import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { Router } from '../../../../../../node_modules/@angular/router';

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
  checkedList: any = [];
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
    this.initMockTests(ecourse);
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
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.http.postMethod2('ext/get-examdesk/IIT', ["Mock_Test"]).then(
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
                  if (test.test_id == obj.source_item_id && obj.course_type_id==ecourse.course_type_id) { test.isChecked = true; }
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
            console.log(response);
            this.prodForm = response;
            this.product_ecourse_maps = response.product_ecourse_maps;
            this.product_ecourse_maps.forEach((course) => {
              course.isExpand = false;
              course.testlist = [];
            })
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
    // let array = this.testlist.filter((item) => item.isChecked == true);
    // console.log(array);
    // if (this.testlist.length == 0) {
    //   this.nextForm.emit();
    // } else 
    let objectArray = [];
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
    }); {
      if (objectArray.length && (!this.isRippleLoad)) {
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
              this.msgService.showErrorMessage('success', "product mock test updated successfully", '');
              this.nextForm.emit();
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
      else {
        this.msgService.showErrorMessage('error', " select at least one Mock Test", '');
        return;
      }
    }

  }
}
