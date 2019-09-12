import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router } from '../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-online-exam',
  templateUrl: './online-exam.component.html',
  styleUrls: ['./online-exam.component.scss']
})
export class OnlineExamComponent implements OnInit {

  @Input() entity_id: any;
  @Input() prodForm: any;

  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  @Output() previewEvent = new EventEmitter<boolean>();
  testlist: any = [];
  checkedList: any = [];
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

  initOnlineTests() {
    //Fetch Product Groups List
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.http.postMethod2('ext/get-examdesk', ["Online_Test"]).then(
        (resp: any) => {
          this.isRippleLoad = false;
          let response = resp['body'];
          if (response.validate) {
            let details = JSON.parse(response.result['Online Test']);
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
            this.checkedList = [];
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
            this.prodForm.product_item_stats = {};
            this.prodForm.product_items_types.forEach(element => {
              this.prodForm.product_item_stats[element.slug] = true;
            });
            this.updateProductItemStates(null, null);
            this.initOnlineTests();
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
    let array = this.testlist.filter((item) => item.isChecked == true);
    console.log(array);
    if (this.testlist.length == 0) {
      this.nextForm.emit();
    } else {
      let objectArray = []
      array.forEach(element => {
        if (element.isChecked) {
          let object = {
            "source_item_id": element.test_id,
            "source_subject_id": "",
            "course_type_id": "",
            "parent_topic_id": "",
            "slug": "Online_Test"
          }
          objectArray.push(object);
        }
      });


      if (objectArray.length && (!this.isRippleLoad)) {
        //update test List
        let obj={
          "page_type": "Online_Test",
          "item_list":objectArray
        }
        this.isRippleLoad = true;
        this.http.postMethod('product-item/update/' + this.entity_id, obj).then(
          (resp: any) => {
            this.isRippleLoad = false;
            let response = resp['body'];
            if (response.validate) {
              let details = response.result;
              this.prodForm.product_item_list = details;
              this.msgService.showErrorMessage('success', "product online test updated successfully", '');
              this.nextForm.emit();
            }
            else {
              this.checkedList = [];
              this.msgService.showErrorMessage('error', response.errors.message, '');
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
}
