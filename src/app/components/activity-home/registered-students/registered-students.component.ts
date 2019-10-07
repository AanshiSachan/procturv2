import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { UserService } from '../../../services/user-management/user.service';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ProductService } from '../../../services/products.service';

@Component({
  selector: 'app-registered-students',
  templateUrl: './registered-students.component.html',
  styleUrls: ['./registered-students.component.scss']
})
export class RegisteredStudentsComponent implements OnInit {

  usersList: any = [];
  userListDataSource: any = [];
  searchedData: any = [];
  userSelected: any = [];
  productList: any = [];
  ItemTypeData: any = [];
  displayKeys: any = [];
  searchText: any = '';
  filter: any = {
    product_id: '',
    slug: ''
  };
  isRippleLoad = false;
  searchDataFlag = false;
  enable_elearn_feature_flag = false;

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
    private user_service: UserService,
    private _tablePreferencesService: TablePreferencesService,
    private http: ProductService,
  ) {
  }

  ngOnInit() {
    // this.getData();
    this.checkIsEnableElearnFeature();
    this.tableSetting.keys = this.feeSettings1;
    this.setDefaultValues();
  }
  setDefaultValues() {
    this.tableSetting.keys = [
      { primaryKey: 'name', header: 'Name', priority: 1, allowSortingFlag: true },
      { primaryKey: 'username', header: 'Contact No', priority: 2, allowSortingFlag: true },
      { primaryKey: 'alternate_email_id', header: 'Email Id', priority: 3, allowSortingFlag: true, amountValue: true, },
      { primaryKey: 'created_date', header: 'Registered Date', priority: 4, allowSortingFlag: true, amountValue: true, }
    ];
    this.displayKeys = this.tableSetting.keys;
  }

  getData() {
    let Active = 'Y';
    let obj: any = {
      is_not_alr_users: 'N',
      user_Type: 99,
      app_downloaded: -1
    }
    this.isRippleLoad = true;
    this.user_service.getUserList(obj, Active).subscribe(
      (data: any) => {
        this.isRippleLoad = false;
        this.usersList = data;
        this.userListDataSource = this.usersList;
      },
      err => {
        this.isRippleLoad = false;
        this._msgService.showErrorMessage('error', 'Error', err.error.message);
      }
    );
  }

  checkIsEnableElearnFeature() {
    let data: any = sessionStorage.getItem('enable_eLearn_feature');
    console.log(data);
    if (data != 0) {
      this.enable_elearn_feature_flag = true;
      this.getProductList();
      this.getSlugData();
    }
    else {
      this.enable_elearn_feature_flag = false;
      this.getData();
    }
  }

  getProductList() {
    this.isRippleLoad = true;
    this.http.getMethod('product/get-product-list',null).subscribe(
      (data: any) => {
        this.productList = data.result;
        this.isRippleLoad = false;
      },
      err => {
        this.isRippleLoad = false;
        this._msgService.showErrorMessage('error', 'Error', err.error.message);
      }
    )
  }
  getSlugData() {
    let data: any = sessionStorage.getItem('userid');
    this.isRippleLoad = true;
    this.http.getMethod('master/item-type/get', null).subscribe(
      (data: any) => {
        this.isRippleLoad = false;
        this.ItemTypeData = data.result;
      },
      err => {
        this.isRippleLoad = false;
        this._msgService.showErrorMessage('error', 'Error', err.error.message);
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
    if (this.filter.product_id !== '' || this.filter.slug !== '') {
      this.isRippleLoad = true;
      this.http.postMethod('/user-product/get-user-details',data).then(
        (data: any) => {
          this.isRippleLoad = false;
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
          this.isRippleLoad = false;
          this._msgService.showErrorMessage('error', 'Error', err.error.message);
        }
      );
    }
    else {
      this._msgService.showErrorMessage('error', 'Error', 'Please select Product/ Item type');
    }
  }

  searchInList() {
    if (this.searchText != "" && this.searchText != null) {
      let searchData = this.usersList.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.usersList = searchData;
      console.log(this.usersList);
    } else {
      this.searchDataFlag = false;
      this.usersList = this.userListDataSource;
    }
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
