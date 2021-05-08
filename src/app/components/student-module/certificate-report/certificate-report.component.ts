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
  certificate_url:''


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
downloadCertificates(){
  let docArry = this._commService.convertBase64ToArray(this.reportModel.certificate_url);
  let fileName = 'certificate.pdf';//response.docTitle
  let file = new Blob([docArry], { type: 'application/pdf;' });
  let urlcert =URL .createObjectURL(file);
  let downloadLink = document.getElementById('downloadFileClick1');
  downloadLink.setAttribute("href",urlcert);
  downloadLink.setAttribute("download",fileName);
  document.body.appendChild(downloadLink);
  downloadLink.click();

console.log("downloded")

// else {
//   this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
// }
// } else {
// this._commService.showErrorMessage('info', 'Info', "Document does not have any data.");
// }

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
filterCertificate(string:any){
  this.reportData =this.reportData.filter(element =>element.certificate_type.trim().toLocaleLowerCase().charAt(0) === string); 


}
}
