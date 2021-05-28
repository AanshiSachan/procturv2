import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { Router } from '@angular/router';
import CommonUtils from './../../../utils/commonUtils'
import { AppComponent } from './../../../app.component';



@Component({
  selector: 'app-add-edit-salary',
  templateUrl: './add-edit-salary.component.html',
  styleUrls: ['./add-edit-salary.component.scss']
})
export class AddEditSalaryComponent implements OnInit {
  jsonFlag={
    institute_id:'',
   
  }
  salaryModel={
    salary_type:'M',
    salary_grade:'',
    basic_salary:0,
    overtime_rate:'',
    allowance:'',
    allowance_amount:'',
    deduction:'',
    deduction_amount:0,
    typeA:'A',
    typeD:'D',
    template_id:'',

    gross_salary:0,
    total_deduction:0,
    net_salary:0,
  }

  sectionName='';
  editExpenseId:string;
  isEdit:boolean=false
  salrayDataList:any=[]
  addedListAllownc:any=[]
  addedListDeduct:any=[]
  remove:boolean=false;
  removeAllownce:boolean=false;

  template_allowances_map_dtos:any=[]
  editResponce:any
  constructor( private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,
    private router: Router,
    private toastCtrl: AppComponent,) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
     this.salaryModel.template_id = sessionStorage.getItem('id')
    }

  ngOnInit(): void {

    let currentURL = window.location.href;
    if (currentURL.includes('add-salary')) {
      this.sectionName = 'Add';
    }
    else {
      this.sectionName = 'Edit';
      let splitURL = currentURL.split("/");
      this.editExpenseId = splitURL[splitURL.length - 1];
      this.getEditSaralyData();
    }
      this.getAllSalaryData()

    
  }

  getAllSalaryData(){
    this.auth.showLoader();
    let url = '/api/v1/payroll/template/salary/'+this.jsonFlag.institute_id+'/all'
    this.http.getData(url).subscribe(
      (res :any)=>{
    this.salrayDataList=res.result.response
    this.auth.hideLoader();
    // for(let i =0; i< this.salrayDataList.length;i++){
    //   this.salaryModel.template_id = this.salrayDataList[i].template_id

   // }

      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
      }
    )
    }
    addAllowonceDeduction(type){
      let obj={
        type:type,
        allowance:this.salaryModel.allowance,
        allowance_amount:this.salaryModel.allowance_amount,
       
      }
      // if(this.salaryModel.typeA){
      this.addedListAllownc.push(obj);
      console.log(this.addedListAllownc);
      this.calculateGrossSalary();
      this.salaryModel.allowance = '';
      this.salaryModel.allowance_amount = '';
      // }
    }
    dedutAllown(type){
       let obj2 ={
        type:type,
        deduction:this.salaryModel.deduction,
        deduction_amount:this.salaryModel.deduction_amount,
       }
      //  if(this.salaryModel.typeD){
this.addedListDeduct.push(obj2)
this.calculateDeduction();
console.log("deduction",this.addedListDeduct)
this.salaryModel.deduction ='',
this.salaryModel.deduction_amount=0
//this.template_allowances_map_dtos=this.addedListDeduct + this.addedListAllownc
  // }
}
  createSalary(){
    
    // if(this.sectionName =='Add'){
    if(this.validInput()){
      //this.template_allowances_map_dtos=[]
      for(let i=0; i<this.addedListAllownc.length;i++){
        if(this.salaryModel.typeA){
        let item ={
          type:this.salaryModel.typeA,
          allowance:this.addedListAllownc[i].allowance,
          allowance_amount:this.addedListAllownc[i].allowance_amount   
        }
        this.template_allowances_map_dtos.push(item)
      }
    }
    
      for(let i=0; i<this.addedListDeduct.length;i++){
        if(this.salaryModel.typeD){
        let item2={
          type:this.salaryModel.typeD,
          deduction:this.addedListDeduct[i].deduction,
          deduction_amount:this.addedListDeduct[i].deduction_amount,
        }
this.template_allowances_map_dtos.push(item2)
      }
    }
     
    let obj ={
      institute_id :this.jsonFlag.institute_id,
      salary_type:this.salaryModel.salary_type,
      salary_grade:this.salaryModel.salary_grade,
      basic_salary:this.salaryModel.basic_salary,
      overtime_rate:this.salaryModel.overtime_rate,
      template_allowances_map_dtos: this.template_allowances_map_dtos
      
    }
    
    this.auth.showLoader();
    let url ='/api/v1/payroll/template/salary/create'
    this.http.postData(url,obj).subscribe(
      res=>{
        this.auth.hideLoader()
        this.msgToast.showErrorMessage('success', '', "Salary added successfully");
        this.router.navigate(['/view/payrole/salary-template']);
        this.getAllSalaryData()
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.error[0].errorMessage);
      }
    )
    }
  }
  getEditSaralyData(){
     this.auth.showLoader();
    let url ='/api/v1/payroll/template/salary/'+this.jsonFlag.institute_id+'/'+this.salaryModel.template_id
    this.http.getData(url).subscribe(
      (res :any)=>{
        this.auth.hideLoader();
        this. editResponce = res.result;
        this.salaryModel.basic_salary = this.editResponce.basic_salary
        this.salaryModel.gross_salary = this.editResponce.gross_salary
        this.salaryModel.salary_grade = this.editResponce.salary_grade
        this.salaryModel.salary_type = this.editResponce.salary_type;
        this.salaryModel.total_deduction = this.editResponce.total_deduction;
        this.salaryModel.overtime_rate = this.editResponce.overtime_rate;
        this.salaryModel.deduction_amount = this.editResponce.deduction_amount
        this.salaryModel.net_salary = this.editResponce.net_salary;

    for(let i= 0; i<this.editResponce.template_allowances_map_dtos.length;i++){
      if(this.editResponce.template_allowances_map_dtos[i].type == 'D') {
         let obj ={
          type:this.salaryModel.typeD,
          deduction:this.editResponce.template_allowances_map_dtos[i].deduction,
          deduction_amount:this.editResponce.template_allowances_map_dtos[i].deduction_amount,
         }
           this.addedListDeduct.push(obj)
        } else {
             let obj2={
          type:this.salaryModel.typeA,
         allowance:this.editResponce.template_allowances_map_dtos[i].allowance,
         allowance_amount:this.editResponce.template_allowances_map_dtos[i].allowance_amount,
        
         }
       console.log("edit",this.template_allowances_map_dtos)
       this.addedListAllownc.push(obj2)  
        }
  }
      
  },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
      }
    )
    
  }

updateSalary(){
  // if(this.sectionName == 'Edit'){
     for(let i= 0; i<this.addedListDeduct.length;i++){
      if(this.salaryModel.typeD){
 

      let obj ={
        type:this.salaryModel.typeD,
        deduction:this.addedListDeduct[i].deduction,
        deduction_amount:this.addedListDeduct[i].deduction_amount,
       }
  this.template_allowances_map_dtos.push(obj)
      }}
    for(let i=0; i<this.addedListAllownc.length; i++){
      if(this.salaryModel.typeA){
      let obj2={
        type:this.salaryModel.typeA,
      allowance:this.addedListAllownc[i].allowance,
      allowance_amount:this.addedListAllownc[i].allowance_amount,
       }
  this.template_allowances_map_dtos.push(obj2)
    }}
  let obje ={
    institute_id :this.jsonFlag.institute_id,
    template_id:this.salaryModel.template_id,
    salary_type:this.salaryModel.salary_type,
    salary_grade:this.salaryModel.salary_grade,
    basic_salary:this.salaryModel.basic_salary,
    overtime_rate:this.salaryModel.overtime_rate,
    template_allowances_map_dtos: this.template_allowances_map_dtos
  }

  let url='/api/v1/payroll/template/salary/update'
   this.auth.showLoader();
  this.http.putData(url,obje).subscribe(
      res=>{
        this.auth.hideLoader()
        this.msgToast.showErrorMessage('success', '', "Salary Updated successfully");
        console.log("editeeeeeee",obje.template_allowances_map_dtos)
        this.router.navigate(['/view/payrole/salary-template']);
        this.getAllSalaryData()
        // if (this.sectionName == 'Edit') {
        //   this.updateSalary()
            
        // }
        // else {
        //   this.createSalary();
        // }

      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.message);
      }
    )
    
}

removeList(x){
  this.addedListAllownc.splice(x,1)
  console.log("remove list",this.addedListAllownc)
}
removeListDeduct(b){
  this.addedListDeduct.splice(b,1)
  console.log("dection remove",this.addedListDeduct)

}
reomeEow(){
      this.addedListDeduct.splice()

      console.log("delete",this.addedListDeduct)
  

}

  validInput(){
    if(this.salaryModel.allowance.trim() !="" && this.salaryModel.allowance_amount ==""){
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Allownce_amount');
    return;
  }
  if(this.salaryModel.allowance_amount !="" && this.salaryModel.allowance ==""){
    this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Allownce');
  return;
}
  if(this.salaryModel.overtime_rate.trim() ==""){
    this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Overtime Rate');
  return;
}
if(this.salaryModel.salary_grade.trim() ==""){
  this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Salary');
return;
}
if(this.salaryModel.basic_salary == 0){
  this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Basic Salary');
return;
} 
if(this.salaryModel.deduction_amount !=0 && this.salaryModel.deduction.trim() ==""){
this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Deduction');
return
}
if(this.salaryModel.deduction_amount ==0 && this.salaryModel.deduction !=""){
  this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Deduction Amount');
  return
  }

return true;
}
back(){
  this.router.navigateByUrl("/view/payrole/salary-template")
}
calculateGrossSalary() {
  this.salaryModel.gross_salary = 0;
  this.salaryModel.gross_salary = Number(this.salaryModel.gross_salary) + Number(this.salaryModel.basic_salary);
  this.addedListAllownc.forEach(element => {
    this.salaryModel.gross_salary = Number(this.salaryModel.gross_salary) + Number(element.allowance_amount);
  });
  this.salaryModel.net_salary = Number(this.salaryModel.gross_salary) - Number(this.salaryModel.total_deduction);
}
calculateDeduction(){
   this.salaryModel.deduction_amount = 0;
   this.salaryModel.total_deduction = 0;
   console.log(this.addedListDeduct);
  this.addedListDeduct.forEach(element => {
    console.log('ded_amo',Number(element.deduction_amount))
    this.salaryModel.total_deduction = Number(this.salaryModel.total_deduction) + Number(element.deduction_amount);
  });
  console.log("aded",this.salaryModel.deduction_amount);
  this.salaryModel.net_salary = Number(this.salaryModel.gross_salary) - Number(this.salaryModel.total_deduction);
}
removeRow(d){
  // if(this.addedListAllownc.length){
  //   this.addedListAllownc.splice(d,1)
  // }
}
}