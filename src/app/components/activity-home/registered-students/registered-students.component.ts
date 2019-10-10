import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { UserService } from '../../../services/user-management/user.service';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';
import { MessageShowService } from '../../../services/message-show.service';

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

  tableSetting: any = {
    tableDetails: { title: 'Open App Users', key: 'registeredStudents', showTitle: false },
    search: { title: 'Search', showSearch: false },
    keys: this.displayKeys,
    selectAll: { showSelectAll: false, option:'single',title: '', checked: true, key: 'student_disp_id' },
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
  ) {
  }

  ngOnInit() {
    this.getData();
    this.tableSetting.keys = this.feeSettings1;
    this.setDefaultValues();
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
        // this.usersList = data;
        this.userListDataSource = data;
        this.userListDataSource.forEach(element => {
          if (element.alternate_email_id == "null"){
            element.alternate_email_id = "-";
          }
        });
      },
      err => {
        this.isRippleLoad = false;
        this._msgService.showErrorMessage('error', 'Error', err.error.message);
      }
    );
  }

  searchInList() {
    if (this.searchText != "" && this.searchText != null) {
      // this.getData();
      let searchData = this.userListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.usersList = searchData;
    } else {
      // this.searchDataFlag = false;
      // this.getData();
      console.log(this.userListDataSource);
      this.usersList = this.userListDataSource;
    }
  }
}

