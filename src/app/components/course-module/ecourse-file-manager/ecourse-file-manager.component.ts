import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { UploadFileComponent } from './core/upload-file/upload-file.component';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { Router } from '@angular/router';
import { FileService } from './file.service';

@Component({
  selector: 'app-ecourse-file-manager',
  templateUrl: './ecourse-file-manager.component.html',
  styleUrls: ['./ecourse-file-manager.component.scss']
})
export class EcourseFileManagerComponent implements OnInit {

  @ViewChild(UploadFileComponent) uploadFile: UploadFileComponent;
  showUploadFileModal: boolean = false;
  institute_id: any;
  isLangInstitue: any;

  constructor(private _http: HttpService,
    private auth: AuthenticatorService,
    private router: Router,
    private _fservice:FileService
  ) {

  }


  ngOnInit() {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
      this.getDataUsedInCourseList();
    });
    
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isLangInstitue = true;
        } else {
          this.isLangInstitue = false;
        }
      }
    );
  }

  toggleFileUploadModal() {
    this.uploadFile.showParentTopicModel = (this.uploadFile.showParentTopicModel) ? false : true;
    this.uploadFile.showModal = (this.uploadFile.showModal) ? false : true;
  }

  gotoPageData(route){
    console.log(route)
    this.router.navigate([route.routeLink], { queryParams: route.data });
  }

  // user data usage get
  getDataUsedInCourseList() {
    let url = "/api/v1/instFileSystem/getUsedSpace/" + this.institute_id;
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this._fservice.storageData.storage_allocated = (Number(res.storage_allocated) * 0.001048576);
      this._fservice.storageData.uploaded_size =(Number(res.uploaded_size) * 0.001048576);
      let width =1;
      if (this._fservice.storageData.uploaded_size!=0 &&
        this._fservice.storageData.uploaded_size<=this._fservice.storageData.storage_allocated) { width = (100 * this._fservice.storageData.uploaded_size) / this._fservice.storageData.storage_allocated; }
      this._fservice.storageData.width = Math.round(width);
    });
  }

}