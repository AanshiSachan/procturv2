import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
declare var $;

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
userId:any
searchInput:any
teacherList:any=[]
tempList:any=[]
selectedTeacherId:any
allUserDataList:any=[]
template_name:any;
templateType:any;
template_id:any;
  constructor( private router: Router,
    private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,
    private pdf :ExportToPdfService,
    private excel :ExcelService,private routeParam: ActivatedRoute) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
      this.selectedId = JSON.parse(sessionStorage.getItem('selectedId'));
      
    }
  ngOnInit(): void {
   
    this.getAllUserRol();
  }
  setDeleteData(obj) {
    this.selectedTeacherId = obj.teacher_id;
    this.userId = obj.user_id;
  }
onClickAdd(obj){
  let user_id;
  let teacher_id;
  if(this.selectedId == 0) {
    teacher_id = obj.teacher_id;
    user_id = 0;
  } else {
    teacher_id = 0;
    user_id = obj.user_id;
  }
  this.router.navigateByUrl('/view/payrole/add-manage/' +teacher_id + '/' + user_id);
}
  onclickView(obj){
   // sessionStorage.setItem('id',JSON.stringify(id))
   let user_id;
   let teacher_id;
   if(this.selectedId == 0) {
     teacher_id = obj.teacher_id;
     user_id = 0;
   } else {
     teacher_id = 0;
     user_id = obj.user_id;
   }
    this.router.navigateByUrl('/view/payrole/view-manage-template/'+teacher_id + '/' + user_id)
  }
  onClickEdit(obj){
    let user_id;
   let teacher_id;
   if(this.selectedId == 0) {
     teacher_id = obj.teacher_id;
     user_id = 0;
   } else {
     teacher_id = 0;
     user_id = obj.user_id;
   }  
   this.template_name=obj.templateName
   this.templateType=obj.templateType
   this.template_id =obj.template_id
    console.log("edit obj",this.template_name)
    sessionStorage.setItem('temp_name',this.template_name)
    sessionStorage.setItem('temp_type',this.templateType)
    sessionStorage.setItem('temp_id',this.template_id)

    this.router.navigateByUrl('/view/payrole/edit-manage/' +teacher_id + '/' + user_id);
   }
  
  getAllUserRol(){
    this.auth.showLoader();
    const url = `/api/v1/roleApi/allRoles/${this.jsonFlag.institute_id}`;
this.http.getData(url).subscribe(
  (res:any)=>{
this.teacherList = res;
this.selectedId = res.role_id;
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
    this.tempList = res.result;
    console.log("for update data",this.allUserDataList)
     this.auth.hideLoader()
      }, err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
      }
    
    )
  }
  removeTemplate(){
    let obj ={
      user_id:this.userId,
      teacher_id:this.selectedTeacherId,
      institute_id:this.jsonFlag.institute_id
    }
    this.auth.showLoader();
    let url='/api/v1/payroll/manage/remove'
    this.http.putData(url,obj).subscribe(
      (res :any)=>{
    // this.templateList=res.result.response;
     this.msgToast.showErrorMessage('success', '', "Template Removed  successfully");
     $('#deleteModal').modal('hide');
     this.auth.hideLoader();
     this.getAlluserData()
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
  searchFun(){
    this.allUserDataList=this.tempList 
           if(this.searchInput == undefined || this.searchInput == null){
             this.searchInput ="";
           }else{
             let searchData = this.allUserDataList.filter(item=>Object.keys(item).some(k=>item[k]!=null && item[k].toString().toLowerCase().includes
             (this.searchInput.toLowerCase())));
             this.allUserDataList = searchData
           }
   
   
   }
}
