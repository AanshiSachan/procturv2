import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-add-edit-hourly',
  templateUrl: './add-edit-hourly.component.html',
  styleUrls: ['./add-edit-hourly.component.scss']
})
export class AddEditHourlyComponent implements OnInit {
  jsonFlag={
    institute_id:''
  }
  hourlyModel={
    salary_type:'H',
    hourly_grade:'',
    hourly_rate:'',
    template_id:''
  }
  selectedId:any

  editHourlyResponse:any
  sectionName:any;
  constructor( private router: Router,
    private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,
    private pdf :ExportToPdfService,
    private excel :ExcelService, private routeParam: ActivatedRoute) { 
      this.jsonFlag.institute_id=sessionStorage.getItem('institute_id');
      this.hourlyModel.template_id = sessionStorage.getItem('id')
    }
  ngOnInit(): void {
    this.routeParam.params.subscribe(params => {
      this.selectedId = params['id'];
    });
    console.log(this.selectedId);
    // this.getEditResponse();
    if (this.selectedId) {
      this.getEditResponse();
    
    }
    
  }
createHourly(){
  if(this.validInput()){
  let obj={
    institute_id:this.jsonFlag.institute_id,
    salary_type:this.hourlyModel.salary_type,
    hourly_grade:this.hourlyModel.hourly_grade,
    hourly_rate:this.hourlyModel.hourly_rate
  }
  this.auth.showLoader();
  let url='/api/v1/payroll/template/hourly/create'
  this.http.postData(url,obj).subscribe(
    res=>{
      this.auth.hideLoader()
      this.msgToast.showErrorMessage('success', '', "Hourly added successfully");
      this.router.navigate(['/view/payrole/hourly-template']);
     // this.getAllSalaryData()
    },
    err => {
      this.auth.hideLoader();
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.error[0].errorMessage);
    }
  )
  }
  }
  getEditResponse(){
    this.auth.showLoader();
    let url ='/api/v1/payroll/template/hourly/'+this.jsonFlag.institute_id+'/'+this.selectedId
  this.http.getData(url).subscribe(
    (res :any)=>{
      this.auth.hideLoader()
      this.editHourlyResponse = res.result;
      this.hourlyModel.hourly_grade = this.editHourlyResponse.hourly_grade;
      this.hourlyModel.hourly_rate = this.editHourlyResponse.hourly_rate;

      console.log("edit",this.editHourlyResponse)
    },
    err => {
      this.auth.hideLoader();
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
    }
  )
  }
  updateHourly(){
    let obj ={
      template_id:this.selectedId,
      institute_id:this.jsonFlag.institute_id,
      salary_type:this.hourlyModel.salary_type,
      hourly_grade:this.hourlyModel.hourly_grade,
      hourly_rate:this.hourlyModel.hourly_rate
    }
    this.auth.showLoader();
    let url ='/api/v1/payroll/template/hourly/update'
  this.http.putData(url,obj).subscribe(
    (res :any)=>{
      this.auth.hideLoader()
      this.msgToast.showErrorMessage('success', '', "Hourly updated successfully");
      this.router.navigate(['/view/payrole/hourly-template']);  
     
    },
    err => {
      this.auth.hideLoader();
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.error[0].errorMessage);

      }
  )
  }
  
  validInput(){
    if(this.hourlyModel.hourly_grade.trim() ==""){
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Hourly Grade');
    return
  }
  if(this.hourlyModel.hourly_rate.trim() ==""){
    this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Hourly Rate');
  return
}
  
return true
}

}
