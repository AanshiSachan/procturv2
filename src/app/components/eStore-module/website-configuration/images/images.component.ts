import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../../services/products.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  activeSession: any = {
    id: '',
    name: '',
    size: ''
  };
  pageModel: any = '';
  @ViewChild('fileUpload', { static: false }) fileUpload: any;

  constructor(
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.toggler('logoImage', '200 * 50 / 50 * 50', 'Logo');
    this.getData();
  }

  getData() {
    this.auth.showLoader();
    this.productService.getMethod('/api/v2/website/configuration/' + sessionStorage.getItem('institute_id'), null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        if (res.result) {
          this.pageModel = res.result;
        }
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  toggler(id, size, name) {
    this.activeSession.id = id;
    this.activeSession.size = size;
    this.activeSession.name = name;
  }

  checkValidation(files) {
    for (let i = 0; i < files.length; i++) {
      let pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.gif|.png|.jpg|.jpeg)$/i;
      if (!pattern.test(files[i].name)) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select file in gif, png, jpg form");
        return false;
      } else {
        return true;
      }
    }
  }

  uploadHandler($event, fileUpload) {
    if (this.checkValidation($event.files)) {
      // console.log(this.material_dataFlag);
      const formData = new FormData();
      let data = this.pageModel;
      formData.append('data', JSON.stringify(data));
      if ($event.files && $event.files.length) {
        $event.files.forEach(file => {
          formData.append(this.activeSession.id, file);
        });
        // formData.append('files', $event.files);
      }

      let base = this.auth.getBaseUrl();
      let urlPostXlsDocument = base + "/prod/api/v2/website/configuration/update";
      let newxhr = new XMLHttpRequest();
      let auths: any = {
        userid: sessionStorage.getItem('userid'),
        userType: sessionStorage.getItem('userType'),
        password: sessionStorage.getItem('password'),
        institution_id: sessionStorage.getItem('institute_id'),
      }
      let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);
      newxhr.open("PUT", urlPostXlsDocument, true);
      newxhr.setRequestHeader("Authorization", Authorization);
      newxhr.setRequestHeader("x-proc-authorization", Authorization);
      newxhr.setRequestHeader("x-prod-inst-id", sessionStorage.getItem('institute_id'));
      newxhr.setRequestHeader("x-prod-user-id", sessionStorage.getItem('userid'));
      newxhr.setRequestHeader("enctype", "multipart/form-data;");
      newxhr.setRequestHeader("Accept", "application/json, text/javascript");
      newxhr.setRequestHeader("Access-Control-Allow-Origin", "*");

      if (!this.auth.isRippleLoad.getValue()) {
        this.auth.showLoader();
        newxhr.onreadystatechange = () => {
          this.auth.hideLoader();
          if (newxhr.readyState == 4) {
            if (newxhr.status >= 200 && newxhr.status < 300) {
              // this.clearuploadObject();
              // this.refreshList();
              let msg = this.activeSession.name.concat(' image uploaded successfully');
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', msg);
              fileUpload.clear();
              this.getData();
            } else {
              this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);
            }
          }
        }
        newxhr.send(formData);
      }
    }
  }

}
