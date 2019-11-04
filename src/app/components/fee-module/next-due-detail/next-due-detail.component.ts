import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { GetFeeService } from '../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../services/report-services/fee-services/postFee.service';

@Component({
  selector: 'next-due-detail',
  templateUrl: './next-due-detail.component.html',
  styleUrls: ['./next-due-detail.component.scss']
})
export class NextDueDetailComponent implements OnChanges {

  @Input() feeData: any;
  @Output() closeButton = new EventEmitter<any>()

  nextDuesData:any[] = [];

  constructor(private getter: GetFeeService, private putter: PostFeeService) { }

  ngOnChanges() {
    this.feeData;
    this.updateData();
  }


  updateData() {
    //console.log(this.feeData);
    this.getter.getFutureDues(this.feeData.student_id).subscribe(
      res => {
        this.nextDuesData = res;
      },
      err => {}
    )
  }

  closePopups(){
    this.closeButton.emit(null);
  }

}



