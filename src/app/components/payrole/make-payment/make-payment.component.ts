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
  allUserDataList:any[]
  selectedId:any
  teacher_id:any
  selectedTeacherId:any
  userId:any
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
this.router.navigateByUrl('/view/payrole/add-salary-payment/' +teacher_id + '/' + user_id)
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
   for(let i=0; i<this.allUserDataList.length;i++){
      this.teacher_id = this.allUserDataList[i].teacher_id 

   }
  // sessionStorage.setItem('teacher_id',JSON.stringify(this.teacher_id))
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
