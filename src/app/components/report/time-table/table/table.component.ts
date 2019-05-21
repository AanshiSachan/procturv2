import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { timeTableService } from '../../../../services/TimeTable/timeTable.service';
import { AppComponent } from '../../../../app.component';
import { AuthenticatorService } from '../../../../services/authenticator.service';
// import { CommonServiceFactory } from '../../../services/common-service';
import * as moment from 'moment';

import { error } from 'selenium-webdriver';

// var jsPDF = require('jspdf');
// require('jspdf-autotable');


@Component({
  selector: 'time-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class tableComponent {

  maxNoOfClasses: number = 0;
  maxClassArray: any[] = [];
  x: number = 0;
  isProfessional: boolean;
  today: string = moment(Date.now()).format("DD-MM-YYYY");


  constructor(
    private auth: AuthenticatorService
    )
    {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
  }

  @Input() recordInput: any[] = [];
  @Input() courseName: any;




  ngOnInit(){

    // for (var i = 0; i < this.recordInput.length; i++) {
    //   let validation_flag = true;
    //   for(var x = 0; x < this.recordInput[i].data.length; x++){
    //     if(this.recordInput[i].data[x].class_type == "Exam"){
    //       validation_flag = false;
    //       this.recordInput[i].data[x] = [];
    //       this.recordInput[i].data.splice(x, 1);
    //       x--;
    //     }
    //   }
    // }

    for (var i = 0; i < this.recordInput.length; i++) {
      if(this.recordInput[i].data.length > this.maxNoOfClasses){
        this.maxNoOfClasses = this.recordInput[i].data.length;
      }
    }

    for (var i = 0; i < this.maxNoOfClasses; i++) {
      this.maxClassArray.push(i)
    }

  }

  arrayOne(n: number): any[] {
    return Array(n);
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
