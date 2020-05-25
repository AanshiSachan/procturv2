import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ProductService } from '../../../services/products.service';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';

@Component({
  selector: 'app-registered-student',
  templateUrl: './product-registered-student.component.html',
  styleUrls: ['./product-registered-student.component.scss']
})
export class RegisteredStudentComponent implements OnInit {

  usersList: any = [];
  userListDataSource: any = [];
  searchedData: any = [];
  productList: any = [];
  ItemTypeData: any = [];
  displayKeys: any = [];
  searchText: any = '';
  filter: any = {
    product_id: '',
    slug: ''
  };
  searchDataFlag = false;

  tableSetting: any = {
    tableDetails: { title: 'Open App Users', key: 'registeredStudents', showTitle: false },
    search: { title: 'Search', showSearch: false },
    keys: this.displayKeys,
    selectAll: { showSelectAll: false, title: '', checked: true, key: 'student_disp_id' },
    actionSetting:
    {
      showActionButton: false,
      editOption: 'popup',//or button
      // options: this.menuOptions
    },
    displayMessage: 'No data found'
  };

  feeSettings1 = [
    { primaryKey: 'name', header: 'Name', priority: 1, allowSortingFlag: true },
    { primaryKey: 'username', header: 'Contact No', priority: 2, allowSortingFlag: true },
    { primaryKey: 'alternate_email_id', header: 'Email Id', priority: 3, allowSortingFlag: true },
    { primaryKey: 'created_date', header: 'Registered Date', priority: 4, allowSortingFlag: true}
  ];

  constructor(
    private _msgService: MessageShowService,
    private auth: AuthenticatorService,
    private _tablePreferencesService: TablePreferencesService,
    private http: ProductService,
  ) {
  }

  ngOnInit() {
    this.getProductList();
    this.getSlugData();
    this.tableSetting.keys = this.feeSettings1;
    this.setDefaultValues();
    this.filterData();
  }
  setDefaultValues() {
    this.tableSetting.keys = [
      { primaryKey: 'name', header: 'Name', priority: 1, allowSortingFlag: true },
      { primaryKey: 'username', header: 'Contact No', priority: 2, allowSortingFlag: true },
      { primaryKey: 'alternate_email_id', header: 'Email Id', priority: 3, allowSortingFlag: true, },
      { primaryKey: 'created_date', header: 'Registered Date', priority: 4, allowSortingFlag: true,}
    ];
    this.displayKeys = this.tableSetting.keys;
  }

  getProductList() {
    this.auth.showLoader();
    this.http.getMethod('product/get-product-list', null).subscribe(
      (data: any) => {
        this.productList = data.result;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    )
  }
  getSlugData() {
    this.auth.showLoader();
    this.http.getMethod('master/item-type/get', null).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.ItemTypeData = data.result;
      },
      err => {
        this.auth.hideLoader();
        this._msgService.showErrorMessage('error', '', err.error.message);
      }
    );
  }

  filterData() {
    let data: any;
    data = {
      'by': [
        {
          'column': 'productId',
          'value': this.filter.product_id
        },
        {
          'column': 'slug',
          'value': this.filter.slug
        }
      ]
    };
    // if (this.filter.product_id !== '' || this.filter.slug !== '') {
      this.auth.showLoader();
      this.http.postMethod('/user-product/get-user-details', data).then(
        (data: any) => {
          this.auth.hideLoader();
          console.log(data.body.result);
          if (data.body.result != null) {
            let temp: any = {};
            let temp2: any = [];
            data.body.result.forEach(element => {
              temp = {
                name: element.name,
                username: element.phone,
                alternate_email_id: element.email_id,
                created_date: element.registered_date
              };
              temp2.push(temp);
            },
            );
            this.usersList = temp2;
          }
        },
        err => {
          this.auth.hideLoader();
          this._msgService.showErrorMessage('error', '', err.error.message);
        }
      );
    // }
    // else {
    //   this._msgService.showErrorMessage('error', '', 'Please select Product/ Item type');
    // }
  }
}

  // searchInList() {
  //   if (this.searchText != "" && this.searchText != null) {
  //     let data1: any = {};
  //     let data2: any = [];
  //     this.userListDataSource.forEach(element => {
  //       data1 = {
  //         name : element.name,
  //         user_id: element.user_id,
  //         username : element.username
  //       }
  //       data2.push(data1);
  //     },
  //     );
  //     console.log(data2);
  //     let searchData = data2.filter(item =>
  //       Object.keys(item).some(
  //         k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
  //     );
  //     searchData.forEach(element => {
  //       if(element.user_id == this.userListDataSource.user_id){
  //         data1 = this.userListDataSource;
  //       }
  //       data2.push(data1);
  //     },
  //     );
  //     console.log(data2);
  //     this.searchedData = data2;
  //     this.totalRow = searchData.length;
  //     this.searchDataFlag = true;
  //     this.PageIndex = 1;
  //     this.fetchTableDataByPage(this.PageIndex);
  //   } else {
  //     this.searchDataFlag = false;
  //     this.fetchTableDataByPage(this.PageIndex);
  //     this.totalRow = this.userListDataSource.length;
  //   }
  // }
