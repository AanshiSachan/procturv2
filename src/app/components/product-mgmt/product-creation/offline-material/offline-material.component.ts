import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offline-material',
  templateUrl: './offline-material.component.html',
  styleUrls: ['./offline-material.component.scss']
})
export class OfflineMaterialComponent implements OnInit {
  @Input() entity_id: any;
  @Input() prodForm: any;

  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  @Output() previewEvent = new EventEmitter<boolean>();
  testlist: any = [];
  description:string='';
  selectAll: boolean = false;
  isRippleLoad: boolean = false;
  constructor(
    private http: ProductService,
    private msgService: MessageShowService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initOfflineMaterials() {
    //Fetch Product Groups List
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.http.postMethod('ext/get-examdesk', ["Online_Test"]).then(
        (resp: any) => {
          this.isRippleLoad = false;
          let response = resp['body'];
          if (response.validate) {
            let details = JSON.parse(response.result['Online_Test']);
            this.testlist = details.data;
            this.selectAllDetails(false);
            if (this.testlist.length && this.prodForm.product_item_list.length) {
              this.prodForm.product_item_list.forEach((obj) => {
                this.testlist.forEach((test) => {
                  if (test.test_id == obj.source_item_id) { test.isChecked = true; }
                });
              });
            }
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
            this.description = response.page_description['Offline_Material'];
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

  selectAllDetails($event) {
    this.testlist.forEach(element => { element.isChecked = $event });
  }

  selectVlaue($event) {
    this.selectAll = false;
    let array = this.testlist.filter(element => element.isChecked == true);
    if (array.length == this.testlist.length) {
      this.selectAll = true;
    }
  }

  gotoBack() {
    this.router.navigateByUrl('/view/products/details');
  }

  gotoNext() {
    if(this.description==''){
      this.msgService.showErrorMessage('error', 'Pleaas add description', '');
      return
    }
    let objectArray = [];
    // let array = this.testlist.filter((item) => item.isChecked == true);
    // console.log(array);
    // if (this.testlist.length == 0) {
    //   this.nextForm.emit();
    // } else {
    //   let objectArray = []
    //   array.forEach(element => {
    //     if (element.isChecked) {
    //       let object = {
    //         "source_item_id": element.test_id,
    //         "source_subject_id": "",
    //         "course_type_id": "",
    //         "parent_topic_id": "",
    //         "slug": "Offline_Material"
    //       }
    //       objectArray.push(object);
    //     }
    //   });}


      if ((!this.isRippleLoad)) {
        //update test List
        let obj={
          "page_type": "Offline_Material",
          "item_list":objectArray,
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
              this.msgService.showErrorMessage('success', "product printed material  updated successfully", '');
              this.nextForm.emit();
            }
            else {
              this.nextForm.emit();
              // this.msgService.showErrorMessage('error', response.error[0].error_message, '');
            }
          },
          (err) => {
            this.msgService.showErrorMessage('error', err['error'].errors.message, '');
          });
      }
      else {
        this.isRippleLoad = false;
        this.msgService.showErrorMessage('error', " select at least one online test", '');
        return;
      }
    

  }

}
