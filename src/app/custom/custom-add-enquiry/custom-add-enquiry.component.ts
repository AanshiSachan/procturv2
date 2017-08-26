import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'custom-add-enquiry',
  templateUrl: './custom-add-enquiry.component.html',
  styleUrls: ['./custom-add-enquiry.component.css']
})
export class CustomAddEnquiryComponent implements OnInit {

  source: LocalDataSource;

  @ViewChild('modal')
  modal: CustomAddEnquiryComponent;

  constructor() { }

  ngOnInit() { }

  open(size: string) {
    this.modal.open(size);
  }

  openModal() {
    alert('added');
  }

/*   onSubmit({ value, valid }: { value: OrderRequest, valid: boolean }) {
    this.add({ value, valid });
    this.modal.close();
  }
 */
  close() {
    this.modal.close();
  }

/*   add({ value, valid }: { value: OrderRequest, valid: boolean }): void {
    let result = JSON.stringify(value);
    if (!result) {
      return;
    }
    this.appService.create(value)
      .then(orderRequest => {
        this.orderRequests.push(orderRequest);
        this.source.add(orderRequest);
        this.source.refresh();
      });
  } */

}
