import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $;

@Component({
  selector: 'app-add-edit-manage',
  templateUrl: './add-edit-manage.component.html',
  styleUrls: ['./add-edit-manage.component.scss']
})
export class AddEditManageComponent implements OnInit {
  jsonFlag={
    institute_id:''
  }
  slaryType:any
  template_id:any
  userId:any
  selectedId:any
  sectionName='';

  selectedTeacherId:any
  templateList:any=[];
  constructor( private router: Router,
    private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,
    private pdf :ExportToPdfService,
    private excel :ExcelService,private routeParam: ActivatedRoute) { 
      this.jsonFlag.institute_id=sessionStorage.getItem('institute_id')
     this.selectedTeacherId = sessionStorage.getItem('teacher_id')

    }
  ngOnInit(): void {
    this.routeParam.params.subscribe(params => {
      this.selectedTeacherId = params['teacher_id'];
      this.userId =params['user_id']
      let currentURL = window.location.href;
      if (currentURL.includes('edit-manage')) {
        this.sectionName = 'edit';
        console.log("editName",this.sectionName)

      }else{
        this.sectionName='Add'
      }
     
    });
    console.log("teacher iddd",this.selectedId)
  }
  getAllHourlyData(){
    this.auth.showLoader();
    let url='/api/v1/payroll/template/hourly/'+this.jsonFlag.institute_id+'/all'
    this.http.getData(url).subscribe(
      (res :any)=>{
    this.templateList=res.result.response;
    this.template_id =res.result.response.template_id
    this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
      }
    )
    }
    getAllSalaryData(){
      this.auth.showLoader();
      let url = '/api/v1/payroll/template/salary/'+this.jsonFlag.institute_id+'/all'
      this.http.getData(url).subscribe(
        (res :any)=>{
       this.templateList=res.result.response;
       this.auth.hideLoader();
       
      console.log("salaryyyyyy",this.templateList)
        },
        err => {
          this.auth.hideLoader();
          this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
        }
      )
      }
      assigneTemplateEmployee(){
        let obj={
          template_id:this.template_id,
          user_id:this.userId,
          teacher_id:this.selectedTeacherId,
          institute_id:this.jsonFlag.institute_id

        }
        this.auth.showLoader();
        let url='/api/v1/payroll/manage/add'
        this.http.putData(url,obj).subscribe(
          (res :any)=>{
         this.templateList=res.result.response;
         this.auth.hideLoader();
         this.msgToast.showErrorMessage('success', '', "Template Assigne  successfully");


        console.log("salaryyyyyy",this.templateList)
          },
          err => {
            this.auth.hideLoader();
            this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.message);
            this.router.navigate(['/view/payrole/manage-salary']);

          }
        )

      }
     updateManageTemp(){
      let obj={
        template_id:this.template_id,
        user_id:this.selectedId,
        teacher_id:this.selectedTeacherId,
        institute_id:this.jsonFlag.institute_id

      }
      this.auth.showLoader();
      let url='/api/v1/payroll/manage/add'
      this.http.putData(url,obj).subscribe(
        (res :any)=>{
       this.templateList=res.result.response;
       this.auth.hideLoader();
       this.msgToast.showErrorMessage('success', '', "Template Updated successfully");


      console.log("salaryyyyyy",this.templateList)
        },
        err => {
          this.auth.hideLoader();
          this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.message);
        }
      )

     }
      onselectSalaryDropdown(){
        if(this.slaryType == 'M'){
          this.getAllSalaryData();
        }else{
          this.getAllHourlyData();
        }
      }
}
