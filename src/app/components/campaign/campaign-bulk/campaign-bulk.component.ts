import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { NgForm } from '@angular/forms';
import { addCampaign } from '../../../model/add-campaign';
import { LoginService } from '../../../services/login-services/login.service';
import { CampaignService } from '../../../services/campaign-services/campaign.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';

@Component({
  selector: 'app-campaign-bulk',
  templateUrl: './campaign-bulk.component.html',
  styleUrls: ['./campaign-bulk.component.scss']
})
export class CampaignBulkComponent implements OnInit {

  isCancelUpload: boolean = false;
  isUploadingXls: boolean = false;
  progress: number = 0;
  fileLoading: string = "";
  isBulkUploadStatus: boolean = false;
  bulkUploadRecords: any;

  private campaignAddFormData: addCampaign = {
    name: "",
    referred: "",
    source: ""
  };

  private referralList: any[] = [];
  private sourceList: any[] = [];
  isProfessional: boolean = false;

  constructor(
    private fetchData: CampaignService,
    private router: Router,
    private login: LoginService,
    private prefill: FetchprefilldataService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService
  ) { }

  ngOnInit() {
    this.fetchPrefillFormData();
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

  /* Fetch and store the prefill data to be displayed on dropdown menu */
  fetchPrefillFormData() {
    let referralList = this.prefill.getLeadReffered().subscribe((data: any) => {
      this.referralList = data;
    });

    let sourceList = this.prefill.getLeadSource().subscribe((data: any) => {
      this.sourceList = data;
    });
  }

  /* base64 data to be converted to xls file */
  downloadTemplate() {
    //console.log(this.auth.getBaseUrl);
    window.open("https://app.proctur.com/doc/lead_upload_form.xls", "_blank");
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
  uploadHandler(event, form: NgForm) {

    if (form.valid) {
      let response;
      this.fetchData.verifyUploadFileName(this.campaignAddFormData.name).subscribe(
        res => {
          response = res;
          if (response.statusCode >= 200 && response.statusCode < 300) {
            for (let file of event.files) {
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
                let formdata = new FormData();

                formdata.append("campaign_list_file", file);
                //Append the rest of the detail
                formdata.append("campaign_list_name", this.campaignAddFormData.name);
                formdata.append("campaign_list_desc", "");
                formdata.append("file_extn", "xls");
                formdata.append("is_ajax", "Y");
                formdata.append("referred_by", this.campaignAddFormData.referred);
                formdata.append("source", this.campaignAddFormData.source);
                let urlPostXlsDocument = "https://app.proctur.com/CampaignListUpload";
                let xhr: XMLHttpRequest = new XMLHttpRequest();
                let auths: any = {
                  userid: sessionStorage.getItem('userid'),
                  userType: sessionStorage.getItem('userType'),
                  password: sessionStorage.getItem('password'),
                  institution_id: sessionStorage.getItem('institute_id'),
                }
                let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);
                xhr.open("POST", urlPostXlsDocument, true);
                xhr.setRequestHeader("processData", "false");
                xhr.setRequestHeader("contentType", "false");
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                xhr.setRequestHeader("enctype", "multipart/form-data");
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
                      // this.showErrorMessage(this.msgService.toastTypes.success, "File uploaded", xhr.response.fileName);
                      this.bulkUploadStep2(xhr.response, form);
                    } else {
                      this.isUploadingXls = false;
                      this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.functionalMsg.uploadFail, xhr.response.fileName);
                    }
                  }
                }
                xhr.send(formdata);
              } else {
                this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.functionalMsg.invalidType, '');
              }
            }
            event.files = [];
          }
        },
        error => {
          this.isUploadingXls = false;
          this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.functionalMsg.sameName, '');
        }
      )
    } else {
      this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.functionalMsg.mandatoryInfo, '');
    }
  }

  /* fetch the status of the data updated to server */
  fetchBulkUploadStatusData() {
    this.prefill.fetchBulkUpdateStatusReport().subscribe(
      res => {
        this.bulkUploadRecords = res;
      }
    )
  }

  verifyUploadFileName(data) {
    let response;
    this.fetchData.verifyUploadFileName(data).subscribe(
      res => {
        response = res;

        if (response.statusCode >= 200 && response.statusCode < 300) {
        } else {
          this.isUploadingXls = false;
          this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.functionalMsg.invalidType, '');
        }
      }
    )
  }

  bulkUploadStep2(data, form: NgForm) {
    let response;
    this.fetchData.uploadFileStep2(data).subscribe(
      res => {
        response = res;

        if (response.statusCode >= 200 && response.statusCode < 300) {


          this.showErrorMessage(this.msgService.toastTypes.success, this.msgService.object.functionalMsg.uploaded, '');
          this.clearFormAndMove();
          form.reset();
        } else {
          this.isUploadingXls = false;
          this.showErrorMessage(this.msgService.toastTypes.error, this.msgService.object.functionalMsg.invalidType, '');
        }
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
  // downloadBulkStatusReport(el) {
  //   this.fetchData.fetchBulkReport(el.list_id).subscribe(
  //     res => {
  //         let byteArr = this.convertBase64ToArray(res.document);
  //         let format = res.format;
  //         let fileName = res.docTitle;
  //         let fileId: string = el.list_id.toString();
  //         let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
  //         let url = URL.createObjectURL(file);
  //         let dwldLink = document.getElementById(fileId);
  //         dwldLink.setAttribute("href", url);
  //         dwldLink.setAttribute("download", fileName);
  //     },
  //     err => {}
  //   )
  // }

  clearFormAndMove() {
    // this.navigateTo('studentForm');
    this.campaignAddFormData = {
      name: "",
      referred: "",
      source: ""
    }
    this.fetchPrefillFormData();

  }

  // toast function 
  showErrorMessage(objType, massage, body) {
    this.msgService.showErrorMessage(objType, massage, body);
  }

}