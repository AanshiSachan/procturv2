import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { ReportService } from '../../../../services/library/report/report.service';
import * as moment from 'moment';

@Component({
  selector: 'app-never-issued',
  templateUrl: './never-issued.component.html',
  styleUrls: ['./never-issued.component.scss']
})
export class NeverIssuedComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    isRippleLoad: false
  };
  neverIssuedBookReportList: any[] = [];
  lostbookrange: any[] = [];
  lostBookReportList: any[] = [];
  fineCollectionRange: any[] = [];
  searchText: string;
  constructor(
    private reportService: ReportService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.lostbookrange[0] = new Date(moment().date(1).format("YYYY-MM-DD"));
    this.lostbookrange[1] = new Date(moment().format("YYYY-MM-DD"));
    this.getNeverIssuedBookReport();
  }

  getStartDate() {
    this.cd.markForCheck();
    let date = moment().date(1).format("YYYY-MM-DD");
    return this.fineCollectionRange[0];
}

getEndDate() {
    this.cd.markForCheck();
    return this.fineCollectionRange[1];
}

  getNeverIssuedBookReport(){

    this.jsonFlag.isRippleLoad = true;
    this.reportService.getNeverIssuedBookReport().subscribe(
      response => {
        this.jsonFlag.isRippleLoad = false;
        let res: any;
        res = response
        this.neverIssuedBookReportList = res.response;
        console.log(this.neverIssuedBookReportList)
      },
      errorResponse => {
        this.jsonFlag.isRippleLoad = false;
      }
    )
  }


}
