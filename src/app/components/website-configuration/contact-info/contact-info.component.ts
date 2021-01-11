import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {

  pageModel: any = {
    contact: '',
    email_id: '',
    whatsapp: '',
    address: ''
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
    if ((this.pageModel.contact == '' || this.pageModel.contact == null) && (this.pageModel.email_id == '' || this.pageModel.email_id == null) && (this.pageModel.whatsapp == '' || this.pageModel.whatsapp == null) && (this.pageModel.address == '' || this.pageModel.address == null)) {
    } else {
      var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,9})+$/;
      if (this.pageModel.email_id == ''|| this.pageModel.email_id == null || reg.test(this.pageModel.email_id)) {
        var reg_num = /^[+]+?([0-9])+[-]+?([0-9])+(,[+]+?([0-9])+[-]+?([0-9])+)*$/;
        if (this.pageModel.contact == ''|| this.pageModel.contact == null || reg_num.test(this.pageModel.contact)) {
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
                this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Contact info updated successfully");
                this.getData();
              } else {
                this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);
              }
            }
          }
          newxhr.send(formData);
        }
      } else {
        this.msgService.showErrorMessage('error', '', 'Please enter valid number');
      }
      } else {
        this.msgService.showErrorMessage('error', '', 'Please enter valid email address');
      }
    }
  }

}
