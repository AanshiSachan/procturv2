import { Component, OnInit } from '@angular/core';
import * as Muuri from 'muuri/muuri';
@Component({
  selector: 'app-biometric-widget',
  templateUrl: './biometric-widget.component.html',
  styleUrls: ['./biometric-widget.component.scss']
})
export class BiometricWidgetComponent implements OnInit {


public grid: any;
public order: string[] = ['1', '2', '3', '4'];

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

  }

  getOrder() {
    this.order = this.grid.getItems().map(item => item.getElement().getAttribute('data-id'));
  }

}
