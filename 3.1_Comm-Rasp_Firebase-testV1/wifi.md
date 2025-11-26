# Connection of Raspberry Pi to local Wifi
To connect the Raspberry board to the local wifi you must write this: <br>
```json
{ 
  "ssid_1": { "ssid": "ssid_1", "pw": "pwd01234" },
  "ssid_2": { "ssid": "ssid_2", "pw": "pwd56789" }
}
or, just one:
{ 
  "your_ssid": { "ssid": "ssid", "pw": "pwd01234" }
}
```
<br>

inside a file named ```wifi.json```, into the **_sec_** folder: <br>
| 📂: COMPETICAO-ESC_2025** > 3.1_Comm-Rasp_Firebase > sec