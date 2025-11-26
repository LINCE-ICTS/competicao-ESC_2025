import network
import socket
import time
import ujson
import neopixel
from machine import Pin

# --------------------
# Configuração NeoPixel
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

# --------------------
# Configuração Wi-Fi
ssid = "oi"
password = "oioioioi"

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)
while not wlan.isconnected():
    time.sleep(0.5)
print("IP RP2040:", wlan.ifconfig()[0])

# --------------------
# Mostra o W azul no início
logo_w()
time.sleep(2)

# --------------------
# Configuração do servidor TCP
addr = socket.getaddrinfo("0.0.0.0", 8001)[0][-1]
s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(addr)
s.listen(1)
print("Servidor rodando...")

while True:
    cl, addr = s.accept()
    print("Conexão de:", addr)
    
    # Acende W verde e faz fade
    fade_green_to_blue()
    
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
