import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'student-pop-up',
  templateUrl: './student-pop-up.component.html',
  styleUrls: ['./student-pop-up.component.scss']
})
export class StudentPopUpComponent implements OnChanges{

  @Input() isBig:any = "";

  constructor() { }

  ngOnChanges(){
    this.isBig;
    if(this.isBig != ""){
      console.log(this.isBig);
    }
  }
}
