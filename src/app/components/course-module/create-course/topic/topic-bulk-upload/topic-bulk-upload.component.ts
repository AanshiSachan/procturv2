import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../../../services/common-service';
import { HttpService } from '../../../../../services/http.service';
@Component({
  selector: 'app-topic-bulk-upload',
  templateUrl: './topic-bulk-upload.component.html',
  styleUrls: ['./topic-bulk-upload.component.scss']
})
export class TopicBulkUploadComponent implements OnInit {

  progress: number = 0;
  fileLoading: string = "";
  isUploadingXls: boolean = false;

  constructor(
    private router: Router,
    private _http: HttpService,
    private auth: AuthenticatorService,
    private commonService: CommonServiceFactory
  ) { }

  ngOnInit() {
  }

  /* base64 data to be converted to xls file */
  downloadTemplate() {
    this.auth.showLoader();
    let url = "/api/v1/topic_manager/5307";
    this._http.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        let byteArr = this.commonService.convertBase64ToArray(res.document);
        let format = res.format;
        let fileName = res.docTitle;
        let file = new Blob([byteArr], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(file);
        let dwldLink = document.getElementById('template_link');
        dwldLink.setAttribute("href", url);
        dwldLink.setAttribute("download", fileName);
        dwldLink.click();
      },
      error => {
        this.auth.hideLoader();
        console.log(error);
      }
    );
  }

}
