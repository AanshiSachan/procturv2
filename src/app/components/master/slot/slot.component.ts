import { Component, OnInit } from '@angular/core';
import { SlotApiService } from '../../../services/slot-service/slot.service';
import { CommonServiceFactory } from '../../../services/common-service';

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
  slotTableList: any = [];
  createNewSlot: boolean = false;

  constructor(
    private apiService: SlotApiService,
    private commonService: CommonServiceFactory

  ) {
    this.commonService.removeSelectionFromSideNav();
  }

  ngOnInit() {
    this.getAllSlotsFromServer();
  }

  getAllSlotsFromServer() {
    this.apiService.getAllSlots().subscribe(
      (data: any) => {
        this.slotsDataSource = data;
        this.totalRow = data.length;
        this.fetchTableDataByPage(this.PageIndex);
      },
      error => {
        this.commonService.showErrorMessage('error', '', error.error.message);
      }
    )
  }

  addNewSlot(element) {
    if (element.value != "" && element.value != null) {
      this.apiService.addNewSlotToList({ "slot_name": element.value.trim() }).subscribe(
        data => {
          this.commonService.showErrorMessage('success', 'Added', "Slot added successfully");
          element.value = "";
          this.getAllSlotsFromServer();
        },
        error => {
          this.commonService.showErrorMessage('error', '', error.error.message);
        }
      )
    } else {
      this.commonService.showErrorMessage('error', '', "Please fill Slot Name");
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
        this.cancelEditRow(index);
        this.getAllSlotsFromServer();
      },
      error => {
        this.commonService.showErrorMessage('error', '', error.error.message);
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
    this.PageIndex = index;
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

}
