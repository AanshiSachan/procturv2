import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-online-class',
  templateUrl: './online-class.component.html',
  styleUrls: ['./online-class.component.scss']
})
export class OnlineClassComponent implements OnInit {

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
  description:string='';
  constructor(
    private http: ProductService,
    private msgService: MessageShowService,
    private router: Router,
  ) { }

  ngOnInit() {
  this.initForm();
  }

  initForm() {
    //Fetch Product Groups List

    if (this.entity_id && this.entity_id.length > 0) {
      //Fetch Product Info
      this.isRippleLoad = true;
      this.http.getMethod('product/get/' + this.entity_id, null).subscribe(
        (resp: any) => {
          this.isRippleLoad = false;
          let response = resp.result;
          if (resp.validate) {
            this.prodForm = response;
            let productData = response;
            this.description = response.page_description['Online_Class'];;
            this.prodForm.product_item_stats = {};
            this.prodForm.product_items_types.forEach(element => {
              this.prodForm.product_item_stats[element.slug] = true;
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

  gotoNext() {
    if(this.description == undefined ||this.description==''){
      this.msgService.showErrorMessage('error', 'Pleaas add description', '');
      return
    }

    if (this.description.length > 1500 ) {
      this.msgService.showErrorMessage('error', 'allowed description limit is 1500 characters', '');
      return;
    }

    if ((!this.isRippleLoad)) {
      //update test List
      let obj={
        "page_type": "Online_Class",
        "item_list":[],
        "description":this.description
      }
      this.isRippleLoad = true;
      this.http.postMethod('product-item/update/' + this.entity_id, obj).then(
        (resp: any) => {
          this.isRippleLoad = false;
          let response = resp['body'];
          if (response.validate) {
            let details = response.result;
            this.prodForm.product_item_list = details;
            this.msgService.showErrorMessage('success', "Product updated successfully !", '');
            this.nextForm.emit();
          }
          else {
            this.msgService.showErrorMessage('error', response.error[0].error_message, '');
          }
        },
        (err) => {
          this.isRippleLoad = false;
          this.msgService.showErrorMessage('error','There is some problem in processing your request.Please try after some time.Or contact us at support@proctur.com for further assistance. ', '');
        });
    }
  }
}
