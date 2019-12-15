import { Component, OnInit } from '@angular/core';
import { FeeStrucService } from '../../../../services/feeStruc.service';
import { CommonServiceFactory } from '../../../../services/common-service';


@Component({
  selector: 'app-fee-types',
  templateUrl: './fee-types.component.html',
  styleUrls: ['./fee-types.component.scss']
})
export class FeeTypesComponent implements OnInit {

  createNewFeeType: boolean = false;
  isTaxEnableFeeInstallments: boolean = false;
  addNewFee = {
    fee_type: '',
    fee_type_desc: '',
    fee_amount: '',
    fee_type_tax: 0,
    fee_type_id: 0,
    country_id: ''
  }
  feeTypeList: any = [];
  countryDetails: any = [];

  constructor(
    private apiService: FeeStrucService,
    private commonService: CommonServiceFactory
  ) { }

  ngOnInit() {
    this.getListOfFeeType();
    this.fetchDataForCountryDetails();
    this.isTaxEnableFeeInstallments = sessionStorage.getItem('enable_tax_applicable_fee_installments') == '0' ? true : false;

  }

  getCurrencyDetails(value, currency, lang) {
    if (value && currency && lang) {
      let formatted = value.toLocaleString(lang, {
        maximumFractionDigits: 2,
        style: 'currency',
        currency: currency
      }).slice(0, -3);

      return formatted.replace(/[0-9]/g, '');
    }
   else{
    return lang;
   }  
  }


  fetchDataForCountryDetails() {
    let encryptedData = sessionStorage.getItem('country_data');
    let data = JSON.parse(encryptedData);
    if (data.length > 0) {
      this.countryDetails = data;
    }
    console.log(data);
  }

  getListOfFeeType() {
    this.apiService.getAllFeeType().subscribe(
      res => {
        this.feeTypeList = res;
        this.feeTypeList.forEach(element => {
          element.country_id = element.countryId.country_id;
        });
      },
      err => {
        this.commonService.showErrorMessage('error', 'Error', err.error.message);
      }
    )
  }

  updateDetails() {
    let data = this.makeDataJson();
    this.apiService.upadateFeeType(data).subscribe(
      res => {
        this.commonService.showErrorMessage('success', 'Updated', 'Details Updated Successfully');
        this.getListOfFeeType();
      },
      err => {
        this.commonService.showErrorMessage('error', 'Error', err.error.message);
      }
    )
  }

  makeDataJson() {
    let data: any = [];
    for (let t = 0; t < this.feeTypeList.length; t++) {
      let obj: any = {};
      obj.fee_amount = this.feeTypeList[t].fee_amount;
      obj.fee_type = this.feeTypeList[t].fee_type;
      obj.fee_type_desc = this.feeTypeList[t].fee_type_desc;
      obj.fee_type_id = this.feeTypeList[t].fee_type_id;
      obj.country_id = this.feeTypeList[t].country_id;
      if (this.feeTypeList[t].fee_type_tax == "" || this.feeTypeList[t].fee_type_tax == null) {
        this.feeTypeList[t].fee_type_tax = 0;
      }
      obj.fee_type_tax = this.feeTypeList[t].fee_type_tax;
      data.push(obj);
    }
    return data;
  }

  addNewFeeType() {
    if (this.addNewFee.fee_type.trim() != "") {
      if (this.addNewFee.country_id != "") {
        let obj: any = this.addNewFee;
        obj.country_id = Number(this.addNewFee.country_id);
        this.feeTypeList.push(obj);
        this.addNewFee = {
          fee_type: '',
          fee_type_desc: '',
          fee_amount: '',
          fee_type_tax: 0,
          fee_type_id: 0,
          country_id: ''
        }
      } else {
        this.commonService.showErrorMessage('error', 'Country Required', 'Please select country of Fee Type');
      }
    } else {
      this.commonService.showErrorMessage('error', 'Name Required', 'Please give name of Fee Type');
    }
  }

  deleteRow(row, index) {
    this.feeTypeList.splice(index, 1);
  }

  toggleCreate() {
    if (this.createNewFeeType == false) {
      this.createNewFeeType = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.createNewFeeType = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }

}
