import { Component, OnInit } from '@angular/core';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-data-setup',
  templateUrl: './data-setup.component.html',
  styleUrls: ['./data-setup.component.scss']
})
export class DataSetupComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    isRippleLoad: false,
    toggle: false
  };

  headerList: any[] = [];
  payeeHeader: any[] = [];
  payerHeader: any[] = [];
  accountHeader: any[] = [];
  categoryHeader: any[] = [];

  payeeVisibilty: boolean = false;
  payerVisibilty: boolean = false;
  accountVisibilty: boolean = false;
  categoryVisibilty: boolean = false;

  editPayeeId = '';
  editPayerId = '';
  editAccountId = '';
  editCategory = {};

  isEditPayee: boolean = false;
  isEditPayer: boolean = false;
  isEditAccount: boolean = false;
  isEditCategory: boolean = false;

  tableValueData: any[] = [];
  selectedSection: string = '';

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
    private auth: AuthenticatorService
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
  }

  ngOnInit() {
    this.payeeHeader = [
      { header: 'Name', class: 'medium-item' },
      { header: 'Vendor Type', class: 'medium-item' },
      { header: 'Company Name', class: 'medium-item' },
      { header: 'Contact No.', class: 'medium-item' },
      { header: 'Email ID', class: 'medium-item' },
      { header: 'Edit', class: 'small-item' }
    ];

    this.payerHeader = [
      { header: 'Name', class: 'medium-item' },
      { header: 'Vendor Type', class: 'medium-item' },
      { header: 'Company Name', class: 'medium-item' },
      { header: 'Contact No.', class: 'medium-item' },
      { header: 'Email ID', class: 'medium-item' },
      { header: 'Edit', class: 'small-item' }
    ];

    this.accountHeader = [
      { header: 'Payee/Payer	', class: 'medium-item' },
      { header: 'Name	', class: 'medium-item' },
      { header: 'Account Name	', class: 'medium-item' },
      { header: 'Type	', class: 'medium-item' },
      { header: 'Account Number	', class: 'medium-item' },
      { header: 'IFSC Code	', class: 'medium-item' },
      { header: 'Description	', class: 'medium-item' },



      { header: 'Edit', class: 'small-item' }
    ];

    this.categoryHeader = [
      { header: 'Category Name', class: 'large-item' },
      { header: 'Description	', class: 'large-item' },
      { header: 'Category Type', class: 'large-item' },
      { header: 'Edit', class: 'small-item' }
    ];

    this.switchActiveView('payee');
  }

  switchActiveView(showId) {
    // changes done by - Nalini
    // code refactoring
    this.selectedSection = showId;
    this.getTableData(showId)
  }

  getTableData(showId) {
    let url = "";
    if (showId == 'payee') {
      this.headerList = this.payeeHeader;
      url = `/api/v1/payment/party/expense/all/${this.jsonFlag.institute_id}`;
    }
    if (showId == 'payer') {
      this.headerList = this.payerHeader;
      url = `/api/v1/payment/party/income/all/${this.jsonFlag.institute_id}`;
    }
    if (showId == 'account') {
      this.headerList = this.accountHeader;
      url = `/api/v1/account/all/${this.jsonFlag.institute_id}`;
    }
    // Category changes added
    if (showId == 'category') {
      this.headerList = this.categoryHeader;
      url = `/api/v1/expense/category/all/${this.jsonFlag.institute_id}?expense_category_type=2,3`;
    }

    this.auth.showLoader();
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.tableValueData = res;

      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  editPayee(party_id) {
    this.isEditPayee = true;
    this.editPayeeId = party_id;
    this.payeeVisibilty = true;
  }

  editPayer(party_id) {
    this.isEditPayer = true;
    this.editPayerId = party_id;
    this.payerVisibilty = true;
  }

  editAccount(account_id) {
    this.isEditAccount = true;
    this.editAccountId = account_id;
    this.accountVisibilty = true;
  }

  // changes done by Nalini - to handle manage category changes
  editCategoryFun(obj) {
    this.isEditCategory = true;
    this.editCategory = obj;
    this.categoryVisibilty = true;
  }

  toggleCategory() {
    if (this.categoryVisibilty) {
      this.categoryVisibilty = false;
      this.getTableData(this.selectedSection);
    }
    else {
      this.editCategory = {};
      this.isEditCategory = false;
      this.categoryVisibilty = true;
    }
  }


  togglePayee() {
    if (this.payeeVisibilty) {
      this.payeeVisibilty = false;
      this.getTableData(this.selectedSection);
    }
    else {
      this.payeeVisibilty = true;
      this.editPayeeId = '';
      this.isEditPayee = false;
    }
  }

  togglePayer() {
    if (this.payerVisibilty) {
      this.payerVisibilty = false;
      this.getTableData(this.selectedSection);
    }
    else {
      this.editPayerId = '';
      this.isEditPayer = false;
      this.payerVisibilty = true;
    }
  }

  toggleAccount() {
    if (this.accountVisibilty) {
      this.accountVisibilty = false;
      this.getTableData(this.selectedSection);
    }
    else {
      this.editAccountId = '';
      this.isEditAccount = false;
      this.accountVisibilty = true;
    }
  }

}
