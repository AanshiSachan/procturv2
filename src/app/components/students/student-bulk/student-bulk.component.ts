import { Component, OnInit } from '@angular/core';
import { PostStudentDataService } from '../../../services/student-services/post-student-data.service';
import 'rxjs/Rx';
import { Base64 } from 'js-base64';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';
import { FetchStudentService } from '../../../services/student-services/fetch-student.service';

@Component({
  selector: 'app-student-bulk',
  templateUrl: './student-bulk.component.html',
  styleUrls: ['./student-bulk.component.scss']
})
export class StudentBulkComponent implements OnInit {
  isCancelUpload: boolean = false;
  isUploadingXls: boolean = false;
  progress: number = 0;
  fileLoading: string = "";
  isBulkUploadStatus: boolean = false;
  bulkUploadRecords: any[] = [];
  studentUploadForm: any;

  constructor(private fetchData: FetchStudentService, private postData: PostStudentDataService,
    private appC: AppComponent, private router: Router) {
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  ngOnInit() {
    this.fetchBulkUploadStatusData();
  }


  /* base64 data to be converted to xls file */
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
      let fileString: string = '';
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        fileString = reader.result.split(',')[1];
        this.uploadXLS(fileString);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
    event.files = [];
  }


  uploadXLS(inp: string) {
    let obj = {
      file: inp,
      file_extn: "xls",
      comments: "",
      institute_id: sessionStorage.getItem('institute_id')
    }

    this.postData.uploadStudentBulk(obj).subscribe(
      res => {
        let msg = {
          type: 'success',
          title: 'Student Details Uploaded',
          body: 'The selected file(s) have been uploaded, and will be updated shortly'
        }
        this.appC.popToast(msg);
      },
      err => {
        let msg = {
          type: 'error',
          title: 'Failed To Upload Student(s)',
          body: err.message
          }
          this.appC.popToast(msg);          
      }
    )

  }


  /* fetch the status of the data updated to server */
  fetchBulkUploadStatusData() {
    this.fetchData.fetchBulkUpdateStatusReport().subscribe(
      res => {
        this.bulkUploadRecords = res;
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
  downloadBulkStatusReport(el) {
    /* this.fetchData.fetchBulkReport(el.list_id).subscribe(
      res => {
        let byteArr = this.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let fileId: string = el.list_id.toString();
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById(fileId);
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
      },
      err => { }
    ) */
  }

  /* Customiized click detection strategy */
  inputClicked(ev) {
    if (ev.target.classList.contains('form-ctrl')) {
      if (ev.target.classList.contains('bsDatepicker')) {
        var nodelist = document.querySelectorAll('.bsDatepicker');
        [].forEach.call(nodelist, (elm) => {
          elm.addEventListener('focusout', function (event) {
            event.target.parentNode.classList.add('has-value');
          });

        });
      }
      else if ((ev.target.classList.contains('form-ctrl')) && !(ev.target.classList.contains('bsDatepicker'))) {
        //document.getElementById(ev.target.id).click();
        ev.target.addEventListener('blur', function (event) {
          if (event.target.value != '') {
            event.target.parentNode.classList.add('has-value');
          } else {
            event.target.parentNode.classList.remove('has-value');
          }
        });
      }
    }
  }

}
