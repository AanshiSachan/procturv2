import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { MessageShowService } from '../../../.../../../../services/message-show.service';
import { ProductService } from '../../../../../services/products.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit, OnDestroy {
  selectedPageId: any = '';
  pageModel: any = {
    name: '',
    order_number: ''
  }

  constructor(
    private router: Router,
    private productService: ProductService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private routeParam: ActivatedRoute,
  ) {
    this.routeParam.params.subscribe(params => {
      this.selectedPageId = params['id'];
    });
  }

  ngOnInit(): void {
    if (this.selectedPageId) {
      this.pageModel = JSON.parse(sessionStorage.getItem('faqData'));
    }
  }

  ngOnDestroy() {
    sessionStorage.removeItem('faqData');
  }


  cancel() {
    this.router.navigate(['view/website-configuration/faq/category/list']);
  }

  saveData() {
    this.selectedPageId ? this.updateData() : this.createData();
  }

  updateData() {
    if (this.pageModel.name != '' && this.pageModel.name != null) {
      let data = {
        id: this.selectedPageId,
        institute_id: sessionStorage.getItem('institute_id'),
        name: this.pageModel.name,
        order_number: this.pageModel.order_number,
      }
      this.auth.showLoader();
      this.productService.putMethod('api/v2/website/faq/category/update', data).then(
        (result: any) => {
          this.auth.hideLoader();
          const response = result['body'];
          if (response.validate) {
            this.msgService.showErrorMessage('success', '', 'FAQ category updated successfully');
            this.router.navigate(['view/website-configuration/faq/category/list']);
          } else {
            this.msgService.showErrorMessage('error', response.error[0].error_message, '');
          }
        },
        (err) => {
          this.auth.hideLoader();
          console.log(err);
        }
      );
    } else {
      this.msgService.showErrorMessage('error', '', 'Please enter title')
    }
  }

  createData() {
    if (this.pageModel.name != '' && this.pageModel.name != null) {
      let data = {
        institute_id: sessionStorage.getItem('institute_id'),
        name: this.pageModel.name,
        order_number: this.pageModel.order_number,
      }
      this.auth.showLoader();
      this.productService.postMethod('api/v2/website/faq/category/create', data).then(
        (result: any) => {
          this.auth.hideLoader();
          const response = result['body'];
          if (response.validate) {
            this.msgService.showErrorMessage('success', '', 'FAQ category added successfully');
            this.router.navigate(['view/website-configuration/faq/category/list']);
          } else {
            this.msgService.showErrorMessage('error', response.error[0].error_message, '');
          }
        },
        (err) => {
          this.auth.hideLoader();
          console.log(err);
        }
      );
    } else {
      this.msgService.showErrorMessage('error', '', 'Please enter title')
    }
  }

}
