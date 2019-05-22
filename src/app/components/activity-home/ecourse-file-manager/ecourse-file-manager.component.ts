import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { UploadFileComponent } from './core/upload-file/upload-file.component';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ecourse-file-manager',
  templateUrl: './ecourse-file-manager.component.html',
  styleUrls: ['./ecourse-file-manager.component.scss']
})
export class EcourseFileManagerComponent implements OnInit {

  @ViewChild(UploadFileComponent) uploadFile: UploadFileComponent;
  showUploadFileModal: boolean = false;
  institute_id: any;
  storageData: any = {
    storage_allocated: 10,
    uploaded_size: 1,
    width: 1
  }

  constructor(private _http: HttpService,
    private auth: AuthenticatorService,
    private router: Router
  ) {
    
  }


  ngOnInit() {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
      this.getDataUsedInCourseList();
    });
    }

  toggleFileUploadModal() {
    this.uploadFile.showModal = (this.uploadFile.showModal) ? false : true;
  }

  gotoPageData(route){
    // console.log(route)
    this.router.navigate([route.routeLink], { queryParams: route.data });
  }

  // user data usage get
  getDataUsedInCourseList() {
    let url = "/api/v1/instFileSystem/getUsedSpace/" + this.institute_id;
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.storageData.storage_allocated = (Number(res.storage_allocated) / 1024).toFixed(2);
      this.storageData.uploaded_size = res.uploaded_size;
      let width = (100 * this.storageData.uploaded_size) / this.storageData.storage_allocated;
      this.storageData.width = Math.round(width);
    });
  }

}
