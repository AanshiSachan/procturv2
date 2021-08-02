import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ProductService } from '../../../services/products.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {
  pageModel: any = {
    background_color: '',
    font_family_heading: '',
    font_family_content: '',
    text_heading_color: '',
    text_content_color: '',
    border_color: ''
  }
  FontData: any[] = [];
  constructor(
    private router: Router,
    private productService: ProductService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getFontData();
  }

  getFontData() {
    this.auth.showLoader();
    this.productService.getMethod('/api/v2/website/font/all', null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.FontData = res.result;
        //this.fetchTableDataByPage(this.pageIndex);
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  getData() {
    this.auth.showLoader();
    this.productService.getMethod('/api/v2/website/configuration/' + sessionStorage.getItem('institute_id'), null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.pageModel = res.result;
        console.log(this.pageModel)
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  cancel() {
    this.router.navigate(['view/website-configuration/images']);
  }

  setFontFamilyContent(obj) {
    console.log(obj);
    this.pageModel.font_family_content_id = obj.id;
    this.pageModel.font_family_content_name = obj.name;
  }

  setFontFamilyHeader(obj) {
    this.pageModel.font_family_heading_id = obj.id;
    this.pageModel.font_family_heading_name = obj.name;
  }

  saveData() {
    if (this.pageModel.background_color == null && (this.pageModel.font_family_content == '' || this.pageModel.font_family_content == null) && (this.pageModel.font_family_heading == '' || this.pageModel.font_family_heading == null) && (this.pageModel.text_heading_color == null) && (this.pageModel.text_content_color == null) && (this.pageModel.border_color == null)) {
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
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Text colours updated successfully");
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

