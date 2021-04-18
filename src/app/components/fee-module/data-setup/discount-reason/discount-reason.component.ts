import { Component, OnInit } from '@angular/core';
import { StudentFeeService } from '../../../student-module/student_fee.service';
import { CommonServiceFactory } from '../../../../services/common-service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
declare var $;

@Component({
  selector: 'app-discount-reason',
  templateUrl: './discount-reason.component.html',
  styleUrls: ['./discount-reason.component.scss']
})
export class DiscountReasonComponent implements OnInit {

  discountReasonArray: any = [];
  createNewDiscount: boolean = false;
  discountReason: string = "";
  discount_reason_id: number = -1;

  constructor(
    private apiService: StudentFeeService,
    private commonService: CommonServiceFactory,
    private auth: AuthenticatorService,

  ) { }

  ngOnInit() {
    this.getDiscountReson();
  }

  getDiscountReson() {
    this.auth.showLoader();
    this.apiService.getAllDiscountReasons().subscribe(
      res => {
        this.discountReasonArray = res;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    )
  }

  toggleCreateNew() {
    if (this.createNewDiscount == false) {
      this.createNewDiscount = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.createNewDiscount = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }

  addNewDiscountReason() {
    if (this.discountReason.trim() != "" && this.discountReason.trim().length > 0) {
      this.auth.showLoader();
      let obj: any = {
        reason: this.discountReason
      }
      this.apiService.createDiscountReason(obj).subscribe(
        res => {
          this.commonService.showErrorMessage('success', 'Discount Reason Added', '');
          this.getDiscountReson();
          this.auth.hideLoader();
          this.discountReason = "";
        },
        err => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', err.error.message, '');
        }
      )
    } else {
      this.commonService.showErrorMessage('error', '', 'Please enter discount reason');
    }
  }

  editRowTable(row, index) {
    document.getElementById(("row" + index).toString()).classList.remove('displayComp');
    document.getElementById(("row" + index).toString()).classList.add('editComp');
  }
  editReason(data) {
    $('#discountReasonModel').modal('show');
    this.discountReason = data.reason;
    this.discount_reason_id=data.discount_reason_id;
  }
  updateDiscountReason() {
    if (this.discountReason != "") {
      this.auth.showLoader();
      let obj: any = {};
      obj.reason = this.discountReason;
      this.apiService.updateDiscountReasons(obj, this.discount_reason_id).subscribe(
        (data: any) => {
          this.commonService.showErrorMessage('success', 'Discount Reason Updated!', '');
          this.discountReason = "";
          $('#discountReasonModel').modal('hide');
          this.auth.hideLoader();
          this.getDiscountReson();
        },
        (error: any) => {
          this.auth.hideLoader();
          this.commonService.showErrorMessage('error', '', error.error.message);
        }
      )
    } else {
      this.commonService.showErrorMessage('error', '', 'Please enter discount reason');
    }
  }
  clearData() {
    this.discountReason = "";
    $('#discountReasonModel').modal('hide');
  }

  cancelEditRow(index) {
    document.getElementById(("row" + index).toString()).classList.add('displayComp');
    document.getElementById(("row" + index).toString()).classList.remove('editComp');
    this.getDiscountReson();
  }


}
