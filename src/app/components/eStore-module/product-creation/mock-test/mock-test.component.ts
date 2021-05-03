import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { HttpService } from '../../../../services/http.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { ProductService } from '../../../../services/products.service';
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
  isAdvanceProductEdit: boolean = false;
  description: string = '';
  product_ecourse_maps: any = [];
  standardData: any = [];
  subjectData: any = [];
  filteredTestList: any = [];
  filterData = {
    standard_id:-1,
    subject_id:-1
  }
  editorConf = {
    height: 150,
    menubar: false,
    branding: false,
    plugins: [
      'preview anchor',
      'visualblocks code ',
      'insertdatetime  table paste code  wordcount'
    ],
    toolbar: 'undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent'
  };
  constructor(
    private http: ProductService,
    private msgService: MessageShowService,
    private router: Router,
    private auth:AuthenticatorService,
    private _httpService: HttpService
  ) { }

  ngOnInit() {
    console.log(this.prodForm);
    this.initForm();
    this.getAllStandards();
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
    if (!this.auth.isRippleLoad.getValue()) {
      this.auth.showLoader();
      this.http.postMethod('ext/get-examdesk/' + ecourse.course_type, ["Mock_Test"]).then(
        (resp: any) => {
          this.auth.hideLoader();
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
                    && obj.slug == "Mock_Test") {
                    test.isChecked = true;
                    test.is_existed_checked = (test.isChecked && this.isAdvanceProductEdit) ? true : false;
                  }
                });
              });
            }
          }
          else {
            this.msgService.showErrorMessage('error', response.errors.message, '');
          }
        },
        (err) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('error', err['error'].errors.message, '');
        });
    }
  }

  initForm() {
    //Fetch Product Groups List

    if (this.entity_id && this.entity_id.length > 0 && (!this.auth.isRippleLoad.getValue())) {
      // Fetch Product Info
      this.auth.showLoader();
      this.http.getMethod('product/get/' + this.entity_id, null).subscribe(
        (resp: any) => {
          this.auth.hideLoader();
          let response = resp.result;
          if (resp.validate) {
            let productData = response;
            this.prodForm = response;
            console.log(response);
            this.description = response.page_description['Mock_Test'];
            this.product_ecourse_maps = response.product_ecourse_maps;
            this.product_ecourse_maps.forEach((course) => {
              course.isExpand = false;
              course.testlist = [];
            });
            this.prodForm.product_item_stats = {};
            // if (productData.product_item_list && productData.product_item_list.length) {
            //   productData.product_item_list.forEach((object) => {
            //     if (object.slug == 'Mock_Test') {
            //       this.testlist.push(object);
            //     }
            //   });
            // }
            this.prodForm && this.prodForm.product_items_types && this.prodForm.product_items_types.forEach(element => {
              this.prodForm.product_item_stats[element.slug] = true;
            });
            this.isAdvanceProductEdit = (this.prodForm.is_advance_product && this.prodForm.status == 30) ? true : false;
            this.updateProductItemStates(null, null);
            this.getTestIdByProduct();
          }
          else {
            this.msgService.showErrorMessage('error', response.errors.message, '');
          }
        },
        (err) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('error', err['error'].errors.message, '');
        });
    }

  }

  getTestIdByProduct() {
    this.auth.showLoader();
    const url = `user-product/get-product-test-details/Mock_Test/${this.entity_id}`
      this.http.getMethod(url, null).subscribe(
        (resp: any) => {
          this.auth.hideLoader();
          let response = resp;
          if (resp.validate) {
            let productData = response;
            this.testlist = [];
            console.log(productData);
            // this.prodForm.product_item_stats = {};
            if (productData.data && productData.data.length) {
              productData.data.forEach((object) => {
                // if (object.slug == 'Mock_Test') {
                  object.isChecked = true;
                  object.is_existed_checked = (object.isChecked && this.isAdvanceProductEdit) ? true : false;
                  this.testlist.push(object);
                // }
              });
              console.log(this.testlist);
            }
          }
          else {
            this.msgService.showErrorMessage('error', response.errors.message, '');
          }
        },
        (err) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('error', err['error'].errors.message, '');
        });
  }

  getAllStandards() {
    let url = "/api/v1/standards/standard-subject-list/" + sessionStorage.getItem('institute_id') + "?is_active=Y" + '&is_subject_required=true';
    this.auth.showLoader();
    this._httpService.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.standardData = data.result;
        // console.log(data);
      },
      (error: any) => {
        this.auth.hideLoader();
        console.log(error);
      }
    )
  }

  getAllSubjectListFromServer(standards_id) {
    this.subjectData = [];
    this.filterData.subject_id = -1;
    for (let i = 0; i < this.standardData.length; i++) {
      if (this.standardData[i].standard_id == this.filterData.standard_id) {
        this.subjectData = this.standardData[i].subject_list;
      }
    }
  }

  fetchTestByStd() {
    if(this.filterData.standard_id != -1) {
      this.auth.showLoader();
    let url = `/ext/get-examdesk-test/Mock_Test?standard_id=${this.filterData.standard_id}`;
    if(this.filterData.subject_id!=-1) {
      url = url +`&subject_id=${this.filterData.subject_id}`;
    }
      this.http.getMethod(url, null).subscribe(
        (resp: any) => {
          this.auth.hideLoader();
          let response = resp;
          console.log(response);
          if (resp.validate) {
           this.filteredTestList = response.data;
           for(let i=0;i<this.filteredTestList.length;i++) {
            this.filteredTestList[i].disabled = false;
             for(let j=0;j<this.testlist.length;j++) {
               if(this.filteredTestList[i].test_id == this.testlist[j].test_id) {
                 this.filteredTestList[i].disabled = true;
               }
             }
           }
           if(!this.filteredTestList.length) {
            this.msgService.showErrorMessage('info', '', 'No Data Found');
           }
          }
          else {
            this.msgService.showErrorMessage('error', response.errors.message, '');
          }
        },
        (err) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('error', err['error'].errors.message, '');
        });
      } else {
        this.msgService.showErrorMessage('error','','Please select Standard');
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

  getTime(date) {
    let milisec = date * 1000;
    return moment(new Date(milisec)).format('h:mm')
  }
  getDate(date) {
    let milisec = date * 1000;
    return moment(new Date(milisec)).format('DD MMM YYYY');
  }

  gotoBack() {
    this.router.navigateByUrl('/view/e-store/details');
  }

  gotoNext() {
    if (this.description == undefined || this.description == '') {
      this.msgService.showErrorMessage('error', 'Please add description', '');
      return
    }
    if (this.description.length > 5000) {
      this.msgService.showErrorMessage('error', 'allowed description limit is 5000 characters', '');
      return;
    }
    let objectArray = [];
    this.prodForm.product_item_list && this.prodForm.product_item_list.forEach((object) => {
      if (object.slug != 'Mock_Test') {
        objectArray.push(object);
      }
    })

    // this.product_ecourse_maps.forEach(course => {
      this.testlist.forEach(element => {
        if (element.isChecked) {
          let object = {
            "source_item_id": element.test_id,
            "source_subject_id": "",
            "course_type_id": '',
            "parent_topic_id": "",
            "slug": "Mock_Test",
            "category_id": 0
          }
          objectArray.push(object);
        }
      });
      console.log(this.filteredTestList);
      this.filteredTestList.forEach(element => {
        if (element.isChecked) {
          let object = {
            "source_item_id": element.test_id,
            "source_subject_id": "",
            "course_type_id": '',
            "parent_topic_id": "",
            "slug": "Mock_Test",
            "category_id": 0
          }
          objectArray.push(object);
        }
      });
    // });
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
      if ((!this.auth.isRippleLoad.getValue())) {
        //update test List
        let obj = {
          "page_type": "Mock_Test",
          "status": this.prodForm.status,
          "is_advance_product": this.prodForm.is_advance_product,
          "item_list": objectArray,
          "description": this.description,
          "is_paid" : this.prodForm.is_paid
        }
        this.auth.showLoader();
        this.http.postMethod('product-item/update/' + this.entity_id, obj).then(
          (resp: any) => {
            this.auth.hideLoader();
            let response = resp['body'];
            if (response.validate) {
              let details = response.result;

              this.prodForm.product_item_list = details;
              console.log(this.prodForm)
              this.msgService.showErrorMessage('success', "Product updated successfully !", '');
              this.nextForm.emit();
            }
            else {
              this.msgService.showErrorMessage('error', response.error[0].error_message, '');
            }
          },
          (err) => {
            this.auth.hideLoader();
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
