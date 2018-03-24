import { Component, OnInit } from '@angular/core';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import { AddCategory } from '../../../model/inventory-category';
import { InventoryCategoryService } from '../../../services/inventory-services/inventory-category.service';
import { retry } from 'rxjs/operator/retry';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-inventory-category',
  templateUrl: './inventory-category.component.html',
  styleUrls: ['./inventory-category.component.scss']
})
export class InventoryCategoryComponent implements OnInit {

  newCategory: AddCategory = {};
  categoryList: any = [];
  dataSourceCategory: any = [];
  totalRow;
  studentdisplaysize: number = 10;
  PageIndex: number = 1;
  sizeArr: any[] = [10, 25, 50, 100];
  displayBatchSize = 10;
  createNewCategory: boolean = false;

  constructor(
    private categoryService: InventoryCategoryService,
    private appC: AppComponent
  ) { }

  ngOnInit() {
    this.getAllCategoryList();
    this.switchActiveView('category');
  }

  addNewCategoryRow(categoryElement, descriptionElement) {
    this.newCategory.category_name = categoryElement.value;
    this.newCategory.desc = descriptionElement.value;
    this.addTableRow(this.newCategory);
  }

  //  Add Row Of Table
  addTableRow(data) {
    if (data.category_name == "" || data.category_name == null) {
      let data = {
        type: 'error',
        title: "Error",
        body: "Please fill Category Name."
      }
      this.appC.popToast(data);
      return;
    }
    this.categoryService.setNewCategory(data).subscribe(
      data => {
        this.getAllCategoryList();
        document.getElementById('ctgryName').value = "";
        document.getElementById('ctgrydesc').value = "";
        let msg = {
          type: 'success',
          title: "",
          body: "New Category Added."
        }
        this.appC.popToast(msg);
      },
      error => {
        console.log(error);
      }
    );
  }


  // Cancel

  cancelTableRow(event) {
    this.getAllCategoryList();
  }


  // edit perticular row

  editRow(id) {
    document.getElementById(("row" + id).toString()).classList.remove('displayComp');
    document.getElementById(("row" + id).toString()).classList.add('editComp');
  }

  // update the current table row

  updateTableRow(rowData, id) {
    document.getElementById(("row" + id).toString()).classList.remove('editComp');
    document.getElementById(("row" + id).toString()).classList.add('displayComp');
    let data: any = {};
    data.category_id = rowData.category_id;
    data.category_name = rowData.category_name;
    data.desc = rowData.desc;
    data.institution_id = rowData.institution_id;
    console.log(data);
    this.categoryService.updateExisting(data).subscribe(
      data => {
        console.log('Datatat', data);
        let msg = {
          type: 'success',
          title: "",
          body: "Category Updated."
        }
        this.appC.popToast(msg);
      },
      error => {
        console.log(error);
      }
    );
  }

  // to fetch all category items 

  getAllCategoryList() {
    this.categoryService.getCategoryList().subscribe(
      (data: any) => {
        this.totalRow = data.length;
        this.dataSourceCategory = data;
        this.fetchTableDataByPage(this.PageIndex);
      },
      err => {
        console.log(err, 'Error');
      }
    )
  }

  toggleCreateNewSlot() {
    if (this.createNewCategory == false) {
      this.createNewCategory = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.createNewCategory = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }

  // pagination functions 

  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.categoryList = this.getDataFromDataSource(startindex);
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
    let t = this.dataSourceCategory.slice(startindex, startindex + this.displayBatchSize);
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


  switchActiveView(tabName) {
    document.getElementById('item').classList.remove('active');
    document.getElementById('category').classList.remove('active');
    document.getElementById(tabName).classList.add('active');
  }

}
