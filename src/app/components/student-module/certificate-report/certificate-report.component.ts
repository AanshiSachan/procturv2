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
  date:moment().format('DD-MM-YYYY')

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
getCertificateReportData(){
  this.auth.showLoader();
  let url='/api/v1/certificate/report/'+this.jsonFlag.institute_id;
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
searchItem(){
  this.reportData = this.reportSearch;
  if(this.searchInput == undefined || this.searchInput == null){
    this.searchInput ="";
  }else{
    let searchData = this.reportSearch.filter(item =>Object.keys(item).some(k =>item[k]!=null && item[k].toString().toLowerCase().includes(this.searchInput.toLowerCase()))); 
    this.reportSearch = searchData;
  }

}
}
