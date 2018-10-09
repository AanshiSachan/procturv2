import { Component, OnInit } from '@angular/core';
import { StudentFeeService } from '../students/student_fee.service';
import { CommonServiceFactory } from '../../services/common-service';

@Component({
  selector: 'app-discount-reason',
  templateUrl: './discount-reason.component.html',
  styleUrls: ['./discount-reason.component.scss']
})
export class DiscountReasonComponent implements OnInit {

  discountReasonArray: any = [];
  createNewDiscount: boolean = false;
  discountReason: string = "";

  constructor(
    private apiService: StudentFeeService,
    private commonService: CommonServiceFactory
  ) { }

  ngOnInit() {
    this.getDiscountReson();
  }

  getDiscountReson() {
    this.apiService.getAllDiscountReasons().subscribe(
      res => {
        this.discountReasonArray = res;
      },
      err => {

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
      let obj: any = {
        reason: this.discountReason
      }
      this.apiService.createDiscountReason(obj).subscribe(
        res => {
          this.commonService.showErrorMessage('success', 'Discount Reason Added', '');
          this.getDiscountReson();
          this.discountReason = "";
        },
        err => {
          this.commonService.showErrorMessage('error', err.error.message, '');
        }
      )
    } else {
      this.commonService.showErrorMessage('error', 'Error', 'Please provide discount reason');
    }
  }

  editRowTable(row, index) {
    document.getElementById(("row" + index).toString()).classList.remove('displayComp');
    document.getElementById(("row" + index).toString()).classList.add('editComp');
  }

  saveInformation(row, index) {
    if (row.reason != null && row.reason != "") {
      let obj: any = {};
      obj.reason = row.reason;
      this.apiService.updateDiscountReasons(obj, row.discount_reason_id).subscribe(
        (data: any) => {
          this.cancelEditRow(index);
          this.commonService.showErrorMessage('success', 'Discount Reason Updated', '');
          this.getDiscountReson();
        },
        (error: any) => {
          this.commonService.showErrorMessage('error', 'Error', error.error.message);
        }
      )
    } else {
      this.commonService.showErrorMessage('error', 'Error', 'Please provide discount reason');
    }
  }

  cancelEditRow(index) {
    document.getElementById(("row" + index).toString()).classList.add('displayComp');
    document.getElementById(("row" + index).toString()).classList.remove('editComp');
  }


}
