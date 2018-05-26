import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { timeTableService } from '../../../../services/TimeTable/timeTable.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';

@Component({
  selector: 'time-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class tableComponent {
  @Input() recordInput: any[] = [];
  @Input() courseName :any;
  

  ngOnInit() {
  }

  ngOnChanges() {
    this.recordInput;
  }

  styling(para) {
    if (para == "Exam") {
      return "red";
    }
    else {
      return "#04b8e6";
    }
  }
}