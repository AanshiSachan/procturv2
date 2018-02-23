import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fee-types',
  templateUrl: './fee-types.component.html',
  styleUrls: ['./fee-types.component.scss']
})
export class FeeTypesComponent implements OnInit {

  createNewFeeType: boolean = false;
  addNewFee = {
    fee_type: '',
    fee_type_desc: '',
    fee_amount: '',
    fee_type_tax: '',
    fee_type_id: 0,
  }

  constructor() { }

  ngOnInit() {
    this.getListOfFeeType();
  }

  getListOfFeeType() {

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
