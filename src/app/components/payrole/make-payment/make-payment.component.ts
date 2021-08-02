import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {
  jsonFlag={
    institute_id:''
  }
  teacherList:any=[]
  tempList:any=[]
  allUserDataList:any[]=[]
  selectedId:any
  teacher_id:any
  selectedTeacherId:any
  userId:any
  searchInput:any
  constructor( private router: Router,
    private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,
    private pdf :ExportToPdfService,
    private excel :ExcelService,) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
      this.selectedTeacherId = sessionStorage.getItem('teacher_id')
      this.userId = sessionStorage.getItem('user_id')
    }
  ngOnInit(): void {
    this.getAllUserRol()
  }
onclickMakePayment(obj){
  let user_id;
  let teacher_id;
  if(this.selectedId == 0) {
    teacher_id = obj.teacher_id;
    user_id = 0;
  } else {
    teacher_id = 0;
    user_id = obj.user_id;
  }
  let template_id = obj.template_id
  sessionStorage.setItem('template_id',template_id)
this.router.navigateByUrl('/view/payrole/add-salary-payment/' +teacher_id + '/' + user_id)
console.log("dataaa",obj)
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
  if(this.selectedId !=-1){
  this.auth.showLoader();
   let url='/api/v1/payroll/manage/'+this.jsonFlag.institute_id+'/users/'+this.selectedId +'?isForPayment=true';
   this.http.getData(url).subscribe(
     (res:any)=>{
   this.allUserDataList = res.result;
   this.tempList = res.result;
 
   sessionStorage.setItem('selectedId',JSON.stringify(this.selectedId))

   console.log("teacher_id",this.teacher_id)
   this.auth.hideLoader()

   console.log("teacher id",this.allUserDataList)

     }, err => {
       this.auth.hideLoader();
       this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
     }
   
   )
}
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
  this.pdf.exportToPdf(row,column,'Salary_payment')
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
  this.excel.exportAsExcelFile(temp,'Salary_payment')

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
