import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';

@Component({
  selector: 'app-third-party-auth',
  templateUrl: './third-party-auth.component.html',
  styleUrls: ['./third-party-auth.component.scss']
})
export class ThirdPartyAuthComponent implements OnInit {

  pageModel: any = {
    chat_key: '',
    google_analytics_key: '',
    pixel_key: '',
    google_verfication_key: ''
  }

  constructor(
    private router: Router,
    private productService: ProductService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.auth.showLoader();
    this.productService.getMethod('/api/v2/website/configuration/' + sessionStorage.getItem('institute_id'), null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.pageModel = res.result;
        //this.fetchTableDataByPage(this.pageIndex);
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  cancel() {
    this.router.navigate(['view/website-configuration/images']);
  }

  saveData() {
    if ((this.pageModel.chat_key == '' || this.pageModel.chat_key == null) && (this.pageModel.google_analytics_key == '' || this.pageModel.google_analytics_key == null) && (this.pageModel.pixel_key == '' || this.pageModel.pixel_key == null) && (this.pageModel.google_verfication_key == '' || this.pageModel.google_verfication_key == null)) {
    } else {
      // console.log(this.material_dataFlag);
      const formData = new FormData();
      let data = this.pageModel;
      formData.append('data', JSON.stringify(data));

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
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Third party integration updated successfully");
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
