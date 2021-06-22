import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../../services/common-service';
import { FeeStrucService } from '../../../../services/feeStruc.service';
//import CommonUtils from '../../../../utils/commonUtils';
declare var $;
@Component({
  selector: 'app-fee-types-v2',
  templateUrl: './fee-types-v2.component.html',
  styleUrls: ['./fee-types-v2.component.scss']
})
export class FeeTypesV2Component implements OnInit {
  type: string = '';
  activeSession: any = 'fee_types';
  addNewFee = {
    fee_type: '',
    fee_type_desc: '',
    fee_type_tax: '',
    fee_type_id: 0,
  }
  feeTypeList: any = [];
  tax_type_with_percentage: String;
  is_tax_enabled: boolean;
  constructor(
    private apiService: FeeStrucService,
    private auth: AuthenticatorService,
    private commonService: CommonServiceFactory,
    private http: HttpService) {
    this.is_tax_enabled = sessionStorage.getItem("enable_tax_applicable_fee_installments") == '1' ? true : false;
    this.getInstituteFeeTypes();
  }
  ngOnInit(): void {
  }
  toggle(id) {
    this.activeSession = id;
  }
  getInstituteFeeTypes() {
    this.auth.showLoader();
    this.apiService.getAllFeeType().subscribe(
      res => {
        this.auth.hideLoader();
        this.feeTypeList = res;
      },
      err => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', err.error.message);
      }
    )
  }
  editFeeTypes(data) {
    if (data != null) {
      this.addNewFee.fee_type = data.fee_type;
      this.addNewFee.fee_type_desc = data.fee_type_desc;
      this.addNewFee.fee_type_tax = data.fee_type_tax;
      this.addNewFee.fee_type_id=data.fee_type_id;
      $('#feetypesModal').modal('show');
    }
  }
  createFeeType() {
    if (this.validateUserInput()) {
      this.auth.showLoader();
      let url = "/api/v2/fee_types/create/" + sessionStorage.getItem('institute_id');
      let payload: any = {
        fee_type_name: this.addNewFee.fee_type,
        fee_type_desc: this.addNewFee.fee_type_desc,
        institute_id: sessionStorage.getItem('institute_id')
      };
      if (this.is_tax_enabled) {
        payload.tax_percentage = this.addNewFee.fee_type_tax==''?0:this.addNewFee.fee_type_tax;
      }
      this.http.postData(url, payload).subscribe(data => {
        let temp: any = data;
        this.commonService.showErrorMessage('success', '', temp.message)
        this.auth.hideLoader();
        $('#feetypesModal').modal('hide');
        this.clearData();
        this.getInstituteFeeTypes();
      }, error => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', error.error.message)
      })

    }
  }
  clearData() {
    this.addNewFee = {
      fee_type: '',
      fee_type_desc: '',
      fee_type_tax: '',
      fee_type_id: 0,
    }
    $('#feetypesModal').modal('hide');
  }
  validateUserInput() {
    if ( this.addNewFee.fee_type.trim()=='') {
      this.commonService.showErrorMessage('info', '', "Enter Valid Fee Type!");
      return false;
    }
    return true;
  }
  updateFeeType() {
    if (this.validateUserInput()) {
      this.auth.showLoader();
      let url = "/api/v2/fee_types/update";
      let payload: any = {
        id:this.addNewFee.fee_type_id,
        fee_type_name: this.addNewFee.fee_type,
        fee_type_desc: this.addNewFee.fee_type_desc,
        institute_id: sessionStorage.getItem('institute_id')
      };
      if (this.is_tax_enabled) {
        payload.tax_percentage = this.addNewFee.fee_type_tax==''?0:this.addNewFee.fee_type_tax;
      }
      this.http.putData(url, payload).subscribe(data => {
        let temp: any = data;
        this.commonService.showErrorMessage('success', '', temp.message)
        this.auth.hideLoader();
        $('#feetypesModal').modal('hide');
        this.clearData();
        this.getInstituteFeeTypes();
      }, error => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', error.error.message)
      })

    }
  }
}
