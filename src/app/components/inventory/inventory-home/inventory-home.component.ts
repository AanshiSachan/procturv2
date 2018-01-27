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
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from '../../../../assets/imported_modules/multiselect-dropdown';
import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { InventoryService } from '../../../services/inventory-services/inventory.service';
import { instituteInfo } from '../../../model/instituteinfo';
import { sourceUrl } from '@angular/compiler';
import { AddCategoryInInventory } from '../../../model/add-item-inventory';


@Component({
  selector: 'app-home',
  templateUrl: './inventory-home.component.html',
  styleUrls: ['./inventory-home.component.scss']
})
export class HomeComponent implements OnInit {

  itemTableDatasource: any;
  itemList: any = [];
  categoryList: any = [];
  selectedRow = "";
  operationFlag = "";
  isAddUnit: boolean = false;
  masterCategoryList: any;
  deleteItemPopUp: boolean = false;
  deleteRowDetails: any;
  PageIndex = 1;
  studentdisplaysize = 10;
  totalRow;
  createItemPopUp: boolean = false;
  addItemForm: FormGroup;
  courseList: any;
  showAllocateOption: boolean = false;
  showAllocationBranchPopUp: boolean = false;
  allocateItemForm: FormGroup;
  allocateItemRowClicked: any;
  allocateItemDetails: any;
  subBranchList: any;
  subBranchItemList: any;
  showAvailableUnits: boolean = false;
  availabelItemCount: any;
  showAllocationHistoryPopUp: boolean = false;
  allocationHistoryList;
  itemName;

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
    cost: { id: 'cost', title: 'Cost', filter: false, show: true },

  };

  busy: Subscription;

  constructor(
    private inventoryApi: InventoryService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.checkMainBranchOrSubBranch()
    this.loadTableDatatoSource();
    this.loadItemCategories();
    this.loadItemCategoryMaster();
  }


  checkMainBranchOrSubBranch() {
    let sessionData = JSON.parse(sessionStorage.getItem('institute_info')).is_main_branch;
    if (sessionData == "Y") {
      this.showAllocateOption = true;
    } else {
      this.showAllocateOption = false;
    }
  }

  loadTableDatatoSource() {
    this.itemList = [];
    this.inventoryApi.fetchAllItems().subscribe(
      data => {
        this.totalRow = data.length;
        this.itemTableDatasource = data;
        this.fetchTableDataByPage(this.PageIndex);
        this.selectedRow = "";
      },
      error => {
        console.log(error);
      }
    )

  }

  loadItemCategories() {
    this.inventoryApi.fetchAllCategories().subscribe(
      data => {
        this.categoryList = data;
      },
      error => {
        console.log(error)
      }
    )
  }

  loadItemCategoryMaster() {
    this.inventoryApi.fetchAllMasterCategoryItem().subscribe(
      data => {
        this.masterCategoryList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  editRow(row_no, item_id) {
    this.isAddUnit = false;
    if (this.selectedRow !== "") {
      console.log(this.selectedRow);
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

  addItemsQuantity(row) {
    debugger
    if (row.units_added > 0) {
      let data: any = {};
      data.item_id = row.item_id;
      data.units_added = row.units_added;
      this.inventoryApi.addQuantityInStock(data).subscribe(
        data => {
          this.loadTableDatatoSource();
        },
        error => {
          console.log('Add Stock Error', error);
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
      unit_cost: row.unit_cost.toString()
    };
    this.inventoryApi.updateInventoryItem(postdata).subscribe(
      data => {
        this.loadTableDatatoSource();
        this.categoryList = data;
        document.getElementById(("row" + i).toString()).classList.add('displayComp');
        document.getElementById(("row" + i).toString()).classList.remove('editComp');
      },
      error => {
        console.log(error);
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
    this.inventoryApi.deleteRowFromItem(this.deleteRowDetails.item_id).subscribe(
      data => {
        this.loadTableDatatoSource();
        this.deleteItemPopUp = false;
      },
      error => {
        console.log(error);
      }
    )
  }


  allocationDetails(row, i) {
    this.itemName = row.item_name;
    this.inventoryApi.getInventoryItemHistory(row.item_id).subscribe(
      data => {
        this.showAllocationHistoryPopUp = true;
        this.allocationHistoryList = data;
      },
      error => {
        console.log(error);
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
      this.itemList = searchData;
      this.totalRow = searchData.length;
    } else {
      this.fetchTableDataByPage(this.PageIndex);
      this.totalRow = this.itemTableDatasource.length;
    }
  }

  // pagination functions 
  fetchTableDataByPage(index) {
    let startindex = this.studentdisplaysize * (index - 1);
    this.itemList = this.getDataFromDataSource(startindex);
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
    let t = this.itemTableDatasource.slice(startindex, startindex + this.studentdisplaysize);
    return t;
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
    })
  }

  ///// To add a Item 

  addItemDetails() {
    console.log(this.categoryList);
    console.log(this.masterCategoryList);
    this.createAddItemForm();
    this.createItemPopUp = true;
  }

  //// Add Item Pop Up Function

  closeCreatePopup() {
    this.createItemPopUp = false;
  }

  masterCourseSelected() {
    let courseId = this.addItemForm.value.standardDet;
    this.inventoryApi.getCourseOnBasisOfMasterCourse(courseId).subscribe(
      data => {
        console.log('Change Event Triggered', data);
        this.courseList = data;
      },
      error => {
        console.log("Error", error);
      }
    )
  }

  saveItemDetails() {
    console.log(this.addItemForm.value);
    let data: AddCategoryInInventory = {};
    data.alloted_units = this.addItemForm.value.alloted_units.toString();
    data.category_id = this.addItemForm.value.categoryDet;
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
    this.inventoryApi.addItemDetailsInCategory(data).subscribe(
      data => {
        console.log(data);
        this.loadTableDatatoSource();
        this.createItemPopUp = false;
      },
      error => {
        console.log("Error", error);
      }
    )

  }


  /////// Multi Branch Data And Function Check Point
  allocateQuantityToSubBranches(row) {
    console.log(row);
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
    this.inventoryApi.getItemDetailsForSubBranches(rowId).subscribe(
      data => {
        console.log("getItemInfo", data);
        this.allocateItemDetails = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getAllSubBranchesInformation() {
    this.inventoryApi.getAllSubBranchesInfo().subscribe(
      data => {
        this.subBranchList = data;
        console.log('All Branches', data);
      },
      error => {
        console.log(error);
      }
    )
  }

  onSubBranchSelection() {
    let data_id = this.allocateItemForm.value.sub_branch_id;
    this.inventoryApi.getSubBranchItemInfo(data_id).subscribe(
      data => {
        this.subBranchItemList = data;
        console.log('Sub Branch Selection', data);
      },
      error => {
        console.log('Error', error);
      }
    )
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


  allocateItemToBranches() {
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
        console.log("Allocate Item", data);
        this.showAllocationBranchPopUp = false;
        this.loadTableDatatoSource();
      },
      error => {
        console.log("Allocate Item", error);
      }
    )
  }

  closeAllocateSubBranchPopup() {
    this.showAllocationBranchPopUp = false;
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

}
