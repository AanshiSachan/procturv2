import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    basic_salary:'',
    overtime_rate:'',
    allowance:'',
    allowance_amount:'',
    deduction:'',
    deduction_amount:'',
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
    private toastCtrl: AppComponent,private routeParam: ActivatedRoute) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
     //this.salaryModel.template_id = sessionStorage.getItem('id')
    }

  ngOnInit(): void {
    this.routeParam.params.subscribe(params => {
      this.salaryModel.template_id = params['id'];

    });
    if(this.salaryModel.template_id){
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
  

      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
      }
    )
    }
    addAllowonceDeduction(type){
      if(this.salaryModel.allowance.trim() !=""){
        if(this.salaryModel.allowance_amount.trim() !=""){

      
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
    }else{
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Allownce_amount');
    }
    }else{
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Allownce');

    }
    }
  
    dedutAllown(type){
      if(this.salaryModel.deduction !=''){
        if(this.salaryModel.deduction_amount !=''){


       let obj2 ={
        type:type,
        deduction:this.salaryModel.deduction,
        deduction_amount:this.salaryModel.deduction_amount,
       }
this.addedListDeduct.push(obj2)
this.calculateDeduction();
console.log("deduction",this.addedListDeduct)
this.salaryModel.deduction ='',
this.salaryModel.deduction_amount=''
}else{
  this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Deduction Amount');

}
}else{
  this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Deduction');

}
}
  createSalary(){
    
    if(this.validInput()){
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
       

      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.error[0].errorMessage);
      }
    )
    
}

removeList(x){
  this.addedListAllownc.splice(x,1)
  this.calculateGrossSalary()
}
removeListDeduct(b){
  this.addedListDeduct.splice(b,1)
  this.calculateDeduction()

}


  validInput(){
   
  if(this.salaryModel.overtime_rate.trim() ==""){
    this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Overtime Rate');
  return;
}
if(this.salaryModel.salary_grade.trim() ==""){
  this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Salary');
return;
}
if(this.salaryModel.basic_salary.trim() == ''){
  this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Basic Salary');
return;
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
   this.salaryModel.deduction_amount = '';
   this.salaryModel.total_deduction = 0;
  this.addedListDeduct.forEach(element => {
    this.salaryModel.total_deduction = Number(this.salaryModel.total_deduction) + Number(element.deduction_amount);

  });
  this.salaryModel.net_salary = Number(this.salaryModel.gross_salary) - Number(this.salaryModel.total_deduction);
}

}