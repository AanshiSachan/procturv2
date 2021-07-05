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
startDate:any;
endDate:any;
dateFilterRange:any
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
  let url='/api/v1/certificate/report/'+this.jsonFlag.institute_id+'?fromDate='+this.startDate+'&toDate='+this.endDate;
  
  this.PostStudService.stdGetData(url).subscribe(
    (res : any) =>{
      this. reportData = res.result;
      this.reportSearch = res.result;

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
filterTransfer(obj){

let filterData = this.reportSearch.filter(name=>name.certificate_type === obj)

this.reportData = filterData; 
console.log("selected",filterData)
}
dateRangeChange(e) {
  this.startDate = moment(e[0]).format("YYYY-MM-DD");
  this.endDate = moment(e[1]).format("YYYY-MM-DD");
  this.getCertificateReportData()
}
}