import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { HttpService } from '../../../services/http.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ProductService } from '../../../services/products.service';
declare var $;

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  filter: any = {
    between: {
      from: null,
      to: null
    },
    by: {
      title: null,
      publishDate: null,
      isPaid: null,
      ecourseId: '-1',
      status: null,
      productType: -1
    },
    // sort: {
    //   publishDate: false
    // }
  };

  /* Variable to handle popups */
  varJson: any = {
    PageIndex: 1,
    sizeArr: [5, 25, 50, 100, 150, 200, 500],
    displayBatchSize: 25,
    total_items: 0
  };

  helpMsg: string = "Product on which the bar colour is green,is an advanced product"
  productList: any = [];
  productDetails: any = [];
  ecourseList: any = [];
  subjectsList: any = [];
  studentDetails: any = [];
  masterCourseDetails: any = [];
  courseDetails: any = [];
  product_details_for_student: any = '';
  master_course_name: '';
  course_id: '';
  batch_id: '';
  notifyToStudents = true;
  // activeStudents = true;
  isProfessional = true;
  deleteItem: any = {
    textTitle: '',
    title: '',
    entity_id: 0,
    operation: '',
    btnText: 'Loading...'
  };

  jsonKeys = {
    selectAll: false,
    institute_id: ''
  }

  constructor(
    private http: ProductService,
    private msgService: MessageShowService,
    private _http: HttpService,
    private auth: AuthenticatorService
  ) { }

  ngOnInit() {
    this.jsonKeys.institute_id = sessionStorage.getItem('institute_id');
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.fectchTableDataByPage(1)
    this.getAllProductDetails();
  }

  /*** pagination functions */
  /* Fetch next set of data from server and update table */
  fetchNext() {
    this.varJson.PageIndex++;
    this.fectchTableDataByPage(this.varJson.PageIndex);
  }

  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    this.varJson.PageIndex--;
    this.fectchTableDataByPage(this.varJson.PageIndex);
  }

  getAllProductDetails() {
    this.auth.showLoader();
    this.http.getMethod('product/get-product-list', null).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.productDetails = data.result;
      },
      (error: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('error', error.message, '');
      }
    )
  }
  /* Fetch table data by page index */
  fectchTableDataByPage(index) {
    this.varJson.PageIndex = index;
    let object = {
      "page_no": this.varJson.PageIndex,
      "no_of_records": this.varJson.displayBatchSize
    }

    this.auth.showLoader();
    this.http.postMethod('product/get', object).then(
      (resp: any) => {
        let response = resp['body'];
        this.auth.hideLoader();
        if (response.validate) {
          this.productList = response.result.results;
          this.varJson.total_items = response.result.total_records;
          // -- added by laxmi
          // this code is used to laod image url dynamically not save in locally so dont remove it
          this.productList.forEach(obj => {
            if (obj.logo_url) {
              obj.logo_url = obj.logo_url + "?t=" + new Date().getTime();//
            }
          });

        }
        else {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('error', "something went wrong, try again", '');
        }
      },
      (err) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('error', "something went wrong, try again", '');
      });

  }

  convertUTCDateToLocalDate(date_s) {
    var date = new Date(date_s)
    // var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    //
    // var offset = date.getTimezoneOffset() / 60;
    // var hours = date.getHours();
    //
    // newDate.setHours(hours - offset);
    return moment(date).format('DD MMM YYYY');
  }

  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.varJson.PageIndex = 1;
    this.varJson.displayBatchSize = parseInt(num);
    this.fectchTableDataByPage(this.varJson.PageIndex);
  }

  getSubjectList() {
    //  Fetch Subjects List
    //<base_url>/ecourse/{institute_id}/{ecourse_id}/subjects
    this.auth.hideLoader();
    this.filter.subject_id = '-1';
    this.subjectsList = [];
    this._http.getData('/api/v1/ecourse/' + this.jsonKeys.institute_id + '/' + this.filter.ecourse_id + '/subjects').subscribe(
      (resp: any) => {
        this.auth.hideLoader();
        if (resp && resp.length) {
          this.subjectsList = resp;
        }
      },
      (err) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });
    // }

  }

  actionProductModal(operation, id) {
    this.deleteItem.operation = operation;
    let item = this.productList.filter(item => item.entity_id == id)[0];
    this.deleteItem.title = item.title;
    this.deleteItem.entity_id = item.entity_id;
    switch (operation) {
      case 'delete': {
        this.deleteItem.textTitle = "Are you sure, you want to delete " + this.deleteItem.title + " ? ";
        this.deleteItem.btnText = 'Delete';
        break;
      }
      case 'readytopublish': {
        this.deleteItem.textTitle = "Do you want to change the status of " + this.deleteItem.title + " to ready ";
        this.deleteItem.btnText = 'Ready To Publish';
        break;
      }
      case 'ready': {
        this.deleteItem.btnText = 'Ready';
        this.deleteItem.textTitle = "Do you want to change the status of " + this.deleteItem.title + " to ready ? ";
        break;
      }
      case 'publish': {
        this.deleteItem.textTitle = "Do you want to publish " + this.deleteItem.title + " ? ";
        this.deleteItem.btnText = 'Publish';
        break;
      }
      case 'unpublish': {
        this.deleteItem.textTitle = "Are you sure, you want to unpublish  " + this.deleteItem.title + " ? ";
        this.deleteItem.btnText = 'Unpublish';
        break;
      }
      case 'close': {
        this.deleteItem.textTitle = "Are you sure, you want to close  " + this.deleteItem.title + " ? ";
        this.deleteItem.btnText = 'Close';
        break;
      }
    }

    $("#actionProductModal").modal({
      backdrop: 'static',
      keyboard: false,
      show: true
    });
  }

  showAssignStudentPopup(data) {
    this.master_course_name = '';
    this.course_id = '';
    this.batch_id = '';
    this.product_details_for_student = data;
    this.courseDetails = [];
    this.getStudentDetails();
    this.getMasterCourseData();
    $("#assignStudent").modal({
      backdrop: 'static',
      keyboard: false,
      show: true
    });
  }

  getStudentDetails() {
    this.jsonKeys.selectAll = false;
    this.studentDetails = [];
    let ecourse = Array.prototype.map.call(this.product_details_for_student.product_ecourse_maps, ecourse => ecourse.course_type_id);
    let object = {};
    if (!this.isProfessional) {
      object = {
        "ecourse_ids": ecourse,
        "master_course_name": "",
        "course_id": ""
      };
      if (this.course_id != '') {
        object = {
          "course_id": this.course_id
        };
      } else if (this.master_course_name != '') {
        object = {
          "master_course_name": this.master_course_name,
        };
      }
    } else {
      object = {
        "ecourse_ids": ecourse,
        'standard_id': "",
        'subject_id': "",
        'batch_id': ""
      }
      if (this.batch_id != "") {
        object = {
          "ecourse_ids": ecourse,
          "master_course_name": this.master_course_name,
          "course_id": this.course_id
        };
      } else if (this.master_course_name != "" && this.course_id != "" && this.batch_id != "") {
          object = {
          "ecourse_ids": [],
          'standard_id': "",
          'subject_id': "",
          'batch_id': this.batch_id
        }
      }
      else if (this.master_course_name != "" && this.course_id != "") {
        object = {
          "ecourse_ids": [],
          'standard_id': this.master_course_name,
          'subject_id': this.course_id,
          'batch_id': ""
        }
      }
      else if (this.master_course_name != "") {
        object = {
          "ecourse_ids": [],
          'standard_id': this.master_course_name,
          'subject_id': "",
          'batch_id': ""
        }
      }
    }
    console.log(object);
    this.auth.showLoader();
    const url = `user-product/student-details/${this.product_details_for_student.entity_id}`;
    this.http.postMethod(url, object).then(
      (resp: any) => {
        this.auth.hideLoader();
        if (resp) {
          let data = resp['body'];
          if (resp && data.validate) {
            this.studentDetails = data.result;
            this.toggleAllCheckBox('');
          } else {
            this.msgService.showErrorMessage('info', 'Something went wrong, try again ', '');
          }
        }
      },
      (err) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('info', 'Something went wrong, try again ', '');
      }
    );
  }

  // getAllActiveStudents() {
  //   // if (!this.activeStudents) {
  //   this.master_course_name = '';
  //   this.course_id = '';
  //   this.batch_id = '';
  //   this.getStudentDetails();
  //   // } else {
  //     // this.studentDetails = [];
  //   // }
  // }

  getMasterCourseData() {
    // this.auth.showLoader();
    let ecourse = Array.prototype.map.call(this.product_details_for_student.product_ecourse_maps, ecourse => ecourse.course_type_id);
    let object = {
      'ecourse_ids': ecourse,
      'instiute_id': sessionStorage.getItem('institute_id')
    };
    this._http.postData('/api/v1/institute/courseMapping/get-mastercourse-or-standard', object).subscribe(
      (resp: any) => {
        // this.auth.hideLoader();
        if (resp) {
          this.masterCourseDetails = resp;
        }
      },
      (err) => {
        // this.auth.hideLoader();
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });
  }

  getCourseDetails(event) {
    this.auth.showLoader();
    let ecourse = [];
    if (event == '') {
      ecourse = Array.prototype.map.call(this.product_details_for_student.product_ecourse_maps, ecourse => ecourse.course_type_id);
    }
    let object = {
      'ecourse_ids': ecourse,
      'instiute_id': sessionStorage.getItem('institute_id'),
      'master_course_name': event
    };
    this._http.postData('/api/v1/institute/courseMapping/get-courses', object).subscribe(
      (resp: any) => {
        this.auth.hideLoader();
        if (resp) {
          this.courseDetails = resp.course_list;
        }
      },
      (err) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });
  }

  getSubjectDetails(event) {
    this.auth.showLoader();
    this._http.getData('/api/v1/batches/fetchCombinedBatchData/' + this.jsonKeys.institute_id + '?standard_id=' + event + '&subject_id =-1' + '&assigned = N').subscribe(
      (resp: any) => {
        this.auth.hideLoader();
        if (resp) {
          this.courseDetails = resp;
        }
      },
      (err) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });
  }

  assignStudentToProduct() {
    const user_id_list = [];
    const user_id_list_deAssigned = [];
    this.studentDetails.forEach(stu => {
      if (stu.isSelected && !stu.is_product_already_purchased) {
        user_id_list.push(stu.user_id);
      }
      if (!stu.isSelected && stu.is_product_already_purchased) {
        user_id_list_deAssigned.push(stu.user_id);
      }
    });
    let is_send_sms = 'N';
    if (this.notifyToStudents) {
      is_send_sms = 'Y';
    }
    let object = {
      "product_id": this.product_details_for_student.entity_id,
      "user_id_list": user_id_list,
      "product_unassigned_user_ids": user_id_list_deAssigned,
      'is_send_sms': is_send_sms
    };
    console.log(object);
    this.auth.showLoader();
    this.http.postMethod('order/assign-product', object).then(
      (resp: any) => {
        this.auth.hideLoader();
        if (resp) {
          let data = resp['body'];
          if (resp && data.validate) {
            this.msgService.showErrorMessage('success', 'Students Assigned/Unassigned Successfully!', '');
            this.closePopup();
          } else {
            this.msgService.showErrorMessage('error', data.error[0].error_message, '');
          }
        }
      },
      (err) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('info', 'Something went wrong, try again ', '');
      }
    );
  }

  studentDataOnMasterCourse() {
    // this.activeStudents = false;
    this.getStudentDetails();
  }

  closePopup() {
    $("#assignStudent").modal('hide');
  }

  clearStudentFilter() {
    this.master_course_name = '';
    this.course_id = '';
    this.batch_id = '';
    this.getStudentDetails();
  }

  confirmAction(operation, id) {
    let item = this.productList.filter(item => item.entity_id == id)[0];
    let object = {
      "status": 10,
      "entity_id": item.entity_id
    }
    switch (operation) {
      case 'delete': {
        this.auth.showLoader();
        this.http.getMethod('product/delete/' + id, null).subscribe(
          (resp: any) => {
            this.auth.hideLoader();

            console.log(resp);
            if (resp && resp.validate) {
              let response = resp.result;
              this.msgService.showErrorMessage('success', 'Product deleted successfully!', '');
              $("#actionProductModal").modal('hide');
              this.productList.forEach((element, index) => {
                if (element.entity_id == response.entity_id) {
                  this.productList.splice(index, 1);
                  console.log(this.productList);
                }
              });
              this.varJson.total_items--;
            }
            else {
              this.msgService.showErrorMessage('info', 'Something went wrong, try again ', '');
            }
          },
          (err) => {
            this.auth.hideLoader();
            this.msgService.showErrorMessage('info', 'Something went wrong, try again ', '');
          });
        break;
      }
      case 'ready': {
        object.status = 20;
        this.tempFucntion(id, item, object, operation);
        break;
      }
      case 'publish': {
        object.status = 30;
        this.tempFucntion(id, item, object, operation);
        break;
      }
      case 'unpublish': {
        object.status = 40;
        this.tempFucntion(id, item, object, operation);
        break;
      }
      case 'close': {
        object.status = 50;
        this.tempFucntion(id, item, object, operation);
        break;
      }
    }

  }


  tempFucntion(id, item, body, operation) {
    this.auth.showLoader();
    this.http.postMethod('product/change-status', body).then(
      (resp: any) => {
        this.auth.hideLoader();
        if (resp) {
          let data = resp['body'];
          item.status = body.status;
          if (resp && data.validate) {
            item.publish_date = data.result.publish_date;
            this.msgService.showErrorMessage("success", 'product updated successfully', '');
            $('#actionProductModal').modal('hide');
          } else {
            this.msgService.showErrorMessage('info', 'Something went wrong, try again ', '');
          }
        }
      },
      (err) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('info', 'Something went wrong, try again ', '');
      }
    );

  }
  getPublishedDate(entity_id) {
    this.filter.by.title = entity_id;
    console.log(this.productList);
    this.productList.forEach(element => {
      if (element.entity_id == entity_id) {
        this.filter.by.title = element.title;
        // this.filter.by.publishDate = element.publishDate;
      }
    });
  }

  Clearfilter() {
    this.filter = {
      between: {
        from: null,
        to: null
      },
      by: {
        title: null,
        publishDate: null,
        isPaid: null,
        minPrice: null,
        maxPrice: null,
        status: null,
        productType: -1
      },
      // sort: {
      //   publishDate: false
      // }
    };
    this.fectchTableDataByPage(1);
  }

  filterData() {
    console.log("filterData");
    console.log(this.filter);
    let data: any;
    // this.filter.by.minPrice = Number(this.filter.by.minPrice);
    // this.filter.by.maxPrice = Number(this.filter.by.maxPrice);
    let between = {
      from: null,
      to: null
    }
    if (this.filter.between.from && this.filter.between.to) {
      between = {
        from: this.filter.between.from ? moment(this.filter.between.from).format('YYYY-MM-DD') : '',
        to: this.filter.between.to ? moment(this.filter.between.to).format('YYYY-MM-DD') : ''
      }
    }
    this.varJson.PageIndex = 1;

    data = {
      'page_no': this.varJson.PageIndex,
      'no_of_records': this.varJson.displayBatchSize,
      'between': between,
      'by': [
        // {
        //   'column': 'title',
        //   'value': this.filter.by.title
        // },
        {
          'column': 'publishDate',
          'value': this.filter.by.publishDate ? moment(this.filter.by.publishDate).format('YYYY-MM-DD') : null
        },

        {
          'column': 'isPaid',
          'value': JSON.parse(this.filter.by.isPaid)
        },
        // {
        //   'column': 'minPrice',
        //   'value': Number(this.filter.by.minPrice)
        // },
        // {
        //   'column': 'maxPrice',
        //   'value': this.filter.by.maxPrice ? Number(this.filter.by.maxPrice) : this.filter.by.maxPrice
        // },
        {
          'column': 'status',
          'value': this.filter.by.status ? Number(this.filter.by.status) : this.filter.by.status
        },
        // {
        // 	"column": "productType",
        //     "value": Number(this.filter.by.productType)
        // }

      ],
      'sort': {
        'column': 'publishDate',
        'assending': false
      }
    };
    this.auth.showLoader();
    this.http.postMethod('product/advance-filter', data).then(
      (resp: any) => {
        this.auth.hideLoader();
        let response = resp['body'];
        console.log(response);
        if (response.validate) {
          this.productList = response.result.results;
          this.varJson.total_items = response.result.total_records;
        }
      },
      (err) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('info', 'Something went wrong, try again ', '');
      }
    );
    // this.varJson.PageIndex=1;
    //   this.fectchTableDataByPage(this.varJson.PageIndex);
  }
  // Removed IF Conditon for de-selecting the  assigned student -Ashwini Kumar Gupta
  toggleAllCheckBox($event) {
    console.log('toggleAllCheckBox');
    this.studentDetails.forEach(element => {
      element.isSelected = this.jsonKeys.selectAll;
      if (element.is_product_already_purchased) {
        element.isSelected = true;
      }
    });
  }
  // End
  isAllSelected($event, item) {
    console.log($event, item);
  }

  isAllChecked(): boolean {
    return this.studentDetails.every(_ => _.isSelected);
  }

  toggleActionMenu(event) {
    console.log(event);
    // event.target.nextElementSibling.classList.toggle('d-flex');
  }

}
