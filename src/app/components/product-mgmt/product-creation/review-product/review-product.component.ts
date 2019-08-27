import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router } from '@angular/router';
import moment = require('moment');

@Component({
  selector: 'app-review-product',
  templateUrl: './review-product.component.html',
  styleUrls: ['./review-product.component.scss']
})
export class ReviewProductComponent implements OnInit {
  prod_free: any;
  selectedPeople1: any;
  people: any;
  @Input() entity_id: any;
  @Input() prodForm: any;
  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  products_ecourse_maps:any[]=[];
  ecourseList: any = [];
  moderatorSettings: any = {
    singleSelection: false,
    idField: 'course_type_id',
    textField: 'course_type',
    enableCheckAll: false
  };
  constructor(
    private http: ProductService,
    private msgService: MessageShowService,
    private router: Router
  ) { }



  ngOnInit() {
    if (this.entity_id != 0) {
      this.initFormSequence();
    }
    this.initDataEcourse();
    console.log(this.prodForm,this.entity_id);
  }

  calc_days() {
    return (this.prodForm.start_datetime != '' && this.prodForm.end_datetime != '') ? Math.ceil(Math.abs((new Date(this.prodForm.end_datetime).getTime()) - (new Date(this.prodForm.start_datetime).getTime())) / (1000 * 3600 * 24)) : 'NA';
  }

  initDataEcourse() {
    let param = {
      "proc-authorization": "MTk4MzJ8MDphZG1pbjoxMDAxMjg="
    }
    this.http.getMethod('ext/get-ecources', param).subscribe(
      (resp: any) => {
        let response = JSON.parse(resp.result);
        console.log(resp);
        if (resp.validate) {
          this.ecourseList = response;
        }
        else {
          this.msgService.showErrorMessage('error', response.errors.message, '');
        }
      },
      (err) => {
        // this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });
  }

  initFormSequence() {
    if (this.entity_id && this.entity_id.length > 0) {
      //Fetch Product Info
      this.http.getMethod('product/get/' + this.entity_id, null).subscribe(
        (resp: any) => {
          let response = resp.result;
          if (resp.validate) {
            let productData = response;
            this.prodForm.entity_id = productData.entity_id;
            this.prodForm.title = productData.title;
            this.prodForm.about = productData.about;
            this.prodForm.is_paid = productData.is_paid;
            this.prodForm.price = productData.price;
            this.prodForm.start_datetime = productData.valid_from_date;
            this.prodForm.end_datetime = productData.valid_to_date;
            this.prodForm.status = productData.status;
            this.prodForm.purchase_limit = productData.purchase_limit;
            this.prodForm.product_ecourse_maps = productData.product_ecourse_maps;
            this.prodForm.product_items_types = productData.product_items_types;
            this.products_ecourse_maps = [];
            this.prodForm.product_ecourse_maps.forEach((object) => {
              let obj = { course_type: object.course_type, course_type_id: object.course_type_id };
              this.products_ecourse_maps.push(obj);
            });
          }
          else {
            this.msgService.showErrorMessage('error', response.errors.message, '');
          }
        },
        (err) => {
          this.msgService.showErrorMessage('error', err['error'].errors.message, '');
        });
    }
  }

  updateProducts() {

  }
}
