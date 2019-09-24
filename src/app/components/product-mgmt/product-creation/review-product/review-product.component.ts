import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router } from '@angular/router';


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
  @Output() previewEvent = new EventEmitter<boolean>();
  products_ecourse_maps:any[]=[];
  ecourseList: any = [];
  mock_count:number =0;
  online_count:number =0;
  isRippleLoad:boolean = false;
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
    this.initForm();
    console.log(this.prodForm,this.entity_id);
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
            this.prodForm.product_item_stats = { };
            this.prodForm.product_items_types.forEach(element => {
              this.prodForm.product_item_stats[element.slug] = true;
            });
            this.mock_count =0;
            this.online_count =0;
            this.prodForm.product_item_list.forEach((data)=>{
              if(data.slug=='Mock_Test'){
                this.mock_count++;
              }

              if(data.slug=='Online_Test'){
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
    let param = {
      "proc-authorization": "MTk4MzJ8MDphZG1pbjoxMDAxMjg="
    }
    if(!this.isRippleLoad){
      this.isRippleLoad = true;
      this.http.getMethod('ext/get-ecources', param).subscribe(
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
    if (this.entity_id && this.entity_id.length > 0&&(!this.isRippleLoad)) {
      //Fetch Product Info
      this.isRippleLoad= true;
      this.http.getMethod('product/get/' + this.entity_id, null).subscribe(
        (resp: any) => {
          this.isRippleLoad= false;
          let response = resp.result;
          if (resp.validate) {
            let productData = response;
            this.prodForm =productData;
            this.prodForm.is_paid =  this.prodForm.is_paid =='Y' ?0:1;
            // this.prodForm.entity_id = productData.entity_id;
            // this.prodForm.title = productData.title;
            // this.prodForm.about = productData.about;
            // this.prodForm.is_paid = productData.is_paid;
            // this.prodForm.price = productData.price;
            // this.prodForm.start_datetime = productData.valid_from_date;
            // this.prodForm.end_datetime = productData.valid_to_date;
            // this.prodForm.status = productData.status;
            // this.prodForm.purchase_limit = productData.purchase_limit;
            // this.prodForm.product_ecourse_maps = productData.product_ecourse_maps;
            // this.prodForm.product_items_types = productData.product_items_types;
            // this.prodForm.product_item_list =productData.product_item_list;
            this.prodForm.product_item_stats={};
            this.prodForm.product_items_types.forEach(element => {
              this.prodForm.product_item_stats[element.slug] = true;
            });
            this.mock_count =0;
            this.online_count =0;
            this.prodForm.product_item_list.forEach((data)=>{
              if(data.slug=='Mock_Test'){
                this.mock_count++;
              }

              if(data.slug=='Online_Test'){
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
          this.isRippleLoad= false;
          this.msgService.showErrorMessage('error', err['error'].errors.message, '');
        });
    }
  }

  saveProduct() {
    if (this.prodForm.title == "" ||
      this.prodForm.title == null) {
      this.msgService.showErrorMessage('error', 'title should NOT be shorter than 1 characters', '');
      return;
    } 
    if(this.prodForm.purchase_limit==0){
      this.msgService.showErrorMessage('error', 'product sell limit should be grater than zero', '');
      return;
     }

    this.prodForm.is_paid = (this.prodForm.price) ? 'Y' : 'N';
    this.prodForm.price = this.prodForm.price ? 0 : this.prodForm.price;
    let object = {
      "entity_id": this.prodForm.entity_id,
      "title": this.prodForm.title,
      "institute_id": sessionStorage.getItem('institute_id'),
      "logoUrl": "",
      "about": this.prodForm.about,
      "is_paid": this.prodForm.is_paid,
      "price": this.prodForm.price,
      "valid_from_date": this.prodForm.valid_from_date,
      "valid_to_date": this.prodForm.valid_to_date,
      "sales_from_date":this.prodForm.sales_from_date,
      "sales_to_date":this.prodForm.sales_to_date,
      "purchase_limit": this.prodForm.purchase_limit,
      "status": this.prodForm.status,
      "product_ecourse_maps": this.products_ecourse_maps,
      "product_items_types": this.prodForm.product_items_types,
      "product_item_list" :this.prodForm.product_item_list,
      "publish_date":this.prodForm.publish_date
    }  
      this.updateProduct(object);
    
  }


  updateProduct(object) {

    let body = JSON.parse(JSON.stringify(object));
     if(!this.isRippleLoad){
       this.isRippleLoad = true;
       this.http.postMethod('product/update', body).then(
        (resp) => {
          this.isRippleLoad = false;
          let data = resp['body'];
          if (data.validate) {
            this.msgService.showErrorMessage('success', "product updated successfully", '');
            this.gotoBack();
          }
          else {
            this.msgService.showErrorMessage('error', "something went wrong, try again", '');
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
    this.router.navigateByUrl('/view/products/details');
  }
}
