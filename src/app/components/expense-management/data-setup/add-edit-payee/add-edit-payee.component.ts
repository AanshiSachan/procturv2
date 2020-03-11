import { Component, OnInit, Output, Input, ElementRef, HostListener, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MessageShowService } from '../../../../services/message-show.service';
import { HttpService  } from '../../../../services/http.service';
declare var $;
@Component({
  selector: 'app-add-edit-payee',
  templateUrl: './add-edit-payee.component.html',
  styleUrls: ['./add-edit-payee.component.scss']
})
export class AddEditPayeeComponent implements OnInit {

  @Output() closePopup = new EventEmitter<boolean>();
  @Input() isEditPayee: boolean;
  @Input() editPayeeId: any;
  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    isRippleLoad: false
  };

  payeeDetails = {
    title: 'Mr.',
    name: '',
    vendorType: '',
    primaryContactNo: '',
    companyName: '',
    secondaryContactNo: '',
    emailId: '',
    displayName: '',
    address: '',
    notes: ''
  };

  editPartyDetails: any;
  partyDetails: any[] = [];

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
  }

  ngOnInit() {
    $('#addPayeeModal').modal('show');
    this.getVendorDetails()
    if(this.isEditPayee){
      this.setEditValues();
    }
  }

  getVendorDetails(){
    const url = `/api/v1/masterData/type/PARTY_TYPE`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.partyDetails = res;
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  setEditValues(){
    const url = `/api/v1/payment/party/${this.editPayeeId}`;
    this.httpService.getData(url).subscribe(
      (res: any) => {
        this.editPartyDetails = res;
        this.setValue();
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  setValue(){
    this.payeeDetails.name = this.editPartyDetails.name;
    this.payeeDetails.address = this.editPartyDetails.address;
    this.payeeDetails.vendorType = this.editPartyDetails.type;
    this.payeeDetails.companyName = this.editPartyDetails.company_name;
    this.payeeDetails.displayName = this.editPartyDetails.display_name;
    this.payeeDetails.emailId = this.editPartyDetails.email_id;
    this.payeeDetails.primaryContactNo = this.editPartyDetails.primary_mobile_no;
    this.payeeDetails.secondaryContactNo = this.editPartyDetails.secondary_phone_no;
    this.payeeDetails.notes = this.editPartyDetails.notes;
    this.payeeDetails.title = this.editPartyDetails.title;
  }

  savePayeeDetails(){
    if(this.payeeDetails.displayName.trim() != ""){
      let obj = {
        name: this.payeeDetails.name,
        address: this.payeeDetails.address,
        institution_id: this.jsonFlag.institute_id,
        type: this.payeeDetails.vendorType,
        company_name: this.payeeDetails.companyName,
        display_name: this.payeeDetails.displayName,
        email_id: this.payeeDetails.emailId,
        primary_mobile_no: this.payeeDetails.primaryContactNo,
        secondary_phone_no: this.payeeDetails.secondaryContactNo,
        notes: this.payeeDetails.notes,
        title: this.payeeDetails.title,
      }
      const url = `/api/v1/payment/party`;
      if(this.isEditPayee){
        // obj.party_id = this.editPartyDetails.party_id;
        this.httpService.putData(url, obj).subscribe(
          (res: any) => {
            if(res.statusCode == 200){
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Institute party details updated successfully!');
              this.closePopups(false);
            }
          },
          err => {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
          }
        )
      }
      else{
        this.httpService.postData(url, obj).subscribe(
          (res: any) => {
            if(res.statusCode == 200){
              this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Institute party details added successfully!');
              this.closePopups(false);
            }
          },
          err => {
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
          }
        )
      }

    }
    else{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please specify Display Name!');
    }
  }


  closePopups($event) {
    $('#addPayeeModal').modal('hide');
    this.closePopup.emit(false);
  }

}
