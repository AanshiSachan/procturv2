import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { ProductService } from '../../../../services/products.service';

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
    this.getStaticPageData();
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
        primary_key: 'page_title',
        value: "Title",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'page_status',
        value: "Status",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'page_route',
        value: "Page URL",
        charactLimit: 60,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'in_navbar',
        value: "Show on website",
        charactLimit: 20,
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
        width: "20%",
        textAlign: "left"
      },
      {
        width: "20%",
        textAlign: "left"
      },
      {
        width: "20%",
        textAlign: "left"
      },
      {
        width: "20%",
        textAlign: "left"
      },

    ]
  }

  getStaticPageData() {
    this.auth.showLoader();
    this.httpService.getMethod('/api/v2/website/page/institute/' + sessionStorage.getItem('institute_id'), null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.staticPageDataSouece = res.result;
        this.totalRecords = this.staticPageDataSouece.length;
        this.staticPageData = this.getDataFromDataSource(0);
        if(this.staticPageDataSouece && this.staticPageDataSouece.length) {
          this.staticPageDataSouece.forEach(element => {
            if(element.page_status !=null && element.page_status != '') {
              element.page_status = element.page_status.charAt(0).toUpperCase() + element.page_status.substr(1).toLowerCase();
              element.in_navbar = (element.in_navbar) ? 'Yes' : 'No';
            }
          });
        }
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
    this.router.navigate(['view/website-configuration/static-pages/edit/' + object.data.id])
  }

  deleteRow(obj) {
    this.auth.showLoader();
    this.httpService.deleteFile('/prod/api/v2/website/page/' + obj.data.id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success','','Page Deleted Successfully');
        this.getStaticPageData();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

}
