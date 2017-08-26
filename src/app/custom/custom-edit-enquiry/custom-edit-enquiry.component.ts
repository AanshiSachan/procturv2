import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-custom-edit-enquiry',
  templateUrl: './custom-edit-enquiry.component.html',
  styleUrls: ['./custom-edit-enquiry.component.css']
})
export class CustomEditEnquiryComponent implements OnInit {

  source: LocalDataSource;
  data: any;

  @ViewChild('modal')
  modal: CustomEditEnquiryComponent;
  constructor() { }
  ngOnInit() { }
  openModal(data) {
    alert(data);
  }
  onSubmit() {
    this.modal.close();
  }
  close() {
    this.modal.close();
  }
  edit(){
  }
}
