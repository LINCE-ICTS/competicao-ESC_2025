# import WIFI_MANAGER 
from src.wifi import WIFI_MANAGER
from machine import Pin, SoftI2C, ADC
from ssd1306 import SSD1306_I2C

# Configuração do OLED
i2c = SoftI2C(scl=Pin(15), sda=Pin(14))
oled = SSD1306_I2C(128, 64, i2c)

# create the wifi led, as pin 15
wifiLED = Pin("LED", Pin.OUT)

# import configurations your list of wifi
'''CONFIGURATIONS STACKS--------------'''
from src.configs.readConfigs import currentListOfWifi


def onWifiConnected(payload):
    print("--------onWifiConnected------------")
    print(payload)
    print("-----------------------------------")

def onWifiConnectedFailed(payload):
    print("--------onWifiConnectedFailed------")
    print(payload)
    print("-----------------------------------")

def onScannedForWifi(payload):
    print("--------onScannedForWifi-----------")
    print(payload)
    print("-----------------------------------")

def onWifiDisconnected(payload):
    print("--------onWifiDisconnected---------")
    print(payload)
    print("-----------------------------------")

# OLED config
def update_oled(lines):
    oled.fill(0)
    for i, line in enumerate(lines):
        oled.text(line, 0, i * 8)
    oled.show()

# create your wifi call back
WIFICallbacks = {
    "onWifiConnected":onWifiConnected,
    "onWifiConnectedFailed":onWifiConnectedFailed,
    "onScannedForWifi":onScannedForWifi,
    "onWifiDisconnected":onWifiDisconnected
}


# initialized wifi manager
wifi_manager = WIFI_MANAGER(currentListOfWifi,WIFICallbacks,wifiLED)

# let's check the connection
if wifi_manager.isWifiConnected():
    print("|------- WIFI IS NOW CONNECTED -----------|")
    print("|        Will Connect to RTDB             |")
    print("|-----------------------------------------|")

    messages = [
        "           ",
        "           ",
        "   Wifi: Conectado!  ",
        "   [RTDB]: Iiniciando conexão...  ",
        "           ",
        "           ",
        "           ",
        "           ",
    ]
    update_oled(messages)
    
else: 
    print("|-------- SOMETHING WENT WRONG -----------|")
    print("|    Check your wifi ssid and password?   |")
    print("|-----------------------------------------|")
    
    messages = [
        "           ",
        "           ",
        "   Wifi: Falha na Conexão!  ",
        "   | Cheque seu SSID/Senha |  ",
        "           ",
        "           ",
        "           ",
        "           ",
    ]
    update_oled(messages)