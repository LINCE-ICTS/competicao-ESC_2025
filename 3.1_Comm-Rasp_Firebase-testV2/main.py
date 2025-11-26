import network
import socket
import time
import ujson
import neopixel
from machine import Pin
# Imports for Firebase RDB connection
import urequests, websocket
from _thread import start_new_thread

# ==========================
# Configuração NeoPixel
# ==========================
NUM_LEDS = 25
np = neopixel.NeoPixel(Pin(7), NUM_LEDS)

def clear_all():
    for i in range(NUM_LEDS):
        np[i] = (0, 0, 0)
    np.write()

def logo_w():
    """Desenha a letra W azul - versão mais preenchida"""
    clear_all()
    BLUE = (0, 0, 255)
    w_leds =[0,5,10,15,20,16,12,18,24,19,14,9,4]
    for led in w_leds:
        np[led] = BLUE
    np.write()
    
def fade_green_to_blue():
    """Mantém o W verde por 1s e depois faz fade para azul"""
    w_leds = [0,5,10,15,20,16,12,18,24,19,14,9,4]
    GREEN = (0, 255, 0)
    BLUE = (0, 0, 255)

    # Acende W em verde
    for led in w_leds:
        np[led] = GREEN
    np.write()
    time.sleep(1)  # mantém verde por 1 segundo

    # Fade do verde para azul
    steps = 16
    for step in range(steps):
        ratio = step / (steps - 1)
        for led in w_leds:
            r = int(GREEN[0] * (1-ratio) + BLUE[0] * ratio)
            g = int(GREEN[1] * (1-ratio) + BLUE[1] * ratio)
            b = int(GREEN[2] * (1-ratio) + BLUE[2] * ratio)
            np[led] = (r, g, b)
        np.write()
        time.sleep(0.08)

# ==========================
# Configurações do Firebase
# ==========================
# --------------------
# Configuração Firebase RDB
PROJECT_ID = "lince-esc2025-database"                               # ID do projeto no Firebase
DATABASE_URL = f"https://{PROJECT_ID}-default-rtdb.firebaseio.com"  # Link para o Database
DB_NODE_PATH = "/clients/rp2040"                                    # Nó do RaspPi no RDB

WS_URL = f"wss://{PROJECT_ID}-default-rtdb.firebaseio.com/.ws?v=5&ns={PROJECT_ID}-default-rtdb"

# --------------------
# WRITE --> Send data to RDB
def fb_write(data: dict):
    try:
        url = DATABASE_URL + DB_NODE_PATH + ".json"
        r = urequests.patch(url, data=ujson.dumps(data))
        print("Firebase write: ", r.text)
        r.close()
    except Exception as e:
        print("WRITE ERROR -> ", e)
# --------------------
# LISTEN --> RDB updates
def fb_listen(callback):
    try:
        ws = websocket.create_connection(WS_URL)
        print("🔗 WebSocket conectado ao Firebase!")

        # Subscricao no path
        sub_msg = {
            "t": "d",
            "d": {
                "r": 1,
                "a": "q",              # query
                "b": {                 # qual NODE observar
                    "p": f"{DB_NODE_PATH}",  # NODE path
                    "h": ""             # sem necessidade de hash
                }
            }
        }
        ws.send(ujson.dumps(sub_msg))

        while True:
            msg = ws.recv()
            if msg:
                parsed = ujson.loads(msg)
                if "d" in parsed and "b" in parsed["d"]:
                    data = parsed["d"]["b"]
                    callback(data)      # ← triggers da ação
    except Exception as e:
        print("LISTEN ERROR →", e)
        time.sleep(3)
        fb_listen(callback)             # auto reconnect
# --------------------
# CALLBACK --> Roda no update
def on_remote_data(data):
    print("🔥 Atualização Firebase:", data)

    # Example: blink LEDs differently based on Firebase input
    if "led" in data and data["led"] == "on":
        print("[LED] turn ON")
        # your neopixel bright effect here

    if "led" in data and data["led"] == "off":
        print("[LED] turn OFF")
        # turn off neopixel here


# --------------------
# Inicia o Firebase Listener em paralelo
def start_firebase_sync():
    start_new_thread(fb_listen, (on_remote_data,))  # Escuta comandos do Firebase

    def heartbeat():
        while True:
            fb_write({"status": "online", "timestamp": time.time()})
            time.sleep(10)

    start_new_thread(heartbeat, ())                 # Envia dados a cada 10s

# ==========================
# Configuração do servidor TCP
# |> roda no main thread
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
# (1) - Configuração e Conexão Wi-Fi
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

# ==========================
# (2) - Exibe o W azul inicial
# ==========================
logo_w()
time.sleep(2)

# ==========================
# (3) INICIA FIREBASE (thread)
# ==========================
start_firebase_sync()   # realtime + heartbeat


# ==========================
# (4) INICIA SERVIDOR TCP (mainloop)
# ==========================
start_tcp_server()