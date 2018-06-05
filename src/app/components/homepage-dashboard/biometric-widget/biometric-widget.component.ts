import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as Muuri from 'muuri/muuri';
@Component({
  selector: 'biometric-widget',
  templateUrl: './biometric-widget.component.html',
  styleUrls: ['./biometric-widget.component.scss']
})
export class BiometricWidgetComponent implements OnInit {


public grid: any;
public order: string[] = ['1', '2', '3', '4'];

biometricData = [{
  "deviceId": "111",
  "deviceFName": "Harvin Academy",
  "serialNumber": "OIN7040057041300450",
  "ipAddress": "192.168.1.10",
  "lastPing": 1527763822000,
  "deviceLocation": "UP",
  device_status: 1
},
]

@Output() changeWidth: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {

    this.grid = new Muuri('.grid', {
      dragEnabled: false,
      layout: {
        fillGaps: true,
        rounding: true
      },
      layoutOnResize: true,
      layoutOnInit: false,
      sortData: {
        id: (item, element) => {
          // return parseFloat(element.getAttribute('data-id'));
          return this.order.indexOf(element.getAttribute('data-id'));
        }
      }
    });
    this.grid.sort('id');
    this.grid.on('dragEnd', (item, event) => {
      this.getOrder();
    });
    this.sendDataToHome();
  }

  getOrder() {
    this.order = this.grid.getItems().map(item => item.getElement().getAttribute('data-id'));
  }

  sendDataToHome(){
    this.changeWidth.emit(this.biometricData);
  }
}
