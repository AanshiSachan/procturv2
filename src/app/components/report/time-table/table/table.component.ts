import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { timeTableService } from '../../../../services/TimeTable/timeTable.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
//import { ColumnSetting, ColumnMap } from '../tabl';


@Component({
  selector: 'time-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class tableComponent {
  @Input() recordInput: any[] = [];
  @Input() timeTableData: any[]=[];
  @Input() headers: any;
  timeTableArr: any = [];
  timeTableObj: any;
  startdateweek = moment().startOf('week').add(1, 'day').format('DD-MMM-YYYY');
  enddateweek = moment().endOf('week').add(1, 'day').format('DD-MMM-YYYY');
  flag: boolean = false;

  //columnMaps: ColumnMap[];
  ngOnInit() {
    //this.timeTableHeader();
  }


  ngOnChanges() {
    this.recordInput;
    this.timeTableDataList();
  }

  timeTableDataList(){
    this.timeTableArr = [];
    for (var i = 0; i < 7; i++) {
      this.flag = false;
      for (let prop in this.timeTableObj) {
        if (moment(this.startdateweek).add(i, 'day').format("DD-MM-YYYY") == moment(prop).format("DD-MM-YYYY") && (moment(this.startdateweek).add(i, 'day').format("dddd")==moment(prop).format("dddd"))) {
          let obj = {
            headerDate: moment(prop).format("DD-MM-YYYY"),
            headerDays: moment(prop).format("dddd"),
            data: this.timeTableObj[prop],
          }

          this.timeTableArr.push(obj);
          this.flag = true;
          break;
        }
      }
      if (this.flag == false) {
        let obj = {
          headerDate: (moment(this.startdateweek).add(i, 'day').format("DD-MMM-YYYY")),
          headerDays: (moment(this.startdateweek).add(i, 'day').format("dddd")),
          data: [],

        }
      //  this.emptytimeTable= true;
        this.timeTableArr.push(obj);
      }

    }
    console.log(this.timeTableArr);


  }


}