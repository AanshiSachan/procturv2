import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn, NgForm } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from '../../../../assets/imported_modules/multiselect-dropdown';
import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { CampaignService } from '../../../services/campaign-services/campaign.service';
import { addCampaign } from '../../../model/add-campaign';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import {AuthenticatorService} from '../../../services/authenticator.service';

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
    referred:"",
    source:""   
  };

  private referralList: any[] = [];
  private sourceList: any[] = [];

  isProfessional: boolean = false;

  constructor(private fetchData: CampaignService, private router: Router, private login: LoginService, private appC: AppComponent, private prefill: FetchprefilldataService, private auth: AuthenticatorService) { }

  ngOnInit() {

    this.fetchPrefillFormData();
    //filling drop downs

    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';

    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));

    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

  /* Fetch and store the prefill data to be displayed on dropdown menu */
  fetchPrefillFormData() {
    
        let referralList = this.prefill.getLeadReffered().subscribe(data => {
          this.referralList = data;
        });
    
        let sourceList = this.prefill.getLeadSource().subscribe(data => {
          this.sourceList = data;
        });    
  }

  /* Customiized click detection strategy */
  inputClicked() {
    var nodelist = document.querySelectorAll('.form-ctrl');
    [].forEach.call(nodelist, (elm) => {
      elm.addEventListener('blur', function (event) {
        if (event.target.value != '') {
          event.target.parentNode.classList.add('has-value');
        } else {
          event.target.parentNode.classList.remove('has-value');
        }
      });
    });
  }


  /* base64 data to be converted to xls file */
  downloadTemplate() {
    //console.log(this.auth.getBaseUrl);
    window.open("http://app.proctur.com/doc/lead_upload_form.xls", "_blank");
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
  uploadHandler(event,form: NgForm) {

    if (form.valid) {

      let response;
      this.fetchData.verifyUploadFileName(this.campaignAddFormData.name).subscribe(
        res => {
          response= res;  
          if (response.statusCode >= 200 && response.statusCode < 300) {                
            for (let file of event.files) {
              if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type == 'application/vnd.ms-excel' ){
                let formdata = new FormData();
    
                formdata.append("campaign_list_file", file);
    
                //Append the rest of the detail
                formdata.append("campaign_list_name",this.campaignAddFormData.name);
                formdata.append("campaign_list_desc","");
                formdata.append("file_extn","xls");
                formdata.append("is_ajax","Y");
                formdata.append("referred_by",this.campaignAddFormData.referred);
                formdata.append("source",this.campaignAddFormData.source);       
    
                //
    
                let urlPostXlsDocument = "http://app.proctur.com/CampaignListUpload";
    
                let xhr: XMLHttpRequest = new XMLHttpRequest();
    
                xhr.open("POST", urlPostXlsDocument, true);
                xhr.setRequestHeader("processData", "false");
                xhr.setRequestHeader("contentType", "false");
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
                xhr.setRequestHeader("enctype", "multipart/form-data");
                xhr.setRequestHeader("Authorization", sessionStorage.getItem('Authorization'));
    
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
                      //
                      // 
                      //
                      this.isUploadingXls = false;
                      // let data = {
                      //   type: 'success',
                      //   title: "File uploaded",
                      //   body: xhr.response.fileName
                      // }
                      // this.appC.popToast(data);
    
                      
                      this.bulkUploadStep2(xhr.response,form);
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
    
              }else{
                let data = {
                  type: 'error',
                  title: "Invalid File Type",

                }
    
                this.appC.popToast(data);  
              }
            
              
            }
            event.files = [];
          } else {
                   
          }   
        },
        error => {
          this.isUploadingXls = false;
          let data = {
            type: 'error',
            title: "Name already exist"
          }
          this.appC.popToast(data); 
        }
      )

      
      

        

    }else{
      let data = {
        type: 'error',
        title: "Please provide mandatory information.",
      }
      this.appC.popToast(data);  
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

  verifyUploadFileName(data){
    let response;
    this.fetchData.verifyUploadFileName(data).subscribe(
      res => {
        response= res;

        if (response.statusCode >= 200 && response.statusCode < 300) {                
        } else {
          this.isUploadingXls = false;
          let data = {
            type: 'error',
            title: "File uploaded Failed"
          }
          this.appC.popToast(data);        
        }   
      }
    )
  }

  bulkUploadStep2(data,form: NgForm){
    let response;
    this.fetchData.uploadFileStep2(data).subscribe(
      res => {
        response= res;

        if (response.statusCode >= 200 && response.statusCode < 300) {  

          let data = {
            type: 'success',
            title: "File uploaded",
            // body: xhr.response.fileName
          }
          this.appC.popToast(data);
          this.clearFormAndMove();
          form.reset();     
        } else {
          this.isUploadingXls = false;
          let data = {
            type: 'error',
            title: "File uploaded Failed"
          }
          this.appC.popToast(data);        
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
      referred:"",
      source:"" 
    }
    this.fetchPrefillFormData();
    
  }




}