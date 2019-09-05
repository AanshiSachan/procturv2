import { Component, OnInit, EventEmitter, Output, OnChanges, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { EcourseFileManagerComponent } from '../ecourse-file-manager.component';
import { Router } from '@angular/router';
import { MessageShowService } from '../../../../services/message-show.service';

@Component({
  selector: 'app-ecourse-list',
  templateUrl: './ecourse-list.component.html',
  styleUrls: ['./ecourse-list.component.scss']
})
export class EcourseListComponent implements OnInit {

  categiesList: any = [];
  institute_id: any;
  isRippleLoad: boolean = false;
  showSettings: boolean = true;
  outputMessage: any = '';
  settingDetails: any = {
    "institute_id": 100058,
    "video_watermark": "Megha",
    "is_video_public": "N",
    "watermark_opacity": 1,
    "watermark_color": "#2680eb",
    "watermark_font_size": 10,
    "video_watch_limit_per_video": 0,
    "storage_capacity_threshold_alerts": null,
    "bandwidth_threshold_alerts": null,
    "watermark_text_moving_interval": 0,
    "moving_text_type": "rtext"
  }

  constructor(
    private _http: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private router: Router
  ) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    console.log("EcourseListComponent");
  }

  ngOnInit() {
    this.getcategoriesList();
    this._http.routeList = [];
    let obj = { routeLink: '/view/activity/ecourse-file-manager/ecourses', name: 'E-Course', data: { data: null } };
    this._http.routeList.push(obj);
    sessionStorage.setItem('routeListForEcourse', JSON.stringify(this._http.routeList));

    this._http.data.subscribe(data => {
      // console.log(data);
      if (data == 'list') {
        this.getcategoriesList();
        this._http.updatedDataSelection(null);
      }
    });
  }

  getToSubject(ecourse) {
    if (sessionStorage.getItem('routeListForEcourse')) {
      this.router.navigate(['/view/activity/ecourse-file-manager/ecourses/' + ecourse.course_type_id + "/subjects"], { queryParams: { data: window.btoa(ecourse.course_type) } });
    }
  }

  getSettingDetails(){
    // <base_url>/instFileSystem/getStudyMaterialSetting/{institute_id}
    let url = "/api/v1/instFileSystem/getStudyMaterialSetting/" + this.institute_id;
    this.isRippleLoad = true;
    this.showSettings = true;
    this._http.getData(url).subscribe((res: any) => {
      console.log("getSettingDetails",res);
      this.isRippleLoad = false;
      this.settingDetails =res;
      this.showSettings = false;
      
    }, err => {
      this.isRippleLoad = false;
    });
  }


  clearObject() {
    this.showSettings = !this.showSettings;
  }

  Save_Setting_Details() {
    this.isRippleLoad = true;
    //<base_url>/instFileSystem/updateStudyMaterialSetting
    let url = "/api/v1/instFileSystem/updateStudyMaterialSetting";
    this.settingDetails.institute_id = this.institute_id ;
    this._http.putData(url,this.settingDetails).subscribe((res: any) => {
      console.log(res);
      this.isRippleLoad = false;
      this.showSettings = true;
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', res.message);

    }, err => {
      console.log(err);
      this.isRippleLoad = false;
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.message);
    });
  }

  getcategoriesList() {
    this.categiesList = [];
    this.isRippleLoad = true;
    let url = "/api/v1/instFileSystem/institute/" + this.institute_id + "/ecoursesList";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.isRippleLoad = false;
      this.categiesList = res;
      if (this.categiesList.length == 0) {
        this.outputMessage = 'No Data Found';
      }

    }, err => {
      this.isRippleLoad = false;
    });
  }

}
