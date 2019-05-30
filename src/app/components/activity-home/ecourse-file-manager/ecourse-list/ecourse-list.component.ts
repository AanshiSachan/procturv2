import { Component, OnInit, EventEmitter, Output, OnChanges, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { EcourseFileManagerComponent } from '../ecourse-file-manager.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ecourse-list',
  templateUrl: './ecourse-list.component.html',
  styleUrls: ['./ecourse-list.component.scss']
})
export class EcourseListComponent implements OnInit {

  categiesList: any = [];
  institute_id: any;
  isRippleLoad: boolean = false;
  outputMessage:any ='';

  constructor(
    private _http: HttpService,
    private auth: AuthenticatorService,
    private router: Router
  ) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
  }

  ngOnInit() {
    this.getcategoriesList();
    this._http.routeList = [];
    let obj = { routeLink: '/view/activity/ecourse-file-manager/ecourses', name: 'E-Course', data: { data: null } };
    this._http.routeList.push(obj);
    sessionStorage.setItem('routeListForEcourse', JSON.stringify(this._http.routeList));

    this._http.data.subscribe(data => {
      console.log(data);
      if (data == 'list') { this.getcategoriesList();
        this._http.updatedDataSelection(null); }
    });
  }

  getToSubject(ecourse) {
    if (sessionStorage.getItem('routeListForEcourse')) {
      this.router.navigate(['/view/activity/ecourse-file-manager/ecourses/' + ecourse.course_type_id + "/subjects"], { queryParams: { data: window.btoa(ecourse.course_type) } });
    }
  }

  getcategoriesList() {
    this.categiesList = [];
    this.isRippleLoad = true;
    let url = "/api/v1/instFileSystem/institute/" + this.institute_id + "/ecoursesList";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.isRippleLoad = false;
      this.categiesList = res;
      if(this.categiesList.length==0){
        this.outputMessage ='No Data Found';
      }

    }, err => {
      this.isRippleLoad = false;
    });
  }

}
