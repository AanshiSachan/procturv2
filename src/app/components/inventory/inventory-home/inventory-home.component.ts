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
  totalRow ;
  createItemPopUp: boolean = false;
  addItemForm: FormGroup;
  courseList: any ;

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
    this.loadTableDatatoSource();
    this.loadItemCategories();
    this.loadItemCategoryMaster();
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


  inputClicked() {

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

  searchDatabase(element) {
    let searchData = this.itemTableDatasource.filter(item => 
      Object.keys(item).some(
        k => item[k] != null && item[k].toString().toLowerCase().includes(element.value.toLowerCase()))
    );
    this.itemList = searchData;
  }

   // pagination functions 
   fetchTableDataByPage(index){
    let startindex = this.studentdisplaysize * (index - 1);
    this.itemList = this.getDataFromDataSource(startindex);
  }

  fetchNext(){
    this.PageIndex ++;
    this.fetchTableDataByPage(this.PageIndex);
  }

  fetchPrevious(){
    if(this.PageIndex != 1){
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let t = this.itemTableDatasource.slice(startindex , startindex + this.studentdisplaysize);
    return t;
  }

  //// Add Item Form

  createAddItemForm() {
    this.addItemForm = this.fb.group({
      item_name:['',[Validators.required]],
      desc: [''],
      categoryDet: ['',[Validators.required]],
      alloted_units: ['',Validators.required],
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
        console.log('Change Event Triggered' , data);
        this.courseList = data;
      },
      error => {
        console.log("Error" , error);
      }
    )
  }

  saveItemDetails() {
    console.log(this.addItemForm.value);
    let data: AddCategoryInInventory = {} ;
    data.alloted_units = this.addItemForm.value.alloted_units.toString();
    data.category_id = this.addItemForm.value.categoryDet;
    data.created_date = this.addItemForm.value.created_date;
    data.desc = this.addItemForm.value.desc;
    data.item_name = this.addItemForm.value.item_name;
    data.standard_id = this.addItemForm.value.standardDet;
    if( data.standard_id == null || data.standard_id == "") {
      data.standard_id = -1;
    }
    data.subject_id = this.addItemForm.value.subjectDet;
    if( data.subject_id == null || data.subject_id == "" ) {
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
        console.log("Error" , error);
      }
    )

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
