import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'app-manage-salary',
  templateUrl: './manage-salary.component.html',
  styleUrls: ['./manage-salary.component.scss']
})
export class ManageSalaryComponent implements OnInit {
jsonFlag={
  institute_id:'',
  role_id:''
}

//is_template_assigned:boolean=false
selectedId:any
teacher_id:any
teacherList:any=[]
allUserDataList:any=[]
  constructor( private router: Router,
    private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,
    private pdf :ExportToPdfService,
    private excel :ExcelService,) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
    }
  ngOnInit(): void {
    this.getAllUserRol();
  }
onClickAdd(){
  this.router.navigateByUrl('/view/payrole/add-manage')
}
  onclickView(id){
    sessionStorage.setItem('id',JSON.stringify(id))
    console.log("user id",id)

    this.router.navigateByUrl('/view/payrole/view-manage-template/'+id)
  }
  onClickEdit(id){
    this.router.navigateByUrl('/view/payrole/edit-manage/' +id);
  
  }
  
  getAllUserRol(){
    this.auth.showLoader();
    const url = `/api/v1/roleApi/allRoles/${this.jsonFlag.institute_id}`;
this.http.getData(url).subscribe(
  (res:any)=>{
this.teacherList = res;
this.selectedId = res.role_id


this.auth.hideLoader();
console.log("teacherlisttttttt",this.teacherList)
  },
   err => {
    this.auth.hideLoader();
    this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
  }

)
  }
  getAlluserData(){
   this.auth.showLoader();
    let url='/api/v1/payroll/manage/'+this.jsonFlag.institute_id+'/users/'+this.selectedId;
    this.http.getData(url).subscribe(
      (res:any)=>{
    this.allUserDataList = res.result;
    for(let i=0; i<this.allUserDataList.length;i++){
       this.teacher_id = this.allUserDataList[i].teacher_id 

    }
    sessionStorage.setItem('teacher_id',JSON.stringify(this.teacher_id))
    console.log("idddddddd",this.teacher_id)
    this.auth.hideLoader()

    console.log("teacher id",this.allUserDataList)

      }, err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
      }
    
    )
  }
  removeTemplate(){
    let obj ={
      user_id:this.selectedId,
      teacher_id:this.teacher_id,
      institute_id:this.jsonFlag.institute_id
    }
    this.auth.showLoader();
    let url='/api/v1/payroll/manage/remove'
    this.http.putData(url,obj).subscribe(
      (res :any)=>{
    // this.templateList=res.result.response;
     this.auth.hideLoader();
     this.msgToast.showErrorMessage('success', '', "Template Removed  successfully");
this.getAlluserData()
    //console.log("salaryyyyyy",this.templateList)
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.message);
      }
    )
  }
  downloadPdf(){
    for(let i=0; i<this.allUserDataList.length;i++){
      this.allUserDataList[i].template_id = i+1
    }
    let temp=[]
    this.allUserDataList.map((e:any)=>{
      let obj =[
      e.template_id,
      e.user_name,
      e.user_email,
      e.joining_date,
      ]
      temp.push(obj)
    })
    let row = []
    row = [["#","Name","Email","Joining Date"]]
    let column = temp
    this.pdf.exportToPdf(row,column,'Manage_salary')
  }
  downloaExcel(){
    for(let i=0; i<this.allUserDataList.length;i++){
      this.allUserDataList[i].template_id = i+1
    }
    let temp:any[]=[]
    temp = this.allUserDataList.map(e =>{
      let obj :any ={
        template_id:e.template_id,
        user_name:e.user_name,
        user_email: e.user_email,
        joining_date: e.joining_date,
    }
    return obj
    })
    this.excel.exportAsExcelFile(temp,'Manage_Salary')
  
  }
}
