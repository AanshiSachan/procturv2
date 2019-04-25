import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpService } from '../../../../services/http.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { EcourseFileManagerComponent } from '../ecourse-file-manager.component';
import { Router} from '@angular/router';

@Component({
  selector: 'app-ecourse-list',
  templateUrl: './ecourse-list.component.html',
  styleUrls: ['./ecourse-list.component.scss']
})
export class EcourseListComponent implements OnInit {

  categiesList: any = [];
  institute_id: any;

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
  }

  getToSubject(ecourse){
     this.router.navigateByUrl("/view/activity/ecourse-file-manager/ecourses/"+ecourse.course_type_id+"/subjects");
     let  obj ={routeLink:'../ecourses/'+ecourse.course_type_id+'/subjects',name:ecourse.course_type};
     this._http.routeList.push(obj);
  }

  getcategoriesList() {
    this.categiesList = [];
    let url = "/api/v1/instFileSystem/institute/" + this.institute_id + "/ecoursesList";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.categiesList = res;
    });
  }
}
