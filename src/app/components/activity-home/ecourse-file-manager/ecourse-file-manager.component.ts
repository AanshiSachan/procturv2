import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { UploadFileComponent } from './core/upload-file/upload-file.component';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-ecourse-file-manager',
  templateUrl: './ecourse-file-manager.component.html',
  styleUrls: ['./ecourse-file-manager.component.scss']
})
export class EcourseFileManagerComponent implements OnInit  {

  @ViewChild(UploadFileComponent) uploadFile: UploadFileComponent;
  showUploadFileModal: boolean = false;
  institute_id: any;

  constructor(private _http: HttpService,
    private auth: AuthenticatorService,
  ) {
    
  }


  ngOnInit() {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
      this.getDataUsedInCourseList();
    });
    this._http.routeList =[];
    let  obj ={routeLink:'../ecourse-file-manager',name:'eCourse'};
    this._http.routeList.push(obj);
  }

  toggleFileUploadModal() {
    this.uploadFile.showModal = (this.uploadFile.showModal) ? false : true;
  }


  // user data usage get
  getDataUsedInCourseList() {
    let url = "/api/v1/instFilesSystem/getUsedSpace/" + this.institute_id;
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
    });
  }

}
