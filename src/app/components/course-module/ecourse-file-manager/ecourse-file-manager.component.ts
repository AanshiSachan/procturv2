import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { UploadFileComponent } from './core/upload-file/upload-file.component';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { Router } from '@angular/router';
import { FileService } from './file.service';
import { MessageShowService } from '../../../services/message-show.service';

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
  vDOCipher_allocated_bandwidth: any;
  vDOCipher_used_bandwidth: any;
  vDOCipher_allocated_storage: any ='0';
  vDOCipher_used_storage: any = '0';
  enable_vdoCipher_feature: any = false;
  showSettings: boolean = true;
  is_video_public: boolean = true;
  settingDetails: any = {
    "institute_id": 100058,
    "video_watermark": "Megha",
    "is_video_public": true,
    "watermark_opacity": 1,
    "watermark_color": "#2680eb",
    "watermark_font_size": 10,
    "video_watch_limit_per_video": 1,
    "storage_capacity_threshold_alerts": 1,
    "bandwidth_threshold_alerts": 1,
    "watermark_text_moving_interval": 1,
    watermark_name: '',
    watermark_phone: '',
    watermark_email: ''
  }

  constructor(private _http: HttpService,
    private auth: AuthenticatorService,
    private router: Router,
    private _fservice:FileService,
    private msgService: MessageShowService
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
    this.enable_vdoCipher_feature = sessionStorage.getItem('enable_vdoCipher_feature') == '1' ? true : false;
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
      this.vDOCipher_allocated_bandwidth = (Number(res.vDOCipher_allocated_bandwidth) / 1024).toFixed(3);
      this.vDOCipher_used_bandwidth = (Number(res.vDOCipher_used_bandwidth) / 1024).toFixed(3);
      this.vDOCipher_allocated_storage = (Number(res.vDOCipher_allocated_storage) / 1024).toFixed(3);
      this.vDOCipher_used_storage = (Number(res.vDOCipher_used_storage) / 1024).toFixed(3);
      let width =1;
      if (this._fservice.storageData.uploaded_size!=0 &&
        this._fservice.storageData.uploaded_size<=this._fservice.storageData.storage_allocated) { width = (100 * this._fservice.storageData.uploaded_size) / this._fservice.storageData.storage_allocated; }
      this._fservice.storageData.width = Math.round(width);
    });
  }

  getSettingDetails() {
    // <base_url>/instFileSystem/getStudyMaterialSetting/{institute_id}
    let url = "/api/v1/instFileSystem/getStudyMaterialSetting/" + this.institute_id;
    this.auth.showLoader();
    this.showSettings = true;
    this._http.getData(url).subscribe((res: any) => {
      console.log("getSettingDetails", res);
      this.auth.hideLoader();
      this.settingDetails = res;
      this.is_video_public = this.settingDetails.is_video_public == 'Y' ? true : false;
      if(this.settingDetails.dynamic_watermark_text!=null) {
        let temp_details = this.settingDetails.dynamic_watermark_text.split(',');
        for(let i=0;i<3;i++) {
          if (temp_details[i] == 'name') {
            this.settingDetails.watermark_name = true;
          } else if(temp_details[i] == 'phone') {
            this.settingDetails.watermark_phone = true;
          } else if(temp_details[i] == 'email') {
            this.settingDetails.watermark_email = true;
          }
        }
      }
      this.showSettings = false;

    }, err => {
      this.auth.hideLoader();
    });
  }

  clearObject() {
    this.showSettings = !this.showSettings;
  }

  Save_Setting_Details() {
    this.auth.showLoader();
    //<base_url>/instFileSystem/updateStudyMaterialSetting
    let url = "/api/v1/instFileSystem/updateStudyMaterialSetting";
    this.settingDetails.institute_id = this.institute_id;
    this.settingDetails.is_video_public = this.is_video_public == true ? 'Y' : 'N';
    let temp :any = [];
    (this.settingDetails.watermark_name) ? (temp.push('name')) : '';
    (this.settingDetails.watermark_phone) ? (temp.push('phone')) : '';
    (this.settingDetails.watermark_email) ? (temp.push('email')) : '';
    temp = temp.join(',');
    let object = {
      "institute_id": this.settingDetails.institute_id,
      "video_watermark": this.settingDetails.video_watermark,
      "is_video_public": this.settingDetails.is_video_public,
      "watermark_opacity": this.settingDetails.watermark_opacity,
      "watermark_color": this.settingDetails.watermark_color,
      "watermark_font_size": this.settingDetails.watermark_font_size,
      "watermark_text_moving_interval": this.settingDetails.watermark_text_moving_interval,
      "vdocipher_bandwidth_threshold": this.settingDetails.vdocipher_bandwidth_threshold,
      "vdocipher_storage_capacity_threshold": this.settingDetails.vdocipher_storage_capacity_threshold,
      dynamic_watermark_text: temp
    }
    this._http.putData(url, object).subscribe((res: any) => {
      console.log(res);
      this.auth.hideLoader();
      this.showSettings = true;
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', res.message);

    }, err => {
      console.log(err);
      this.auth.hideLoader();
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.message);
    });
  }
}