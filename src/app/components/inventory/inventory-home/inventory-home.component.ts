import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import 'rxjs/Rx';
import { AddCategoryInInventory } from '../../../model/add-item-inventory';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { InventoryService } from '../../../services/inventory-services/inventory.service';
import { MessageShowService } from '../../../services/message-show.service';
declare var $;


@Component({
  selector: 'app-home',
  templateUrl: './inventory-home.component.html',
  styleUrls: ['./inventory-home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('ActionInv') ActionInv: ElementRef;
  addItemForm: FormGroup;
  allocateItemForm: FormGroup;
  courseList: any = [];
  itemTableDatasource: any = [];
  itemList: any = [];
  categoryList: any = [];
  masterCategoryList: any = [];
  subBranchList: any = [];
  searchData: any = [];

  selectedRow = "";
  operationFlag = "";
  allocateItemRowClicked: any;
  allocateItemDetails: any;
  subBranchItemList: any;
  availabelItemCount: any;
  allocationHistoryList;
  itemName: any = "";
  deleteRowDetails: any;

  PageIndex = 1;
  studentdisplaysize = 10;
  totalRow: number = 0;

  isAddUnit: boolean = false;
  subtractFlag: boolean = false;
  deleteItemPopUp: boolean = false;
  createItemPopUp: boolean = false;
  showAllocateOption: boolean = false;
  showAllocationBranchPopUp: boolean = false;
  showAvailableUnits: boolean = false;
  isProfessional:boolean = false;
  showAllocationHistoryPopUp: boolean = false;
  searchDataFlag: boolean = false;
  showMenu: boolean = false;
  enable_eLearn_feature_flag : boolean = false;

  header: any = {
    inventory_item: { id: 'inventory_item', title: 'Inventory Item', filter: false, show: true },
    category: { id: 'category', title: 'Category', filter: false, show: true },
    description: { id: 'description', title: 'Description', filter: false, show: true },
    standard_name: { id: 'standard_name', title: 'Standard', filter: false, show: true },
    subject_name: { id: 'subject_name', title: 'Subject', filter: false, show: true },
    master_course: { id: 'master_course', title: 'Master Course', filter: false, show: true },
    course: { id: 'course', title: 'Course', filter: false, show: true },
    total_units: { id: 'total_units', title: 'Total Units', filter: false, show: true },
    available: { id: 'available', title: 'Available Units', filter: false, show: true },
    edit: { id: 'edit', title: 'Action', filter: false, show: true },
    add_units: { id: 'add_units', title: 'Add Units', filter: false, show: true },
    cost: { id: 'cost', title: 'Unit Cost', filter: false, show: true },
  };

  editManageUnit:any = {
    availableUnits: 0,
    totalUnits: 0,
    newUnit: 0,
    item_id: ""
  };
  editStandSubject:any = {
    standard_id: "",
    standard_name: "",
    subject_id: "-1",
    subject_name: ""
  };
  editCourseList: any = [];

  arr = Array(1000).fill(0).map((e,i)=>i-500)

  constructor(
    private inventoryApi: InventoryService,
    private fb: FormBuilder,
    private msg:MessageShowService,
    private auth: AuthenticatorService
  ) {
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') { // batch
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.checkMainBranchOrSubBranch()
    this.loadTableDatatoSource();
    this.loadItemCategories();
    this.loadItemCategoryMaster();
    this.checkEnableElearnFeature();
  }

  checkEnableElearnFeature() {
    let enable_eLearn_feature: any;
    enable_eLearn_feature = sessionStorage.getItem('enable_eLearn_feature');
    if (enable_eLearn_feature == 1) {
      this.enable_eLearn_feature_flag = true;
    }
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
    this.auth.showLoader();
    this.itemTableDatasource = [];
    this.inventoryApi.fetchAllItems().subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.totalRow = data.length;
        this.itemTableDatasource = data;
        this.fetchTableDataByPage(this.PageIndex);
        this.selectedRow = "";
      },
      error => {
        this.auth.hideLoader();
        //console.log(error);
      }
    )

  }

  loadItemCategories() {
    this.auth.showLoader();
    this.inventoryApi.fetchAllCategories().subscribe(
      data => {
        this.auth.hideLoader();
        this.categoryList = data;
      },
      error => {
        this.auth.hideLoader();
        //console.log(error)
      }
    )
  }

  loadItemCategoryMaster() {
    this.auth.showLoader();
    this.inventoryApi.fetchAllMasterCategoryItem().subscribe(
      data => {
        this.auth.hideLoader();
        this.masterCategoryList = data;
      },
      error => {
        this.auth.hideLoader();
        //console.log(error);
      }
    )
  }

  editRow(row_no, item_id, row) {
    this.isAddUnit = false;
    if (this.selectedRow !== "") {
      document.getElementById(("row" + this.selectedRow).toString()).classList.add('displayComp');
      document.getElementById(("row" + this.selectedRow).toString()).classList.remove('editComp');
    }
    this.selectedRow = row_no;
    document.getElementById(("table-header").toString()).classList.remove('displayComp');
    document.getElementById(("table-header").toString()).classList.add('editComp');
    document.getElementById(("row" + row_no).toString()).classList.remove('displayComp');
    document.getElementById(("row" + row_no).toString()).classList.add('editComp');

    this.editStandSubject.standard_id = row.standard_id;
    this.editStandSubject.standard_name = row.standard_name;
    this.getCourseList(row);
  }

  getCourseList(row){
    let courseId = this.editStandSubject.standard_id;
    this.auth.showLoader();
    this.inventoryApi.getCourseOnBasisOfMasterCourse(courseId).subscribe(
      data => {
        this.auth.hideLoader();
        this.editCourseList = data;
        this.editStandSubject.subject_id = row.subject_id;
        this.editStandSubject.subject_name = row.subject_name;
      },
      error => {
        this.auth.hideLoader();
        //console.log('', error);
      }
    )
  }

  masterCourseChanged(){
    let courseId = this.editStandSubject.standard_id;
    this.auth.showLoader();
    this.editStandSubject.subject_id = "-1";
    this.editStandSubject.subject_name = "";
    this.inventoryApi.getCourseOnBasisOfMasterCourse(courseId).subscribe(
      data => {
        this.auth.hideLoader();
        this.editCourseList = data;
      },
      error => {
        this.auth.hideLoader();
        //console.log('', error);
      }
    )
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
      this.auth.showLoader();
      this.inventoryApi.addQuantityInStock(data).subscribe(
        data => {
          this.auth.hideLoader();
          this.loadTableDatatoSource();
          this.subtractFlag = false;
        },
        error => {
          this.auth.hideLoader();
          this.subtractFlag = false;
          this.msg.showErrorMessage("error" , '' , error.error.message);
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
      standard_id: this.editStandSubject.standard_id.toString(),
      subject_id: this.editStandSubject.subject_id.toString(),
      standard_name: this.editStandSubject.standard_name.toString(),
      subject_name: this.editStandSubject.subject_name.toString(),
      unit_cost: row.unit_cost.toString(),
      out_of_stock_indicator_units: row.out_of_stock_indicator_units.toString(),
      is_offline_or_online: row.is_offline_or_online
    };
    this.auth.showLoader();
    this.inventoryApi.updateInventoryItem(postdata).subscribe(
      data => {
        this.auth.hideLoader();
        this.loadTableDatatoSource();
        document.getElementById(("row" + i).toString()).classList.add('displayComp');
        document.getElementById(("row" + i).toString()).classList.remove('editComp');
      },
      error => {
        this.auth.hideLoader();
        this.msg.showErrorMessage("error" , '' , error.error.message);
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

  showManageUnit(row){
    $('#manageUnit').modal('show');
    this.editManageUnit.availableUnits = row.available_units;
    this.editManageUnit.totalUnits = row.alloted_units;
    this.editManageUnit.item_id = row.item_id;
  }


  allocateUnit(){
    // if (this.editManageUnit.newUnit > 0) {
      let data: any = {};
      data.item_id = this.editManageUnit.item_id;
      data.units_added = this.editManageUnit.newUnit;
      this.auth.showLoader();
      this.inventoryApi.addQuantityInStock(data).subscribe(
        data => {
          this.auth.hideLoader();
          this.editManageUnit.item_id = "";
          this.editManageUnit.newUnit = 0;
          this.editManageUnit.availableUnits = 0;
          this.editManageUnit.totalUnits = 0;
          $('#manageUnit').modal('hide');
          this.loadTableDatatoSource();
        },
        error => {
          this.auth.hideLoader();
          this.msg.showErrorMessage("error" , '' , error.error.message);
          this.loadTableDatatoSource();
        }
      )
    // }
  }

  deleteStudent() {
    this.auth.showLoader();
    this.inventoryApi.deleteRowFromItem(this.deleteRowDetails.item_id).subscribe(
      data => {
        this.auth.hideLoader();
        this.loadTableDatatoSource();
        this.deleteItemPopUp = false;
        this.msg.showErrorMessage("success" , "" , "Inventory Deleted Successfully")
      },
      error => {
        this.auth.hideLoader();
        this.msg.showErrorMessage("error" , '' , error.error.message);
      }
    )
  }


  allocationDetails(row, i) {
    //console.log(i);
    this.itemName = row.item_name;
    this.auth.showLoader();
    this.inventoryApi.getInventoryItemHistory(row.item_id).subscribe(
      data => {
        this.auth.hideLoader();
        this.showAllocationHistoryPopUp = true;
        this.allocationHistoryList = data;
      },
      error => {
        this.auth.hideLoader();
        this.msg.showErrorMessage("error" , '' , error.error.message);
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
      out_of_stock_indicator_units: [''],
      is_offline_or_online:['']
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
    this.auth.showLoader();
    this.inventoryApi.getCourseOnBasisOfMasterCourse(courseId).subscribe(
      data => {
        this.auth.hideLoader();
        this.courseList = data;
      },
      error => {
        this.auth.hideLoader();
        //console.log('', error);
      }
    )
  }

  saveItemDetails() {
    let data: AddCategoryInInventory = {};
    data.alloted_units = this.addItemForm.value.alloted_units.toString();
    data.category_id = this.addItemForm.value.categoryDet;
    if (data.category_id == -1) {
      this.msg.showErrorMessage("error" , '' ,"Please enter category");
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
    data.is_offline_or_online=this.addItemForm.value.is_offline_or_online;
    this.auth.showLoader();
    this.inventoryApi.addItemDetailsInCategory(data).subscribe(
      data => {
        this.auth.hideLoader();
        this.loadTableDatatoSource();
        this.createItemPopUp = false;
      },
      error => {
        this.auth.hideLoader();
        this.msg.showErrorMessage("error" , '' , error.error.message);
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
    this.auth.showLoader();
    this.inventoryApi.getItemDetailsForSubBranches(rowId).subscribe(
      data => {
        this.auth.hideLoader();
        //console.log("getItemInfo", data);
        this.allocateItemDetails = data;
      },
      error => {
        this.auth.hideLoader();
        this.msg.showErrorMessage("error" , '' , error.error.message);
      }
    )
  }

  getAllSubBranchesInformation() {
    this.auth.showLoader();
    this.inventoryApi.getAllSubBranchesInfo().subscribe(
      data => {
        this.auth.hideLoader();
        this.subBranchList = data;
        //console.log('All Branches', data);
      },
      error => {
        this.auth.hideLoader();
        //console.log(error);
      }
    )
  }

  onSubBranchSelection() {
    let data_id = this.allocateItemForm.value.sub_branch_id;
    if (data_id != "-1") {
      this.auth.showLoader();
      this.inventoryApi.getSubBranchItemInfo(data_id).subscribe(
        data => {
          this.auth.hideLoader();
          this.subBranchItemList = data;
        },
        error => {
          this.auth.hideLoader();
          console.log('', error);
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
    if (this.allocateItemForm.value.sub_branch_id == "" || this.allocateItemForm.value.sub_branch_id == null || this.allocateItemForm.value.sub_branch_id == '-1') {
           this.msg.showErrorMessage("error" , '' , "Please enter sub branch");
      return false;
    }
    if (this.allocateItemForm.value.sub_branch_item_id == "" || this.allocateItemForm.value.sub_branch_item_id == null) {
         this.msg.showErrorMessage("error" , '' , "Please enter sub branch item");
      return false;
    }
    if (this.allocateItemForm.value.alloted_units == "" || this.allocateItemForm.value.alloted_units == null) {
        this.msg.showErrorMessage("error" , '' , "Please enter no of allocation units");
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
        this.msg.showErrorMessage("success" , '' , "Successfully allocated to sub branch");
        this.showAllocationBranchPopUp = false;
        this.loadTableDatatoSource();
      },
      error => {
        //console.log("Allocate Item", error);
        this.msg.showErrorMessage("error" , '' , error.error.message);
      }
    )
  }

  closeAllocateSubBranchPopup() {
    this.showAllocationBranchPopUp = false;
    this.showAvailableUnits = false;
  }

}
