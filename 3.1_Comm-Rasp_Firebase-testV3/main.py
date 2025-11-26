# firmware_rp2040_firebase.py
import network
import socket
import time
import ujson
import urequests
import neopixel
from machine import Pin
from _thread import start_new_thread

# ==========================
# NeoPixel
# ==========================
NUM_LEDS = 25
np = neopixel.NeoPixel(Pin(7), NUM_LEDS)

def clear_all():
    for i in range(NUM_LEDS):
        np[i] = (0,0,0)
    np.write()

def logo_w():
    clear_all()
    BLUE = (0,0,255)
    w_leds = [0,5,10,15,20,16,12,18,24,19,14,9,4]
    for led in w_leds:
        np[led] = BLUE
    np.write()

def fade_green_to_blue():
    w_leds = [0,5,10,15,20,16,12,18,24,19,14,9,4]
    GREEN = (0,255,0)
    BLUE  = (0,0,255)
    for led in w_leds:
        np[led] = GREEN
    np.write()
    time.sleep(1)
    steps = 16
    for step in range(steps):
        ratio = step / (steps - 1)
        for led in w_leds:
            r = int(GREEN[0]*(1-ratio) + BLUE[0]*ratio)
            g = int(GREEN[1]*(1-ratio) + BLUE[1]*ratio)
            b = int(GREEN[2]*(1-ratio) + BLUE[2]*ratio)
            np[led] = (r,g,b)
        np.write()
        time.sleep(0.08)

# ==========================
# CONFIG FIREBASE (AJUSTE AQUI)
# ==========================
PROJECT_ID = "lince-esc2025-database" 
DB_NODE = "/clients/rp2040"                          # nó onde painel escreve comandos
# Se precisar de auth (token) coloque: "?auth=SEU_TOKEN", caso contrário deixe ""
AUTH_PARAM = ""                                     # exemplo "?auth=ABC123"

DATABASE_URL = f"https://{PROJECT_ID}-default-rtdb.firebaseio.com"  # Link para o Database
NODE_URL = DATABASE_URL + DB_NODE + ".json" + AUTH_PARAM  # leitura/escrita do nó (ex: /clients/rp2040.json?auth=...)

# ==========================
# FIREBASE: write / read helpers
# ==========================
def fb_put(data):
    """substitui o conteúdo do nó (PUT)"""
    try:
        r = urequests.put(NODE_URL, data=ujson.dumps(data))
        # print("FB PUT status:", r.status_code, r.text)
        r.close()
    except Exception as e:
        print("FB PUT erro:", e)

def fb_patch(data):
    """atualiza parcialmente o nó (PATCH)"""
    try:
        r = urequests.patch(NODE_URL, data=ujson.dumps(data))
        # print("FB PATCH status:", r.status_code)
        r.close()
    except Exception as e:
        print("FB PATCH erro:", e)

def fb_get():
    """retorna conteúdo do nó como dict, ou None"""
    try:
        r = urequests.get(NODE_URL)
        if r.status_code == 200:
            payload = r.text
            r.close()
            try:
                return ujson.loads(payload)
            except:
                return None
        else:
            r.close()
            return None
    except Exception as e:
        print("FB GET erro:", e)
        return None

# ==========================
# PROCESSAMENTO DE COMANDOS
# ==========================
def process_command(cmd_obj):
    """
    cmd_obj: dict com comandos enviados pelo dashboard da Firebase.
    Exemplo esperado:
      { "cmd_id": 12345, "led":"on", "mode":"fade", "color":[0,255,0] }
    """
    try:
        print("Processando comando:", cmd_obj)
        # exemplo: controle de led
        if "led" in cmd_obj:
            if cmd_obj["led"] == "on":
                fade_green_to_blue()
            elif cmd_obj["led"] == "off":
                clear_all()
        # adicione aqui mais handlers conforme necessidade

    except Exception as e:
        print("Erro ao processar comando:", e)

# ==========================
# THREAD UNIFICADA (poll + heartbeat)
# ==========================
POLL_INTERVAL = 2      # tempo para verificar comandos
HEARTBEAT_INTERVAL = 10  # tempo máximo para enviar status

def fb_manager():
    time.sleep(2)
    print("Firebase loop iniciado...")
    last_hb = time.time()

    while True:
        # --- 1) Poll de Comandos ---
        try:
            data = fb_get()
            print("Firebase GET:", data)
            if isinstance(data, dict) and "command" in data and data["command"]:
                cmd = data["command"]
                process_command(cmd)
                fb_patch({"command": None})
        except Exception as e:
            print("Poll erro:", e)

        # --- 2) Heartbeat periódico ---
        if time.time() - last_hb >= HEARTBEAT_INTERVAL:
            try:
                fb_patch({
                    "status": {
                        "online": True,
                        "ip": wlan.ifconfig()[0],
                        "ts": time.time()
                    }
                })
                last_hb = time.time()
            except Exception as e:
                print("Heartbeat erro:", e)

        time.sleep(POLL_INTERVAL)

# ==========================
# SERVIDOR TCP (mantive seu handler original)
# ==========================
def start_tcp_server():
    addr = socket.getaddrinfo("0.0.0.0", 8001)[0][-1]
    s = socket.socket()
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(addr)
    s.listen(1)
    print("Servidor rodando em :8001 ...")

    while True:
        cl, addr = s.accept()
        print("Conexão de:", addr)

        fade_green_to_blue()  # animação visual ao receber chamada

        try:
            data = cl.recv(1024)
            while len(data) == 1024:
                chunk = cl.recv(1024)
                if not chunk:
                    break
                data += chunk

            try:
                data_str = data.decode('utf-8', errors='ignore')
                if "\r\n\r\n" in data_str:
                    body = data_str.split("\r\n\r\n", 1)[1]
                    print("Corpo recebido:", repr(body))
                    if body:
                        obj = ujson.loads(body)
                        print("Recebido JSON:", obj)
                        # opcional: grave último request no Firebase
                        fb_patch({"last_request": obj, "last_request_time": time.time()})
                    else:
                        print("Sem corpo JSON no request")
            except Exception as e:
                print("Erro parse JSON:", e)

            cl.send(b"HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nOK\n")

        except Exception as e:
            print("Erro durante a conexão:", e)

        finally:
            cl.close()

# ==========================
# WIFI e inicialização
# ==========================
ssid = "Desktop_F2717481"
password = "Hospede1234"

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)
while not wlan.isconnected():
    time.sleep(0.5)
print("| WiFi conectado: ", wlan.ifconfig())
print("| IP RP2040: ", wlan.ifconfig()[0])

# Mostra W inicial
logo_w()
time.sleep(2)

# Inicia apenas 1 thread Firebase
start_new_thread(fb_manager, ())

# Inicia servidor principal (bloqueante)
try:
    start_tcp_server()   # loop principal
except KeyboardInterrupt:
    print("Encerrado manualmente.")  # Permite que interrompe o programa com "CTRL+C"