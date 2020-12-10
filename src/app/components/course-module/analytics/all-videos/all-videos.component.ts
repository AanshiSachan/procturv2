import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


@Component({
  selector: 'app-all-videos',
  templateUrl: './all-videos.component.html',
  styleUrls: ['./all-videos.component.scss']
})
export class AllVideosComponent implements OnInit {

  allVideoData: any = [];
  pageOffset: any;
  pageSize: any;
  totalRecords: number = 0;
  totalElements: any;
  userwiseDetail: any = [];
  allVideo: boolean = false;
  PageIndex: number = 1;
  displayBatchSize: any = 10;
  sizeArr: any[] = [10, 15, 25, 50, 100, 150, 200, 500, 1000];
  videoTitle = "";
  title: boolean = false;
  constructor(private _http: HttpService,
    private msgService: MessageShowService,
    private auth: AuthenticatorService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {
    this.allVideo = true;
    // let url = '/api/v1/instFileSystem/videoReport/institute/' + sessionStorage.getItem('institute_id') + '?pageSize=15&pageOffset=0&sortBy=totalConsumedBandwidth ASC';
    this.allvideo(10, 1);
  }
  allvideo(batch, page) {
    let url = '/api/v1/instFileSystem/videoReport/institute/' + sessionStorage.getItem('institute_id') + '?pageSize=' + batch + '&pageOffset=' + page;
    this._http.getData(url).subscribe(
      (resp: any) => {
        // this.pageSize = resp.result.pageSize;
        this.allVideoData = resp.result.response;
        this.totalRecords = resp.result.totalElements;
        console.log(this.allVideoData);
      },
      (err) => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      });
  }

  totalVideoTitle(val, t, batch, page) {
    this.PageIndex = page;
    sessionStorage.setItem('totalVideoTitle', val);
    sessionStorage.setItem('Title', t);
    this.videoTitle = t;
    this.title = true;
    this.allVideo = false;
    this.userwiseDetail = [];
    let url = '/api/v1/instFileSystem/videoReport/video/' + val + '?pageSize=' + batch + '&pageOffset=' + page + '&sortBy=createdDate ASC';
    // let url = '/api/v1/instFileSystem/videoReport/17841/' + val + '?pageSize=' + batch + '&pageOffset=' + page + '&sortBy=createdDate ASC';
    this._http.getData(url).subscribe(
      (resp: any) => {
        this.userwiseDetail = resp.result.video_list.response;
        this.totalRecords = resp.result.video_list.totalElements;        
        console.log(this.userwiseDetail);
      },
      (err) => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      });
  }
  fetchTableDataByPage(index) {
    if (this.allVideo) {
      this.PageIndex = index;
      let startindex = this.displayBatchSize * (index - 1);
      this.allVideoData = this.getDataFromDataSource(startindex);
    }
    else if (this.title) {
      this.PageIndex = index;
      let startindex = this.displayBatchSize * (index - 1);
      this.userwiseDetail = this.getDataFromDataSource(startindex);
    }


  }

  fetchNext() {
    if (this.allVideo) {
      this.PageIndex++;
      this.fetchTableDataByPage(this.PageIndex);
    }
    else if (this.title) {
      this.PageIndex++;
      this.fetchTableDataByPage(this.PageIndex);
    }



  }

  fetchPrevious() {
    if (this.allVideo) {
      if (this.PageIndex != 1) {
        this.PageIndex--;
        this.fetchTableDataByPage(this.PageIndex);
      }
    }
    else if (this.title) {
      if (this.PageIndex != 1) {
        this.PageIndex--;
        this.fetchTableDataByPage(this.PageIndex);
      }
    }

  }

  getDataFromDataSource(startindex) {
    if (this.allVideo) {
      this.allvideo(this.displayBatchSize, this.PageIndex);
    }
    else if (this.title) {
      this.totalVideoTitle(sessionStorage.getItem('totalVideoTitle'), sessionStorage.getItem('Title'), this.displayBatchSize, this.PageIndex);
    }


  }

  updateTableBatchSize(event) {
    if (this.allVideo) {
      this.PageIndex = 1;
      this.displayBatchSize = event;
      this.fetchTableDataByPage(this.PageIndex);
    }
    else if (this.title) {
      this.PageIndex = 1;
      this.displayBatchSize = event;
      this.fetchTableDataByPage(this.PageIndex);
    }


  }
}
