import { Component, OnInit } from '@angular/core';
import { ActivityPtmService } from '../../../services/activity-ptmservice/activity-ptm.service';

@Component({
  selector: 'app-ptm-management',
  templateUrl: './ptm-management.component.html',
  styleUrls: ['./ptm-management.component.scss']
})
export class PtmManagementComponent implements OnInit {

  batchQueryParam = {
    is_active: 1
  }
  getptmDates = {
    batch_id: -1
  }
  ptmId = {
    ptm_id: -1
  }
  getAllBatches: any[] = []
  fetchPtmDates: any[] = []
  viewStudents: any[] = [];
  isRippleLoad: boolean = false;

  constructor(private ptmService: ActivityPtmService) { }

  ngOnInit() {
    this.fetchBatchesList();
  }

  fetchBatchesList() {
    this.isRippleLoad = true;
    this.ptmService.getBatches(this.batchQueryParam).subscribe(
      (data: any) => {
        this.isRippleLoad = false;
        this.getAllBatches = data;
      },
      (error: any) => {
        this.isRippleLoad = false;
      }
    )
  }

  loadPtmDates(batch_id) {
    this.isRippleLoad = true;
    this.getptmDates = {
      batch_id: batch_id
    }
    this.ptmService.loadPtm(this.getptmDates).subscribe(
      (data: any) => {
        this.isRippleLoad = false;
        this.fetchPtmDates = data;
      },
      (error: any) => {
        this.isRippleLoad = false;
      }
    )
  }

  viewStudentsData() {
    this.isRippleLoad = true;
    this.ptmService.viewStudents(this.ptmId).subscribe(
      (data: any) => {
        this.isRippleLoad = false;
        this.viewStudents = data;
      },
      (error: any) => {
        this.isRippleLoad = false;
      }
    )
  }

  fetchDetails(){
    this.isRippleLoad = true;
    
  }

}
