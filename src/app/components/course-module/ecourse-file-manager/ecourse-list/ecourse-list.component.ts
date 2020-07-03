import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';

@Component({
  selector: 'app-ecourse-list',
  templateUrl: './ecourse-list.component.html',
  styleUrls: ['./ecourse-list.component.scss']
})
export class EcourseListComponent implements OnInit {

  categiesList: any = [];
  institute_id: any;
  showSettings: boolean = true;
  is_video_public: boolean = true;
  outputMessage: any = '';
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
    "watermark_text_moving_interval": 1
  }


  constructor(
    private _http: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private router: Router,
    private cd :ChangeDetectorRef
  ) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    console.log("EcourseListComponent");
  }

  ngOnInit() {
    this.getcategoriesList();
    this._http.routeList = [];
    let obj = { routeLink: '/view/course/ecourse-file-manager/ecourses', name: 'E-Course', data: { data: null } };
    this._http.routeList.push(obj);
    sessionStorage.setItem('routeListForEcourse', JSON.stringify(this._http.routeList));
      this.cd.detectChanges();
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
      let course_type = btoa(ecourse.course_type.replace(/[\u00A0-\u2666]/g, function(c) {
            return '&#' + c.charCodeAt(0) + ';';
      }));

      this.router.navigate(['/view/course/ecourse-file-manager/ecourses/' + ecourse.course_type_id + "/subjects"], { queryParams: { data:  course_type} });
    }
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
    let object = {
      "institute_id": this.settingDetails.institute_id,
      "video_watermark": this.settingDetails.video_watermark,
      "is_video_public": this.settingDetails.is_video_public,
      "watermark_opacity": this.settingDetails.watermark_opacity,
      "watermark_color": this.settingDetails.watermark_color,
      "watermark_font_size": this.settingDetails.watermark_font_size,
      "watermark_text_moving_interval": this.settingDetails.watermark_text_moving_interval,
      "vdocipher_bandwidth_threshold": this.settingDetails.vdocipher_bandwidth_threshold,
      "vdocipher_storage_capacity_threshold": this.settingDetails.vdocipher_storage_capacity_threshold
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

  getcategoriesList() {
    this.categiesList = [];
    this.auth.showLoader();
    let url = "/api/v1/instFileSystem/institute/" + this.institute_id + "/ecoursesList";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.auth.hideLoader();
      this.categiesList = res;
      if (this.categiesList.length == 0) {
        this.outputMessage = 'No data found';
      }

    }, err => {
      this.auth.hideLoader();
    });
  }

}
