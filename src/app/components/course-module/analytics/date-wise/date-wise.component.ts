import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';

@Component({
  selector: 'app-date-wise',
  templateUrl: './date-wise.component.html',
  styleUrls: ['./date-wise.component.scss']
})
export class DateWiseComponent implements OnInit, OnDestroy {

  dateWiseSelection: boolean = false;
  sizeArr: any[] = [10, 15, 25, 50, 100, 150, 200, 500, 1000];
  videoWiseSelection: boolean = false;
  userwiseDetail: any = [];
  from_date = moment(new Date()).format('YYYY-MM-DD');
  videoData: any = [];
  PageIndex: number = 1;
  displayBatchSize: any = 10;
  weekDataSource: any = [];
  videoDataSource: any = [];
  userDataSource: any = [];
  selectType: any;
  totalRecords: number = 0;
  perPage: number = 10;
  searchText = "";
  searchText1 = "";
  to_date = moment(new Date()).format('YYYY-MM-DD');
  totalElements: any;
  title = "";
  userWiseSelection: boolean = false;
  searchflag: boolean = false;
  dropDownFilter: boolean = false;
  dropDownFilerVideo: boolean = false;
  showDateSelection: boolean = false;
  instituteId: any = sessionStorage.getItem('institute_id');
  datelineRange: any[] = [];
  weekData: any = [];
  chartFormat: any ='';
  max_graph_value: any = '';
  constructor(private _http: HttpService,
    private msgService: MessageShowService,
    private auth: AuthenticatorService) { }

  ngOnInit() {
    this.dateWiseSelection = true;
    this.select('daily');
  }

  ngOnDestroy() {
    sessionStorage.removeItem('fromDate');
  }

  filter(val) {
    switch (val) {
      case 'date': this.dropDownFilter = !this.dropDownFilter;
        break;
      case 'video': this.dropDownFilerVideo = true;
        break;
    }
  }
  select(val) {
    console.log("asd", val);
    let url: any;
    switch (val) {

      case 'daily': this.showDateSelection = false;
        this.datelineRange[1] = moment(new Date()).format('DD-MM-YYYY');
        this.datelineRange[0] = moment(new Date()).subtract(10, 'days').format('DD-MM-YYYY');
        this.chartFormat = 'DD-MMM-YYYY';
        url = '/api/v1/instFileSystem/videoReport/report/' + sessionStorage.getItem('institute_id') + '?from=' + this.datelineRange[0] + '&to=' + this.datelineRange[1] + '&reportType=0';
        this.dailyReport(url);
        break;
      case 'monthly': this.showDateSelection = false;
        this.chartFormat = 'MMM';
        url = '/api/v1/instFileSystem/videoReport/report/' + sessionStorage.getItem('institute_id') + '?reportType=1';//monthly
        this.dailyReport(url);
        break;
      case 'yearly': this.showDateSelection = false;
        this.chartFormat = 'YYYY';
        url = '/api/v1/instFileSystem/videoReport/report/' + sessionStorage.getItem('institute_id') + '?reportType=2' //Year
        this.dailyReport(url);
        break;
      case 'custom': this.showDateSelection = true;
      this.chartFormat = 'DD-MMM-YYYY';
        break;
    }

  }
  custom() {
    let url = '/api/v1/instFileSystem//videoReport/report/' + sessionStorage.getItem('institute_id') + '?from=' + moment(this.from_date).format('DD-MM-YYYY') + '&to=' + moment(this.to_date).format('DD-MM-YYYY') + '&reportType=0';
    this.chartFormat = 'DD-MMM-YYYY';
    this.dailyReport(url);
  }

  dailyReport(url) {
    this.selectType = "date";
    this.weekData = [];
    this.auth.showLoader();
    this._http.getData(url).subscribe(
      (resp: any) => {
        this.auth.hideLoader();
        this.weekDataSource = resp.result.response;
        this.max_graph_value = Math.round(resp.result.max_graph_value);
        this.weekData = this.getDataFromDataSource(0);
        console.log('week' ,this.weekData);
        this.totalRecords = this.weekDataSource.length;

        this.generateChartData(this.weekDataSource);

      },
      (err) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      });
  }
  generateChartData(res) {
    let dateMap: any[] = [];
    let band: any[] = [];


    res.map(e => {
      dateMap.push(moment(e.date).format(this.chartFormat));
      band.push(e.consumed_bandwidth);
    });

    this.createChart(dateMap, band);
  }

  createChart(d: any[], f: any[]) {

    let band = f;


    let minWidth = 800;
    let dataLength = d.length;
    console.log(d.length);
    if (dataLength > 20 && dataLength < 35) {
      minWidth = 1100;
    }
    if (dataLength > 35 && dataLength < 50) {
      minWidth = 2100;
    }
    if (dataLength > 50 && dataLength < 75) {
      minWidth = 3100;
    }
    if (dataLength > 75 && dataLength < 100) {
      minWidth = 4100;
    }
    if (dataLength > 100 && dataLength < 150) {
      minWidth = 12000;
    }
    if (dataLength > 150 && dataLength < 200) {
      minWidth = 14000;
    }
    if (dataLength > 200) {
      minWidth = 16000;
    }

    (Highcharts as any).chart('chartWrap', {
      chart: {
        type: 'area',
        scrollablePlotArea: {
          minWidth: minWidth,
          scrollPositionX: 1
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        labels: {
          overflow: 'justify'
        },
        title: {
          text: 'Date'
        },
        categories: d
      },
      yAxis: {
        title: {
          text: 'Bandwidth (MB)'
        },
        min: 0,
        visible: true,
        tickAmount: 5,
        max: this.max_graph_value
      },
      tooltip: {
        useHTML: true,
        shared: false,
        formatter: function () {
          var point = this.point
          let tool = '';
          tool += 'Bandwidth ' + band[point.index] + '(MB)';
          tool += '<br>' + 'Date ' + d[point.index];
          return tool;
        },
      },
      plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
      },
      series: [{
        showInLegend: false,
        data: f
      }]
    })
  }
  videoWise(val, batch, page) {
    this.PageIndex = page;
    this.selectType = "video";
    let to = moment(val).format('DD-MM-YYYY');
    let from =moment(val).format('DD-MM-YYYY');
    if(this.chartFormat == 'MMM') {
      to = moment(val).startOf('month').format('DD-MM-YYYY');
      from = moment(val).endOf('month').format('DD-MM-YYYY');
    } else if(this.chartFormat == 'YYYY') {
      to = moment(val).startOf('year').format('DD-MM-YYYY');
      from = moment(val).endOf('year').format('DD-MM-YYYY');
    }
    sessionStorage.setItem('videWise', val);
    this.videoWiseSelection = true;
    this.dateWiseSelection = false;
    this.videoData = [];
    let url = '/api/v1/instFileSystem/videoReport/institute/' + sessionStorage.getItem('institute_id') + '?pageSize=' + batch + '&pageOffset=' + page + '&from=' + to + '&to=' + from;
    this._http.getData(url).subscribe(
      (resp: any) => {
        this.videoData = resp.result.response;
        sessionStorage.setItem('fromDate', val);
        // this.videoData = this.getDataFromDataSource(0);
        // if (this.videoWiseSelection) {
        // this.totalElements = resp.result.totalElements;
        this.totalRecords = resp.result.totalElements;
        // }
        console.log(this.videoData);
      },
      (err) => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      });
  }

  userwise(val, t, batch, page) {
    this.title = t;
    this.selectType = "user";
    sessionStorage.setItem('userWise', val);
    sessionStorage.setItem('title', this.title);
    this.userwiseDetail = [];
    // this.totalElements = 
    this.userWiseSelection = true;
    this.videoWiseSelection = false;
    let date = sessionStorage.getItem('fromDate');
    let url = '/api/v1/instFileSystem/videoReport/video/' + val + '?pageSize=' + batch + '&pageOffset=' + page + '&sortBy=createdDate ASC';
    if(date!='' && date != null) {
      let to = moment(date).format('DD-MM-YYYY');
      let from =moment(date).format('DD-MM-YYYY');
      if(this.chartFormat == 'MMM') {
        to = moment(date).startOf('month').format('DD-MM-YYYY');
        from = moment(date).endOf('month').format('DD-MM-YYYY');
      } else if(this.chartFormat == 'YYYY') {
        to = moment(date).startOf('year').format('DD-MM-YYYY');
        from = moment(date).endOf('year').format('DD-MM-YYYY');
      }
      url = url.concat('&from=' + to + '&to=' + from);
    }
    this._http.getData(url).subscribe(
      (resp: any) => {
        this.userwiseDetail = resp.result.video_list.response;
        // this.userwiseDetail = this.getDataFromDataSource(0);
        console.log(" this.userwiseDetail", this.userwiseDetail);
        this.totalRecords = resp.result.video_list.totalElements;
      },
      (err) => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      });
  }

  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      let searchData: any;
      searchData = this.videoData.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.videoData = searchData;
      this.searchflag = true;
    }
    else {
      this.videoWise(sessionStorage.getItem('videWise'), this.displayBatchSize, this.PageIndex);

    }
  }
  searchDatabaseUser() {
    if (this.searchText1 != "" && this.searchText1 != null) {
      let searchData: any;
      searchData = this.userwiseDetail.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText1.toLowerCase()))
      );
      this.userwiseDetail = searchData;
      this.searchflag = true;
    }
    else {
      this.userwise(sessionStorage.getItem('userWise'), sessionStorage.getItem('title'), this.displayBatchSize, this.PageIndex);

    }
  }

  fetchTableDataByPage(index) {
    if (this.dateWiseSelection) {
      this.PageIndex = index;
      let startindex = this.displayBatchSize * (index - 1);
      this.weekData = this.getDataFromDataSource(startindex);
    }
    else if (this.videoWiseSelection) {
      this.PageIndex = index;
      let startindex = this.displayBatchSize * (index - 1);
      this.videoData = this.getDataFromDataSource(startindex);
    }
    else if (this.userWiseSelection) {
      this.PageIndex = index;
      let startindex = this.displayBatchSize * (index - 1);
      this.userwiseDetail = this.getDataFromDataSource(startindex);
    }

  }

  fetchNext() {
    if (this.dateWiseSelection) {
      this.PageIndex++;
      this.fetchTableDataByPage(this.PageIndex);
    }
    else if (this.videoWiseSelection) {
      this.PageIndex++;
      this.fetchTableDataByPage(this.PageIndex);
    }
    else if (this.userWiseSelection) {
      this.PageIndex++;
      this.fetchTableDataByPage(this.PageIndex);
    }


  }

  fetchPrevious() {
    if (this.dateWiseSelection) {
      if (this.PageIndex != 1) {
        this.PageIndex--;
        this.fetchTableDataByPage(this.PageIndex);
      }
    }
    else if (this.videoWiseSelection) {
      if (this.PageIndex != 1) {
        this.PageIndex--;
        this.fetchTableDataByPage(this.PageIndex);
      }
    }
    else if (this.userWiseSelection) {
      if (this.PageIndex != 1) {
        this.PageIndex--;
        this.fetchTableDataByPage(this.PageIndex);
      }
    }

  }

  getDataFromDataSource(startindex) {
    if (this.dateWiseSelection) {
      let t = this.weekDataSource.slice(startindex, startindex + this.displayBatchSize);
      return t;
    }
    else if (this.videoWiseSelection) {
      this.videoWise(sessionStorage.getItem('videWise'), this.displayBatchSize, this.PageIndex);
      // let t = this.videoDataSource.slice(startindex, startindex + this.displayBatchSize);
      // return t;
    }
    else if (this.userWiseSelection) {
      this.userwise(sessionStorage.getItem('userWise'), sessionStorage.getItem('title'), this.displayBatchSize, this.PageIndex);
      // let t = this.userDataSource.slice(startindex, startindex + this.displayBatchSize);
      // return t;
    }

  }

  updateTableBatchSize(event) {
    if (this.dateWiseSelection) {
      this.PageIndex = 1;
      this.displayBatchSize = event;
      this.fetchTableDataByPage(this.PageIndex);
    }
    else if (this.videoWiseSelection) {
      this.PageIndex = 1;
      this.displayBatchSize = event;
      this.fetchTableDataByPage(this.PageIndex);
    }
    else if (this.userWiseSelection) {
      this.PageIndex = 1;
      this.displayBatchSize = event;
      this.fetchTableDataByPage(this.PageIndex);
    }

  }



  home() {
    this.dateWiseSelection = true;
    this.videoWiseSelection = false;
    this.userWiseSelection = false;
    this.select('daily');
  }
  dateValidationForFuture(e) {
    //console.log(e);
    let today = moment(new Date);
    let selected = moment(e);
    let diff = moment(selected.diff(today))['_i'];
    if (diff <= 0) {

    }
    else {
      this.to_date = moment(new Date).format('YYYY-MM-DD');
      this.from_date = moment(new Date).format('YYYY-MM-DD');
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Future date is not allowed");
    }
  }
}
