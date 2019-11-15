import { Component, OnInit } from '@angular/core';
import { ColumnSetting } from '../../../shared/custom-table/layout.model';
import { ClassRoomService } from '../../../../services/class-roomService/class-roomlist.service';
import { LoginService } from '../../../../services/login-services/login.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { error } from 'selenium-webdriver';


@Component({
  selector: 'app-class-room',
  templateUrl: './class-room.component.html',
  styleUrls: ['./class-room.component.scss']
})
export class ClassRoomComponent {

  pagedclassRoomData: any[] = [];
  addClasslistData: any[] = [];
  saveclassListData: any = [];
  updateclassListData: any[] = [];
  classRoomData: any = [];
  searchData: any = [];
  tempObj: any;

  enterclassdataDesc: string = "";
  enterclassdata: string = "";
  searchText: string = "";
  tempIndex: string = "";
  pageIndex: number = 1;
  displayBatchSize: number = 10;
  totalRow: number = 0;
  updateFlag: boolean = false;
  CreateNewList: boolean = false;
  searchflag: boolean = false;
  editFlag: boolean = false;
  isProfessional: boolean;
  type:string='';

  constructor
    (
    private ClassList: ClassRoomService,
    private login: LoginService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService
    ) {
    this.removeFullscreen();
    this.removeSelectionFromSideNav();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
          this.type ='batch';
        }
        else {
          this.isProfessional = false;
          this.type ='course';
        }
      })
    this.getClassList();
  }


  /*=========================fetching class list========================================
  ====================================================================================== */

  getClassList() {
    this.ClassList.fetchClassList().subscribe(
      (res: any) => {
        this.classRoomData = res;
        this.totalRow = res.length;
        this.fetchTableDataByPage(this.pageIndex);
      }),
      err => {
      }
  }

  /*=====================================================================================
  ======================================================================================*/
  editRowTable(row, index) {
    if (this.editFlag) {
      this.pagedclassRoomData[this.tempIndex] = this.tempObj;
      console.log(this.pagedclassRoomData[this.tempIndex]);
      document.getElementById(("row" + this.tempIndex).toString()).classList.remove('editComp');
      document.getElementById(("row" + this.tempIndex).toString()).classList.add('displayComp');
    } else {
      this.editFlag = true;
    }
    this.tempIndex = index;
    console.log(this.tempIndex);
    this.tempObj = Object.assign({}, row);
    console.log(this.tempObj);
    document.getElementById(("row" + index).toString()).classList.remove('displayComp');
    document.getElementById(("row" + index).toString()).classList.add('editComp');
  }
  /*===================================(+)(-)====================================
  =============================================================================== */
  toggleCreateNewList() {
    if (this.CreateNewList == false) {
      this.CreateNewList = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.CreateNewList = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }
  /*====================================adding new class room=======================
  ================================================================================= */

  addNewclassRoom(Room_ele, Desc_ele) {
    if (Room_ele != "" && Desc_ele != "" && Room_ele != null && Desc_ele != null) {
      let classRoomobj = {
        class_room_desc: Desc_ele,
        class_room_name: Room_ele
      }
      for (var i = 0; i < this.classRoomData.length; i++) {
        if (this.classRoomData[i].class_room_name == classRoomobj.class_room_name) {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, "Error", 'Duplicate Entries are not Allowed');
          return;
        }

      }

      if (Desc_ele.length > 500) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, "Error", 'Description should not be greater than 500 Characters');
        return;
      }
      this.ClassList.saveClassroomDetail(classRoomobj).subscribe(
        data => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, "Added", 'ClassRoom Added Successfully');
          this.getClassList();
          this.enterclassdata = "";
          this.enterclassdataDesc = "";
          this.toggleCreateNewList();

        },
        error => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, "Error", error.error.message);

        }
      )
    }

    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, "Error", 'Please fill Mandatory Fields');
      this.enterclassdata = "";
      this.enterclassdataDesc = "";
      return;
    }
  }

  /*===================================saving classroom info========================
  ================================================================================= */
  saveclassRoomInfo(row, index) {
    let data = {
      class_room_name: row.class_room_name,
      class_room_desc: row.class_room_desc,
      class_room_id: row.class_room_id,

    }

    for (var j = 0; j < this.classRoomData.length; j++) {
      if (j == index) {
        continue;
      }
      else if (this.classRoomData[j].class_room_name === row.class_room_name) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, "Error", 'Duplicate Entries are not Allowed');
        return;
      }
    }

    if (data.class_room_name != "" && data.class_room_name != null && data.class_room_desc != "" && data.class_room_desc != null) {
      if (data.class_room_desc.length > 500) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, "Error", 'Description should not be greater than 500');
        return;
      }
      this.ClassList.updateclassListData(data).subscribe(
        res => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, "Updated", 'ClassRoom Updated Successfully');
          this.editFlag = false;
          this.tempIndex = "";
          this.tempObj = null;
          this.getClassList();
        },
        err => {

        }
      );
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, "Error", 'Please fill classRoom name and Description');
    }
  }
  /*===================================Search============================================ */
  searchDatabase() {

    if (this.searchText != "" && this.searchText != null) {
      this.pageIndex = 1;
      let searchRes: any;

      searchRes = this.classRoomData.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.searchData = searchRes;
      this.totalRow = searchRes.length;
      this.searchflag = true;
      this.fetchTableDataByPage(this.pageIndex);
    }
    else {
      this.searchflag = false;
      this.fetchTableDataByPage(this.pageIndex);
      this.totalRow = this.classRoomData.length;

    }
  }

  /*====================update for vaid field==================================================== */

  // updateValidDataField() {
  //   if (this.updateFlag == false) {

  //   }
  // }

  /*==================pagination================================================================*/
  fetchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.pagedclassRoomData = this.getClassRoomTableFromSource(startindex);
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

  getClassRoomTableFromSource(startindex) {
    if (this.searchflag) {
      let t = this.searchData.slice(startindex, startindex + this.displayBatchSize);
      return t;
    } else {
      let t = this.classRoomData.slice(startindex, startindex + this.displayBatchSize);
      return t;
    }
  }
  /*==================================================================================
  ====================================================================================== */
  removeFullscreen() {
    var header = document.getElementsByTagName('core-header');
    var sidebar = document.getElementsByTagName('core-sidednav');

    [].forEach.call(header, function (el) {
      el.classList.remove('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.remove('hide');
    });
  }

  removeSelectionFromSideNav() {
    // let classArray = ['lione', 'litwo', 'lithree', 'lifour', 'lifive', 'lisix', 'liseven', 'lieight', 'linine', 'lizero'];
    // classArray.forEach(function (className) {
    //   console.log(className);
    //   document.getElementById(className).classList.remove('active');
    // });
    /* document.getElementById('liten').classList.remove('active');
    document.getElementById('lieleven').classList.remove('active'); */
  }

}
