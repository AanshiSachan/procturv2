import { Component, OnInit } from '@angular/core';
import { ColumnSetting } from '../shared/custom-table/layout.model';
import { ClassRoomService } from '../../services/class-roomService/class-roomlist.service';
import { LoginService } from '../../services/login-services/login.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-class-room',
  templateUrl: './class-room.component.html',
  styleUrls: ['./class-room.component.scss']
})
export class ClassRoomComponent {

  classRoomData: any = [];
  totalRow = 0;
  pagedclassRoomData: any[] = [];
  addClasslistData: any[] = [];
  saveclassListData: any = [];
  updateclassListData: any[] = [];
  pageIndex: number = 1;
  CreateNewList: boolean = false;
  displayBatchSize: number = 10;


  constructor
    (
    private ClassList: ClassRoomService,
    private login: LoginService,
    private AppC: AppComponent
    ) {
    this.removeFullscreen();
    this.removeSelectionFromSideNav();
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

  ngOnInit() {
    this.getClassList();
  }

  /*=========================fetching class list========================================
  ====================================================================================== */

  getClassList() {
    this.ClassList.fetchClassList().subscribe(
      res => {
        this.classRoomData = res;
        this.totalRow = res.length;
        this.fetchTableDataByPage(this.pageIndex);
      }),
      err => {
        console.log(err);
      }
  }

  /*=====================================================================================
  ======================================================================================*/
  editRowTable(row, index) {
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
    if (Room_ele && Desc_ele != "" && Room_ele && Desc_ele != null) {
      let classRoomobj = {
        class_room_desc: Desc_ele,
        class_room_name: Room_ele
      }
      this.ClassList.saveClassroomDetail(classRoomobj).subscribe(
        data => {
          let msg = {
            type: 'success',
            title: "Added",
            body: "ClassRoom Added Successfully."
          }
          this.AppC.popToast(msg);
          this.getClassList();
          this.toggleCreateNewList();
        },
        error => {
          console.log(error);
          let msg = {
            type: "error",
            title: "Error",
            body: error.error.message
          }
          this.AppC.popToast(msg);
        }
      )
    }
    else {
      let data = {
        type: 'error',
        title: "Error",
        body: "Please fill ClassRoom Name."
      }
      this.AppC.popToast(data);
      return;
    }
  }

  /*===================================saving classroom info========================
  ================================================================================= */
  saveclassRoomInfo(row, index) {
    let data = {
      "class_room_name": row.class_room_name,
      "class_room_desc": row.class_room_desc,
      "class_room_id": row.class_room_id,

    }
    this.ClassList.updateclassListData(data).subscribe(
      res => {
        this.getClassList();
      }),
      error => {
        let msg = {
          type: "error",
          title: "",
          body: "An Error Occured"
        }
        this.AppC.popToast(msg);
      }

  }

  /*==================pagination================================================ */
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
    let t = this.classRoomData.slice(startindex, startindex + this.displayBatchSize);
    return t;
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
    document.getElementById('lione').classList.remove('active');
    document.getElementById('litwo').classList.remove('active');
    document.getElementById('lithree').classList.remove('active');
    document.getElementById('lifour').classList.remove('active');
    document.getElementById('lifive').classList.remove('active');
    document.getElementById('lisix').classList.remove('active');
    document.getElementById('liseven').classList.remove('active');
    document.getElementById('lieight').classList.remove('active');
    document.getElementById('linine').classList.remove('active');
    document.getElementById('lizero').classList.remove('active');
    /* document.getElementById('liten').classList.remove('active');
    document.getElementById('lieleven').classList.remove('active'); */
  }

}



