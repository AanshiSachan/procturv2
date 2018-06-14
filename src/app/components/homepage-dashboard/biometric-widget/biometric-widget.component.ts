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
  count: number;
  biometricEnable: string;
  biometricData: any = [];
  mappedBiometric: any = [];
  getTimeInterval: any;
  sum: number = 0;

  @Output() changeWidth: EventEmitter<any> = new EventEmitter();

  constructor(private biometric: BiometricStatusServiceService) { }

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
  }

  getOrder() {
    this.order = this.grid.getItems().map(item => item.getElement().getAttribute('data-id'));
  }



  

  fetchBiometricStatus() {
    this.biometric.biometricStatus().subscribe(
      (data: any) => {
        for (let i in data) {
          this.mappedBiometric.push(data[i]);

        }

        this.biometricData = this.mappedBiometric;
        console.log(this.biometricData);
        this.count = this.biometricData.length;
        this.changeWidth.emit(this.biometricData);
      },
      (error: any) => {

      }
    )
  }

}
