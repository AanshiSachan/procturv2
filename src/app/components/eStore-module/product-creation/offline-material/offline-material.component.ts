import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageShowService } from '../../../../services/message-show.service';
import { ProductService } from '../../../../services/products.service';

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
  inventoryList: any = [];
  description: string = '';
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
      this.http.getMethod('ext/inventory', null).subscribe(
        (resp: any) => {
          this.isRippleLoad = false;
          if (resp.validate) {
            this.inventoryList = resp.result;
            this.inventoryList.forEach(element => {
              element.isChecked = false;
              for (let i = 0; i < this.prodForm.product_item_list.length; i++) {
                let obj = this.prodForm.product_item_list[i];
                if (element.inventory_id == obj.source_item_id && obj.slug == 'Offline_Material') {
                  element.isChecked = true;
                  break;
                }
              }
              element.is_existed_selected = element.isChecked;
            });
            this.selectVlaue();
          }
          else {
            this.msgService.showErrorMessage('error', resp.error, '');
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
            this.initOfflineMaterials();
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
    this.inventoryList.forEach(element => {
      if (element.is_existed_selected) {
        element.isChecked = element.is_existed_selected
      }
      else {
        element.isChecked = $event;
      }
    });
    this.selectVlaue();
  }

  selectVlaue() {
    this.selectAll = false;
    let array = this.inventoryList.filter(element => element.isChecked == true);
    if (array.length == this.inventoryList.length) {
      this.selectAll = true;
    }
  }

  gotoBack() {
    this.router.navigateByUrl('/view/e-store/details');
  }

  gotoNext() {
    if (this.description == undefined || this.description == '') {
      this.msgService.showErrorMessage('error', 'Pleaas add description', '');
      return
    }
    if (this.description.length > 1500) {
      this.msgService.showErrorMessage('error', 'allowed description limit is 1500 characters', '');
      return;
    }
    let objectArray = [];
    let array = this.inventoryList.filter((item) => item.isChecked == true);
    console.log(array);
    if (this.inventoryList.length == 0) {
      this.nextForm.emit();
    } else {
      let objectArray = []
      array.forEach(element => {
        if (element.isChecked) {
          let object = {
            "source_item_id": element.inventory_id,
            "source_subject_id": "",
            "course_type_id": "",
            "parent_topic_id": "",
            "slug": "Offline_Material"
          }
          objectArray.push(object);
        }
      });


      if ((!this.isRippleLoad)) {
        //update test List
        let obj = {
          "page_type": "Offline_Material",
          "status": this.prodForm.status,
          "is_advance_product": this.prodForm.is_advance_product,
          "item_list": objectArray,
          "description": this.description
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
        this.msgService.showErrorMessage('error', " select at least one printed materials", '');
        return;
      }
    }
  }

}
