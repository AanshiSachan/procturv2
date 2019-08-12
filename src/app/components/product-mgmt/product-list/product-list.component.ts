import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  filter: any = {
    exam_id: null,
    standard_id: null,
    subject_id: null
  };
  productList: any = [];
  total_items: any;
  productListLoading: boolean = true;

  examList: any = [];
  subjectsList: any = [];
  standardList: any = [];
  deleteItem: any = {
    title: '',
    product_id: 0,
    operation: '',
    btnClass: 'btn-disable',
    btnText: 'Loading...'
  };


  constructor() { }

  ngOnInit() {
  }
  

}
