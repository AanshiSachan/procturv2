import { Component, OnInit } from '@angular/core';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import 'rxjs/Rx';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-enquiry-bulkadd',
  templateUrl: './enquiry-bulkadd.component.html',
  styleUrls: ['./enquiry-bulkadd.component.scss']
})
export class EnquiryBulkaddComponent implements OnInit {

  constructor(private fetchData: FetchenquiryService, private postData: PostEnquiryDataService) {
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
        document.body.appendChild(dwldLink);
        dwldLink.click();
      },
      err => {
        console.log(err.responseJSON.message);
      })
  }

  convertBase64ToArray(val) {

    var binary_string =  window.atob(val);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;

  }

  uploadSingleBulkSheet() {

  }

  uploadMultipleBulkSheet() {

  }


  msgs: any[];
  
  uploadedFiles: any[] = [];

  onUpload(event) {
      for(let file of event.files) {
          this.uploadedFiles.push(file);
      }
  
      this.msgs = [];
      this.msgs.push({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

}
