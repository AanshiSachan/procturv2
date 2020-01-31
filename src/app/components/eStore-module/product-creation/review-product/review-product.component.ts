import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { ProductService } from '../../../../services/products.service';


@Component({
  selector: 'app-review-product',
  templateUrl: './review-product.component.html',
  styleUrls: ['./review-product.component.scss']
})
export class ReviewProductComponent implements OnInit {
  prod_free: any;
  selectedPeople1: any;
  people: any;
  isAdvanceProductEdit: boolean = false;
  @Input() entity_id: any;
  @Input() prodForm: any;
  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  @Output() previewEvent = new EventEmitter<boolean>();
  products_ecourse_maps: any[] = [];
  ecourseList: any = [];
  mock_count: number = 0;
  online_count: number = 0;
  isRippleLoad: boolean = false;
  image_url: any = null;
  moderatorSettings: any = {
    singleSelection: false,
    idField: 'course_type_id',
    textField: 'course_type',
    enableCheckAll: false
  };
  constructor(
    private http: ProductService,
    private msgService: MessageShowService,
    private router: Router,
    private auth: AuthenticatorService,
  ) { }



  ngOnInit() {
    if (this.entity_id != 0) {
      this.initFormSequence();
    }
    this.initDataEcourse();
    this.initForm();
    console.log(this.prodForm, this.entity_id);
  }

  initForm() {
    //Fetch Product Groups List

    if (this.entity_id && this.entity_id.length > 0 && (!this.isRippleLoad)) {
      //Fetch Product Info
      this.isRippleLoad = true;
      this.http.getMethod('product/get/' + this.entity_id, null).subscribe(
        (resp: any) => {
          this.isRippleLoad = false;
          let response = resp.result;
          if (resp.validate) {
            let productData = response;
            this.prodForm = response;
            this.prodForm.product_item_stats = {};
            this.prodForm.product_items_types.forEach(element => {
              this.prodForm.product_item_stats[element.slug] = true;
            });
            this.mock_count = 0;
            this.online_count = 0;
            this.prodForm.product_item_list.forEach((data) => {
              if (data.slug == 'Mock_Test') {
                this.mock_count++;
              }

              if (data.slug == 'Online_Test') {
                this.online_count++;
              }
            });
            this.updateProductItemStates(null, null);
          }
          else {
            this.msgService.showErrorMessage('error', response.errors.message, '');
          }
        },
        (err) => {
          this.isRippleLoad = false;
          this.msgService.showErrorMessage('error', err['error'].errors.message, '');
        });
    }


  }

  // calc_days() {
  //   return (this.prodForm.valid_from_date != '' && this.prodForm.valid_to_date != '') ? Math.ceil(Math.abs((new Date(this.prodForm.valid_to_date).getTime()) - (new Date(this.prodForm.valid_from_date).getTime())) / (1000 * 3600 * 24)) : 'NA';
  // }

  initDataEcourse() {
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.http.getMethod('ext/get-ecources', null).subscribe(
        (resp: any) => {
          this.isRippleLoad = false;
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
          this.isRippleLoad = false;
          // this.msgService.showErrorMessage('error', err['error'].errors.message, '');
        });
    }
  }

  initFormSequence() {
    if (this.entity_id && this.entity_id.length > 0 && (!this.isRippleLoad)) {
      //Fetch Product Info
      this.isRippleLoad = true;
      this.http.getMethod('product/get/' + this.entity_id, null).subscribe(
        (resp: any) => {
          this.isRippleLoad = false;
          let response = resp.result;
          if (resp.validate) {
            let productData = response;
            this.prodForm = productData;
            this.prodForm.is_paid = this.prodForm.is_paid == 'Y' ? 0 : 1;
            this.prodForm.is_duration = this.prodForm.duration == 0 ? false : true;
            this.prodForm.valid_from_date = moment(this.prodForm.valid_from_date).format('DD-MMM-YYYY');
            this.prodForm.valid_to_date = moment(this.prodForm.valid_to_date).format('DD-MMM-YYYY');
            this.prodForm.product_item_stats = {};
            this.isAdvanceProductEdit = (this.prodForm.is_advance_product && this.prodForm.status== 30) ?true:false;
            // -- added by laxmi
            // this code is used to laod image url dynamically not save in locally dont remove it
            this.image_url = response.photo_url ? response.photo_url + "?t=" + new Date().getTime() : null;
            this.prodForm.logo_url = response.logo_url;
            this.prodForm.photo_url = response.photo_url
            this.prodForm.product_items_types.forEach(element => {
              this.prodForm.product_item_stats[element.slug] = true;
            });
            this.mock_count = 0;
            this.online_count = 0;
            this.prodForm.product_item_list.forEach((data) => {
              if (data.slug == 'Mock_Test') {
                this.mock_count++;
              }

              if (data.slug == 'Online_Test') {
                this.online_count++;
              }
            });
            this.updateProductItemStates(null, null);
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
          this.isRippleLoad = false;
          this.msgService.showErrorMessage('error', err['error'].errors.message, '');
        });
    }
  }

  uploadHandler(Input) {
    const files = Input.target.files;
    if (files.length) {
      let pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.gif|.png|.jpg|.jpeg)$/i;
      if (!pattern.test(files[0].name)) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select product image ");
        return;
      }
      let fileInfoJson: any = { "institute_id": sessionStorage.getItem("institute_id"), "product_id": this.prodForm.entity_id };
      let formData = new FormData();
      formData.append("file", Input.target.files[0]);
      formData.append("fileInfoJson", JSON.stringify(fileInfoJson));
      const base = this.auth.getBaseUrl();
      const urlPostXlsDocument = base + "/api/v1/instFileSystem/fileUpload";
      let newxhr = new XMLHttpRequest();
      let auths: any = {
        userid: sessionStorage.getItem('userid'),
        userType: sessionStorage.getItem('userType'),
        password: sessionStorage.getItem('password'),
        institution_id: sessionStorage.getItem('institute_id'),
      }
      const Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);
      newxhr.open("POST", urlPostXlsDocument, true);
      newxhr.setRequestHeader("Authorization", Authorization);
      newxhr.setRequestHeader("enctype", "multipart/form-data;");
      newxhr.setRequestHeader("Accept", "application/json, text/javascript");
      newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      this.isRippleLoad = true;
      newxhr.onreadystatechange = () => {
        if (newxhr.readyState == 4) {
          if (newxhr.status >= 200 && newxhr.status < 300) {
            this.isRippleLoad = false;
            let res = JSON.parse(newxhr.response);
            this.image_url = res.photo_url ? res.photo_url + "?t=" + new Date().getTime() : null;
            this.prodForm.logo_url = res.thumbnail_url;
            this.prodForm.photo_url = res.photo_url;
            this.msgService.showErrorMessage('success', '', 'File uploaded successfully');

          } else {
            this.isRippleLoad = false;
            // this.msgService.showErrorMessage('error', err['error'].errors.message, '');

          }
        }
      }
      newxhr.send(formData);
    }
  }

  saveProduct() {
    if (this.prodForm.title == "" ||
      this.prodForm.title == null) {
      this.msgService.showErrorMessage('error', 'title should not be shorter than one characters', '');
      return;
    }
    if (this.prodForm.purchase_limit == 0) {
      this.msgService.showErrorMessage('error', 'product sell limit should be grater than zero', '');
      return;
    }

    if (this.prodForm.duration <= 0 && this.prodForm.is_duration) {
      this.msgService.showErrorMessage('error', 'please enter product duration ', '');
      return;
    }

    if (this.prodForm.about.length > 1500) {
      this.msgService.showErrorMessage('error', 'allowed description limit is 1500 characters', '');
      return;
    }

    if (!this.prodForm.is_duration) {
      this.prodForm.duration = 0;
      this.prodForm.valid_from_date = moment(this.prodForm.valid_from_date);
      this.prodForm.valid_to_date = moment(this.prodForm.valid_to_date);
    } else {
      this.prodForm.valid_from_date = null;
      this.prodForm.valid_to_date = null;
    }


    this.prodForm.is_paid = (this.prodForm.price) ? 'Y' : 'N';
    this.prodForm.price = this.prodForm.price ? this.prodForm.price : 0;
    let object = {
      "entity_id": this.prodForm.entity_id,
      "title": this.prodForm.title,
      "institute_id": sessionStorage.getItem('institute_id'),
      "logo_url": this.prodForm.logo_url,
      "photo_url": this.prodForm.photo_url,
      "about": this.prodForm.about,
      "is_paid": this.prodForm.is_paid,
      "is_advance_product":this.prodForm.is_advance_product,
      "price": this.prodForm.price,
      "valid_from_date": this.prodForm.valid_from_date,
      "valid_to_date": this.prodForm.valid_to_date,
      "sales_from_date":moment(this.prodForm.sales_from_date).format('YYYY-MM-DD'),
      "sales_to_date": moment(this.prodForm.sales_to_date).format('YYYY-MM-DD'),
      "purchase_limit": this.prodForm.purchase_limit,
      "status": this.prodForm.status,
      "duration": this.prodForm.duration,
      "product_ecourse_maps": this.products_ecourse_maps,
      "product_items_types": this.prodForm.product_items_types,
      "product_item_list": this.prodForm.product_item_list,
      "publish_date": this.prodForm.publish_date
    }
    this.updateProduct(object);

  }


  updateProduct(object) {

    let body = JSON.parse(JSON.stringify(object));
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.http.postMethod('product/update', body).then(
        (resp:any) => {
          this.isRippleLoad = false;
          let data = resp['body'];
          if (data.validate) {
            this.msgService.showErrorMessage('success', "product updated successfully", '');
            this.gotoBack();
          }
          else {
            this.msgService.showErrorMessage('error', resp.body.error[0].error_message, '');
          }
        },
        (err) => {
          this.isRippleLoad = false;
          this.msgService.showErrorMessage('error', "something went wrong, try again", '');
        });
    }

  }

  // update parent state data
  updateProductItemStates(event, item) {
    if (item) {
      this.prodForm.product_item_stats[item.slug] = event ? 1 : 0;
    }
    // console.log(this.prodForm);
    this.previewEvent.emit(this.prodForm);
  }

  gotoBack() {
    this.router.navigateByUrl('/view/e-store/details');
  }
}
