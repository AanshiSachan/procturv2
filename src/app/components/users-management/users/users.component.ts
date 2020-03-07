import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { UserService } from '../../../services/user-management/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  usersList: any = [];
  userListDataSource: any = [];
  isLangInstitute: boolean = false;
  dataFilter: any = {
    role: 0,
    is_active: true,
    is_show_credentials: false
  };
  allocateItemPopUp: boolean = false;
  tempdata: any = "";
  inventoryList: any = [];
  inventoryAllocated: any = [];
  allocateInventory: any = {
    item_id: -1,
    alloted_units: 1
  };
  showUnit: boolean = false;
  availableunit: number = 0;
  showUserTable: boolean = false;
  PageIndex: number = 1;
  displayBatchSize: number = 10;
  searchDataFlag: boolean = false;
  searchedData: any = [];
  totalRow: number = 0;
  userSelected: any = [];
  searchText: any = "";
  toottip: string = "We can customize our users via providing or assigning different roles according to their activities.User can login with their credentials and can operate only their defined roles."
  isActiveUsers: boolean = true;

  constructor(
    private apiService: UserService,
    private toastCtrl: AppComponent,
    private auth: AuthenticatorService,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkWhichTabIsOpen();
    this.checkInstituteType();
    this.getAllUserList();
    if (sessionStorage.getItem('permitted_roles')) {
      let permissions = Object.keys(JSON.parse(sessionStorage.getItem('permitted_roles')));
      if (permissions.includes('720')) {
        this.dataFilter.is_show_credentials = true;
      }
    }
  }

  checkWhichTabIsOpen() {
    let url = this.router.url;
    if (url.includes('user')) {
      this.switchActiveView('liUser');
    } else {
      this.switchActiveView('liRole');
    }
  }

  switchActiveView(id) {
    document.getElementById('liUser').classList.remove('active');
    document.getElementById('liRole').classList.remove('active');
    document.getElementById(id).classList.add('active');
  }

  getAllUserList() {
    if (this.dataFilter.role == "-1") {
      this.messageNotifier('error', '', 'Please Select User Type');
      return;
    }
    this.PageIndex = 1;
    let Active: any = "";
    if (this.dataFilter.is_active) {
      Active = "Y";
      this.isActiveUsers = true;
    } else {
      Active = "N";
      this.isActiveUsers = false;
    }
    let obj: any = {
      is_not_alr_users: 'N',
      user_Type: this.dataFilter.role,
      app_downloaded: -1
    }
    this.searchText = "";
    this.searchDataFlag = false;
    this.auth.showLoader();
    this.apiService.getUserList(obj, Active).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.totalRow = res.length;
        this.showUserTable = true;
        this.userListDataSource = this.addKeys(res, false);
        this.fetchTableDataByPage(this.PageIndex);
      },
      err => {
        this.auth.hideLoader();
        this.showUserTable = false;
        console.log(err);
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  clearData(){
    this.usersList=[];
    this.totalRow=0;
    this.PageIndex=1;
    this.userListDataSource =[];
  }

  sendSmsForApp(type) {
    if (confirm('Are you sure you want to send SMS to selected users?')) {
      let data = {
        app_sms_type: type,
        userArray: this.getSelectedUser()
      };
      if (data.userArray.length == 0) {
        this.messageNotifier('error', '', 'Please select user');
        return;
      }
      this.apiService.sendSmS(data).subscribe(
        res => {
          this.messageNotifier('success', 'Sent successfully', 'SMS Sent Successfully');
        },
        err => {
          console.log(err);
          this.messageNotifier('error', '', err.error.message);
        }
      )
    }
  }

  allocateItemToUser(data) {
    this.tempdata = data;
    this.getInventoryItemList(data);
    this.getAllocatedItemHistrory(data);
    this.allocateItemPopUp = true;
  }

  closePopUp() {
    this.tempdata = "";
    this.allocateItemPopUp = false;
    this.showUnit = false;
    this.allocateInventory = {
      item_id: -1,
      alloted_units: 1
    };
  }

  getInventoryItemList(data) {
    this.auth.showLoader();
    this.apiService.getItemList(data.user_id).subscribe(
      res => {
        this.auth.hideLoader();
        this.inventoryList = res;
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  getAllocatedItemHistrory(data) {
    this.auth.showLoader();
    this.apiService.getAllotedHistroy(data.user_id).subscribe(
      res => {
        this.auth.hideLoader();
        this.inventoryAllocated = res;
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  allocateItem() {
    if (this.allocateInventory.item_id == -1) {
      this.messageNotifier('error', '', 'Please prvide item details');
      return;
    }
    let unit: number = Number(this.allocateInventory.alloted_units);
    if (unit < 0) {
      this.messageNotifier('error', '', 'Please give valid unit');
      return;
    }
    if (this.availableunit < unit) {
      this.messageNotifier('error', '', 'Allocatd unit can not be greater than available unit');
      return;
    }
    let obj: any = {
      alloted_units: this.allocateInventory.alloted_units,
      item_id: this.allocateInventory.item_id,
      user_id: this.tempdata.user_id
    }
    this.auth.showLoader();
    this.apiService.allocateItem(obj).subscribe(
      res => {
        this.auth.hideLoader();
        this.messageNotifier('success', 'Allocated', 'Inventory Allocate Successfully');
        this.getAllocatedItemHistrory(this.tempdata);
        this.allocateInventory = {
          item_id: -1,
          alloted_units: 1
        };
        this.showUnit = false;
      },
      err => {
        this.auth.hideLoader();
        console.log(err);
      }
    )
  }

  onitemSelction() {
    if (this.allocateInventory.item_id != '-1') {
      this.showUnit = true;
      for (let i = 0; i < this.inventoryList.length; i++) {
        if (this.inventoryList[i].item_id == this.allocateInventory.item_id) {
          this.availableunit = Number(this.inventoryList[i].available_units);
        }
      }
    } else {
      this.showUnit = false;
      this.availableunit = 0;
    }
  }

  deleteInventoryItem(data) {
    if (confirm('Are you sure you want to delete?')) {
      this.auth.showLoader();
      this.apiService.deleteInventory(data.allocation_id).subscribe(
        res => {
          this.auth.hideLoader();
          this.messageNotifier('success', 'Deleted', 'Item Deleted Successfully');
          this.getAllocatedItemHistrory(this.tempdata);
        },
        err => {
          this.auth.hideLoader();
          console.log(err);
          this.messageNotifier('error', '', err.error.message);
        }
      )
    }
  }

  descriptPassword(object){
    object.isEncript= (!object.isEncript);    
  }

  // pagination functions 
  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.usersList = this.getDataFromDataSource(startindex);
    this.usersList.forEach(element => {
      element.isEncript= true;
    });
  }

  fetchNext() {
    this.PageIndex++;
    this.fetchTableDataByPage(this.PageIndex);
  }

  fetchPrevious() {
    if (this.PageIndex != 1) {
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let data = [];
    if (this.searchDataFlag == true) {
      data = this.searchedData.slice(startindex, startindex + this.displayBatchSize);
    } else {
      data = this.userListDataSource.slice(startindex, startindex + this.displayBatchSize);
    }
    return data;
  }


  searchInList() {
    if (this.searchText != "" && this.searchText != null) {
      let searchData = this.userListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.searchedData = searchData;
      this.totalRow = searchData.length;
      this.searchDataFlag = true;
      this.PageIndex = 1;
      this.fetchTableDataByPage(this.PageIndex);
    } else {
      this.searchDataFlag = false;
      this.fetchTableDataByPage(this.PageIndex);
      this.totalRow = this.userListDataSource.length;
    }
  }

  getSelectedUser() {
    let arr: any = [];
    for (let i = 0; i < this.userSelected.length; i++) {
      if (this.userSelected[i].assigned == true) {
        arr.push(this.userSelected[i].user_id);
      }
    }
    return arr;
  }

  userSelectedEvent(event, data) {
    if (event.target.checked) {
      this.userSelected.push(data);
    } else {
      for (let i = 0; i < this.userSelected.length; i++) {
        if (this.userSelected[i].user_id == data.user_id) {
          this.userSelected.splice(i, 1);
        }
      }
    }
  }


  addKeys(data, val) {
    data.forEach(
      element => {
        element.assigned = val;
      }
    )
    return data;
  }

  checkInstituteType() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitute = true;
        } else {
          this.isLangInstitute = false;
        }
      }
    )
  }

  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.toastCtrl.popToast(data);
  }
}
