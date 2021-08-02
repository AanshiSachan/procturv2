import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { PostStudentDataService } from '../../..//services/student-services/post-student-data.service';
import { CommonServiceFactory } from '../../../services/common-service';
import { Location } from '@angular/common'
import { MessageShowService } from '../../../services/message-show.service';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import * as moment from 'moment';


@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss'],

})
export class CertificatesComponent implements OnInit {

  
  today= moment((new Date)).format('YYYY-MM-DD');

jsonFlag={
  institute_id:''
}
transferCertificateModel={
  dateOfBirth:'',
  student_name:'',
  father_name:'',
  doj: '',
  whetherBelongsTo:'',
  studentLast_class:'',
  student_id:'',
  student_administration_number:'',
  mother_name:'',
  last_studied_class:'',
  nationality:'',
  last_school_dues_paid_month:'',
  last_date:  moment(new Date()).format("YYYY-MM-DD"),
  last_annual_exam_result:'',
  certificate_issue_date: moment(new Date()).format("DD-MM-YYYY"),
  total_present_days:'',
  total_working_days:'',
  reasonLeaveSchool:'',
  genCharacter:'',
  whetherNcc:'',
  feeConcession:'',
  failedClass:'',
  belongsTo:'',
  promotionToClass:'',
  subject_names:'',
  application_date:'',
  remark:'',
  awsDownloadLink:'',
  institute_name:'',
  institute_logo_url:'',
  inst_phone:'',
    inst_email:'',
    inst_address:''
  


}

studentTransferData:any=[]
  constructor(private router: Router,
    private PostStudService: PostStudentDataService,
    private auth: AuthenticatorService,
    private _commService: CommonServiceFactory,
    private msgService:MessageShowService,
    private location: Location) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id');
    this.transferCertificateModel.student_id = sessionStorage.getItem('student_id')
    }

transfer :boolean=false
transferCertificates:boolean=true

  ngOnInit(): void {
  this.getTransferData();
  }
 
transferCertificate(){
  this.transferCertificates = false
  this.transfer=true;
}

getTransferData(){
this.auth.showLoader();
let url = '/api/v1/certificate/transferDetails/'+this.jsonFlag.institute_id+'/'+this.transferCertificateModel.student_id;
this.PostStudService.stdGetData(url).subscribe(
  (res:any) =>{
    let response = res;
    this.studentTransferData = res.result;
    this.transferCertificateModel = this.studentTransferData
      this.transferCertificateModel.student_name=this.studentTransferData.student_name;
      this.transferCertificateModel.father_name= this.studentTransferData.father_name 
      this.transferCertificateModel.dateOfBirth=this.studentTransferData.dob;
      this.transferCertificateModel.doj=this.studentTransferData.doj;
      this.transferCertificateModel.student_administration_number=this.studentTransferData.student_administration_number
      this.transferCertificateModel.mother_name=this.studentTransferData.mother_name
      this.transferCertificateModel.last_studied_class = this.studentTransferData.last_studied_class
      this.transferCertificateModel.nationality=this.studentTransferData.nationality
      this.transferCertificateModel.last_school_dues_paid_month=this.studentTransferData.last_school_dues_paid_month
      this.transferCertificateModel.last_date=this.studentTransferData.last_date
      this.transferCertificateModel.last_annual_exam_result= this.studentTransferData.last_annual_exam_result
      this.transferCertificateModel.certificate_issue_date=this.studentTransferData.certificate_issue_date
      
      this.transferCertificateModel.total_present_days = this.studentTransferData.total_present_days 
      this.transferCertificateModel.total_working_days = this.studentTransferData.total_working_days

    if(this.transferCertificateModel.last_date == null){
      this. transferCertificateModel.last_date = this.today
      console.log("datedddd",this.today)
    }else{
      this.transferCertificateModel.last_date
    }
    if(this.transferCertificateModel.doj == null){
       this.transferCertificateModel.doj = this.today
    }else{
      this.transferCertificateModel.doj
    }
    console.log("transfer",this.studentTransferData)
    this.auth.hideLoader();

    //}


},
err => {
  console.log(err);
}
)
}
generateTransferCertificates(){
  this.transferCertificates = false
  this.transfer=true;
  let obj={
    institute_id : this.jsonFlag.institute_id,
    student_id :this.transferCertificateModel.student_id,
    student_name : this.transferCertificateModel.student_name,
    student_administration_number :this.transferCertificateModel.student_administration_number,
    father_name : this.transferCertificateModel.father_name,
    mother_name : this.transferCertificateModel.mother_name,
    dob : this.transferCertificateModel.dateOfBirth,
    nationality : this.transferCertificateModel.nationality,
    category : this.transferCertificateModel.belongsTo,
    doj : this.transferCertificateModel.doj,
    last_studied_class : this.transferCertificateModel.last_studied_class,
    last_annual_exam_result:this.transferCertificateModel.last_annual_exam_result,
    exam_failure_times : this .transferCertificateModel.failedClass,
    subject_names : this.transferCertificateModel.subject_names,
    promotion_class :this.transferCertificateModel.promotionToClass,
    last_school_dues_paid_month : this.transferCertificateModel.last_school_dues_paid_month,
    nature_of_concession:this.transferCertificateModel.feeConcession,
    total_working_days :this.transferCertificateModel.total_working_days,
    total_present_days:this.transferCertificateModel.total_present_days,
    ncc_cadet_scout_guide_detail:this.transferCertificateModel.whetherNcc,
    general_character:this.transferCertificateModel.genCharacter,
    last_date :this.transferCertificateModel.last_date,
    application_date:this.transferCertificateModel.application_date,
    issue_date :this.transferCertificateModel.certificate_issue_date,
    leaving_reason:this.transferCertificateModel.reasonLeaveSchool,
    remark:this.transferCertificateModel.remark

  }
  this.auth.showLoader();
  let url ='/api/v1/certificate/transfer';
  this.PostStudService.stdPostData(url,obj).subscribe(
    (res:any) =>{
      let resp =res.result;
      console.log("transfer",resp)
      this.auth.hideLoader();  
  },
  err => {
    console.log(err);
    this.auth.hideLoader();
  }
)

}

downloadTransferCertificates(){
let obj ={
    institute_id : this.jsonFlag.institute_id,
    student_id :this.transferCertificateModel.student_id,
    student_name : this.transferCertificateModel.student_name,
    student_administration_number :this.transferCertificateModel.student_administration_number,
    father_name : this.transferCertificateModel.father_name,
    mother_name : this.transferCertificateModel.mother_name,
    dob : this.transferCertificateModel.dateOfBirth,
    nationality : this.transferCertificateModel.nationality,
    category : this.transferCertificateModel.belongsTo,
    doj : this.transferCertificateModel.doj,
    last_studied_class : this.transferCertificateModel.last_studied_class,
    last_annual_exam_result:this.transferCertificateModel.last_annual_exam_result,
    exam_failure_times : this .transferCertificateModel.failedClass,
    subject_names : this.transferCertificateModel.subject_names,
    promotion_class :this.transferCertificateModel.promotionToClass,
    last_school_dues_paid_month : this.transferCertificateModel.last_school_dues_paid_month,
    nature_of_concession:this.transferCertificateModel.feeConcession,
    total_working_days :this.transferCertificateModel.total_working_days,
    total_present_days:this.transferCertificateModel.total_present_days,
    ncc_cadet_scout_guide_detail:this.transferCertificateModel.whetherNcc,
    general_character:this.transferCertificateModel.genCharacter,
    last_date :this.transferCertificateModel.last_date,
    application_date:this.transferCertificateModel.application_date,
    issue_date :this.transferCertificateModel.certificate_issue_date,
    leaving_reason:this.transferCertificateModel.reasonLeaveSchool,
    remark:this.transferCertificateModel.remark  
}
  this.auth.showLoader();
  let url ='/api/v1/certificate/transfer';
  this.PostStudService.stdPostData(url,obj).subscribe(
    (res:any) =>{
      let resp =res.result;
      this.transferCertificateModel.awsDownloadLink = resp.awsDownloadLink
      console.log("transfer generated",resp)     
       console.log("transfe url",this.transferCertificateModel.awsDownloadLink)



this.auth.hideLoader();
      if(res){
          if(resp.document != "" ){
          let docArry = this._commService.convertBase64ToArray(resp.document);
          let fileName = resp.docTitle;//response.docTitle
          let file = new Blob([docArry], { type: 'application/pdf;' });
          let urlcert =URL .createObjectURL(file);
          let downloadLink = document.getElementById('downloadFileClick1');
          downloadLink.setAttribute("href",urlcert);
          downloadLink.setAttribute("download",fileName);
          document.body.appendChild(downloadLink);
          downloadLink.click();
        }
        else {
          this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
        }
      } else {
        this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
      }
    },
    err => {
      console.log(err);
      this.auth.hideLoader();
    }
  )

}

previewCertificate(){
  let obj ={
    institute_id : this.jsonFlag.institute_id,
    student_id :this.transferCertificateModel.student_id,
    student_name : this.transferCertificateModel.student_name,
    student_administration_number :this.transferCertificateModel.student_administration_number,
    father_name : this.transferCertificateModel.father_name,
    mother_name : this.transferCertificateModel.mother_name,
    dob : moment(this.transferCertificateModel.dateOfBirth).format("YYYY-MM-DD"),
    nationality : this.transferCertificateModel.nationality,
    category : this.transferCertificateModel.belongsTo,
    doj : moment(this.transferCertificateModel.doj).format("YYYY-MM-DD"),
    last_studied_class : this.transferCertificateModel.last_studied_class,
    last_annual_exam_result:this.transferCertificateModel.last_annual_exam_result,
    exam_failure_times : this .transferCertificateModel.failedClass,
    subject_names : this.transferCertificateModel.subject_names,
    promotion_class :this.transferCertificateModel.promotionToClass,
    last_school_dues_paid_month : this.transferCertificateModel.last_school_dues_paid_month,
    nature_of_concession:this.transferCertificateModel.feeConcession,
    total_working_days :this.transferCertificateModel.total_working_days,
    total_present_days:this.transferCertificateModel.total_present_days,
    ncc_cadet_scout_guide_detail:this.transferCertificateModel.whetherNcc,
    general_character:this.transferCertificateModel.genCharacter,
    last_date : moment(this.transferCertificateModel.last_date).format("YYYY-MM-DD"),
    //application_date:this.transferCertificateModel.application_date,
    issue_date :this.transferCertificateModel.certificate_issue_date,
    leaving_reason:this.transferCertificateModel.reasonLeaveSchool,
    remark:this.transferCertificateModel.remark  
}
  this.auth.showLoader();
  let url ='/api/v1/certificate/transfer';
  this.PostStudService.stdPostData(url,obj).subscribe(
    (res:any) =>{
      let resp =res.result;
      this.transferCertificateModel.awsDownloadLink = resp.awsDownloadLink
      this.auth.hideLoader();
window.open('https://docs.google.com/viewer?url=' +this.transferCertificateModel.awsDownloadLink);
console.log("preview",obj.doj)

},
err => {
  console.log(err);
  this.auth.hideLoader();
}
)

} 

downloadTransferPdf(){
  var data = document.getElementById('transferCertificate');  
  html2canvas(data).then(canvas => {  
    var imgWidth = 208;   
    var pageHeight = 295;    
    var imgHeight = canvas.height * imgWidth / canvas.width;  
    var heightLeft = imgHeight;  

    const contentDataURL = canvas.toDataURL('image/png')  
    let pdf = new jsPDF('p', 'mm', 'a4'); 
    var position = 0;  
    pdf.addImage(contentDataURL,'PNG', 0, position, imgWidth, imgHeight)  
    pdf.save('transferCertificates.pdf');  


  });
}
printTransfer(conductCertificate2){
  const printContents = document.getElementById('transferCertificate').innerHTML;
  const originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
  //  document.body.innerHTML=restorePage; 
}


Back(){
this.router.navigateByUrl('/view/students')
}
cloaseCertificate(){
  this.transfer = false;
  this.transferCertificates = true;
}
onfuturDateSelection(){
let today= moment(new Date);
 let selectedDate = moment(this.transferCertificateModel.dateOfBirth)
 let diff = moment(selectedDate.diff(today))['_i'];
 if(diff > 0){
  this.msgService.showErrorMessage('info', '', "Future date is not allowed");
  this.transferCertificateModel.dateOfBirth = moment(new Date).format('YYYY-MM-DD')
  console.log("daterrrrrrrr",this.transferCertificateModel.dateOfBirth)
}
}
onAddmithinDate(){
  let today= moment(new Date);
 let selectedDate = moment(this.transferCertificateModel.doj)
 let diff = moment(selectedDate.diff(today))['_i'];
  if(diff > 0){
  this.msgService.showErrorMessage('info', '', "Future date is not allowed");
  this.transferCertificateModel.last_date = moment(new Date).format('YYYY-MM-DD')
}}
onLastDate(){
  let today= moment(new Date);
  let selectedDate = moment(this.transferCertificateModel.last_date)
  let diff = moment(selectedDate.diff(today))['_i'];
  if(diff > 0){
   this.msgService.showErrorMessage('info', '', "Future date is not allowed");
   this.transferCertificateModel.last_date = moment(new Date).format('YYYY-MM-DD')
 }
}
}
