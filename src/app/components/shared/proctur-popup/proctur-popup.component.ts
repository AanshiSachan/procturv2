import { Component, Input, ViewChild, ElementRef, OnChanges} from '@angular/core';

@Component({
  selector: 'proctur-popup',
  templateUrl: './proctur-popup.component.html',
  styleUrls: ['./proctur-popup.component.scss']
})
export class ProcturPopUpComponent implements OnChanges{

  @Input() sizeWidth:string = "";

  @ViewChild('popupContainer') pc: ElementRef;

  constructor() { }

  ngOnChanges(){
    this.sizeWidth;
    this.pc.nativeElement.classList.add(this.sizeWidth);
  }
  
}
