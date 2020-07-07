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
  searchData: any = [];
  institute_id: any;
  is_video_public: boolean = true;
  outputMessage: any = '';
  searchValue: any = '';

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
      this.router.navigate(['/view/course/ecourse-file-manager/ecourses/' + ecourse.course_type_id + "/subjects"], { queryParams: { data: window.btoa(ecourse.course_type) } });
    }
  }


  getcategoriesList() {
    this.categiesList = [];
    this.auth.showLoader();
    let url = "/api/v1/instFileSystem/institute/" + this.institute_id + "/ecourses-list";
    this._http.getData(url).subscribe((res: any) => {
      console.log(res);
      this.auth.hideLoader();
      this.categiesList = res;
      this.categiesList.forEach(element => {
        element.size = 0
        element.categoryDtoList.forEach(category => {
          element.size = element.size + category.size;
        });
        element.size = (element.size / 1024);
      });
      this.searchData = res;
      if (this.categiesList.length == 0) {
        this.outputMessage = 'No data found';
      }

    }, err => {
      this.auth.hideLoader();
    });
  }

  searchTeacher() {
    if (this.searchValue != "" && this.searchValue != null) {
      let searchData = this.categiesList.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchValue.toLowerCase()))
      );
      this.searchData = searchData;
    } else {
      this.searchData = this.categiesList;
    }
  }

}
