import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Tree } from 'primeng/tree';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  showModal: boolean = false;
  dragoverflag:boolean = false;
  @ViewChild('uploaders') uploaders: ElementRef;
  @ViewChild('expandingTree') expandingTree: Tree;
  constructor() { }

  ngOnInit() {
    this.dragoverflag = true;
  }

  onSelect(event, uploaders) {
    /* Remove the overlay from layout  */
    // this.dropZone.nativeElement.classList.remove("over");
    // this.dragoverflag = false;
    // this.addCategoryPopup = true;
    // this.selectedFiles = event.files;
  }

}
