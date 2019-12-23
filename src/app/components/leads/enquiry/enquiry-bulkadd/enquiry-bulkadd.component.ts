import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../../app.component';
import { Router } from '@angular/router';
import { FetchenquiryService } from '../../../../services/enquiry-services/fetchenquiry.service';
import { PostEnquiryDataService } from '../../../../services/enquiry-services/post-enquiry-data.service';
import { LoginService } from '../../../../services/login-services/login.service';
import { FetchprefilldataService } from '../../../../services/fetchprefilldata.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../../services/common-service';

@Component({
  selector: 'app-enquiry-bulkadd',
  templateUrl: './enquiry-bulkadd.component.html',
  styleUrls: ['./enquiry-bulkadd.component.scss']
})
export class EnquiryBulkaddComponent implements OnInit {

  isCancelUpload: boolean = false;
  isUploadingXls: boolean = false;
  progress: number = 0;
  fileLoading: string = "";
  isBulkUploadStatus: boolean = false;
  bulkUploadRecords: any;

  constructor(
    private fetchData: FetchenquiryService, 
    private postData: PostEnquiryDataService,
    private appC: AppComponent, 
    private router: Router, 
    private prefill: FetchprefilldataService, 
    private login: LoginService, 
    private auth: AuthenticatorService,
    private _commService: CommonServiceFactory
    ) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.fetchBulkUploadStatusData();
  }


  /* base64 data to be converted to xls file */
  downloadTemplate() {
    this.fetchData.fetchDownloadTemplate().subscribe(
      (res: any) => {

        let byteArr = this._commService.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('template_link');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        dwldLink.click();
      },
      err => {

      })
  }



  /* update xhr header for uploading formdata */
  updateXlsHeaders(ev) {
    ev.xhr.setRequestHeader("processData", "false");
    ev.xhr.setRequestHeader("contentType", "false");
    ev.xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    ev.xhr.setRequestHeader("enctype", "multipart/form-data");
    ev.xhr.setRequestHeader("Authorization", sessionStorage.getItem("Authorization"));
  }

  /* function to upload the xls file as formdata */
  uploadHandler(event) {
    for (let file of event.files) {

      let formdata = new FormData();
      formdata.append("file", file);
      let base = this.auth.getBaseUrl();
      let urlPostXlsDocument = base + "/api/v2/enquiry_manager/bulkUploadEnquiries";
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open("POST", urlPostXlsDocument, true);
      xhr.setRequestHeader("processData", "false");
      xhr.setRequestHeader("contentType", "false");
      xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
      xhr.setRequestHeader("enctype", "multipart/form-data");
      let auths: any = {
        userid: sessionStorage.getItem('userid'),
        userType: sessionStorage.getItem('userType'),
        password: sessionStorage.getItem('password'),
        institution_id: sessionStorage.getItem('institute_id'),
      }
      let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);
      xhr.setRequestHeader("Authorization", Authorization);
      this.isUploadingXls = true;
      xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
        if (e.lengthComputable) {
          this.progress = Math.round((e.loaded * 100) / e.total);
          document.getElementById('progress-width').style.width = this.progress + '%';
          this.fileLoading = file.name;
        }
      }, false);
      //Call function when onload.
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          this.progress = 0;
          if (xhr.status >= 200 && xhr.status < 300) {
            this.isUploadingXls = false;
            let data = {
              type: 'success',
              title: "File uploaded",
              body: xhr.response.fileName
            }
            this.appC.popToast(data);
            this.fetchBulkUploadStatusData();
          } else {
            this.isUploadingXls = false;
            let data = {
              type: 'error',
              title: "File uploaded Failed",
              body: xhr.response.fileName
            }
            this.appC.popToast(data);

          }
        }
      }
      xhr.send(formdata);
    }
    event.files = [];
  }


  /* fetch the status of the data updated to server */
  fetchBulkUploadStatusData() {
    return this.prefill.fetchBulkUpdateStatusReport().subscribe(
      res => {
        this.bulkUploadRecords = res;
      }
    )
  }

  /* toggle visibility of tabular displayy of bulk data upload */
  bulkStatusReporter() {
    this.fetchBulkUploadStatusData();
    this.isBulkUploadStatus = true;
  }

  /* toggle visibility of tabular displayy of bulk data upload */
  closeBulkStatus() {
    this.isBulkUploadStatus = false;
  }


  /* download the xls status report for a particular file uploaded */
  downloadBulkStatusReport(el) {

    let fileId: string = el.list_id.toString();
    let dwldLink = document.getElementById(fileId);
    this.fetchData.fetchBulkReport(el.list_id).subscribe(
      (res: any) => {
        let byteArr = this._commService.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        if (dwldLink.getAttribute('href') == "" || dwldLink.getAttribute('href') == null) {
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", fileName);
          dwldLink.click();
        }
      },
      err => {
        let obj = {
          type: "error",
          title: "error downloading file",
          body: ""
        }
        this.appC.popToast(obj);
      }
    )
  }

}
