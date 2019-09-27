import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import * as moment from 'moment';

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
  product_ecourse_maps: any = [];
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

  expandEcourse(ecourse) {
    ecourse.isExpand = !ecourse.isExpand;  
    if (ecourse.isExpand && ecourse.testlist.length == 0) {
      this.initOnlineTests(ecourse);
    }
  }

  getTime(date){
    let milisec = date*1000;
    return moment(new Date(milisec)).format('h:mm')
  }
  getDate(date){
    let milisec = date*1000;
    return moment(new Date(milisec)).format('DD MMM YYYY');
  }


  initOnlineTests(ecourse) {
    //Fetch Product Groups List
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.http.postMethod('ext/get-examdesk/' + ecourse.course_type, ["Online_Test"]).then(
        (resp: any) => {
          this.isRippleLoad = false;
          let response = resp['body'];
          if (response.validate) {
            let details = JSON.parse(response.result['Online_Test']);
            ecourse.testlist = details.data;
            // this.selectAllDetails(false);
            if (ecourse.testlist.length && this.prodForm.product_item_list.length) {
              this.prodForm.product_item_list.forEach((obj) => {
                ecourse.testlist.forEach((test) => {
                  if (test.test_id == obj.source_item_id && obj.course_type_id == ecourse.course_type_id
                    && obj.slug == "Online_Test") { test.isChecked = true; }
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
            this.testlist = [];
            this.prodForm = response;
            this.description = response.page_description['Online_Test'];
            this.prodForm.product_item_stats = {};
            this.prodForm.product_items_types.forEach(element => {
              this.prodForm.product_item_stats[element.slug] = true;
            });

            this.updateProductItemStates(null, null);
            this.product_ecourse_maps = response.product_ecourse_maps;
            this.product_ecourse_maps.forEach((course) => {
              course.isExpand = false;
              course.testlist = [];
            });
            if (productData.product_item_list && productData.product_item_list.length) {
              productData.product_item_list.forEach((object) => {
                if (object.slug == 'Online_Test') {
                  this.testlist.push(object);
                }
              });
            }
            this.prodForm.product_item_stats = {};
            this.prodForm && this.prodForm.product_items_types && this.prodForm.product_items_types.forEach(element => {
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
    if(this.description == undefined || this.description==''){
      this.msgService.showErrorMessage('error', 'Pleaas add description', '');
      return
    }
    // let array = this.testlist.filter((item) => item.isChecked == true);
    // console.log(array);
    // if (this.testlist.length == 0) {
    //   this.nextForm.emit();
    // } else 
    let objectArray = [];
    this.prodForm.product_item_list && this.prodForm.product_item_list.forEach((object) => {
      if (object.slug != 'Online_Test') {
        objectArray.push(object);
      }
    });
    this.product_ecourse_maps.forEach(course => {
      course.testlist.forEach(element => {
        if (element.isChecked) {
          let object = {
            "source_item_id": element.test_id,
            "source_subject_id": "",
            "course_type_id": course.course_type_id,
            "parent_topic_id": "",
            "slug": "Online_Test"
          }
          objectArray.push(object);
        }
      });
    });
    if (objectArray.length == 0) {
      objectArray = this.testlist;
    }
    else {
      this.testlist.forEach((linkedtest) => {
        let isAdded = false;
        for (let i = 0; i < objectArray.length; i++) {
          if (linkedtest.source_item_id == objectArray[i].source_item_id) {
            isAdded = true;
            break;
          }
        }
        if (!isAdded) {
          objectArray.push(linkedtest);
        }
      });
    }

    {
      if ((!this.isRippleLoad)) {
        //update test List
        let obj = {
          "page_type": "Online_Test",
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
              console.log(this.prodForm)
              this.msgService.showErrorMessage('success', "product online test updated successfully", '');
              this.nextForm.emit();
            }
            else {
              this.checkedList = [];
              this.msgService.showErrorMessage('error', response.error[0].error_message, '');
            }
          },
          (err) => {
            this.isRippleLoad = false;
            this.msgService.showErrorMessage('error', err['error'].errors.message, '');
          });
      }
      else {
        this.msgService.showErrorMessage('error', " select at least one Online Test", '');
        return;
      }
    }

  }
}
