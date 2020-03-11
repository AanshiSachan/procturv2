import { Component, OnInit } from '@angular/core';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService  } from '../../../services/http.service';

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

  payeeVisibilty: boolean = false;
  payerVisibilty: boolean = false;
  accountVisibilty: boolean = false;

  editPayeeId = '';
  editPayerId = '';
  editAccountId = '';

  isEditPayee:boolean = false;
  isEditPayer: boolean = false;
  isEditAccount: boolean = false;

  tableValueData: any[] = [];
  selectedSection: string = '';

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
   }

  ngOnInit() {
    this.payeeHeader = [
      { header: 'Name', class: 'medium-item'},
      { header: 'Vendor Type', class: 'medium-item'},
      { header: 'Company Name', class: 'medium-item'},
      { header: 'Contact No.', class: 'medium-item'},
      { header: 'Email ID', class: 'medium-item'},
      { header: 'Edit', class: 'small-item'}
    ];

    this.payerHeader = [
      { header: 'Name', class: 'medium-item'},
      { header: 'Vendor Type', class: 'medium-item'},
      { header: 'Company Name', class: 'medium-item'},
      { header: 'Contact No.', class: 'medium-item'},
      { header: 'Email ID', class: 'medium-item'},
      { header: 'Edit', class: 'small-item'}
    ];

    this.accountHeader = [
      { header: 'Account Name	', class: 'large-item'},
      { header: 'Description	', class: 'large-item'},
      { header: 'Type	', class: 'medium-item'},
      { header: 'Edit', class: 'small-item'}
    ];

    this.switchActiveView('payee');
  }

  switchActiveView(showId) {
    let lists = ['payee','payer','account'];
    lists.forEach((object)=>{
      document.getElementById(object).classList.remove('active');
    })
    setTimeout(() => {
      if(document.getElementById(showId)){
        document.getElementById(showId).classList.add('active');
        this.selectedSection = showId;
        this.getTableData(showId)
      }
    }, 500);
  }

  getTableData(showId){
    let url = "";
    if(showId == 'payee'){
      this.headerList = this.payeeHeader;
      url = `/api/v1/payment/party/expense/all/${this.jsonFlag.institute_id}`;
    }
    if(showId == 'payer'){
      this.headerList = this.payerHeader;
      url = `/api/v1/payment/party/income/all/${this.jsonFlag.institute_id}`;
    }
    if(showId == 'account'){
      this.headerList = this.accountHeader;
      url = `/api/v1/account/all/${this.jsonFlag.institute_id}`;
    }

    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.tableValueData = res;
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  editPayee(party_id){
    this.isEditPayee = true;
    this.editPayeeId = party_id;
    this.payeeVisibilty = true;
  }

  editPayer(party_id){
    this.isEditPayer = true;
    this.editPayerId = party_id;
    this.payerVisibilty = true;
  }

  editAccount(account_id){
    this.isEditAccount = true;
    this.editAccountId = account_id;
    this.accountVisibilty = true;
  }

  togglePayee(){
    if(this.payeeVisibilty){
      this.payeeVisibilty = false;
    }
    else{
      this.payeeVisibilty = true;
      this.editPayeeId = '';
      this.isEditPayee = false;
    }
  }

  togglePayer(){
    if(this.payerVisibilty){
      this.payerVisibilty = false;
    }
    else{
      this.editPayerId = '';
      this.isEditPayer = false;
      this.payerVisibilty = true;
    }
  }

  toggleAccount(){
    if(this.accountVisibilty){
      this.accountVisibilty = false;
    }
    else{
      this.editAccountId = '';
      this.isEditAccount = false;
      this.accountVisibilty = true;
    }
  }







}
