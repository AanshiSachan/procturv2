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
  ecourse_id:any;
  isRippleLoad:boolean = false;

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
      console.log(params);
      this.ecourse_id = params.ecourse_id;
      }
    )
  }

  ngOnInit() {
    this.getSubjectList();
    this._http.routeList.splice(2,this._http.routeList.length);
  }

  getSubjectList() {
    this.subjectList = [];
    this.isRippleLoad= true;
    let url = "/api/v1/ecourse/" + this.institute_id +"/"+ this.ecourse_id + "/subjects";    
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.isRippleLoad= false;
      this.subjectList = res;
    },err=>{
      this.isRippleLoad= false;
    });
  }

  getToSubjectMaterials(subject) {
    let url ="/view/activity/ecourse-file-manager/ecourses/" +this.ecourse_id  + "/subjects/"+subject.subject_id+"/materials";
    this._http.routeList.splice(2,this._http.routeList.length);
    this.router.navigateByUrl(url);
    let obj = { routeLink: url, name: subject.subject_name };
    this._http.routeList.push(obj);
  }

}
