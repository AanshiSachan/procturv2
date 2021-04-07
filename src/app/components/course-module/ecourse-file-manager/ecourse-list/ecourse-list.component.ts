import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';
declare var $;

@Component({
  selector: 'app-ecourse-list',
  templateUrl: './ecourse-list.component.html',
  styleUrls: ['./ecourse-list.component.scss']
})
export class EcourseListComponent implements OnInit {

  categiesList: any = [];
  totalRecords: number = 0;
  searchData: any = [];
  institute_id: any;
  is_video_public: boolean = true;
  outputMessage: any = '';
  searchValue: any = '';
  PageIndex: number = 1;
  searchDataDataSource: any = [];
  displayBatchSize: any = 25;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  schoolModel:boolean = false;
  constructor(
    private _http: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.auth.schoolModel.subscribe(
      res => {
        this.schoolModel = false;
        if (res) {
          this.schoolModel = true;
        }
      }
    )
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
    this.getParams();
  }

  //Developed by - Nalini 
  // When vimeo file uploaded successfully then video status api is called based on video id and pop up msg is displayed
  getParams() {
    let url = window.location.href;
    if (url.indexOf("?") > -1) {
      let arr = url.split('?');
      if (url.length > 1 && arr[1] !== '') {
        window.location.href = url.substring(0, arr[0].length);
        this.activatedRoute.queryParams.subscribe(params => {
          let videoId = params['videoId'];
          if (videoId != '' && videoId != null) {
            $('#thankYou').modal('show');
            let obj = {
              "videoID": videoId,
              "institute_id": sessionStorage.getItem('institute_id'),
              "video_status": "Queued",
              "category_id": 305
            }
            let url = "/api/v1/instFileSystem/updateVideoStatus";

            this._http.postData(url, obj).subscribe((res: any) => {
              console.log(res);
            }, (err) => {
            });
          }
        });
      }
    }
  }

  getToSubject(ecourse) {
    if (sessionStorage.getItem('routeListForEcourse')) {
      let course_type = btoa(ecourse.course_type.replace(/[\u00A0-\u2666]/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
      }));

      this.router.navigate(['/view/course/ecourse-file-manager/ecourses/' + ecourse.course_type_id + "/subjects"], { queryParams: { data: course_type } });
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
      this.searchDataDataSource = res;
      this.searchData = this.getDataFromDataSource(0);
      this.totalRecords = this.searchDataDataSource.length;
      console.log("Total Records", this.totalRecords);
      // this.searchData = res;
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

  // pagination functions


  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.searchData = this.getDataFromDataSource(startindex);
  }

  fetchNext() {
    this.PageIndex++;
    this.fetchTableDataByPage(this.PageIndex);
  }

  fetchPrevious() {
    if (this.PageIndex != 1) {
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let t = this.searchDataDataSource.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }

  updateTableBatchSize(event) {
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.PageIndex);
  }
}
