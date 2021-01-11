import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { ProductService } from '../../../../services/products.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit, OnDestroy {

  selectedPageId: any = '';
  pageModel: any = {
    name: '',
    content: '',
    order_number: '',
    image: '',
    rating: '0'
  }

  constructor(
    private routeParam: ActivatedRoute,
    private auth: AuthenticatorService,
    private productService: ProductService,
    private msgService: MessageShowService,
    private router: Router
  ) {
    this.routeParam.params.subscribe(params => {
      this.selectedPageId = params['id'];
    });
    console.log(this.selectedPageId);
  }

  ngOnInit(): void {
    if (this.selectedPageId) {
      this.pageModel = JSON.parse(sessionStorage.getItem('testnomialObj'));
    }
  }

  ngOnDestroy() {
    sessionStorage.removeItem('testnomialObj');
  }

  checkValidation(event) {
    if (event) {
      return true;
    } else if (this.selectedPageId && this.pageModel.image_url!='') {
      return true;
    } else {
      this.msgService.showErrorMessage('error', '', 'Please select Image')
      return false;
    }
  }

  cancel() {
    this.router.navigate(['view/website-configuration/testimonial/list'])
  }

  saveData() {
    let file = (<HTMLFormElement>document.getElementById('uploadFileControl')).files[0];
    console.log(file);
    if (this.checkValidation(file)) {
      if (this.pageModel.name != '' && this.pageModel.name != null) {
        if (this.pageModel.order_number != '' && this.pageModel.order_number != null) {
          // console.log(this.material_dataFlag);
          const formData = new FormData();
          let data: any = {
            institute_id: sessionStorage.getItem('institute_id'),
            name: this.pageModel.name,
            content: this.pageModel.content,
            order_number: this.pageModel.order_number,
            rating: this.pageModel.rating
          }
          if (this.selectedPageId) {
            data.id = this.selectedPageId;
            data.image_url = this.pageModel.image_url;
          }
          formData.append('data', JSON.stringify(data));
          if (file) {
            formData.append('file', file);
          }

          let base = this.auth.getBaseUrl();
          let urlPostXlsDocument = this.selectedPageId ? base + "/prod/api/v2/website/testimonial/update" : base + "/prod/api/v2/website/testimonial/create";
          let newxhr = new XMLHttpRequest();
          let auths: any = {
            userid: sessionStorage.getItem('userid'),
            userType: sessionStorage.getItem('userType'),
            password: sessionStorage.getItem('password'),
            institution_id: sessionStorage.getItem('institute_id'),
          }
          let Authorization = btoa(auths.userid + "|" + auths.userType + ":" + auths.password + ":" + auths.institution_id);
          this.selectedPageId ? newxhr.open("PUT", urlPostXlsDocument, true) : newxhr.open("POST", urlPostXlsDocument, true);
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
                  let msg = this.selectedPageId ? 'Testimonial Updated successfully' : 'Testimonial Added Successfully';
                  this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', msg);
                  this.cancel();

                } else {
                  this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', JSON.parse(newxhr.response).message);
                }
              }
            }
            newxhr.send(formData);
          }
        } else {
          this.msgService.showErrorMessage('error', '', 'Please enter order number')
        }
      } else {
        this.msgService.showErrorMessage('error', '', 'Please enter name');
      }
    }
  }

  clearFile() {
    this.pageModel.image_url = '';
  }

}
