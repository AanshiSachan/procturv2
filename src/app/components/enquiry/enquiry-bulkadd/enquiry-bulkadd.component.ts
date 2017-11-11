import { Component, OnInit } from '@angular/core';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import 'rxjs/Rx';
import { Base64 } from 'js-base64';
import { AppComponent } from '../../../app.component';
import {Router} from '@angular/router'

@Component({
  selector: 'app-enquiry-bulkadd',
  templateUrl: './enquiry-bulkadd.component.html',
  styleUrls: ['./enquiry-bulkadd.component.scss']
})
export class EnquiryBulkaddComponent implements OnInit {

  isCancelUpload: boolean = false;
  isUploadingXls: boolean = false;
  progress: number = 0;
  fileLoading:string = "";

  constructor(private fetchData: FetchenquiryService, private postData: PostEnquiryDataService, private appC: AppComponent, private router: Router) {
    if(sessionStorage.getItem('Authorization') == null){
      this.router.navigate(['/authPage']);
     }
  }

  ngOnInit() {
  }

  downloadTemplate() {
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
      },
      err => {
        console.log(err.responseJSON.message);
      })
  }

  convertBase64ToArray(val) {

    var binary_string = window.atob(val);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;

  }


  updateXlsHeaders(ev) {
    ev.xhr.setRequestHeader("processData", "false");
    ev.xhr.setRequestHeader("contentType", "false");
    ev.xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    ev.xhr.setRequestHeader("enctype", "multipart/form-data");
    ev.xhr.setRequestHeader("Authorization", sessionStorage.getItem("Authorization"));
  }

  uploadHandler(event) {
    for (let file of event.files) {

      let formdata = new FormData();
      
      formdata.append("file", file);
      
      let urlPostXlsDocument = "https://app.proctur.com/StdMgmtWebAPI/api/v2/enquiry_manager/bulkUploadEnquiries";
      
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
          document.getElementById('progress-width').style.width = this.progress +'%';
          this.fileLoading = file.name;
        }
      }, false);

      //Call function when onload.
      xhr.onreadystatechange = () => {
        if(xhr.readyState == 4) {
            this.progress = 0;
          if (xhr.status >= 200 && xhr.status < 300) {
            this.isUploadingXls = false;
            let data = {
              type: 'success',
              title: "File uploaded",
              body: xhr.response.fileName
            }
            this.appC.popToast(data);
            //console.log(xhr.response);
          } else {
            this.isUploadingXls = false;
            let data = {
              type: 'error',
              title: "File uploaded Failed",
              body: xhr.response.fileName
            }
            this.appC.popToast(data);
            //console.log(xhr.response);
          }
        }
      }
      
      xhr.send(formdata);
    }
    event.files = [];
  }
}
