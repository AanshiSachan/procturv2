import {
  Component, OnInit, ViewChild, Input, Output,
  EventEmitter, HostListener, AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn, NgForm } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { InventoryService } from '../../../services/inventory-services/inventory.service';
import { instituteInfo } from '../../../model/instituteinfo';
import { AddCategoryInInventory } from '../../../model/add-item-inventory';


@Component({
  selector: 'app-home',
  templateUrl: './inventory-home.component.html',
  styleUrls: ['./inventory-home.component.scss']
})
export class HomeComponent implements OnInit {

  itemTableDatasource: any = [];
  itemList: any = [];
  categoryList: any = [];
  selectedRow = "";
  operationFlag = "";
  isAddUnit: boolean = false;
  masterCategoryList: any = [];
  deleteItemPopUp: boolean = false;
  deleteRowDetails: any;
  PageIndex = 1;
  studentdisplaysize = 10;
  totalRow: number = 0;
  createItemPopUp: boolean = false;
  addItemForm: FormGroup;
  courseList: any = [];
  showAllocateOption: boolean = false;
  showAllocationBranchPopUp: boolean = false;
  allocateItemForm: FormGroup;
  allocateItemRowClicked: any;
  allocateItemDetails: any;
  subBranchList: any = [];
  subBranchItemList: any;
  showAvailableUnits: boolean = false;
  availabelItemCount: any;
  showAllocationHistoryPopUp: boolean = false;
  allocationHistoryList;
  itemName: any = "";
  searchData: any = [];
  searchDataFlag: boolean = false;
  isRippleLoad: boolean = false;
  private showMenu: boolean = false;
  header: any = {
    inventory_item: { id: 'inventory_item', title: 'Inventory Item', filter: false, show: true },
    category: { id: 'category', title: 'Category', filter: false, show: true },
    description: { id: 'description', title: 'Description', filter: false, show: true },
    master_course: { id: 'master_course', title: 'Master Course', filter: false, show: true },
    course: { id: 'course', title: 'Course', filter: false, show: true },
    total_units: { id: 'total_units', title: 'Total Units', filter: false, show: true },
    available: { id: 'available', title: 'Available Units', filter: false, show: true },
    edit: { id: 'edit', title: 'Action', filter: false, show: true },
    add_units: { id: 'add_units', title: 'Add Units', filter: false, show: true },
    cost: { id: 'cost', title: 'Unit Cost', filter: false, show: true },

  };
  subtractFlag: boolean = false;
  @ViewChild('ActionInv') ActionInv: ElementRef;

  constructor(
    private inventoryApi: InventoryService,
    private fb: FormBuilder,
    private appC: AppComponent
  ) {
  }

  ngOnInit() {
    this.checkMainBranchOrSubBranch()
    this.loadTableDatatoSource();
    this.loadItemCategories();
    this.loadItemCategoryMaster();
  }


  checkMainBranchOrSubBranch() {
    let sessionData = sessionStorage.getItem('is_main_branch');
    if (sessionData == "Y") {
      this.showAllocateOption = true;
    } else {
      this.showAllocateOption = false;
    }
  }

  loadTableDatatoSource() {
    this.itemList = [];
    this.isRippleLoad = true;
    this.itemTableDatasource = [];
    this.inventoryApi.fetchAllItems().subscribe(
      (data: any) => {
        this.isRippleLoad = false;
        this.totalRow = data.length;
        this.itemTableDatasource = data;
        this.fetchTableDataByPage(this.PageIndex);
        this.selectedRow = "";
      },
      error => {
        this.isRippleLoad = false;
        //console.log(error);
      }
    )

  }

  loadItemCategories() {
    this.isRippleLoad = true;
    this.inventoryApi.fetchAllCategories().subscribe(
      data => {
        this.isRippleLoad = false;
        this.categoryList = data;
      },
      error => {
        this.isRippleLoad = false;
        //console.log(error)
      }
    )
  }

  loadItemCategoryMaster() {
    this.isRippleLoad = true;
    this.inventoryApi.fetchAllMasterCategoryItem().subscribe(
      data => {
        this.isRippleLoad = false;
        this.masterCategoryList = data;
      },
      error => {
        this.isRippleLoad = false;
        //console.log(error);
      }
    )
  }

  editRow(row_no, item_id) {
    //console.log(row_no)
    this.isAddUnit = false;
    if (this.selectedRow !== "") {
      //console.log(this.selectedRow);
      document.getElementById(("row" + this.selectedRow).toString()).classList.add('displayComp');
      document.getElementById(("row" + this.selectedRow).toString()).classList.remove('editComp');
    }
    this.selectedRow = row_no;
    document.getElementById(("table-header").toString()).classList.remove('displayComp');
    document.getElementById(("table-header").toString()).classList.add('editComp');
    document.getElementById(("row" + row_no).toString()).classList.remove('displayComp');
    document.getElementById(("row" + row_no).toString()).classList.add('editComp');
  }

  cancelRow(row_no) {
    this.isAddUnit = false;
    this.loadTableDatatoSource();
    document.getElementById(("table-header").toString()).classList.add('displayComp');
    document.getElementById(("table-header").toString()).classList.remove('editComp');
    document.getElementById(("row" + row_no).toString()).classList.add('displayComp');
    document.getElementById(("row" + row_no).toString()).classList.remove('editComp');
  }


  addItemsEnable(i) {
    document.getElementById(("add-item" + i).toString()).classList.add('editAddItem');
    document.getElementById(("add-item" + i).toString()).classList.remove('displayAddItem');
  }

  subtractItemsEnable(i) {
    document.getElementById(("add-item" + i).toString()).classList.add('editAddItem');
    document.getElementById(("add-item" + i).toString()).classList.remove('displayAddItem');
    this.subtractFlag = true;
  }

  addItemsQuantity(row) {
    if (row.units_added > 0) {
      let data: any = {};
      data.item_id = row.item_id;
      if (this.subtractFlag) {
        data.units_added = "-" + Math.floor(row.units_added);
      } else {
        data.units_added = Math.floor(row.units_added);
      }
      this.isRippleLoad = true;
      this.inventoryApi.addQuantityInStock(data).subscribe(
        data => {
          this.isRippleLoad = false;
          this.loadTableDatatoSource();
          this.subtractFlag = false;
        },
        error => {
          this.isRippleLoad = false;
          this.subtractFlag = false;
          let data = {
            type: 'error',
            title: "Error",
            body: error.error.message
          }
          this.appC.popToast(data);
          this.loadTableDatatoSource();
          //console.log('Add Stock Error', error);
        }
      )
    }
  }

  cancelItem(i) {
    document.getElementById(("add-item" + i).toString()).classList.add('displayAddItem');
    document.getElementById(("add-item" + i).toString()).classList.remove('editAddItem');
    this.fetchTableDataByPage(this.PageIndex);
    this.totalRow = this.itemTableDatasource.length;
  }

  updateRow(row, i) {
    let postdata = {
      category_id: row.category_id,
      desc: row.desc,
      institution_id: "",
      item_id: row.item_id.toString(),
      item_name: row.item_name,
      standard_id: row.standard_id.toString(),
      subject_id: row.subject_id.toString(),
      unit_cost: row.unit_cost.toString(),
      out_of_stock_indicator_units: row.out_of_stock_indicator_units.toString()
    };
    this.isRippleLoad = true;
    this.inventoryApi.updateInventoryItem(postdata).subscribe(
      data => {
        this.isRippleLoad = false;
        this.loadTableDatatoSource();
        document.getElementById(("row" + i).toString()).classList.add('displayComp');
        document.getElementById(("row" + i).toString()).classList.remove('editComp');
      },
      error => {
        this.isRippleLoad = false;
        let data = {
          type: 'error',
          title: "Error",
          body: error.error.message
        }
        this.appC.popToast(data);
      }
    )
  }

  deleteRow(row, index) {
    this.deleteItemPopUp = true;
    this.deleteRowDetails = row;
  }

  closeDeletePopup() {
    this.deleteItemPopUp = false;
  }

  deleteStudent() {
    this.isRippleLoad = true;
    this.inventoryApi.deleteRowFromItem(this.deleteRowDetails.item_id).subscribe(
      data => {
        this.isRippleLoad = false;
        this.loadTableDatatoSource();
        this.deleteItemPopUp = false;
      },
      error => {
        this.isRippleLoad = false;
        let data = {
          type: 'error',
          title: "Error",
          body: error.error.message
        }
        this.appC.popToast(data);
      }
    )
  }


  allocationDetails(row, i) {
    //console.log(i);
    this.itemName = row.item_name;
    this.isRippleLoad = true;
    this.inventoryApi.getInventoryItemHistory(row.item_id).subscribe(
      data => {
        this.isRippleLoad = false;
        this.showAllocationHistoryPopUp = true;
        this.allocationHistoryList = data;
      },
      error => {
        this.isRippleLoad = false;
        let data = {
          type: 'error',
          title: "Error",
          body: error.error.message
        }
        this.appC.popToast(data);
      }
    )
  }

  closeAllocationItemHistoryPopup() {
    this.showAllocationHistoryPopUp = false;
  }

  searchDatabase(element) {
    if (element.value != "" && element.value != undefined && element.value != null) {
      let searchData = this.itemTableDatasource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(element.value.toLowerCase()))
      );
      this.searchData = searchData;
      this.totalRow = searchData.length;
      this.searchDataFlag = true;
      this.fetchTableDataByPage(this.PageIndex);
    } else {
      this.searchDataFlag = false;
      this.fetchTableDataByPage(this.PageIndex);
      this.totalRow = this.itemTableDatasource.length;
    }
  }

  // pagination functions 
  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.studentdisplaysize * (index - 1);
    this.itemList = Array.from(this.getDataFromDataSource(startindex));
    //console.log(this.itemList);
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
    if (this.searchDataFlag) {
      data = this.searchData.slice(startindex, startindex + this.studentdisplaysize);
    } else {
      data = this.itemTableDatasource.slice(startindex, startindex + this.studentdisplaysize);
    }
    return data;
  }

  //// Add Item Form

  createAddItemForm() {
    this.addItemForm = this.fb.group({
      item_name: ['', [Validators.required]],
      desc: [''],
      categoryDet: ['', [Validators.required]],
      alloted_units: ['', Validators.required],
      standardDet: [''],
      subjectDet: [''],
      unit_cost: [''],
      created_date: [moment().format("YYYY-MM-DD")],
      out_of_stock_indicator_units: ['']
    })
  }

  ///// To add a Item 

  addItemDetails() {
    this.createAddItemForm();
    this.createItemPopUp = true;
  }

  //// Add Item Pop Up Function

  closeCreatePopup() {
    this.createItemPopUp = false;
  }

  masterCourseSelected() {
    let courseId = this.addItemForm.value.standardDet;
    this.isRippleLoad = true;
    this.inventoryApi.getCourseOnBasisOfMasterCourse(courseId).subscribe(
      data => {
        this.isRippleLoad = false;
        this.courseList = data;
      },
      error => {
        this.isRippleLoad = false;
        //console.log("Error", error);
      }
    )
  }

  saveItemDetails() {
    let data: AddCategoryInInventory = {};
    data.alloted_units = this.addItemForm.value.alloted_units.toString();
    data.category_id = this.addItemForm.value.categoryDet;
    if (data.category_id == -1) {
      let msg = {
        type: 'error',
        title: "Error",
        body: "Please provide category"
      }
      this.appC.popToast(msg);
      return;
    }
    data.created_date = this.addItemForm.value.created_date;
    data.desc = this.addItemForm.value.desc;
    data.item_name = this.addItemForm.value.item_name;
    data.standard_id = this.addItemForm.value.standardDet;
    if (data.standard_id == null || data.standard_id == "") {
      data.standard_id = -1;
    }
    data.subject_id = this.addItemForm.value.subjectDet;
    if (data.subject_id == null || data.subject_id == "") {
      data.subject_id = -1;
    }
    data.unit_cost = this.addItemForm.value.unit_cost.toString();
    data.out_of_stock_indicator_units = this.addItemForm.value.out_of_stock_indicator_units;
    this.isRippleLoad = true;
    this.inventoryApi.addItemDetailsInCategory(data).subscribe(
      data => {
        this.isRippleLoad = false;
        this.loadTableDatatoSource();
        this.createItemPopUp = false;
      },
      error => {
        this.isRippleLoad = false;
        let data = {
          type: 'error',
          title: "Error",
          body: error.error.message
        }
        this.appC.popToast(data);
      }
    )

  }


  /////// Multi Branch Data And Function Check Point
  allocateQuantityToSubBranches(row) {
    //console.log(row);
    this.allocateItemRowClicked = row;
    this.showAllocationBranchPopUp = true;
    this.createAllocationForm();
    this.getItemInformation(row.item_id);
    this.getAllSubBranchesInformation();
  }

  createAllocationForm() {
    this.allocateItemForm = this.fb.group({
      transport: [''],
      challan_no: [''],
      challan_amount: [''],
      alloted_units: ['', [Validators.required]],
      challan_date: [''],
      sub_branch_id: ['', [Validators.required]],
      sub_branch_item_id: ['', [Validators.required]],
      item_id: ['']
    })
  }

  getItemInformation(rowId) {
    this.isRippleLoad = true;
    this.inventoryApi.getItemDetailsForSubBranches(rowId).subscribe(
      data => {
        this.isRippleLoad = false;
        //console.log("getItemInfo", data);
        this.allocateItemDetails = data;
      },
      error => {
        this.isRippleLoad = false;
        let data = {
          type: 'error',
          title: "Error",
          body: error.error.message
        }
        this.appC.popToast(data);
      }
    )
  }

  getAllSubBranchesInformation() {
    this.isRippleLoad = true;
    this.inventoryApi.getAllSubBranchesInfo().subscribe(
      data => {
        this.isRippleLoad = false;
        this.subBranchList = data;
        //console.log('All Branches', data);
      },
      error => {
        this.isRippleLoad = false;
        //console.log(error);
      }
    )
  }

  onSubBranchSelection() {
    let data_id = this.allocateItemForm.value.sub_branch_id;
    if (data_id != "-1") {
      this.isRippleLoad = true;
      this.inventoryApi.getSubBranchItemInfo(data_id).subscribe(
        data => {
          this.isRippleLoad = false;
          this.subBranchItemList = data;
        },
        error => {
          this.isRippleLoad = false;
          console.log('Error', error);
        }
      )
    } else {
      this.subBranchItemList = [];
    }
  }

  onSelectSubBranchItem() {
    let subBranchItemId = this.allocateItemForm.value.sub_branch_item_id;
    this.subBranchItemList.forEach(element => {
      if (element.item_id == subBranchItemId) {
        this.showAvailableUnits = true;
        this.availabelItemCount = element.available_units;
      }
    });
  }


  /* open action menu on click */
  openMenu(index) {
    this.selectedRow = index;
    let len = this.itemList.length;
    for (var i = 0; i < len; i++) {
      if (i == index) {
        document.getElementById('menuList' + i).classList.toggle('hide');
      }
      else if (i != index) {
        document.getElementById('menuList' + i).classList.add('hide');
      }
    }
  }

  /* close action menu on events  */
  closeMenu() {
    document.getElementById('menuList' + this.selectedRow).classList.add('hide');
  }


  @HostListener("document:click", ['$event'])
  onWindowClick(event) {
    if (this.ActionInv.nativeElement.contains(event.target)) {
      //console.log("clicked inside table");
    } else {
      if (document.getElementById('menuList' + this.selectedRow) != null) {
        document.getElementById('menuList' + this.selectedRow).classList.add('hide');
      }
    }
  }

  validateMandatoryFields() {
    let msg = {
      type: 'error',
      title: "Error",
      body: ""
    }
    if (this.allocateItemForm.value.sub_branch_id == "" || this.allocateItemForm.value.sub_branch_id == null || this.allocateItemForm.value.sub_branch_id == '-1') {
      msg.body = "Please provide sub branch";
      this.appC.popToast(msg);
      return false;
    }
    if (this.allocateItemForm.value.sub_branch_item_id == "" || this.allocateItemForm.value.sub_branch_item_id == null) {
      msg.body = "Please provide sub branch item";
      this.appC.popToast(msg);
      return false;
    }
    if (this.allocateItemForm.value.alloted_units == "" || this.allocateItemForm.value.alloted_units == null) {
      msg.body = "Please provide no of allocation units";
      this.appC.popToast(msg);
      return false;
    }
    return true;
  }


  allocateItemToBranches() {
    let check = this.validateMandatoryFields();
    if (check == false) {
      return
    }
    let data: any = {};
    data.alloted_units = this.allocateItemForm.value.alloted_units;
    data.challan_amount = this.allocateItemForm.value.challan_amount;
    data.challan_date = this.allocateItemForm.value.challan_date;
    data.challan_no = this.allocateItemForm.value.challan_no;
    data.transport = this.allocateItemForm.value.transport;
    data.sub_branch_item_id = this.allocateItemForm.value.sub_branch_item_id;
    data.sub_branch_id = this.allocateItemForm.value.sub_branch_id;
    data.item_id = this.allocateItemRowClicked.item_id.toString();
    this.inventoryApi.allocateItemToSubBranch(data).subscribe(
      data => {
        let msg = {
          type: 'success',
          title: "Success",
          body: "Successfully allocated to sub branch"
        }
        this.appC.popToast(msg);
        this.showAllocationBranchPopUp = false;
        this.loadTableDatatoSource();
      },
      error => {
        //console.log("Allocate Item", error);
        let msg = {
          type: 'error',
          title: "Error",
          body: error.error.message
        }
        this.appC.popToast(msg);
      }
    )
  }

  closeAllocateSubBranchPopup() {
    this.showAllocationBranchPopUp = false;
    this.showAvailableUnits = false;
  }

}
