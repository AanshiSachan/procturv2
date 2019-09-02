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
  isRippleLoad:boolean = false;
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
    institute_id:''
  }

  constructor(
    private http: ProductService,
    private msgService: MessageShowService,
    private _http :HttpService
  ) { }

  ngOnInit() {
    this.jsonKeys.institute_id = sessionStorage.getItem('institute_id');
    this.initFilters();
    this.getProductList();
  }

  initFilters() {
 let param ={
      "proc-authorization":"MTk4MzJ8MDphZG1pbjoxMDAxMjg="
    }
    this.isRippleLoad = true;
    this.http.getMethod('ext/get-ecources', param).subscribe(
      (resp:any) => {
        this.isRippleLoad = false;
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
        this.isRippleLoad = false;
        // this.msgService.showErrorMessage('error', err['error'].errors.message, '');
      });
  }

  getSubjectList() {
    // if (this.filter.standard_id > 0) {
    //   //Fetch Subjects List
    //<base_url>/ecourse/{institute_id}/{ecourse_id}/subjects
    this.isRippleLoad = false;
      this._http.getData('/api/v1/ecourse/' + this.jsonKeys.institute_id + '/'+this.filter.ecourse_id+'/subjects').subscribe(
        (resp:any) => {
          this.isRippleLoad = false;
          if (resp.length) {
            this.subjectsList = resp;
          }
        },
        (err) => {
          this.isRippleLoad = false;
          this.msgService.showErrorMessage('error', err['error'].errors.message, '');
        });
    // }

  }

  getProductList() {
    this.isRippleLoad = true;
    this.http.getMethod('product/get', null).subscribe(
      (resp:any) => {
        this.isRippleLoad = false;
        let response = resp.result;
        console.log(resp);
        if (resp.validate) {
          this.productList = response;
          this.total_items = response.length;
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

  loadMoreItems() {
    this.isRippleLoad = true;
    if (this.productList.length < this.total_items) {
      this.http.getData('products?offset=' + this.productList.length, 'web').subscribe(
        (resp) => {
          let response = resp['body'];
          this.isRippleLoad = false;
          if (response.validate) {
            this.productList = [...this.productList, ...response.data.products];            
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
    let item = this.productList.filter(item => item.entity_id == id)[0];

    switch (operation) {
      case 'delete': {
        this.isRippleLoad = true;
        this.http.getMethod('product/delete/'+id, null).subscribe(
          (resp:any) => {
            this.isRippleLoad = false;
            let response = resp.result;
            console.log(resp);
            if (resp.validate) {
              this.msgService.showErrorMessage('success', 'Product removed successfully', '');
              $("#actionProductModal").modal('hide');
              this.productList.forEach((element,index) => {
                if(element.entity_id==response.entity_id){
                  this.productList.splice(index,1);
                  console.log(this.productList);
                }
              });              
              this.total_items = response.length;
            }
            else {
              this.msgService.showErrorMessage('success', 'Something went wrong, try again ', '');
            }
          },
          (err) => {
            this.isRippleLoad = false;
            this.msgService.showErrorMessage('success', 'Something went wrong, try again ', '');
          });
        break;
      }
      case 'publish': {
        item.status = 20;
        this.tempFucntion(id , item,operation);
        break;
      }
      case 'unpublish': {
        item.status = 30;
        this.tempFucntion(id , item,operation);
        break;
      }
    }

  }


  tempFucntion(id , body,operation){
    this.http.postMethod('product/update', body).then(
      (resp) => {
        let data = resp['body'];
        if (data.validate) {
          this.msgService.showErrorMessage("success","product updated successfully", '');
          $("#actionProductModal").modal('hide');
            // item.product_status = body.product_status;
        }
        else {
          this.msgService.showErrorMessage('success', 'Something went wrong, try again ', '');
        }
      },
      (err) => {
        this.msgService.showErrorMessage('success', 'Something went wrong, try again ', '');
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