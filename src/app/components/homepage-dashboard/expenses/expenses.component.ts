import { Component, OnInit, ViewChild, ElementRef, Renderer2, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthenticatorService } from '../../../services/authenticator.service';
import * as moment from 'moment';
import { CommonServiceFactory } from '../../../services/common-service';
import { AppComponent } from '../../../app.component';
import { ExpensesService } from '../../../services/expenses.service';
import { ExcelService } from '../../../services/excel.service';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})

export class ExpensesComponent implements OnInit {

  today: any = Date.now();
  addDate: any;
  editDate: any;
  expenseFor: boolean = false;
  allCategory: any = [];
  newExpenseCategory: any;
  allExpenses: any = [];
  total_expense: number = 0;
  isEdit: boolean = true;
  isShow: boolean = false;
  changeCat: boolean = true;
  filteredDate : boolean = true;
  noRecord: boolean = false;
  selectedRow = "";
  filterCategory = "-1";
  filterDateRange: any;
  public isProfessional: boolean = false;
  expenses: any = {
    category_id: '',
    expense_type: '',
    total_quantity: '',
    rate_per_quantity: '',
    added_date: '',
    total_amount: ''
  };
  editExpense: any = {
    category_id: '',
    expense_type: '',
    total_quantity: '',
    rate_per_quantity: '',
    added_date: '',
    total_amount: ''
  }
  expensesSearchFilter: any = {
    from_date: '',
    to_date: '',
    categoryIds: ''
  };


  constructor(
    private router: Router,
    private auth: AuthenticatorService,
    private commonService : CommonServiceFactory,
    private appC: AppComponent,
    private excelService: ExcelService,
    private expensesService: ExpensesService
  ) {
    this.excelService = excelService;
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
   }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )

    this.getAllCategory();
    this.getAllExpenses();
  }


  getAllCategory(){
    this.expensesService.getAllCategory().subscribe(
      res => {
        console.log(res)
        this.allCategory = res;
      },
      err => {
        console.log(err)
      }
    )
  }

  getAllExpenses(){
    this.total_expense = 0;
    this.expensesService.getAllExpenses(this.expensesSearchFilter).subscribe(
      res => {
        this.allExpenses = res;
        if(this.allExpenses.length > 0){
          this.noRecord = true;
        }
        else{
            this.noRecord = false;
        }
        this.allExpenses.forEach(e => {
          this.total_expense += e.total_amount;
        })

      },
      err => {
        console.log(err)
      }
    )
  }

  cat(){
    if(this.expenses.category_id == -1){
      document.getElementById(("category").toString()).classList.add('hide');
      this.changeCat = false;
    }
  }

  cancelAddNewCat(){
    document.getElementById(("category").toString()).classList.remove('hide');
    this.changeCat = true;
    this.expenses.category_id = "";
    this.newExpenseCategory = "";
  }

  addNewCat(){
    // console.log(this.newExpenseCategory);

    if(this.newExpenseCategory != null && this.newExpenseCategory != ""){
      let obj = {
        category_name: this.newExpenseCategory
      }

      this.expensesService.addCategory(obj).subscribe(
        res => {
          let obj = {
            type: 'success',
            title: 'Item Added Successfully',
            body: ''
          }
          this.appC.popToast(obj);
          this.cancelAddNewCat();
          this.getAllCategory();
        },
        err => {
          console.log(err)
        }
      )
    }
    else{
      let obj = {
        type: 'error',
        title: 'Enter Item Name',
        body: ''
      }
      this.appC.popToast(obj);
    }
  }

  changeExpenseType(){
    this.expenses.total_amount = "";
    this.expenses.total_quantity = "";
    this.expenses.rate_per_quantity = "";
  }

  calculateTotalAmount(){
    this.expenses.total_amount = 0;
    if(this.expenseFor){
      if(this.expenses.total_quantity != null && this.expenses.total_quantity != "" && this.expenses.rate_per_quantity != null && this.expenses.rate_per_quantity != ""){
          this.expenses.total_amount = this.expenses.rate_per_quantity * this.expenses.total_quantity
        }
        else{
          this.expenses.total_amount = 0;
        }
    }
    else{
      this.expenses.total_amount = 0;
    }
  }

  addExpense(){

    if(this.addDate != undefined && this.addDate != ""){
      this.expenses.added_date = moment(this.addDate).format("YYYY-MM-DD");
    }
    if(this.expenseFor){
      this.expenses.expense_type = 1;
    }
    else{
      this.expenses.expense_type = 0;
    }

    if(this.expenses.category_id != "" && this.expenses.category_id != ""){
      this.expensesService.addExpense(this.expenses).subscribe(
        res => {
          this.expenses = {
            category_id: '',
            expense_type: '',
            total_quantity: '',
            rate_per_quantity: '',
            added_date: '',
            total_amount: ''
          }
          let obj = {
            type: 'success',
            title: 'Expense Added Successfully',
            body: ''
          }
          this.appC.popToast(obj);
          this.addDate = Date.now();
          this.getAllExpenses();
        },
        err => {
          console.log(err)
        }
      )
    }
    else{
      let obj = {
        type: 'error',
        title: 'Choose Item Category',
        body: ''
      }
      this.appC.popToast(obj);
    }


  }

  filterExpenses(){
    console.log(this.filterCategory);

    if(this.filterCategory != null && this.filterCategory != "" && this.filterCategory != "-1"){

      this.expensesSearchFilter = {
        from_date: '',
        to_date: '',
        categoryIds: this.filterCategory
      }

      this.getAllExpenses();

      // if(this.filterDateRange != undefined){
      //   if(this.filterDateRange.length > 0 && this.filterDateRange[0] != null && this.filterDateRange[0] != ""){
      //     this.filteredDate = false;
      //     let from_date = moment(this.filterDateRange[0]).format("DD MMM YYYY");
      //     let to_date = moment(this.filterDateRange[1]).format("DD MMM YYYY");
      //
      //     document.getElementById("filteredDate").innerHTML = from_date+"&nbsp; To &nbsp;"+to_date;
      //
      //
      //   }
      //   else{
      //     this.expensesSearchFilter = {
      //       from_date: '',
      //       to_date: '',
      //       categoryIds: this.filterCategory
      //     }
      // }
      //
      // }
    }
    else{
      this.expensesSearchFilter = {
        from_date: '',
        to_date: '',
        categoryIds: ''
      }

        this.getAllExpenses();
    }


  }

  filteredDateRange(){

    if(this.filterDateRange.length > 0 && this.filterDateRange[0] != null && this.filterDateRange[0] != ""){
      this.filteredDate = false;
      let from_date = moment(this.filterDateRange[0]).format("DD MMM YYYY");
      let to_date = moment(this.filterDateRange[1]).format("DD MMM YYYY");

      document.getElementById("filteredDate").innerHTML = from_date+"&nbsp; To &nbsp;"+to_date;

      if(this.filterCategory != null && this.filterCategory != "" && this.filterCategory != "-1"){
        this.expensesSearchFilter = {
          from_date: moment(this.filterDateRange[0]).format("YYYY-MM-DD"),
          to_date: moment(this.filterDateRange[1]).format("YYYY-MM-DD"),
          categoryIds: this.filterCategory
        }
      }
      else{
        this.expensesSearchFilter = {
          from_date: moment(this.filterDateRange[0]).format("YYYY-MM-DD"),
          to_date: moment(this.filterDateRange[1]).format("YYYY-MM-DD"),
          categoryIds: ''
        }
      }


      this.closeMenu();

      this.getAllExpenses();
    }

  }

  editCurrentExpense(row_no, expense){
    console.log(row_no)
    this.isShow = true;
    this.isEdit = false;

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

    this.editExpense = {
      category_id: expense.category_id,
      expense_type: expense.expense_type,
      total_quantity: expense.total_quantity,
      rate_per_quantity: expense.rate_per_quantity,
      added_date: expense.added_date,
      total_amount: expense.total_amount
    }
  }

  updateRow(expense_id){
    this.editExpense.added_date = moment(this.editDate).format("YYYY-MM-DD");

    this.expensesService.updateExpense(this.editExpense,expense_id).subscribe(
      res => {
        let obj = {
          type: 'success',
          title: 'Expense Updated Successfully',
          body: ''
        }
        this.appC.popToast(obj);
        console.log(res);
        this.getAllExpenses();
      },
      err => {
        console.log(err)
        let obj = {
          type: 'error',
          title: '',
          body: err
        }
        this.appC.popToast(obj);
      }
    )
  }

  cancelRow(row_no) {
    document.getElementById(("table-header").toString()).classList.add('displayComp');
    document.getElementById(("table-header").toString()).classList.remove('editComp');
    document.getElementById(("row" + row_no).toString()).classList.add('displayComp');
    document.getElementById(("row" + row_no).toString()).classList.remove('editComp');
  }

  openCalendar(id) {
    document.getElementById(id).click();
  }

  downloadExpenses(){
    let arr = [];

    this.allExpenses.map(
      (ele: any) => {
      let json = {}
      if(ele.rate_per_quantity == null || ele.rate_per_quantity == ""){
        json = {
          'Category Name': ele.category_name,
          'Quantity': ele.total_quantity,
          'Rate per quantity': 0,
          'Total Amount (Rs.)': ele.total_amount,
          'Added Date': ele.added_date
          }
      }
      else{
        json = {
            'Category Name': ele.category_name,
            'Quantity': ele.total_quantity,
            'Rate per quantity': ele.rate_per_quantity,
            'Total Amount (Rs.)': ele.total_amount,
            'Added Date': ele.added_date
          }
      }

        arr.push(json);
      }
    )

    this.excelService.exportAsExcelFile(
      arr,
      'Expense report'
    )

    this.closeMenu();
  }

  resetSortByDate(){
    document.getElementById("filteredDate").innerHTML = "";
    this.filterDateRange = "";
    this.filteredDate = true;

    this.expensesSearchFilter = {
      from_date: '',
      to_date: '',
      categoryIds: ''
    }

    this.getAllExpenses();
  }

  expenseEditDate(date){
    document.getElementById(("changeDate_"+this.selectedRow).toString()).innerHTML = moment(date).format("DD MMM YYYY");
  }

  addNewDate() {
    document.getElementById("changeDate").innerHTML = moment(this.addDate).format("DD MMM YYYY");
  }

  openMenu(index) {
    document.getElementById('menuList').classList.toggle('hide');
  }
  closeMenu() {
    document.getElementById('menuList').classList.add('hide');
  }
}
