import { Component, OnChanges, Input, ViewChild,ElementRef } from '@angular/core';

@Component({
  selector: 'student-pop-up',
  templateUrl: './student-pop-up.component.html',
  styleUrls: ['./student-pop-up.component.scss']
})
export class StudentPopUpComponent implements OnChanges{

  @Input() isBig:any = "";
  @Input() size:any = "80%"

  @ViewChild('studentPop') studentPop : ElementRef;

  constructor() {
   }

  ngOnChanges(){
    this.isBig;
  }
}
