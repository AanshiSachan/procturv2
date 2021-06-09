import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { ProductService } from '../../../../services/products.service';
import { MessageShowService } from '../../../../services/message-show.service'

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  selectedPageId: any = '';
  pageModel: any = {
    page_route: '',
    page_status: '',
    page_title: '',
    in_navbar: false,
    page_data: '',
    image: ''
  }
  editorConf = {
    height: 250,
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
  statusData: any = [
    {
      Title: 'DRAFT'
    },
    {
      Title: 'PUBLISHED'
    }
  ]
  ImgData: any = [];

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
      this.getPageDataById();
    }
  }

  getPageDataById() {
    this.auth.showLoader();
    this.productService.getMethod('/api/v2/website/page/' + this.selectedPageId, null).subscribe(
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

  // saveData() {
  //   this.selectedPageId ? this.updatePage() : this.AddPage();
  // }

  // checkValidation(event) {
  //   if (event) {
  //     return true;
  //   } else if (this.selectedPageId) {
  //     return true;
  //   } else {
  //     this.msgService.showErrorMessage('error', '', 'Please select File')
  //     return false;
  //   }
  // }

  cancel() {
    this.router.navigate(['view/website-configuration/static-pages/list'])
  }

  saveData() {
    let file = (<HTMLFormElement>document.getElementById('uploadFileControl')).files[0];
    // if (this.checkValidation(file)) {
    if (this.pageModel.page_title != '') {
      if (this.pageModel.page_route != '') {
        // console.log(this.material_dataFlag);
        const formData = new FormData();
        let data: any = {
          institute_id: sessionStorage.getItem('institute_id'),
          page_route: this.pageModel.page_route,
          page_status: this.pageModel.page_status,
          page_title: this.pageModel.page_title,
          in_navbar: this.pageModel.in_navbar,
          page_data: this.pageModel.page_data
        }
        data.page_status = (data.page_status == '') ? 'DRAFT' : data.page_status;
        if (this.selectedPageId) {
          data.id = this.selectedPageId;
          data.banner_image_url = this.pageModel.banner_image_url;
        }
        formData.append('data', JSON.stringify(data));
        if (file) {
          formData.append('file', file);
        }

        let base = this.auth.getBaseUrl();
        let urlPostXlsDocument = this.selectedPageId ? base + "/prod/api/v2/website/page/update" : base + "/prod/api/v2/website/page/create";
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
                let msg = this.selectedPageId ? 'Page Updated successfully' : 'Page Added Successfully';
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
        this.msgService.showErrorMessage('error', '', 'Please enter page route')
      }
    } else {
      this.msgService.showErrorMessage('error', '', 'Please enter Title')
    }
    // }
  }

  clearFile() {
    this.pageModel.banner_image_url = '';
  }

}
