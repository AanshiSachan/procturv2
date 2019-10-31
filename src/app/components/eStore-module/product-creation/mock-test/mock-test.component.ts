import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-mock-test',
  templateUrl: './mock-test.component.html',
  styleUrls: ['./mock-test.component.scss']
})
export class MockTestComponent implements OnInit {

  @Input() entity_id: any;
  @Input() prodForm: any;
  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  @Output() previewEvent = new EventEmitter<boolean>();
  testlist: any = [];
  selectAll: boolean = false;
  isRippleLoad: boolean = false;
  description: string = '';
  product_ecourse_maps: any = [];
  constructor(
    private http: ProductService,
    private msgService: MessageShowService,
    private router: Router,
  ) { }

  ngOnInit() {
    console.log(this.prodForm);
    this.initForm();
  }

  expandEcourse(ecourse) {
    ecourse.isExpand = !ecourse.isExpand;
    if (ecourse.isExpand && ecourse.testlist.length == 0) {
      this.initMockTests(ecourse);
    }
  }

  selectAllDetails($event) {
    this.testlist.forEach(element => { element.isChecked = $event });
  }

  selectVlaue($event, test) {
    // this.selectAll = false;
    // let array = this.testlist.filter(element => element.isChecked == true);
    // if (array.length == this.testlist.length) {
    //   this.selectAll = true;
    // }
    console.log($event, test);
  }



  initMockTests(ecourse) {
    //Fetch Product Groups List
    //{course_type: "KAS Prelims", course_type_id: 145}
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.http.postMethod('ext/get-examdesk/' + ecourse.course_type, ["Mock_Test"]).then(
        (resp: any) => {
          this.isRippleLoad = false;
          let response = resp['body'];
          if (response.validate) {
            let details = JSON.parse(response.result['Mock_Test']);
            ecourse.testlist = details.data;
            // this.selectAllDetails(false);
            if (ecourse.testlist.length && this.prodForm.product_item_list.length) {
              this.prodForm.product_item_list.forEach((obj) => {
                ecourse.testlist.forEach((test) => {
                  if (test.test_id == obj.source_item_id &&
                    obj.course_type_id == ecourse.course_type_id
                    && obj.slug == "Mock_Test") 
                    { test.isChecked = true; }
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
            this.testlist = [];
            console.log(response);
            this.description = response.page_description['Mock_Test'];
            this.product_ecourse_maps = response.product_ecourse_maps;
            this.product_ecourse_maps.forEach((course) => {
              course.isExpand = false;
              course.testlist = [];
            });
            this.prodForm.product_item_stats = {};
            if (productData.product_item_list && productData.product_item_list.length) {
              productData.product_item_list.forEach((object) => {
                if (object.slug == 'Mock_Test') {
                  this.testlist.push(object);
                }
              });
            }
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

  getTime(date){
    let milisec = date*1000;
    return moment(new Date(milisec)).format('h:mm')
  }
  getDate(date){
    let milisec = date*1000;
    return moment(new Date(milisec)).format('DD MMM YYYY');
  }

  gotoBack() {
    this.router.navigateByUrl('/view/e-store/details');
  }

  gotoNext() {
    if (this.description == undefined ||this.description == '') {
      this.msgService.showErrorMessage('error', 'Pleaas add description', '');
      return
    }
    if (this.description.length>1500 ) {
      this.msgService.showErrorMessage('error', 'allowed description limit is 1500 characters', '');
      return;
    }
    let objectArray = [];
    this.prodForm.product_item_list && this.prodForm.product_item_list.forEach((object) => {
      if (object.slug != 'Mock_Test') {
        objectArray.push(object);
      }
    })

    this.product_ecourse_maps.forEach(course => {
      course.testlist.forEach(element => {
        if (element.isChecked) {
          let object = {
            "source_item_id": element.test_id,
            "source_subject_id": "",
            "course_type_id": course.course_type_id,
            "parent_topic_id": "",
            "slug": "Mock_Test"
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
          "page_type": "Mock_Test",
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
              this.msgService.showErrorMessage('success',"Product updated successfully !", '');
              this.nextForm.emit();
            }
            else {
              this.msgService.showErrorMessage('error', response.error[0].error_message, '');
            }
          },
          (err) => {
            this.isRippleLoad = false;
            this.msgService.showErrorMessage('error', err['error'].errors.message, '');
          });
      }
      else {
        this.msgService.showErrorMessage('error', " select at least one Mock Test", '');
        return;
      }
    }

  }
}
