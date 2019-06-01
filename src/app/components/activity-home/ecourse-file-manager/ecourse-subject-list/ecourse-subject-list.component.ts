import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-ecourse-subject-list',
  templateUrl: './ecourse-subject-list.component.html',
  styleUrls: ['./ecourse-subject-list.component.scss']
})
export class EcourseSubjectListComponent implements OnInit {

  subjectList: any = [];
  institute_id: any;
  ecourse_id: any;
  isRippleLoad: boolean = false;
  outputMessage:any;
  constructor(
    private _http: HttpService,
    private auth: AuthenticatorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.route.params.subscribe(
      params => {
        this.ecourse_id = params.ecourse_id;
      }
    )
    this.route
      .queryParams
      .subscribe(params => {
        let name = window.atob(params['data']);
        if (sessionStorage.getItem('routeListForEcourse')) {
          this._http.routeList = JSON.parse(sessionStorage.getItem('routeListForEcourse'));
          this._http.routeList.splice(1, this._http.routeList.length);
          let obj = { routeLink: '/view/activity/ecourse-file-manager/ecourses/' + this.ecourse_id + '/subjects', data: { data: params['data'] }, name: name };
          this._http.routeList.push(obj);
          sessionStorage.setItem('routeListForEcourse', JSON.stringify(this._http.routeList));
        }
      });
  }

  ngOnInit() {
    this.getSubjectList();
    this._http.routeList.splice(2, this._http.routeList.length);
  }

  getSubjectList() {
    this.subjectList = [];
    this.isRippleLoad = true;
    let url = "/api/v1/ecourse/" + this.institute_id + "/" + this.ecourse_id + "/subjects";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.isRippleLoad = false;
      this.subjectList = res;
      if(this.subjectList.length==0){
        this.outputMessage ='No Data Found';
      }
    }, err => {
      this.isRippleLoad = false;
    });
  }

  getToSubjectMaterials(subject) {
    this.router.navigate(["/view/activity/ecourse-file-manager/ecourses/" + this.ecourse_id + "/subjects/" + subject.subject_id + "/materials"], { queryParams: { data: window.btoa(subject.subject_name) } });
  }

}
