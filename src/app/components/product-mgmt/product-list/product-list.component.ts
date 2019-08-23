import { Component, OnInit } from '@angular/core';
import { MessageShowService } from '../../../services/message-show.service';
import { ProductService } from '../../../services/products.service';
import { HttpService } from '../../../services/http.service';
declare var $;

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  filter: any = {
    ecourse_id: null,
    standard_id: null,
    subject_id: null
  };
  productList: any = [];
  total_items: any;
  productListLoading: boolean = true;

  ecourseList: any = [];
  subjectsList: any = [];
  deleteItem: any = {
    title: '',
    product_id: 0,
    operation: '',
    btnClass: 'btn-disable',
    btnText: 'Loading...'
  };

  jsonKeys = {
    selectAll: false,
    institute_id:''
  }

  constructor(
    private http: ProductService,
    private msgService: MessageShowService,
    private _http :HttpService
  ) { }

  ngOnInit() {
    //this.getExamList();
    this.jsonKeys.institute_id = sessionStorage.getItem('institute_id');
    this.initFilters();
    this.getProductList();
  }

  initFilters() {
 let param ={
      "proc-authorization":"MTk4MzJ8MDphZG1pbjoxMDAxMjg="
    }
    this.http.getMethod('ext/get-ecources', param).subscribe(
      (resp:any) => {
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
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });


  }

  getSubjectList() {
    // if (this.filter.standard_id > 0) {
    //   //Fetch Subjects List
    //<base_url>/ecourse/{institute_id}/{ecourse_id}/subjects
    
      this._http.getData('/api/v1/ecourse/' + this.jsonKeys.institute_id + '/'+this.filter.ecourse_id+'/subjects').subscribe(
        (resp:any) => {
          if (resp.length) {
            this.subjectsList = resp;
          }
        },
        (err) => {
          this.msgService.showErrorMessage('error', err['error'].errors.message, '');
        });
    // }

  }

  getExamList() {
    let response = { "validate": "true", "data": [{ "exam_id": 1, "account_id": 51, "exam_name": "RRB - M & I Categoris CEN 03 / 2019", "exam_icon": "https://s3-ap-southeast-1.amazonaws.com/proctur-elearn/common_resources/kpsc.png", "page_url": "pages/excise_sub_inspector_2018", "proctur_course_id": null, "status_id": 1, "created_date": "2018-12-11T06:22:33+00:00", "created_by": 51, "updated_date": "2019-05-07T07:37:48.000Z", "updated_by": 11, "ecourse_id": 87, "ecourse_name": "appium", "subjects": [{ "subject_id": 4, "subject_name": "Aptitude" }] }, { "exam_id": 2, "account_id": 51, "exam_name": "RRB - Level - 1 by RRC CEN 01 / 2019", "exam_icon": "https://s3-ap-southeast-1.amazonaws.com/proctur-elearn/common_resources/kpsc.png", "page_url": "pages/hm&teachers_RPC_2018", "proctur_course_id": null, "status_id": 1, "created_date": "2018-12-11T06:22:33+00:00", "created_by": 51, "updated_date": "2019-04-01T13:23:45.000Z", "updated_by": 11, "ecourse_id": 87, "ecourse_name": "appium", "subjects": [{ "subject_id": 4, "subject_name": "Aptitude" }] }, { "exam_id": 3, "account_id": 51, "exam_name": "KPSC Group A & B", "exam_icon": "https://s3-ap-southeast-1.amazonaws.com/proctur-elearn/common_resources/kpsc.png", "page_url": "pages/HM_& _Teachers_HK_2018", "proctur_course_id": null, "status_id": 1, "created_date": "2018-12-11T06:22:33+00:00", "created_by": 51, "updated_date": "2019-04-01T13:24:18.000Z", "updated_by": 11, "ecourse_id": 6, "ecourse_name": "Bank PO", "subjects": [{ "subject_id": 4, "subject_name": "Aptitude" }] }, { "exam_id": 5, "account_id": 51, "exam_name": "Current Affairs (saturday at 4 pm)", "exam_icon": "https://s3-ap-southeast-1.amazonaws.com/proctur-elearn/common_resources/kpsc.png", "page_url": "pages/HM_& _Teachers_HK_2018", "proctur_course_id": null, "status_id": 1, "created_date": "2018-12-11T06:22:33+00:00", "created_by": 51, "updated_date": "2019-04-01T13:10:39.000Z", "updated_by": 11, "ecourse_id": null, "ecourse_name": null, "subjects": [{ "subject_id": 2, "subject_name": "Physcis" }] }, { "exam_id": 6, "account_id": 51, "exam_name": "RRB -JE CEN 03/2018", "exam_icon": "https://s3-ap-southeast-1.amazonaws.com/proctur-elearn/common_resources/psi.png", "page_url": "pages/staff_selection_commission_ssc", "proctur_course_id": null, "status_id": 1, "created_date": "2018-12-11T06:22:33+00:00", "created_by": 51, "updated_date": "2019-04-01T13:25:02.000Z", "updated_by": 11, "ecourse_id": null, "ecourse_name": null, "subjects": [{ "subject_id": 4, "subject_name": "Aptitude" }] }, { "exam_id": 8, "account_id": 51, "exam_name": "IAS Prelims", "exam_icon": "https://s3-ap-southeast-1.amazonaws.com/proctur-elearn/common_resources/kpsc.png", "page_url": "pages/KAR_TET_2018", "proctur_course_id": null, "status_id": 1, "created_date": "2018-12-11T06:22:33+00:00", "created_by": 51, "updated_date": "2019-04-01T13:14:41.000Z", "updated_by": 11, "ecourse_id": null, "ecourse_name": null, "subjects": [{ "subject_id": 2, "subject_name": "Physcis" }] }] }
    this.ecourseList = response.data;
    this.http.getData('exams', 'web').subscribe(
      (response) => {
        let resp = response['body'];
      },
      (err) => {

      }
    );
  }

  getProductList() {
    let response = {
      "validate": "true",
      "data": {
        "total_items": 139,
        "products":
          [
            {
              "product_id": 2,
              "title": "Online Test",
              "slug": "online_test_Rw9SWHZ",
              "product_image": "https://s3-aws.com/product/pepper-pot.jpg",
              "short_description": "Nice Product to purchase ",
              "is_paid": 1,
              "price": 0,
              "start_timestamp": 1548335,
              "end_timestamp": 1548355,
              "product_status": 3,
              "total_items": 139,
              "product_group_id": 26,
              "exam_ids": [1],
              "exams": "RRB - M & I Categoris CEN 03 / 2019"
            }, {
              "product_id": 3,
              "title": "Online Test",
              "slug": "online_test_xZeF0ne",
              "product_image": "123",
              "short_description": "short_description",
              "is_paid": 1,
              "price": 20,
              "start_timestamp": 1262253,
              "end_timestamp": 1264328,
              "product_status": 3,
              "total_items": 139,
              "product_group_id": 10,
              "exam_ids": [],
              "exams": ""
            }, {
              "product_id": 5,
              "title": "Online Test",
              "slug": "upsc_prelims_crash_course_s56jTy",
              "product_image": "https://ams-s3-url.com",
              "short_description": "short_description",
              "is_paid": 1,
              "price": 110,
              "start_timestamp": 1550079564,
              "end_timestamp": 1550079564,
              "product_status": 3,
              "total_items": 139,
              "product_group_id": 12,
              "exam_ids": [2, 4],
              "exams": "RRB - Level - 1 by RRC CEN 01 / 2019,CTET"
            }, {
              "product_id": 31,
              "title": "Online Test",
              "slug": "check_update_product_PKh13oa",
              "product_image": "https://s3-aws.com/product/pepper-pot.jpg",
              "short_description": "This is a short description using the textarea element of the form",
              "is_paid": 1,
              "price": 110,
              "start_timestamp": 1548335,
              "end_timestamp": 1548355,
              "product_status": 1,
              "total_items": 139,
              "product_group_id": 10,
              "exam_ids": [57],
              "exams": ""
            }, {
              "product_id": 32,
              "title": "Online Test",
              "slug": "check_update_product_jQSVMwX",
              "product_image": "https://s3-aws.com/product/pepper-pot.jpg",
              "short_description": "This is a short description using the textarea element of the form",
              "is_paid": 1,
              "price": 110,
              "start_timestamp": 1548335,
              "end_timestamp": 1548355,
              "product_status": 1,
              "total_items": 139,
              "product_group_id": 10,
              "exam_ids": [10],
              "exams": "RRB - NTPC CEN01/2019"
            }, {
              "product_id": 33,
              "title": "Product_test6",
              "slug": "producttest_1BUbQKK",
              "product_image": "https://s3-aws.com/product/pepper-pot.jpg",
              "short_description": "This is a short description using the textarea element of the form",
              "is_paid": 1,
              "price": 1250,
              "start_timestamp": 1548335,
              "end_timestamp": 1548355,
              "product_status": 1,
              "total_items": 139,
              "product_group_id": 38,
              "exam_ids": [233, 244, 344],
              "exams": ""
            }]
      }
    }
    this.productList = response.data.products;
    this.total_items = response.data.total_items;
    this.productListLoading = false;
    this.productList.forEach(element => {
      element.isSelected = false;
    });
    this.http.getData('product/get', 'web').subscribe(
      (resp:any) => {
        let response = JSON.parse(resp.result);
        console.log(response);
        if (resp.validate) {
          this.productList = response;
          this.total_items = response.data.total_items;
          this.productListLoading = false;
        }
        else {
          this.msgService.showErrorMessage('error', response.errors.message, '');
        }

      },
      (err) => {
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      }
    );
  }

  loadMoreItems() {
    this.productListLoading = true;
    if (this.productList.length < this.total_items) {
      this.http.getData('products?offset=' + this.productList.length, 'web').subscribe(
        (resp) => {
          let response = resp['body'];
          this.productListLoading = false;
          if (response.validate) {
            this.productList = [...this.productList, ...response.data.products];            
          }
          else {
            this.msgService.showErrorMessage('error', response.errors.message, '');
          }
        },
        (err) => {
          this.productListLoading = false;
          this.msgService.showErrorMessage('error', err['error'].errors.message, '');
        });
    }
  }

  actionProductModal(operation, id) {
    this.deleteItem.operation = operation;
    let item = this.productList.filter(item => item.product_id == id)[0];
    this.deleteItem.title = item.title;
    this.deleteItem.product_id = item.product_id;
    switch (operation) {
      case 'delete': {
        this.deleteItem.btnClass = 'btn-danger';
        this.deleteItem.btnText = 'Delete';
        break;
      }
      case 'publish': {
        this.deleteItem.btnClass = 'btn-success';
        this.deleteItem.btnText = 'Publish';
        break;
      }
      case 'unpublish': {
        this.deleteItem.btnClass = 'btn-primary';
        this.deleteItem.btnText = 'Unpublish';
        break;
      }
    }

    $("#actionProductModal").modal({
      backdrop: 'static',
      keyboard: false,
      show: true
    });
  }

  confirmAction(operation, id) {
    let body = {
      product_status: 1
    }

    switch (operation) {
      case 'delete': {
        body.product_status = 5;
        break;
      }
      case 'publish': {
        body.product_status = 3;
        break;
      }
      case 'unpublish': {
        body.product_status = 4;
        break;
      }
    }

    let item = this.productList.filter(item => item.product_id == id)[0];
    let index = this.productList.indexOf(item);
    this.http.patchMethod('product/' + id, body).then(
      (resp) => {
        let data = resp['body'];
        if (data.validate) {
          this.msgService.showErrorMessage("success", data.message, '');
          $("#actionProductModal").modal('hide');
          if (operation == 'delete') {
            this.productList.splice(index, 1);
            this.total_items--;
          } else {
            item.product_status = body.product_status;
          }
        }
        else {
          this.msgService.showErrorMessage('error', data.errors.message, '');
        }
      },
      (err) => {
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      }
    );
  }

  filterData(){
    console.log("filterData");
  }

  toggleAllCheckBox($event) {
    console.log('toggleAllCheckBox');
    this.productList.forEach(element => {
      element.isSelected = this.jsonKeys.selectAll;
    });
  }

   isAllSelected($event,item){
    console.log($event,item);
  }

  toggleActionMenu(event) {
    console.log(event);
    //event.target.nextElementSibling.classList.toggle('d-flex');
  }

}