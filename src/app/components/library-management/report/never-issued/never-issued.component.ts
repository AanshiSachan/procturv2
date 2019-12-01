import { Component, OnInit} from '@angular/core';
import { ReportService } from '../../../../services/library/report/report.service';


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

  constructor(
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.getNeverIssuedBookReport();
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
