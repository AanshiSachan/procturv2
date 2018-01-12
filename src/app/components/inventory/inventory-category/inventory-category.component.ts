import { Component, OnInit } from '@angular/core';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';
import { AddCategory } from '../../../model/inventory-category';
import { InventoryCategoryService } from '../../../services/inventory-services/inventory-category.service';

@Component({
  selector: 'app-inventory-category',
  templateUrl: './inventory-category.component.html',
  styleUrls: ['./inventory-category.component.scss']
})
export class InventoryCategoryComponent implements OnInit {

  newCategory: AddCategory = {};
  categoryList;

  constructor(
    private categoryService: InventoryCategoryService
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
    cell2.innerHTML = "<input type='text' id='tdCategory' name='label'>";
    cell3.innerHTML = "<input type='text' id='tdDescription'  name='label'>";
    this.eventLitenerTable();
  }

  // attachiong event on update and cancel button on table row creation
  eventLitenerTable() {
    document.getElementById('updateCell').addEventListener('click',(event)=> {
      this.newCategory.category_name = document.getElementById('tdCategory').value;
      this.newCategory.desc = document.getElementById('tdDescription').value;
      this.addTableRow(this.newCategory);
    } )
    document.getElementById('cancelCell').addEventListener('click',(event)=> {
      this.cancelTableRow(event);
    } )
  }

  //  Add Row Of Table
  addTableRow(data) {
    console.log(data);
    this.categoryService.setNewCategory(data).subscribe(
      data => {
        console.log(data);
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

  editRow(row , id) {
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
        console.log(data);
        this.categoryList = data;
      },
      err => {
        console.log(err);
      }
    )
  }

}
