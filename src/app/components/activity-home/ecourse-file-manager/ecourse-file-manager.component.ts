import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadFileComponent } from './core/upload-file/upload-file.component';

@Component({
  selector: 'app-ecourse-file-manager',
  templateUrl: './ecourse-file-manager.component.html',
  styleUrls: ['./ecourse-file-manager.component.scss']
})
export class EcourseFileManagerComponent implements OnInit {

  @ViewChild(UploadFileComponent) uploadFile: UploadFileComponent;
  
  showUploadFileModal: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  toggleFileUploadModal()
  {
    this.uploadFile.showModal = (this.uploadFile.showModal)?false:true;
  }

}
