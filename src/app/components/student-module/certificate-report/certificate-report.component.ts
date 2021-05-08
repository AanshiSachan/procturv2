import { Component, OnInit } from '@angular/core';
import { PostStudentDataService } from '../../..//services/student-services/post-student-data.service';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../services/common-service';
import * as moment from 'moment';

@Component({
  selector: 'app-certificate-report',
  templateUrl: './certificate-report.component.html',
  styleUrls: ['./certificate-report.component.scss']
})
export class CertificateReportComponent implements OnInit {
jsonFlag ={
  institute_id:''
}
reportModel={
  currentDate: moment(new Date()).format('YYYY-MM-DD'),
  certificate_url:'',
  certificate_type:''


}
  constructor(private router: Router,
    private PostStudService: PostStudentDataService,
    private auth: AuthenticatorService,
    private _commService: CommonServiceFactory) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id');
    // this.transferCertificateModel.student_id = sessionStorage.getItem('students_id')
    }
  ngOnInit(): void {
    this.getCertificateReportData();
  }
  reportData:any=[]
  reportSearch:any=[]
  searchInput:any;
  filterCertificates:any=[];
  selectedOption:any

getCertificateReportData(){
  this.auth.showLoader();
  let url='/api/v1/certificate/report/'+this.jsonFlag.institute_id;
  this.PostStudService.stdGetData(url).subscribe(
    (res : any) =>{
      this. reportData = res.result;
      this.reportSearch = res.result;
      this.filterCertificates = res.result;
for(let i=0; i<this.reportData.length;i++){
  this.reportModel.certificate_url = this.reportData[i].certificate_url
}
      console.log("reppppppppppp",this.reportData)
      this.auth.hideLoader();
    },
    err => {
      console.log(err);
    }
    )
}


viewAndPrintPdf(certificate_url){  
 window.open('https://docs.google.com/viewer?url=' + certificate_url);
 // window.open(certificate_url).print();


}

searchItem(){
  this.reportData = this.reportSearch;
  if(this.searchInput == undefined || this.searchInput == null){
    this.searchInput ="";
  }else{
    let searchData = this.reportData.filter(item =>Object.keys(item).some(k =>item[k] != null && item[k].toString().toLowerCase().includes(this.searchInput.toLowerCase()))); 
    this.reportData = searchData;
  }

}
filterTransfer(){

//  let filterData = this.reportData.filter(name=>name.certificate_type === 'Transfer' || name.certificate_type == 'Bonafide' || name.certificate_type == 'Migration' || name.certificate_type == 'Character')
let filterData = this.reportData.filter(name=>name.certificate_type === 'Transfer')

this.reportData = filterData; 
console.log("selected",filterData)
}
filterBonafied(){
  let filterBonafied = this.reportData.filter(name=>name.certificate_type === 'Bonafide')

  this.reportData = filterBonafied;
  console.log("selected bonafied",filterBonafied)
}
characterFilter(){
  let character = this.reportData.filter(names=>names.certificate_type === 'Character')
  console.log("character",character)

  

}
migrationFilter(obj){
  let migrattion = this.reportData.filter(name=>name.certificate_type === 'Migration')
  this.reportData=[]

  this.reportData = migrattion
  console.log("migration",migrattion)
}
}