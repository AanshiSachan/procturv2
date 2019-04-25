import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-ecourse-subject-list',
  templateUrl: './ecourse-subject-list.component.html',
  styleUrls: ['./ecourse-subject-list.component.scss']
})
export class EcourseSubjectListComponent implements OnInit {

  subjectList: any = [];
  institute_id: any;
  ecourse_id:any;

  constructor(
    private _http: HttpService,
    private auth: AuthenticatorService,
    private route: ActivatedRoute,
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
  }
  getSubjectList() {
    this.subjectList = [];
    let url = "/api/v1/ecourse/" + this.institute_id +"/"+ this.ecourse_id + "/subjects";
    
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.subjectList = res;
    });
  }

}
