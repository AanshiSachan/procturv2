import { Component, OnInit } from '@angular/core';
import * as Muuri from 'muuri/muuri';

@Component({
  selector: 'app-biometric-material-widget',
  templateUrl: './biometric-material-widget.component.html',
  styleUrls: ['./biometric-material-widget.component.scss']
})
export class BiometricMaterialWidgetComponent implements OnInit {


  biometricData=[{
    "deviceId": "111",
    "deviceFName": "Harvin Academy",
    "serialNumber": "OIN7040057041300450",
    "ipAddress": "192.168.1.10",
    "lastPing": 1527763822000,
    "deviceLocation": "UP",
    "device_status": 1
  },
]
  constructor() { }

  ngOnInit() {
  }

}
