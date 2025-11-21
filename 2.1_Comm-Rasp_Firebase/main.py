# import WIFI_MANAGER 
from src.wifi.wifi import WIFI_MANAGER
from machine import Pin
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
    
else: 
    print("|-------- SOMETHING WENT WRONG -----------|")
    print("|    Check your wifi ssid and password?   |")
    print("|-----------------------------------------|")