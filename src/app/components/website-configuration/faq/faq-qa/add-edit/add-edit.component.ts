import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { MessageShowService } from '../../../../../services/message-show.service';
import { ProductService } from '../../../../../services/products.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit, OnDestroy {
  selectedPageId: any = '';
  categoryData: any = [];
  pageModel: any = {
    category_id: '',
    question: '',
    answer: '',
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
      this.pageModel = JSON.parse(sessionStorage.getItem('faqqaData'));
    }
    this.getFaqCategoryData();
  }

  ngOnDestroy() {
    sessionStorage.removeItem('faqqaData');
  }

  getFaqCategoryData() {
    this.auth.showLoader();
    this.productService.getMethod('/api/v2/website/faq/category/institute/' + sessionStorage.getItem('institute_id'), null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.categoryData = res.result;
        //this.fetchTableDataByPage(this.pageIndex);
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }


  cancel() {
    this.router.navigate(['view/website-configuration/faq/qa/list']);
  }

  saveData() {
    this.selectedPageId ? this.updateData() : this.createData();
  }

  updateData() {
    if (this.pageModel.category_id != '' && this.pageModel.category_id != null) {
      if (this.pageModel.question != '' && this.pageModel.question != null) {
        let data = {
          // institute_id: sessionStorage.getItem('institute_id'),
          id: this.selectedPageId,
          category_id: this.pageModel.category_id,
          question: this.pageModel.question,
          answer: this.pageModel.answer,
          order_number: this.pageModel.order_number
        }
        this.auth.showLoader();
        this.productService.putMethod('api/v2/website/faq/update', data).then(
          (result: any) => {
            this.auth.hideLoader();
            const response = result['body'];
            if (response.validate) {
              this.msgService.showErrorMessage('success', '', 'FAQ updated successfully');
              this.router.navigate(['view/website-configuration/faq/qa/list']);
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
        this.msgService.showErrorMessage('error', '', 'Please enter Question');
      }
    } else {
      this.msgService.showErrorMessage('error', '', 'Please select category');
    }
  }

  createData() {
    if (this.pageModel.category_id != '' && this.pageModel.category_id != null) {
      if (this.pageModel.question != '' && this.pageModel.question != null) {
        let data = {
          // institute_id: sessionStorage.getItem('institute_id'),
          category_id: this.pageModel.category_id,
          question: this.pageModel.question,
          answer: this.pageModel.answer,
          order_number: this.pageModel.order_number
        }
        this.auth.showLoader();
        this.productService.postMethod('api/v2/website/faq/create', data).then(
          (result: any) => {
            this.auth.hideLoader();
            const response = result['body'];
            if (response.validate) {
              this.msgService.showErrorMessage('success', '', 'FAQ created successfully');
              this.router.navigate(['view/website-configuration/faq/qa/list']);
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
        this.msgService.showErrorMessage('error', '', 'Please enter Question');
      }
    } else {
      this.msgService.showErrorMessage('error', '', 'Please select category');
    }
  }

}
