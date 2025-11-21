import network 
import time
import json
from machine import Timer

class WIFI_MANAGER():
    """
    The Wifi Manager takes in a list of currently known wifi and tries to connect to the wifi in the list
    the callback handlers are passed in as a dictionary of functions with the following keys
    + onWifiConnected (will be called when wifi is connected successfully)
    + onWifiConnectedFailed (will be called when wifi connection failed)
    + onWifiDisconnection (will be called when wifi is disconnected upon request call disconnect() method)
    + onScannedForWifi (will be called when wifi is scanned for wifi in the vicinity this call back will receive a list of wifi found in the vicinity)

    the class provides the following methods
    + scan_wifi (will scan for wifi in the vicinity)
    + connect_to_wifi (will connect to wifi using the ssid and password)
    + disconnect (will disconnect from the current wifi)
    + isWifiConnected (will return True if wifi is connected)
    + activate_wifi (will activate the wifi)
    + deactivate_wifi (will deactivate the wifi)
    + ledIndicateConnected (will turn on the led to indicate wifi is connected)
    + ledIndicateDisconnected (will blink the led to indicate wifi is disconnected)
    
    """

    def __init__(self, currentKnownListOfWifi, callbacks = {}, led = None ):
            
        # get the wireless lan interface singleton
        self.wlan = network.WLAN(network.STA_IF)
        if "onWifiConnected" in callbacks == False:
            raise Exception("callbacks must define onWifiConnected handler")
        
        if "onWifiConnectedFailed" in callbacks == False:
            raise Exception("callbacks must define onWifiConnectedFailed handler")
        
        self.timer1 = Timer(-1)
        self.led = led
        self.ledIndicateDisconnected()
        
        # register the call backs
        self.callbacks = callbacks    
        self.onWifiConnected = self.callbacks['onWifiConnected']
        self.onWifiConnectedFailed = self.callbacks['onWifiConnectedFailed']
    
    
        if (self.wlan.isconnected() == False):
            # wifi is not connected

            # create a handler to handle the connection fail
            def _connectionFailHandler(payload):
                return

            for wifi in currentKnownListOfWifi:
                # try to connect to the wifi using current known list of wifi
                _ssid = currentKnownListOfWifi[wifi]['ssid']
                _pw = currentKnownListOfWifi[wifi]['pw']

                # connect to wifi using the know ssid and password, also passing the onWifiConnected and onWifiConnectedFailed handlers
                connected = self.connect_to_wifi(ssid=_ssid,pw=_pw,onWifiConnected=self.onWifiConnected,onWifiConnectedFailed=_connectionFailHandler)
                
                # if connected break the loop and exit
                if connected:
                    break
        else:
            # wifi is already connected
            status = self.wlan.ifconfig()
            data = "Network connected"+ str(status)
            self.onWifiConnected({"result":True, "data":data})
            self.ledIndicateConnected()
    
    def ledIndicateConnected(self):
        if self.led is not None:
            # turn on led to indicate connected
            self.led.value(1)
            self.timer1.deinit()

    def ledIndicateDisconnected(self):    
        if self.led is not None:
            # blink led to indicate disconnected    
            self.timer1.init(period=100, mode=Timer.PERIODIC, callback=lambda t: self.led.value(not self.led.value()))

    # helper function to check if wifi is connected
    def isWifiConnected(self):
        return self.wlan.isconnected()
    
    # helper function to activate wifi
    def activate_wifi(self):
        self.wlan.active(True)

    # helper function to deactivate wifi   
    def deactivate_wifi(self):
        self.wlan.active(False)

    # scan for wifi and return the list of wifi found default accepting signal strength is > -40
    def scan_wifi(self,on_scanned_for_wifi,payload=None, ss = -40):
        # activate wifi 1st
        self.activate_wifi()
        # authmodes = ['Open', 'WEP', 'WPA-PSK' 'WPA2-PSK4', 'WPA/WPA2-PSK', 'Hidden', '']
        if self.wlan.active :
            # scan for wifi in the vicinity, and return the list of wifi found 
            wifi_list = self.wlan.scan()
            wifis = []

            for item in wifi_list:
                # formating the bssid to mac address format
                bssid = "{:02x}:{:02x}:{:02x}:{:02x}:{:02x}:{:02x}".format(*item[1])
                wifi = {"ssid":item[0],"mac":bssid,"channel":item[2],"rssi":item[3],"auth":item[4],"hidden":item[5]}
                
                # filter the wifi by the signal strength
                # only accepting good rssi > -40
                if item[3] > ss:
                    wifis.append(wifi)
            wifi_list_string = json.dumps(wifis)
            # wifi_list_string_bytes = bytes(wifi_list_string,'UTF-8')
            
            if on_scanned_for_wifi:
                on_scanned_for_wifi({"result":True, "data":wifi_list_string,"cmd":payload})
    
        else:
            on_scanned_for_wifi({"result":False, "data":"Wifi is not activated","cmd":payload})
    
    # request module to disconnect from the current wifi
    def disconnect(self,on_wifi_disconnection):
        self.wlan.disconnect()
        self.ledIndicateDisconnected()
        # call the handler when on wifi is disconnected
        if on_wifi_disconnection:
            on_wifi_disconnection()
        if "on_wifi_disconnection" in self.callbacks:
            self.callbacks["on_wifi_disconnection"]()

    # connect to wifi using the ssid and password
    def connect_to_wifi(self,ssid,pw,payload = None,onWifiConnected = None, onWifiConnectedFailed = None, force=False):
        
        # check if onWifiConnectedFailed is passed in as a parameter
        # if not then used the callback handler that was passed in during initialization
        if onWifiConnectedFailed == None :
            if "onWifiConnectedFailed" in callbacks:
                onWifiConnectedFailed = self.onWifiConnectedFailed
        
        # check if onWifiConnected is passed in as a parameter
        # if not then used the callback handler that was passed in during initialization
        if onWifiConnected == None:
            if self.onWifiConnected:
                onWifiConnected = self.onWifiConnected

        # check if wifi is already connected  
        # if force was passed in as parameter then force the connection to disconnect
        # prior to connecting to the new wifi
        if self.wlan.isconnected():
            if force == 1:
                print("force disconnection ")
                self.wlan.disconnect()
                self.ledIndicateDisconnected()
            else:
                # if force was passed in as a parameter then
                # just report that wifi has been connected and return
                status = self.wlan.ifconfig()
                data = "Network connected"+ str(status)
                onWifiConnected({"result":True, "data":data,"cmd":payload})
                self.ledIndicateConnected()
                return
        
        '''
        Start the wifi connection process
        '''
        
        # make sure the the wifi is activated
        self.activate_wifi()
        
        # scan for ssid in the vicinity      
        nets = self.wlan.scan()
        nets_ssid = []
        for net in nets:
            net_ssid = str(net[0], 'utf-8')
            nets_ssid.append(net_ssid)

        #compare the detected list of wifi with the ssid to be connected passed in as parameter
        if ssid in nets_ssid:
            self.wlan.connect(ssid, pw)
            # allow 10 attempts for connections
            max_wait = 10                
            while max_wait > 0:
                # possible status:
                # [0=STAT_IDLE, 1=STAT_CONNECTING, 2=STAT_WRONG_PASSWORD, 3=STAT_NO_AP_FOUND, 4=STAT_CONNECT_FAIL, 5=STAT_GOT_IP]
                if self.wlan.status() < 0 or self.wlan.status() >= 3:
                    break
                max_wait -= 1
                # print('waiting for connection to '+str(ssid)+'...')
                time.sleep(1)
            
            if self.wlan.status() != 3:
                connectFailMessage = {"result":False, "data":str(ssid)+" connection failed","cmd":payload}
                onWifiConnectedFailed(connectFailMessage)
                self.ledIndicateDisconnected()
                return False
            else:
                # wifi is now connected
                status = self.wlan.ifconfig()
                data = "Network connected"+ str(status)

                # call the handler when on wifi is connected
                onWifiConnected({"result":True, "data":str(ssid)+" connected" + data,"cmd":payload})
                self.ledIndicateConnected()
                return True
        else:

            connectFailMessage = {"result":False, "data":str(ssid)+" is not valid","cmd":payload}
            # call the handler when on wifi connection failed
            onWifiConnectedFailed(connectFailMessage)
            self.ledIndicateDisconnected()
            return False