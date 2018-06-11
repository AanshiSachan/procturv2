import { Component, OnInit } from '@angular/core';
import { ActivityPtmService } from '../../../services/activity-ptmservice/activity-ptm.service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-ptm-management',
  templateUrl: './ptm-management.component.html',
  styleUrls: ['./ptm-management.component.scss']
})
export class PtmManagementComponent implements OnInit {

  batchQueryParam = {
    is_active: 1
  }
  getAllBatches: any[] = []

  getptmDates = {
    batch_id : -1
  }

  ptmId= {
    ptm_id : -1
  }

  getPtmDates : any[] = []
  viewStudents : any[] = [];

  constructor(private ptmService: ActivityPtmService,
              private appc: AppComponent) { }

  ngOnInit() {
    this.fetchBatchesList()
  }

  fetchBatchesList() {
    this.ptmService.getBatches(this.batchQueryParam).subscribe(
      (data: any) => {
        this.getAllBatches = data;
      },
      (error: any) => {

      }
    )
  }

  loadPtmDates(batch_id){
    this.getptmDates = {
      batch_id : batch_id
    }
    this.ptmService.loadPtm(this.getptmDates).subscribe(
      (data:any) =>{
        this.getPtmDates = data;
      },
      (error:any)=>{

      }
    )
  }

  viewStudentsData(){
    this.ptmService.viewStudents(this.ptmId).subscribe(
      (data:any)=>{
        this.viewStudents = data;
      },
      (error:any)=>{

      }
    )
  }

}
