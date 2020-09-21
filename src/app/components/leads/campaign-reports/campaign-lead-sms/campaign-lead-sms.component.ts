import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { MessageShowService } from '../../../../services/message-show.service';
import { getSMSService } from '../../../../services/report-services/get-sms.service';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-campaign-lead-sms',
  templateUrl: './campaign-lead-sms.component.html',
  styleUrls: ['./campaign-lead-sms.component.scss']
})
export class CampaignLeadSmsComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false
  };

  dateFilter = {
    from_date: moment(new Date()).format('MM-DD-YYYY'),
    to_date: moment(new Date()).format('MM-DD-YYYY'),
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
  from_date:any;
  to_date:any;
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
    let tempObj = {
      from_date: moment(obj.from_date).format('YYYY-MM-DD'),
      to_date: moment(obj.to_date).format('YYYY-MM-DD'),
      institution_id: obj.institution_id,
      start_index: 0,
      batch_size: 50
    }
    this.auth.showLoader();
    if(tempObj.to_date != null && tempObj.to_date != ""){
      tempObj.to_date = moment(tempObj.to_date).format("YYYY-MM-DD");
    }
    if (obj.start_index == 0) {
      return this.campaignService.fetchSmsReport(tempObj).subscribe(
        (res: any) => {
          let result: any;
          result = res;
          this.auth.hideLoader();
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
          this.auth.hideLoader();
        }
      )
    }
    else {
      return this.campaignService.fetchSmsReport(obj).subscribe(
        (res: any) => {
          this.auth.hideLoader();
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
      let checkFromDate = this.dateGreaterThanCheck(this.dateFilter.from_date, this.dateFilter.to_date);
      if(checkToDate){
        var tempToDate = moment(this.dateFilter.to_date).format("MM-DD-YYYY");
        if(checkFromDate){
          var tempFromDate = moment(this.dateFilter.from_date).format("MM-DD-YYYY");
        }
        else{
          this._msgService.showErrorMessage(this._msgService.toastTypes.info, '', "From date can not be greater than To date");
          this.dateFilter.from_date = moment(tempFromDate).format("MM-DD-YYYY");
          return;
        }
      }
      else{
        this._msgService.showErrorMessage(this._msgService.toastTypes.info, '', "To date can not be lesser than From date");
        this.dateFilter.to_date = moment(tempToDate).format("MM-DD-YYYY");
        return;
      }
    }
    else {
      this.dateFilter.to_date = moment(new Date).format('MM-DD-YYYY');
      this.dateFilter.from_date = moment(new Date).format('MM-DD-YYYY');
      this._msgService.showErrorMessage(this._msgService.toastTypes.info, '', "Future date is not allowed");
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
