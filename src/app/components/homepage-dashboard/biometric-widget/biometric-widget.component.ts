import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as Muuri from 'muuri/muuri';
import { BiometricStatusServiceService } from '../../../services/biometric-status/biometric-status-service.service';
@Component({
  selector: 'biometric-widget',
  templateUrl: './biometric-widget.component.html',
  styleUrls: ['./biometric-widget.component.scss']
})
export class BiometricWidgetComponent implements OnInit {


public grid: any;
public order: string[] = ['1', '2', '3', '4'];
biometricEnable:string;
biometricData = [{
  "deviceId": "111",
  "deviceFName": "Harvin Academy",
  "serialNumber": "OIN7040057041300450",
  "ipAddress": "192.168.1.10",
  "lastPing": 1527763822000,
  "deviceLocation": "UP",
  device_status: 1
},
{
  "deviceId": "111",
  "deviceFName": "Harvin Academy",
  "serialNumber": "OIN7040057041300450",
  "ipAddress": "192.168.1.10",
  "lastPing": 1527763822000,
  "deviceLocation": "UP",
  device_status: 2
},
{
  "deviceId": "111",
  "deviceFName": "Harvin Academy",
  "serialNumber": "OIN7040057041300450",
  "ipAddress": "192.168.1.10",
  "lastPing": 1527763822000,
  "deviceLocation": "UP",
  device_status: 1
}

]

getTimeInterval:any;

@Output() changeWidth: EventEmitter<any> = new EventEmitter();

  constructor( private biometric :BiometricStatusServiceService) { }

  ngOnInit() {
    this.biometricEnable = sessionStorage.getItem('biometric_attendance_feature');
    
      if (this.biometricEnable == "1") {
        this.fetchBiometricStatus();
      }
    
    // this.grid = new Muuri('.grid', {
    //   dragEnabled: false,
    //   layout: {
    //     fillGaps: true,
    //     rounding: true
    //   },
    //   layoutOnResize: true,
    //   layoutOnInit: false,
    //   sortData: {
    //     id: (item, element) => {
    //       // return parseFloat(element.getAttribute('data-id'));
    //       return this.order.indexOf(element.getAttribute('data-id'));
    //     }
    //   }
    // });
    // this.grid.sort('id');
    // this.grid.on('dragEnd', (item, event) => {
    //   this.getOrder();
    // });
    this.sendDataToHome();
  }

  getOrder() {
    this.order = this.grid.getItems().map(item => item.getElement().getAttribute('data-id'));
  }

  
  
  sendDataToHome(){
    this.changeWidth.emit(this.biometricData);
  }

  fetchBiometricStatus() {
    this.biometric.biometricStatus().subscribe(
      (data: any) => {

      },
      (error: any) => {

      }
    )
  }
}
