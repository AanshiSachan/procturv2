import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessageShowService } from '../../../../services/message-show.service';
import { ProductService } from '../../../../services/products.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {


  @Input() entity_id: any;
  productItems: any = [];
  @Input() product_item_stats: any;
  product_item_list: any[] = [];

  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  @Output() previewEvent = new EventEmitter<boolean>();

  items: any = {
    pendrive: 0,
    books: 0,
    tablets: 0
  };

  selectedItems2: any = [{ course_type: 'Aniket course', course_type_id: 75 }, { course_type: 'Aniket course', course_type_id: 75 }];
  ecourseList: any = [];
  products_ecourse_maps: any[] = [];
  prodItems: any = {}
  moderatorSettings: any = {
    singleSelection: false,
    idField: 'course_type_id',
    textField: 'course_type',
    // itemsShowLimit: ,
    enableCheckAll: false
  };

  prodForm: any = {
    entity_id: 0,
    title: '',
    exams: '',
    product_image: '',
    exam_ids: [],
    // product_group_id: null,
    short_description: '',
    about: '',
    is_paid: true,
    price: 0,
    cateory: 0,
    itemStates: [],
    start_datetime: moment().format('DD-MMM-YYYY'),
    end_datetime: moment().format('DD-MMM-YYYY'),
    start_timestamp: '',
    end_timestamp: '',
    status: 10,
    product_item_stats: {
      mock_test: 0,
      online_exams: 0,
      live_classes: 0,
      assignments: 0
    }
  };

  constructor(
    private http: ProductService,
    private msgService: MessageShowService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.getProductItemsData();
    this.toggleLoader.emit(true);
    this.initDataEcourse();
    this.previewEvent.emit(this.prodForm);
    this.toggleLoader.emit(false);
  }

  /** get product item details in  */
  getProductItemsData() {

    this.http.getMethod('master/item-type/get', null).subscribe(
      (resp: any) => {
        let response = resp.result;
        if (resp.validate) {
          this.productItems = response;
          this.prodForm.product_item_stats = {};
          this.productItems.forEach((element, index) => {
            this.prodForm.itemStates.push(element);// add states
            this.prodForm.product_item_stats[element.slug] = 0;
            this.prodItems[element.slug] = false;
          });
          this.initForm();
        }
        else {
          this.msgService.showErrorMessage('error', response.errors.message, '');
        }
      },
      (err) => {
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });

  }

  initForm() {
    //Fetch Product Groups List

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
            this.prodForm.product_items_types.forEach(element => {
              this.prodForm.itemStates.forEach((object) => {
                if (object.entity_id == element.entity_id) {
                  this.prodItems[object.slug] = true;
                  this.prodForm.product_item_stats[object.slug] = true;
                }
              });
            });
            this.updateProductItemStates(null, null);
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


  initDataEcourse() {
    let param = {
      "proc-authorization": "MTk4MzJ8MDphZG1pbjoxMDAxMjg="
    }
    this.http.getMethod('ext/get-ecources', param).subscribe(
      (resp: any) => {
        let response = JSON.parse(resp.result);
        console.log(response);
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

  gotoBack() {
    this.router.navigateByUrl('/view/products/details');
  }

  // update parent state data
  updateProductItemStates(event, item) {
    if (item) {
      this.prodForm.product_item_stats[item.slug] = event ? 1 : 0;
    }
    // console.log(this.prodForm);
    this.previewEvent.emit(this.prodForm);

  }

  saveProduct() {
    if (this.prodForm.title == "" ||
      this.prodForm.title == null) {
      this.msgService.showErrorMessage('error', 'title should NOT be shorter than 1 characters', '');
      return;
    }

    // if (this.prodForm.product_group_id == null) {
    //   this.msgService.showErrorMessage('error', 'product group should be not null', '');
    //   return;
    // }
    let keys = Object.keys(this.prodItems);
    let notselectedItem = keys.filter(key => this.prodItems[key] == false);
    if (this.productItems.length == notselectedItem.length) {
      this.msgService.showErrorMessage('error', 'select at least one item ', '');
      return;
    }

    // this.prodForm.start_timestamp =this.prodForm.start_datetime;
    // this.prodForm.end_timestamp = this.prodForm.end_datetime;
    this.prodForm.is_paid = (this.prodForm.price) ? 'Y' : 'N';
    this.prodForm.price = this.prodForm.price ? 0 : this.prodForm.price;
    this.productItems.forEach(element => {
      this.prodForm.product_item_stats[element.slug] = (this.prodItems[element.slug]) ? this.prodForm.product_item_stats[element.slug] : 0;
      if (this.prodForm.product_item_stats[element.slug]) {
        let object = {
          "entity_id": element.entity_id
        }
        this.product_item_list.push(object);
      }
    });
    let object = {
      "entity_id": this.prodForm.entity_id,
      "title": this.prodForm.title,
      "institute_id": sessionStorage.getItem('institute_id'),
      "logoUrl": "",
      "about": this.prodForm.about,
      "is_paid": this.prodForm.is_paid,
      "price": this.prodForm.price,
      "valid_from_date": this.prodForm.start_datetime,
      "valid_to_date": this.prodForm.end_datetime,
      "purchase_limit": 12,
      "status": this.prodForm.status,
      "product_ecourse_maps": this.products_ecourse_maps,
      "product_items_types": this.product_item_list,
    }
    if (this.prodForm.entity_id == 0) {
      this.createProduct(object);
    }
    else {
      this.updateProduct(object);
    }
  }

  createProduct(object) {
    this.toggleLoader.emit(true);

    let body = JSON.parse(JSON.stringify(object));
    this.toggleLoader.emit(true);
    this.http.postMethod('/product/create', object).then(
      (resp: any) => {
        this.toggleLoader.emit(false);
        let response = resp['body']
        if (response.validate) {
          this.msgService.showErrorMessage('success', "product created successfully", '');
          response.result.product = object;
          this.startForm.emit(response.result);
          this.nextForm.emit();
        }
        else {
          this.msgService.showErrorMessage('error', "something went wrong, try again", '');
        }
      },
      (err) => {
        this.toggleLoader.emit(false);
        this.msgService.showErrorMessage('error', "something went wrong, try again", '');
      });
  }

  updateProduct(object) {

    this.toggleLoader.emit(true);
    let body = JSON.parse(JSON.stringify(object));

    this.http.postMethod('product/update', body).then(
      (resp) => {
        this.toggleLoader.emit(false);
        let data = resp['body'];
        if (data.validate) {
          this.msgService.showErrorMessage('success', "product updated successfully", '');
          this.nextForm.emit();
        }
        else {
          this.msgService.showErrorMessage('error', "something went wrong, try again", '');
        }
      },
      (err) => {
        this.toggleLoader.emit(false);
        this.msgService.showErrorMessage('error', "something went wrong, try again", '');
      });
  }

  calc_days() {
    return (this.prodForm.start_datetime != '' && this.prodForm.end_datetime != '') ? Math.ceil(Math.abs((new Date(this.prodForm.end_datetime).getTime()) - (new Date(this.prodForm.start_datetime).getTime())) / (1000 * 3600 * 24)) : 'NA';
  }


}
