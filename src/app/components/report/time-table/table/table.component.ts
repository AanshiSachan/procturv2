import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { timeTableService } from '../../../../services/TimeTable/timeTable.service';
import { AppComponent } from '../../../../app.component';
import * as moment from 'moment';
// var jsPDF = require('jspdf');
// require('jspdf-autotable');

@Component({
  selector: 'time-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class tableComponent {
  @Input() recordInput: any[] = [];
  @Input() courseName: any;

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

  // generate() {
  //   let doc = new jsPDF('l', 'pt');
  //   let columns = ["ID", "Name", "Country"];
  //   let rows = [
  //     [1, "Shaw", "Tanzania"],
  //     [2, "Nelson", "Kazakhstan"],
  //     [3, "Garcia", "Madagascar"]]
  //   doc.autoTable(columns, rows);
  //   doc.save('table.pdf');
  // }

  // generate() {

  //   var doc = new jsPDF('l', 'mm');

  //   let columns = [['date' , 'time' ,  'months']]
  //   let rows = ['tody' , 'tomorrow' , 'dayafter']
  //   doc.autoTable(columns, rows, {margin: {top: 80} , styles:{cellWidth:35}});

  //   // var header = function(data) {
  //   //   doc.setFontSize(18);
  //   //   doc.setTextColor(40);
  //   //   doc.setFontStyle('normal');
  //   //   //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
  //   //   doc.text("Testing Report", data.settings.margin.left, 50);
  //   // };

  //   // var options = {
  //   //   styles:{cellWidth:60},
  //   //   addPageContent: header,
  //   //   margin: {
  //   //     top: 80
  //   //   },
  //   //   startY: doc.doc.previousAutoTable.finalY() + 20
  //   // };

  //   // doc.autoTable(columns, rows, options);

  //   doc.save("table.pdf");
  // }

  // splitBatchData(batch_name) {
  //   if (batch_name.length >= 20) {
  //     return (batch_name.slice(0, 16) + "..");
  //   }
  //   else {
  //     return batch_name;
  //   }
  // }
}