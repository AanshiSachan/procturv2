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
    ecourse_id: '-1',
    standard_id: '-1',
    subject_id: '-1'
  };

  /* Variable to handle popups */
  varJson: any = {
    PageIndex: 1,
    sizeArr: [5,25, 50, 100, 150, 200, 500],
    displayBatchSize: 25,
    total_items:0
  };
  productList: any = [];
  isRippleLoad: boolean = false;
  ecourseList: any = [];
  subjectsList: any = [];
  deleteItem: any = {
    title: '',
    entity_id: 0,
    operation: '',
    btnClass: 'btn-disable',
    btnText: 'Loading...'
  };

  jsonKeys = {
    selectAll: false,
    institute_id: ''
  }

  constructor(
    private http: ProductService,
    private msgService: MessageShowService,
    private _http: HttpService
  ) { }

  ngOnInit() {
    this.jsonKeys.institute_id = sessionStorage.getItem('institute_id');
    this.initFilters();
    this.fectchTableDataByPage(1)
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

    /* Fetch table data by page index */
    fectchTableDataByPage(index) {
      this.varJson.PageIndex = index;
     let object=  {
        "page_no":  this.varJson.PageIndex ,
        "no_of_records": this.varJson.displayBatchSize
      }            
   
      this.isRippleLoad = true;
      this.http.postMethod('product/get', object).then(
        (resp: any) => {
          let response = resp['body'];
          this.isRippleLoad = false;
          console.log(response);
          if (response.validate) {
            this.productList = response.result.results;
            this.varJson.total_items = response.result.total_records;
           
          }
          else {
            this.isRippleLoad = false;
            this.msgService.showErrorMessage('error', "something went wrong, try again", '');
          }
        },
        (err) => {
          this.isRippleLoad = false;
          this.msgService.showErrorMessage('error', "something went wrong, try again", '');
        });
    
  }


  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
      this.varJson.PageIndex = 1;
      this.varJson.displayBatchSize = parseInt(num);
      this.fectchTableDataByPage(this.varJson.PageIndex);
  }

  initFilters() {
    this.http.getMethod('ext/get-ecources', null).subscribe(
      (resp: any) => {
        if (resp) {
          let response = JSON.parse(resp.result);
          console.log(resp);
          if (resp.validate) {
            this.ecourseList = response;
          }
          else {
            this.msgService.showErrorMessage('error', response.errors.message, '');
          }
        }
      },
      (err) => {
        // this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });
  }

  getSubjectList() {
    //  Fetch Subjects List
    //<base_url>/ecourse/{institute_id}/{ecourse_id}/subjects
    this.isRippleLoad = false;
    this.filter.subject_id = '-1';
    this.subjectsList = [];
    this._http.getData('/api/v1/ecourse/' + this.jsonKeys.institute_id + '/' + this.filter.ecourse_id + '/subjects').subscribe(
      (resp: any) => {
        this.isRippleLoad = false;
        if (resp && resp.length) {
          this.subjectsList = resp;
        }
      },
      (err) => {
        this.isRippleLoad = false;
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
        this.deleteItem.btnClass = 'btn-danger';
        this.deleteItem.btnText = 'Delete';
        break;
      }
      case 'readytopublish':{
        this.deleteItem.btnClass = 'btn-primary';
        this.deleteItem.btnText = 'Ready To Publish';
        break;
      }
      case 'ready': {
        this.deleteItem.btnClass = 'btn-primary';
        this.deleteItem.btnText = 'Ready';
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
      case 'close': {
        this.deleteItem.btnClass = 'btn-primary';
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

  confirmAction(operation, id) {
    let item = this.productList.filter(item => item.entity_id == id)[0];
    let object = {
      "status": 10,
      "entity_id": item.entity_id
    }
    switch (operation) {
      case 'delete': {
        if (!this.isRippleLoad) {
          this.isRippleLoad = true;
          this.http.getMethod('product/delete/' + id, null).subscribe(
            (resp: any) => {
              this.isRippleLoad = false;

              console.log(resp);
              if (resp && resp.validate) {
                let response = resp.result;
                this.msgService.showErrorMessage('success', 'Product removed successfully', '');
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
              this.isRippleLoad = false;
              this.msgService.showErrorMessage('info', 'Something went wrong, try again ', '');
            });
        }
        break;
      }
    
      case 'ready': {

        object.status = 20;
        item.status = 20;
        this.tempFucntion(id,item, object, operation);
        break;
      }
      case  'publish':{
        object.status = 30;
        item.status = 30;
        this.tempFucntion(id,item, object, operation);
      }
      case 'unpublish': {
        object.status = 40;
        item.status = 40;
        this.tempFucntion(id,item, object, operation);
        break;
      }
      case 'close': {
        object.status = 50;
        item.status = 50;
        
        this.tempFucntion(id,item, object, operation);
        break;
      }
    }

  }


  tempFucntion(id, item,body, operation) {
    if (!this.isRippleLoad) {
      this.isRippleLoad = true;
      this.http.postMethod('product/change-status', body).then(
        (resp) => {
          this.isRippleLoad = false;
          if (resp) {
            let data = resp['body'];
            if (resp && data.validate) {
              item.publish_date = data.result.publish_date;
              this.msgService.showErrorMessage("success", "product updated successfully", '');
              $("#actionProductModal").modal('hide');
              // item.product_status = body.product_status;
            }
            else {
              this.msgService.showErrorMessage('info', 'Something went wrong, try again ', '');
            }
          }
        },
        (err) => {
          this.isRippleLoad = false;
          this.msgService.showErrorMessage('info', 'Something went wrong, try again ', '');
        }
      );
    }

  }

  filterData() {
    console.log("filterData");
    this.varJson.PageIndex=1;
      this.fectchTableDataByPage(this.varJson.PageIndex);
  }

  toggleAllCheckBox($event) {
    console.log('toggleAllCheckBox');
    this.productList.forEach(element => {
      element.isSelected = this.jsonKeys.selectAll;
    });
  }

  isAllSelected($event, item) {
    console.log($event, item);
  }

  toggleActionMenu(event) {
    console.log(event);
    //event.target.nextElementSibling.classList.toggle('d-flex');
  }

}