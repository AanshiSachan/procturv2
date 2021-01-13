import { Component, OnInit } from '@angular/core';
import {ProductService} from './../../../../services/products.service';
import {AuthenticatorService} from './../../../../services/authenticator.service';
import {Router} from '@angular/router';
import { MessageShowService } from '../../../../services/message-show.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [];
  staticPageDataSouece: any = [];

  constructor(
    private httpService: ProductService,
    private auth: AuthenticatorService,
    private router: Router,
    private msgService: MessageShowService
  ) { }

  ngOnInit(): void {
    this.setTableData();
    this.getTestinomialData();
  }

  setTableData() {
    this.headerSetting = [
      {
        primary_key: 'id',
        value: "Id",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'name',
        value: "Name",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'content',
        value: "Content",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'order_number',
        value: "Order number",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'rating',
        value: "Rating",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'action',
        value: "Action",
        charactLimit: 10,
        sorting: false,
        visibility: true,
        edit: true,
        delete: true,
        // editCondition: 'converted == 0',
        // deleteCondition: 'converted == 0'
      },
    ]

    this.tableSetting = {
      width: "100%",
      height: "58vh"
    }

    this.rowColumns = [
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "25%",
        textAlign: "left"
      },
      {
        width: "25%",
        textAlign: "left"
      },
      {
        width: "15%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "15%",
        textAlign: "left"
      }

    ]
  }

  getTestinomialData() {
    this.auth.showLoader();
    this.httpService.getMethod('api/v2/website/testimonial/institute/' + sessionStorage.getItem('institute_id'), null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.staticPageDataSouece = res.result;
        console.log(this.staticPageDataSouece);
        this.totalRecords = this.staticPageDataSouece.length;
        // if (this.staticPageDataSouece.length) {
        this.staticPageData = this.getDataFromDataSource(0);
        // }
        //this.fetchTableDataByPage(this.pageIndex);
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  // pagination functions 

  fetchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.staticPageData = this.getDataFromDataSource(startindex);
  }

  fetchNext() {
    this.pageIndex++;
    this.fetchTableDataByPage(this.pageIndex);
  }

  fetchPrevious() {
    if (this.pageIndex != 1) {
      this.pageIndex--;
      this.fetchTableDataByPage(this.pageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let t = this.staticPageDataSouece.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }
  updateTableBatchSize(event) {
    this.pageIndex = 1;
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.pageIndex);
  }

  editRow(object) {
    console.log(object);
    sessionStorage.setItem('testnomialObj', JSON.stringify(object.data));
    this.router.navigate(['view/website-configuration/testimonial/edit/' + object.data.id])
  }

  deleteRow(obj) {
    this.auth.showLoader();
    this.httpService.deleteFile('/prod/api/v2/website/testimonial/' + obj.data.id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success','','Testimoninal Deleted Successfully');
        this.getTestinomialData();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

}
