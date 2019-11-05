import { Component, OnInit } from '@angular/core';
import { ClosingReasonService } from '../../../services/closingReasons/closing-reason.service';
import { AppComponent } from '../../../app.component';
import { ELEMENT_PROBE_PROVIDERS } from '@angular/platform-browser/src/dom/debug/ng_probe';
import { MessageService } from 'primeng/components/common/messageservice';
import { MessageShowService } from '../../../services/message-show.service';

@Component({
  selector: 'app-data-setup',
  templateUrl: './data-setup.component.html',
  styleUrls: ['./data-setup.component.scss']
})
export class DataSetupComponent implements OnInit {

  showToggle: boolean = false;
  createNewReasonObj = {
    closing_desc: "",
    institution_id: this.service.institute_id
  }
  getAllClosingReasons: any[] = [];
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1];
  dataStatus: boolean = false;

  constructor(
    private service: ClosingReasonService,
    private appC: AppComponent,
    private services:MessageShowService
  ) { }

  ngOnInit() {
    this.getAllReasons();
  }


  toggleCreateNewReason() {
    if (this.showToggle == false) {
      this.showToggle = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.showToggle = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }

  getAllReasons() {
    this.dataStatus = true;
    this.service.getAllReasons().subscribe(
      (data: any) => {
        this.dataStatus = false;
        this.getAllClosingReasons = data;
      },
      (error: any) => {
        this.dataStatus = false;
        // this.errorMessage(error);
      }
    )
  }

  editRowTable(row, index) {
    document.getElementById(("i" + index).toString()).classList.remove('displayComp');
    document.getElementById(("i" + index).toString()).classList.add('editComp');
  }

  saveInformation(row, index) {
    if (row.closing_desc == "" || row.closing_desc == null) {
      this.appC.popToast({ type: 'error', body: "Closing reason can't be empty" })
    }
    else {
      if (this.isName(row.closing_desc) == true) {
        this.services.showErrorMessage("error" , "" ,"Please enter alphabets only")
      }

      else if(this.checkLength(this.createNewReasonObj.closing_desc) == false){
        this.services.showErrorMessage("error" , "" ,"Limits should not be more than 50")
      }
      else {
        let obj = {
          closing_desc: row.closing_desc,
          institution_id: this.service.institute_id
        }
        this.service.updateClosingReason(obj, row.closing_reason_id).subscribe(
          (data: any) => {
            this.services.showErrorMessage("success" , "" , "Reason updated successfully")
            this.getAllReasons();
          },
          err => {
            this.errorMessage(err);
          }
        )
      }
    }
  }

  cancelEditRow(index) {
    document.getElementById(("i" + index).toString()).classList.add('displayComp');
    document.getElementById(("i" + index).toString()).classList.remove('editComp');
    this.getAllReasons();
  }

  createNewReason() {
    if (this.createNewReasonObj.closing_desc == "") {
      this.services.showErrorMessage("error" , "" , "Closing reason can't be empty")
    }

    else {
      if (this.isName(this.createNewReasonObj.closing_desc) == true) {
        this.services.showErrorMessage("error" , "" , "Please enter alphabets only")
      }

      else if(this.checkLength(this.createNewReasonObj.closing_desc) == false){
        this.services.showErrorMessage("error" , "" , "Limits should not be more than 50")
      }
      else {
        this.service.createReason(this.createNewReasonObj).subscribe(
          (data: any) => {
            this.services.showErrorMessage("success" , "" , "Reason Created Successfully")
            this.showToggle = false;
            this.getAllReasons();
            this.createNewReasonObj.closing_desc = "";
            document.getElementById('showAddBtn').style.display = "inline-block";
            document.getElementById('showCloseBtn').style.display = "none";
          },
          (error: any) => {
            this.errorMessage(error);
          }
        )
      }
    }
  }

  checkLength(el) {
    if (el.length > 50) {
      return false;
    }
    else{
      return true;
    }
  }


  isName(str) {
    let letters = /^[A-Za-z \n]+$/
    if (letters.test(str)) {
      return false;
    }
    else {
      return true;
    }
  }

  errorMessage(error) {
    this.services.showErrorMessage("success" , "" , error.error.message)
  }

}
