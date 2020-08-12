import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../../../services/common-service';
import { HttpService } from '../../../../../services/http.service';
import { MessageShowService } from '../../../../../services/message-show.service';
declare var $;

@Component({
  selector: 'app-topic-bulk-upload',
  templateUrl: './topic-bulk-upload.component.html',
  styleUrls: ['./topic-bulk-upload.component.scss']
})
export class TopicBulkUploadComponent implements OnInit {

  progress: number = 0;
  fileLoading: string = "";
  isUploadingXls: boolean = false;


  isProfessional: boolean = false;
  institute_id: any;
  subjectData: any[] = [];
  standardData: any[] = [];
  filterData = {
    standard_id: -1,
    subject_id: -1
  }

  downloadTempData = {
    standard_id: -1,
    subject_id: -1
  }
  templateSubjectData: any[] = [];

  bulkUploadRecords: any[] = [];
  @ViewChild('fileUpload') fileUpload: any;


  constructor(
    private router: Router,
    private _http: HttpService,
    private auth: AuthenticatorService,
    private commonService: CommonServiceFactory,
    private msgService: MessageShowService
  ) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        }
        else {
          this.isProfessional = false;
        }
      })
   }

  ngOnInit() {
    this.getAllStandards();
  }


  // get standard
  getAllStandards() {
    let url = "/api/v1/standards/all/" + this.institute_id + "?active=Y";
    this.auth.showLoader();
    this._http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.standardData = data;
        // console.log(data);
      },
      (error: any) => {
        this.auth.hideLoader();
        console.log(error);
      }
    )
  }

  getAllSubjectListFromServer(standards_id){
    this.subjectData = [];
    this.filterData.subject_id = -1;
    this.auth.showLoader();
    let url = "/api/v1/subjects/standards/" + standards_id + '?active=Y';
    this._http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.subjectData = data;
        console.log(data);
      },
      error => {
        this.auth.hideLoader();
        console.log(error);
      }
    );
  }

  getAllSubjectListForDownloadTemp(standards_id){
    this.templateSubjectData = [];
    this.downloadTempData.subject_id = -1;
    this.auth.showLoader();
    let url = "/api/v1/subjects/standards/" + standards_id + '?active=Y';
    this._http.getData(url).subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.templateSubjectData = data;
        console.log(data);
      },
      error => {
        this.auth.hideLoader();
        console.log(error);
      }
    );
  }

  /* base64 data to be converted to xls file */
  downloadBulkTemplate() {
    if((this.filterData.standard_id!=-1) && (this.filterData.subject_id!=-1)){
    this.auth.showLoader();
    let url = "/api/v1/topic_manager/"+this.filterData.subject_id+'/download-template';
    this._http.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        var result = res.result;
        let byteArr = this.commonService.convertBase64ToArray(result.document);
        let format = result.format;
        let fileName = result.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('template_link');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        dwldLink.click();
        this.downloadTempData.standard_id = -1;
        this.downloadTempData.subject_id = -1;
        $("#downloadTemplate").modal("hide");
      },
      error => {
        this.auth.hideLoader();
        console.log(error);
      }
    );
    }  else {
      if(!this.isProfessional){
        this.msgService.showErrorMessage('error', 'Please Select standard and subject', '');
      } else {
        this.msgService.showErrorMessage('error', 'Please Select Master course and course', '');
      }
    }
  }


  /* fetch the status of the data updated to server */
  fetchBulkUploadStatusData() {
    this.auth.showLoader();
    let obj = {"func_type":"TopicBulkUpload"};
    let url = "/api/v1/bulkUpload/"+this.institute_id;
    this._http.postData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.bulkUploadRecords = res;
        if(this.bulkUploadRecords.length){
          $("#uploadReport").modal("show");
        }
        else{

        }
      },
      err =>{
        this.auth.hideLoader();
      }
    )
  }
  /* download the xls status report for a particular file uploaded */
  downloadSuccess(el) {
    this.auth.showLoader();
    let url = "/api/v1/bulkUpload/"+this.institute_id+"/success/download/"+el.list_id;
    this._http.getData(url).subscribe(
      res => {
        var result:any = res;
        let byteArr = this.commonService.convertBase64ToArray(result.document);
        let format = result.format;
        let fileName = result.docTitle;
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
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    )
  }

  downloadFailure(el) {
    this.auth.showLoader();
    let url = "/api/v1/bulkUpload/"+this.institute_id+"/download/"+el.list_id;
    this._http.getData(url).subscribe(
      res => {
        this.auth.hideLoader();
        var result:any = res;
        let byteArr = this.commonService.convertBase64ToArray(result.document);
        let format = result.format;
        let fileName = result.docTitle;
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
      },
      err => {
        this.auth.hideLoader();
      }
    )
  }


  /* function to upload the xls file as formdata */
  uploadHandler(event, fileUpload) {
    if((this.filterData.standard_id!=-1) && (this.filterData.subject_id!=-1)){
    let formData = new FormData();

    let arr: any = Array.from(event.files)
    arr.map((ele, index) => {
      formData.append("file_" + index, ele);
    })

    let base = this.auth.getBaseUrl();
    let urlPostXlsDocument = base + "/api/v1/topic_manager/bulkUpload";
    let newxhr = new XMLHttpRequest();
    let auths: any = {
      userid: sessionStorage.getItem('userid'),
      userType: sessionStorage.getItem('userType'),
      password: sessionStorage.getItem('password'),
      institution_id: sessionStorage.getItem('institute_id'),
    }
    let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);

    newxhr.open("POST", urlPostXlsDocument, true);
    newxhr.setRequestHeader("Authorization", Authorization);
    newxhr.setRequestHeader("subject_id", this.filterData.subject_id.toString());
    newxhr.setRequestHeader("enctype", "multipart/form-data;");
    newxhr.setRequestHeader("Accept", "application/json, text/javascript");
    newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    this.isUploadingXls = true;

    newxhr.upload.addEventListener('progress', (e: ProgressEvent) => {
      if (e.lengthComputable) {
        this.progress = Math.round((e.loaded * 100) / e.total);
        document.getElementById('progress-width').style.width = this.progress + '%';
        this.fileLoading = "Topic Data Upload";
      }
    }, false);

    newxhr.onreadystatechange = () => {
      if (newxhr.readyState == 4) {
        this.progress = 0;

        if (newxhr.status >= 200 && newxhr.status < 300) {
          this.isUploadingXls = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'File uploaded Successfully', newxhr.response.fileName);
          this.filterData.standard_id = -1;
          this.filterData.subject_id = -1;
          fileUpload.clear(); // this will clear your selected file
        } else {
          this.isUploadingXls = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Unable to upload file', newxhr.response.fileName);
        }
      }
    }
    newxhr.send(formData);
  } else {
    if(!this.isProfessional){
      this.msgService.showErrorMessage('error', 'Please Select standard and subject', '');
    } else {
      this.msgService.showErrorMessage('error', 'Please Select Master course and course', '');
    }
  }

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
    let urlPostXlsDocument = base + "/api/v1/topic_manager/bulkUpload";

    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("POST", urlPostXlsDocument, true);

    xhr.setRequestHeader("Content-Type", "application/json");
    let auths: any = {
      userid: sessionStorage.getItem('userid'),
      userType: sessionStorage.getItem('userType'),
      password: sessionStorage.getItem('password'),
      institution_id: sessionStorage.getItem('institute_id'),
      subject_id: this.filterData.subject_id
    }
    let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);
    xhr.setRequestHeader("Authorization", Authorization);
    xhr.setRequestHeader("enctype", "multipart/form-data;");
    xhr.setRequestHeader("Accept", "application/json, text/javascript");

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
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'File uploaded Successfully', xhr.response.fileName);
        } else {
          this.isUploadingXls = false;
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, 'Unable to upload file', xhr.response.fileName);
        }
      }
    }
    xhr.send(JSON.stringify(obj));
  }

  genrateReport(obj) {
    if(obj.failure_count != 0) {
      this.downloadFailure(obj);
    } else if (obj.success_count != 0) {
      this.downloadSuccess(obj);
    }
  }

}
