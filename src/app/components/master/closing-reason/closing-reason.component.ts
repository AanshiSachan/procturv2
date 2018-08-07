import { Component, OnInit } from '@angular/core';
import { ClosingReasonService } from '../../../services/closingReasons/closing-reason.service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-closing-reason',
  templateUrl: './closing-reason.component.html',
  styleUrls: ['./closing-reason.component.scss']
})
export class ClosingReasonComponent implements OnInit {
  showToggle: boolean = false;
  createNewReasonObj = {
    closing_desc: "",
    institution_id: this.service.institute_id
  }

  getAllClosingReasons: any[] = [];
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2];
  dataStatus: boolean = false;

  constructor(private service: ClosingReasonService, private appC: AppComponent) {

  }
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
        this.errorMessage(error);
      }
    )
  }

  editRowTable(row, index) {
    document.getElementById(("i" + index).toString()).classList.remove('displayComp');
    document.getElementById(("i" + index).toString()).classList.add('editComp');
  }

  saveInformation(row, index) {
    console.log(row);
    let obj = {
      closing_desc:row.closing_desc,
      institution_id:this.service.institute_id
    }
    this.service.updateClosingReason(obj , row.closing_reason_id).subscribe(
      (data:any)=>{
        this.appC.popToast({type:"success" , title:"" , body:"Reason updated successfully"});
        this.getAllReasons();
      }
    )
  }

  cancelEditRow(index) {
    document.getElementById(("i" + index).toString()).classList.add('displayComp');
    document.getElementById(("i" + index).toString()).classList.remove('editComp');
  }

  createNewReason() {

    this.service.createReason(this.createNewReasonObj).subscribe(
      (data: any) => {
        this.appC.popToast({ type: "success", title: "", body: "Reason Created Successfully" });
        this.showToggle = false;
        this.getAllReasons();
        this.createNewReasonObj.closing_desc = "";
      },
      (error: any) => {
        this.errorMessage(error);
      }
    )
  }

  errorMessage(error) {
    this.appC.popToast({ type: "error", title: "", body: error.error.message });
  }

}
