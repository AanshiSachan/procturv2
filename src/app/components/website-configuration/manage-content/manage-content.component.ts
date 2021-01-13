import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageShowService } from '../../../services/message-show.service';
import { ProductService } from '../../../services/products.service';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-manage-content',
  templateUrl: './manage-content.component.html',
  styleUrls: ['./manage-content.component.scss']
})
export class ManageContentComponent implements OnInit {
  activeSession: any = {
    id: '',
    title: ''
  };
  pageModel: any = {
    about_us_page: '',
    terms_and_condition_page: '',
    privacy_policy_page: '',
    refund_policy_page: '',
    thank_you_page: ''
  }
  editorConf = {
    height: 450,
    menubar: false,
    branding: false,
    plugins: [
      'preview anchor',
      'visualblocks code ',
      'insertdatetime  table paste code  wordcount'
    ],
    toolbar: 'undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent'
  };
  constructor(
    private router: Router,
    private productService: ProductService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.toggler('terms_and_condition_page', 'Terms and Conditions');
  }

  toggler(id, title) {
    this.activeSession.id = id;
    this.activeSession.title = title;
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
    // console.log(this.material_dataFlag);
    if ((this.pageModel.about_us_page == '' || this.pageModel.about_us_page == null) && (this.pageModel.terms_and_condition_page == '' || this.pageModel.terms_and_condition_page == null) && (this.pageModel.privacy_policy_page == '' || this.pageModel.privacy_policy_page == null) && (this.pageModel.refund_policy_page == '' || this.pageModel.refund_policy_page == null) && (this.pageModel.thank_you_page == '' || this.pageModel.thank_you_page == null)) {
      
    } else {
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
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', this.activeSession.title + " content updated successfully");
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
