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
  categoryList;
  dataSourceCategory ;
  totalRow ;
  studentdisplaysize: number = 10;
  PageIndex: number = 1;
  sizeArr: any[] = [10, 25, 50, 100];
  displayBatchSize = 10;

  constructor(
    private categoryService: InventoryCategoryService,
    private appC: AppComponent
  ) { }

  ngOnInit() {
    this.getAllCategoryList();
  }     

  // To create a row in the table
  createTableRow() {
    const element = document.getElementById('tbodyCategory');
    const row = element.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(1);
    cell1.innerHTML = '<a id="updateCell">Update</a>' +" " + '<a id="cancelCell">Cancel</a>';
    cell2.innerHTML = "<input class='edit-comp' type='text' id='tdDescription'  name='label'>";
    cell3.innerHTML = "<input class='edit-comp' type='text' id='tdCategory' name='label'>";
    this.eventLitenerTable();
  }

  // attachiong event on update and cancel button on table row creation
  eventLitenerTable() {
    document.getElementById('updateCell').addEventListener('click',(event)=> {
      this.newCategory.category_name = document.getElementById('tdCategory').value;
      this.newCategory.desc = document.getElementById('tdDescription').value;
      this.addTableRow(this.newCategory , event);
    } )
    document.getElementById('cancelCell').addEventListener('click',(event)=> {
      event.target.closest('tr').remove();
    } )
  }

  //  Add Row Of Table
  addTableRow(data , event) {
    debugger
    if(data.category_name == "" || data.category_name == null){
      let data = {
        type: 'error',
        title: "Error",
        body: "Please fill Category Name."
      }
      this.appC.popToast(data);
      return ;
    }
    let row = event.target.closest('tr');
    this.categoryService.setNewCategory(data).subscribe(
      data => {
        row.remove();
        this.getAllCategoryList();
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
    document.getElementById(("row"+id).toString()).classList.remove('displayComp');
    document.getElementById(("row"+id).toString()).classList.add('editComp');
  }

  // update the current table row

  updateTableRow(rowData , id) {
    document.getElementById(("row"+id).toString()).classList.remove('editComp');
    document.getElementById(("row"+id).toString()).classList.add('displayComp');
    let data: any = {};
    data.category_id = rowData.category_id;
    data.category_name = rowData.category_name;
    data.desc = rowData.desc;
    data.institution_id = rowData.institution_id;
    console.log(data);
    this.categoryService.updateExisting(data).subscribe(
      data => {
        console.log('Datatat' , data);
      },
      error => {
        console.log(error);
      }
    );
  }

  // to fetch all category items 

  getAllCategoryList(){
    this.categoryService.getCategoryList().subscribe(
      (data:any) => {
        this.totalRow = data.length;
        this.dataSourceCategory = data;
        this.fetchTableDataByPage(this.PageIndex);
      },
      err => {
        console.log(err , 'Error');
      }
    )
  }

  // pagination functions 

  fetchTableDataByPage(index){
    let startindex = this.displayBatchSize * (index - 1);
    this.categoryList = this.getDataFromDataSource(startindex);
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
    let t = this.dataSourceCategory.slice(startindex , startindex + this.displayBatchSize);
    return t;
  }

}
