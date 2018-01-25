import { Component, OnInit } from '@angular/core';
import { SlotApiService } from '../../services/slot-service/slot.service';
import { AppComponent } from '../../app.component';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss']
})
export class SlotComponent implements OnInit {

  slotsDataSource;
  PageIndex: number = 1;
  studentdisplaysize: number = 10;
  totalRow: number;
  slotTableList;
  createNewSlot: boolean = false;

  constructor(
    private apiService: SlotApiService,
    private appC: AppComponent
  ) {
    this.removeFullscreen();
  }

  ngOnInit() {
    this.getAllSlotsFromServer();
  }

  getAllSlotsFromServer() {
    this.apiService.getAllSlots().subscribe(
      (data: any) => {
        console.log(data);
        this.slotsDataSource = data;
        this.totalRow = data.length;
        this.fetchTableDataByPage(this.PageIndex);
      },
      error => {
        console.log(error);
      }
    )
  }

  addNewSlot(element) {
    if (element.value != "" && element.value != null) {
      this.apiService.addNewSlotToList({ "slot_name": element.value.trim() }).subscribe(
        data => {
          let msg = {
            type: 'sucess',
            title: "",
            body: "Slot added successfully."
          }
          this.appC.popToast(msg);
          console.log(data);
          element.value = "";
          this.getAllSlotsFromServer();
        },
        error => {
          console.log(error);
        }
      )
    } else {
      let data = {
        type: 'error',
        title: "Error",
        body: "Please fill Slot Name."
      }
      this.appC.popToast(data);
      return;
    }
  }

  editRowTable(row, index) {
    document.getElementById(("row" + index).toString()).classList.remove('displayComp');
    document.getElementById(("row" + index).toString()).classList.add('editComp');
  }

  saveSlotInformation(row, index) {
    let data = { "slot_id": row.slot_id, "slot_name": row.slot_name }
    this.apiService.updateSlotName(data).subscribe(
      data => {
        console.log(data);
        this.cancelEditRow(index);
        this.getAllSlotsFromServer();
      },
      error => {
        console.log(error);
      }
    )
  }

  cancelEditRow(index) {
    document.getElementById(("row" + index).toString()).classList.add('displayComp');
    document.getElementById(("row" + index).toString()).classList.remove('editComp');
  }

  toggleCreateNewSlot() {
    if (this.createNewSlot == false) {
      this.createNewSlot = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.createNewSlot = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }

  // pagination functions 

  fetchTableDataByPage(index) {
    let startindex = this.studentdisplaysize * (index - 1);
    this.slotTableList = this.getDataFromDataSource(startindex);
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
    let t = this.slotsDataSource.slice(startindex, startindex + this.studentdisplaysize);
    return t;
  }

  /* Customiized click detection strategy */
  inputClickedCheck(ev) {
    if (ev.target.classList.contains('form-ctrl')) {
      if (ev.target.classList.contains('bsDatepicker')) {
        var nodelist = document.querySelectorAll('.bsDatepicker');
        [].forEach.call(nodelist, (elm) => {
          elm.addEventListener('focusout', function (event) {
            event.target.parentNode.classList.add('has-value');
          });
        });
      }
      else if ((ev.target.classList.contains('form-ctrl')) && !(ev.target.classList.contains('bsDatepicker'))) {
        //document.getElementById(ev.target.id).click();
        ev.target.addEventListener('blur', function (event) {
          if (event.target.value != '') {
            event.target.parentNode.classList.add('has-value');
          } else {
            event.target.parentNode.classList.remove('has-value');
          }
        });
      }
    }
  }

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

}
