import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../services/products.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';

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
  uploadedImg: any = '';
  @ViewChild('fileUpload', { static: false }) fileUpload: any;

  constructor(
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.toggler('logoImage', '200', '50', 'Logo', this.pageModel.logo_url);
  }

  getData() {
    this.auth.showLoader();
    this.productService.getMethod('/api/v2/website/configuration/' + sessionStorage.getItem('institute_id'), null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        if (res.result) {
          this.pageModel = res.result;
        }
        if (this.activeSession.id == 'logoImage') {
          this.toggler('logoImage', '200', '50', 'Logo', this.pageModel.logo_url);
        } else if (this.activeSession.id == 'faviconImage') {
          this.toggler('faviconImage', '32', '32', 'Favicon', this.pageModel.favicon_url);
        } else if (this.activeSession.id == 'aboutUsImage') {
          this.toggler('aboutUsImage', '512', '512', 'About Us', this.pageModel.about_us_url);
        } else {
          this.toggler('popUpImage', '512', '512', 'Popup', this.pageModel.pop_up_image_url)
        }
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  toggler(id, width, height, name, img) {
    this.activeSession.id = id;
    this.activeSession.width = width;
    this.activeSession.height = height;
    this.activeSession.name = name;
    this.uploadedImg = img;
    if (this.uploadedImg != '' && this.uploadedImg != null) {
      this.uploadedImg = this.uploadedImg + '?' + Math.random().toFixed(2);
    }
  }

  uploadHandler($event, fileUpload) {
    let files = $event.files;
    for (let i = 0; i < files.length; i++) {
      let pattern = /([a-zA-Z0-9\s_\\.\-\(\):])+(.gif|.png|.jpg|.jpeg)$/i;
      if (!pattern.test(files[i].name)) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select file in gif, png, jpg form");
        return false;
      } else {
        const max_height = this.activeSession.height;
        const max_width = this.activeSession.width;
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onloadend = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
            const img_height = rs.currentTarget['height'];
            const img_width = rs.currentTarget['width'];
            if ((img_height != max_height && img_width != max_width) || (this.activeSession.id == 'logoImage' && img_height != 50 && img_width != 50)) {
              let msg = (this.activeSession.id == 'logoImage') ? 'Please upload file of size 200 * 50 px or 50 * 50 px' : 'Please upload file of size ' + max_width + '*' + max_height + 'px';
              this.msgService.showErrorMessage('error', '', msg);
              return false;
            } else {
              const formData = new FormData();
              let data = this.pageModel;
              formData.append('data', JSON.stringify(data));
              if (files && files.length) {
                files.forEach(file => {
                  formData.append(this.activeSession.id, file);
                });
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
                return true;
              }
            }
          };
        };
      }
    }
  }

}
