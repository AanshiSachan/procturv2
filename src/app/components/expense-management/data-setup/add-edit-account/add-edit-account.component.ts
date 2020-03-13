import { Component, OnInit, Output, Input, ElementRef, HostListener, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MessageShowService } from '../../../../services/message-show.service';
import { HttpService  } from '../../../../services/http.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
declare var $;

@Component({
  selector: 'app-add-edit-account',
  templateUrl: './add-edit-account.component.html',
  styleUrls: ['./add-edit-account.component.scss']
})
export class AddEditAccountComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: ''
  };

  accountDetails = {
    accountName: '',
    accountType: 0,
    accountDescription: ''
  }

  editAccountDetails: any;
  account: any[] = [];

  @Output() closePopup = new EventEmitter<boolean>();
  @Input() isEditAccount: boolean;
  @Input() editAccountId: any;

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
    private auth:AuthenticatorService
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
  }

  ngOnInit() {
    $('#addAccountModal').modal('show');
    this.getAccountTypes();
    if(this.isEditAccount){
      this.setEditValues();
    }
  }

  getAccountTypes(){
    this.auth.showLoader();
    const url = `/api/v1/masterData/type/ACCOUNT_TYPE`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.account = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  setEditValues(){
    this.auth.showLoader();
    const url = `/api/v1/account/${this.editAccountId}`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.editAccountDetails = res;
        this.setValue();
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  setValue(){
    this.accountDetails.accountName = this.editAccountDetails.display_name;
    this.accountDetails.accountType = this.editAccountDetails.type;
    this.accountDetails.accountDescription = this.editAccountDetails.notes;
  }

  saveAccountDetails(){
    if(this.accountDetails.accountName.trim() != ''){
      if(!isNaN(this.accountDetails.accountType)){
        if(this.accountDetails.accountDescription.trim() != ""){

          let obj = {
            display_name: this.accountDetails.accountName,
            notes: this.accountDetails.accountDescription,
            institution_id: this.jsonFlag.institute_id,
            type: this.accountDetails.accountType,
            account_id: ''
          };
          const url = `/api/v1/account`;
          if(this.isEditAccount){
            obj.account_id = this.editAccountId;
            this.auth.showLoader();
            this.httpService.putData(url, obj).subscribe(
              (res: any) => {
                this.auth.hideLoader();
                if(res.statusCode == 200){
                  this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Account updated successfully');
                  this.closePopups(false);
                }
              },
              err => {
                this.auth.hideLoader();
                this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
              }
            )
          }
          else{
            delete obj.account_id;
            this.auth.showLoader();
            this.httpService.postData(url, obj).subscribe(
              (res: any) => {
                this.auth.hideLoader();
                if(res.statusCode == 200){
                  this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Account created successfully');
                  this.closePopups(false);
                }
              },
              err => {
                this.auth.hideLoader();
                this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
              }
            )
          }

        }
        else{
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please specify Account Description!');
        }
      }
      else{
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please specify Account Type!');
      }
    }
    else{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please specify Account Name!');
    }

  }

  closePopups($event) {
    $('#addAccountModal').modal('hide');
    this.closePopup.emit(false);
  }

}
