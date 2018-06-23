import { Component, OnInit } from '@angular/core';
import { PostStudentDataService } from '../../../services/student-services/post-student-data.service';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Base64 } from 'js-base64';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-student-bulk',
  templateUrl: './student-bulk.component.html',
  styleUrls: ['./student-bulk.component.scss']
})
export class StudentBulkComponent implements OnInit {
  isCancelUpload: boolean = false;
  isUploadingXls: boolean = false;
  isRippleLoad: boolean = false;
  progress: number = 0;
  fileLoading: string = "";
  isBulkUploadStatus: boolean = false;
  bulkUploadRecords: any[] = [];
  studentUploadForm: any;

  constructor(private fetchData: FetchStudentService, private postData: PostStudentDataService,
    private appC: AppComponent, private router: Router, private auth: AuthenticatorService) {
    if (sessionStorage.getItem('userid') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.fetchBulkUploadStatusData();
  }


  /* base64 data to be converted to xls file */
  downloadTemplate() {
    this.isRippleLoad = true;
    this.fetchData.fetchDownloadTemplate().subscribe(
      res => {
        let byteArr = this.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('template_link');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        dwldLink.click();
        this.isRippleLoad = false;
      },
      err => {
        this.isRippleLoad = false;
        let msg = {
          type: "error",
          title: "",
          body: "An Error Occured"
        }
        this.appC.popToast(msg);
      }
    )
  }


  /* convert base64 string to byte array */
  convertBase64ToArray(val) {

    var binary_string = window.atob(val);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;

  }



  /* function to upload the xls file as formdata */
  uploadHandler(event) {

    for (let file of event.files) {
      //console.log(file);
      if (
        file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type == 'application/vnd.ms-excel' ||
        file.type == 'text/csv' ||
        file.type == 'application/xls' ||
        file.type == 'application/excel' ||
        file.type == 'application/msexcel' ||
        file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type == 'application/x-excel'
      ) {
        let fileString: string = '';
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          fileString = reader.result.split(',')[1];
          this.uploader(fileString);
        }
        reader.onerror = function (error) {
        }
      }
      else {
        let msg = {
          type: 'error',
          title: 'Invalid File Selected',
          body: 'Please provide a valid excel document'
        }
        this.appC.popToast(msg);
      }
    }
  }


  uploadXLS(inp: string) {
    let obj = {
      file: inp,
      file_extn: "xls",
      comments: "",
      institute_id: sessionStorage.getItem('institute_id')
    }
    this.isRippleLoad = true;
    this.postData.uploadStudentBulk(obj).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Student Details Uploaded',
          body: 'The selected file(s) have been uploaded, and will be updated shortly'
        }
        this.appC.popToast(msg);
        this.isRippleLoad = false;
      },
      err => {
        let msg = {
          type: 'error',
          title: 'Failed To Upload Student(s)',
          body: err.message
        }
        this.appC.popToast(msg);
        this.isRippleLoad = false;
      }
    )

  }

  /* function to upload the xls file as formdata */
  uploader(inp: string) {

    let obj = {
      file: inp,
      file_extn: "xls",
      comments: "",
      institute_id: sessionStorage.getItem('institute_id')
    }
    let base = this.auth.getBaseUrl();
    let urlPostXlsDocument = base + "/api/v1/students/studentBulkUploadV2";

    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("POST", urlPostXlsDocument, true);

    xhr.setRequestHeader("Content-Type", "application/json");
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
        this.fileLoading = "Student Data Upload";
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
    xhr.send(JSON.stringify(obj));
  }


  /* fetch the status of the data updated to server */
  fetchBulkUploadStatusData() {
    this.isRippleLoad = true;
    this.fetchData.fetchBulkUpdateStatusReport().subscribe(
      (res: any) => {
        this.isRippleLoad = false;
        this.bulkUploadRecords = res;
      },
      err =>{
        this.isRippleLoad = false;
      }
    )
  }

  /* toggle visibility of tabular displayy of bulk data upload */
  bulkStatusReporter() {
    this.isBulkUploadStatus = true;
  }

  /* toggle visibility of tabular displayy of bulk data upload */
  closeBulkStatus() {
    this.isBulkUploadStatus = false;
  }

  /* download the xls status report for a particular file uploaded */
  downloadSuccess(el) {
    this.isRippleLoad = true;
    this.fetchData.fetchSuccess(el.list_id).subscribe(
      res => {
        let byteArr = this.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let fileId: string = el.list_id.toString();
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('success' + fileId);
        if (dwldLink.getAttribute('href') == null || dwldLink.getAttribute('href') == undefined || dwldLink.getAttribute('href') == '') {
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", fileName);
          dwldLink.click();
          dwldLink.setAttribute("href", null);
          dwldLink.setAttribute("download", '');
        }
        this.isRippleLoad = false;
      },
      err => { 
        this.isRippleLoad = false;
      }
    )
  }

  downloadFailure(el) {
    this.isRippleLoad = true;
    this.fetchData.fetchFailure(el.list_id).subscribe(
      res => {
        let byteArr = this.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let fileId: string = el.list_id.toString();
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('failure' + fileId);
        if (dwldLink.getAttribute('href') == null || dwldLink.getAttribute('href') == undefined || dwldLink.getAttribute('href') == '') {
          dwldLink.setAttribute("href", url);
          dwldLink.setAttribute("download", fileName);
          dwldLink.click();
          dwldLink.setAttribute("href", null);
          dwldLink.setAttribute("download", '');
        }
        this.isRippleLoad = false;
      },
      err => { 
        this.isRippleLoad = false;
      }
    )
  }

}
