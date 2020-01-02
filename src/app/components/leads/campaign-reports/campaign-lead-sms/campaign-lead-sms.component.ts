import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageShowService } from '../../../../services/message-show.service';
import { getSMSService } from '../../../../services/report-services/get-sms.service';
import { CampaignService } from '../../services/campaign.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'app-campaign-lead-sms',
  templateUrl: './campaign-lead-sms.component.html',
  styleUrls: ['./campaign-lead-sms.component.scss']
})
export class CampaignLeadSmsComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    isRippleLoad: false,
  };

  dateFilter = {
    from_date: moment(new Date()).format('YYYY-MM-DD'),
    to_date: "",
    institution_id: "",
    start_index: 0,
    batch_size: 50
  };

  smsTotalCount: number = 0;
  smsSuccessCount: number = 0;
  smsFailedCount: number = 0;

  leadSmsSearchInput: any = "";
  leadSmsList: any;
  tempLeadSmslist: any;

  // FOR PAGINATION
  pageIndex: number = 1;
  displayBatchSize: number = 50;
  totalCount: number = 0;
  startindex: number = 0;

  constructor(
    private campaignService: CampaignService,
    private _msgService: MessageShowService,
    private getSms: getSMSService,
    private auth: AuthenticatorService,
  ) { }

  ngOnInit() {
    this.dateFilter.institution_id = sessionStorage.getItem('institute_id');
    this.getSmsReport(this.dateFilter);
  }

  getSmsReport(obj) {
    this.jsonFlag.isRippleLoad = true;
    if (obj.start_index == 0) {
      return this.campaignService.fetchSmsReport(obj).subscribe(
        (res: any) => {
          let result: any;
          result = res;
          this.jsonFlag.isRippleLoad = false;
          this.pageIndex = 1;
          this.totalCount = 0;
          this.leadSmsList = res;
          this.tempLeadSmslist = res;
          if(result.length > 0){
            this.totalCount = this.leadSmsList[0].total_count;
            this.smsTotalCount = this.leadSmsList[0].total_count;
            this.smsSuccessCount = this.leadSmsList[0].successful_count;
            this.smsFailedCount = this.leadSmsList[0].failure_count;
          }
        },
        err => {
          this.jsonFlag.isRippleLoad = false;
        }
      )
    }
    else {
      return this.campaignService.fetchSmsReport(obj).subscribe(
        (res: any) => {
          this.jsonFlag.isRippleLoad = false;
          this.leadSmsList = res;
        }
      )
    }
  }

  fetchSmsByDate() {
    this.dateFilter.start_index = 0;
    this.getSmsReport(this.dateFilter);
  }

  dateValidationForFuture(e) {
    //console.log(e);
    let today = moment(new Date);
    let selected = moment(e);
    let diff = moment(selected.diff(today))['_i'];
    if (diff <= 0) {
      let checkToDate = this.dateGreaterThanCheck(this.dateFilter.from_date, this.dateFilter.to_date);
      if(checkToDate){
        var tempToDate = moment(this.dateFilter.to_date).format("DD MMM YYYY");
      }
      else{
        this._msgService.showErrorMessage(this._msgService.toastTypes.info, '', "To date can not be lesser than From date");
        this.dateFilter.to_date = moment(tempToDate).format("DD MMM YYYY");
        return;
      }

      let checkFromDate = this.dateGreaterThanCheck(this.dateFilter.from_date, this.dateFilter.to_date);
      if(checkFromDate){
        var tempFromDate = moment(this.dateFilter.from_date).format("DD MMM YYYY");
      }
      else{
        this._msgService.showErrorMessage(this._msgService.toastTypes.info, '', "From date can not be greater than To date");
        this.dateFilter.from_date = moment(tempFromDate).format("DD MMM YYYY");
        return;
      }
    }
    else {
      this.dateFilter.to_date = moment(new Date).format('YYYY-MM-DD');
      this.dateFilter.from_date = moment(new Date).format('YYYY-MM-DD');
      this._msgService.showErrorMessage(this._msgService.toastTypes.info, '', "Future date is not allowed");
    }
  }

  graterThanToday(givenDate){
    let currentDate = new Date();
    givenDate = new Date(givenDate);
    if(givenDate > currentDate){
      return false;
    }
    else{
      return true;
    }
  }

  dateGreaterThanCheck(from_date, to_date){
    from_date = new Date(from_date);
    to_date = new Date(to_date);
    let currentDate = new Date();
    if(from_date > to_date){
      return false;
    }
    else if(from_date > currentDate){
      return false;
    }
    else{
      return true;
    }
  }

  searchDatabase(){   // quick search
    this.leadSmsList = this.tempLeadSmslist;
    if (this.leadSmsSearchInput == undefined || this.leadSmsSearchInput == null) {
      this.leadSmsSearchInput = "";
      this.dateFilter.start_index = 0;
      this.getSmsReport(this.dateFilter);
    }
    else {
      let searchData = this.tempLeadSmslist.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.leadSmsSearchInput.toLowerCase()))
      );
      this.leadSmsList = searchData;
    }
  }


  /*** pagination functions */
  /* Fetch next set of data from server and update table */
  fetchNext() {
    this.pageIndex++;
    this.fectchTableDataByPage(this.pageIndex);
  }

  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    this.pageIndex--;
    this.fectchTableDataByPage(this.pageIndex);
  }

  /* Fetch table data by page index */
  fectchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.dateFilter.start_index = startindex;
    this.getSmsReport(this.dateFilter);
  }

  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.pageIndex = 1;
    this.displayBatchSize = parseInt(num);
    this.dateFilter.start_index = this.startindex;
    this.getSmsReport(this.dateFilter);
  }

  openCalendar(id){
    document.getElementById(id).click();
  }


}
