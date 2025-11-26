import network
import urequests
import utime
from machine import Pin
import neopixel

# ======================= CONFIG =======================
WIFI_SSID = "Desktop_F2717481"
WIFI_PASS = "Hospede1234"

PROJECT_ID = "lince-esc2025-database"                 # exemplo: "testdb-1234"
DATABASE_URL = f"https://{PROJECT_ID}-default-rtdb.firebaseio.com"  # Link para o Database

# Caminhos no Firebase
PATH_CMD = "/device/command.json"
PATH_STATUS = "/device/status.json"
PATH_TEMP = "/device/temperature.json"

# ======================= NeoPixel =======================
NUM = 25
np = neopixel.NeoPixel(Pin(7), NUM)

def clear():
    for i in range(NUM): np[i]=(0,0,0)
    np.write()

def led_on():
    for i in range(NUM): np[i]=(0,255,0)
    np.write()

def led_off():
    clear()

# ======================= WIFI =======================
print("Conectando ao WiFi...")
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASS)

while not wlan.isconnected():
    print(".", end="")
    utime.sleep(0.5)

print("\nWiFi conectado — IP:", wlan.ifconfig()[0])

# ======================= Firebase Helpers =======================
def fb_get(path):
    try:
        r = urequests.get(DATABASE_URL + path)
        data = r.json()
        r.close()
        return data
    except:
        return None

def fb_put(path, value):
    try:
        r = urequests.put(DATABASE_URL + path, json=value)
        r.close()
    except Exception as e:
        print("ERRO PUT:", e)


# ======================= LOOP PRINCIPAL =======================
while True:

    # 1) Ler comando do Firebase
    cmd = fb_get(PATH_CMD)
    print("CMD:", cmd)

    if cmd == "on":
        led_on()
        fb_put(PATH_STATUS, "LED ligado")
        fb_put(PATH_CMD, None)  # limpa o comando

    elif cmd == "off":
        led_off()
        fb_put(PATH_STATUS, "LED desligado")
        fb_put(PATH_CMD, None)

    # 2) Enviar telemetria
    temperatura = 26 + utime.time() % 4
    fb_put(PATH_TEMP, temperatura)
    print("Temp enviada:", temperatura)

    utime.sleep(2)