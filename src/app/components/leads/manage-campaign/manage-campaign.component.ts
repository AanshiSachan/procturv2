import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageShowService } from '../../../services/message-show.service';
import { CampaignService } from '../services/campaign.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';

@Component({
  selector: 'app-manage-campaign',
  templateUrl: './manage-campaign.component.html',
  styleUrls: ['./manage-campaign.component.scss']
})
export class ManageCampaignComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
    isRippleLoad: false,
  };

  filters = {
    stundetName: "",
    contactNumber: "",
    campaignName: "-1",
    referredBy: "-1",
    source: "-1",
    assignedTo: "-1"
  };

  leadSearchInput: any;

  campaignList: any;
  referredByList: any;
  sourceList: any;
  assignedToList: any;

  leadsList: any;
  tempLeadlist: any;
  checkedIds: any[] = [];
  promoSMSList: any;
  selectedSMSList: any[] = [];

  // leads variables
  addLead = {
    phone: "",
    name: "",
    gender: "M",
    emailId: "",
    address: "",
    city: "",
    referredBy: "-1",
    source: "-1"
  };

  editLead = {
    phone: "",
    name: "",
    gender: "M",
    emailId: "",
    address: "",
    city: "",
    referredBy: "-1",
    source: "-1",
    list_id: "",
    base_id: ""
  };

  showEditLead: boolean = false;
  showSMS: boolean = false;

  // FOR PAGINATION
  pageIndex: number = 1;
  displayBatchSize: number = 100;
  totalCount: number = 0;
  sizeArr: any[] = [20, 50, 100, 150, 200, 500];


  constructor(
    private campaignService: CampaignService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService
  ) { }

  ngOnInit() {
    this.fetchPreFillData();
  }

  fetchPreFillData(){
    this.jsonFlag.isRippleLoad = true;
    // get all source list
    this.campaignService.getAllSources().subscribe(
      res => {
        this.sourceList = res;
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please check your internet connection or contact at support@proctur.com if the issue persist');
        this.jsonFlag.isRippleLoad = false;
      }
    );
    // get all assigned list
    this.campaignService.getAssignedList().subscribe(
      res => {
        this.assignedToList = res;
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        this.jsonFlag.isRippleLoad = false;
      }
    );
    // get all referred by list
    this.campaignService.getReferredByList().subscribe(
      res => {
        this.referredByList = res;
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        this.jsonFlag.isRippleLoad = false;
      }
    );
    // fetch all leads(students)
    this.campaignService.getCampaignList().subscribe(
      res => {
        this.campaignList = res;
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        this.jsonFlag.isRippleLoad = false;
      }
    );
    this.searchCampaign();
  }

  searchCampaign(){
    this.pageIndex = 1;
    this.jsonFlag.isRippleLoad = true;
    let obj = {
      "assigned_to": this.filters.assignedTo,
    	"name": "" + this.filters.stundetName + "",
    	"mobile": this.filters.contactNumber,
    	"list_id":  this.filters.campaignName,
    	"source_id": this.filters.source,
    	"referred_by": this.filters.referredBy,
      "start_index": 0,
      "batch_size": 100

    }

    this.campaignService.searchLeads(obj).subscribe(
      res => {
        let result: any;
        result = res;
        this.jsonFlag.isRippleLoad = false;
        this.leadsList = res;
        this.tempLeadlist = res;
        this.totalCount = 0;
        if(result.length > 0){
          this.totalCount = this.leadsList[0].totalCount;
        }
      },
      err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        this.jsonFlag.isRippleLoad = false;
      }
    );
  }

  searchDatabase(){   // search in the array for search input string
    this.leadsList = this.tempLeadlist;
    if (this.leadSearchInput == undefined || this.leadSearchInput == null) {
      this.leadSearchInput = "";
    }
    else {
      let searchData = this.tempLeadlist.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.leadSearchInput.toLowerCase()))
      );
      this.leadsList = searchData;
    }
  }

  downloadPdf(){
    let arr = [];
    for(let i = 0; i < this.tempLeadlist.length; i++){
      this.tempLeadlist[i].converted_status = "-";
      if(this.tempLeadlist[i].converted == 1){
        this.tempLeadlist[i].converted_status = "Converted";
      }
    }
    this.tempLeadlist.map(
      (ele: any) => {
        let json = [
          ele.mobile,
          ele.name,
          ele.email,
          ele.address,
          ele.city,
          ele.gender,
          ele.referred_name,
          ele.source_name,
          ele.converted_status
        ]
        arr.push(json);
      })

    let rows = [];
    rows = [['Mobile', 'Name', 'Email', 'Address', 'City', 'Gender', 'Referred By', 'Source', 'Status']]
    let columns = arr;
    this._pdfService.exportToPdf(rows, columns, 'Leads List');
  }

  rowCheckBoxClick(row){
    let validate_check = false;

    for(let i = 0; i < this.checkedIds.length; i++){
      if(this.checkedIds[i] == row.base_id){
        this.checkedIds.splice(i,1);
        const ele = document.getElementById("check_all") as HTMLInputElement;
        ele.checked = false;
        return validate_check = true;
      }
    }
    if(!validate_check){
      this.checkedIds.push(row.base_id)
    }
  }

  checkAllLead(event){
    this.checkedIds = [];
    let event_flag = event.target.checked;
    for(let i = 0; i < this.leadsList.length; i++){
      if(this.leadsList[i].converted == 0){
        const ele = document.getElementById("check"+i) as HTMLInputElement;
        ele.checked = event_flag;
        if(event_flag){
          this.checkedIds.push(this.leadsList[i].base_id)
        }
      }
    }
  }


  showPromoSMS(){
    if(this.checkedIds.length == 0){
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'No lead is selected. Kindly select at least one!');
      this.showSMS = false;
    }
    else{
      let obj = {
        "status": 1,
  	     "sms_type": "Promotional"
      }
      this.jsonFlag.isRippleLoad = true;
      this.showSMS = true;
      this.campaignService.getPromoSMS(obj).subscribe(
        res => {
          this.promoSMSList = res;
          this.jsonFlag.isRippleLoad = false;
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          this.jsonFlag.isRippleLoad = false;
        }
      );
    }
  }

  selectMsg(msg){
    let validate_check = false;
    for(let i = 0; i < this.selectedSMSList.length; i++){
      if(this.selectedSMSList[i] == msg.message_id){
        this.selectedSMSList.splice(i,1);
        return validate_check = true;
      }
    }
    if(!validate_check){
      this.selectedSMSList.push(msg.message_id)
    }
  }

  sendSMS(){
    if(this.selectedSMSList.length == 0){
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'No SMS is selected. Kindly select at least one!')
    }
    else{
      let obj = {
        "baseIds": this.checkedIds,
        "messageArray": this.selectedSMSList
      }
      this.jsonFlag.isRippleLoad = true;
      this.campaignService.sendPromoSMS(obj).subscribe(
        res => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Message has been sent successfully.');
          this.jsonFlag.isRippleLoad = false;
          this.showSMS = false;
          this.selectedSMSList = [];
          let element = document.getElementsByClassName('modal-backdrop') as HTMLCollectionOf<HTMLElement>;
          for(let i = 0; i < element.length; i++){
            element[i].style.display = "none";
          }
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          this.jsonFlag.isRippleLoad = false;
          this.showSMS = false;
          this.selectedSMSList = [];
          let element = document.getElementsByClassName('modal-backdrop') as HTMLCollectionOf<HTMLElement>;
          for(let i = 0; i < element.length; i++){
            element[i].style.display = "none";
          }
        }
      );
    }
  }

  convertToEnq(){
    if(this.checkedIds.length == 0){
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'No lead is selected. Kindly select at least one!')
    }
    else{
      let obj = {
        "baseIds": this.checkedIds
      }
      this.jsonFlag.isRippleLoad = true;
      this.campaignService.convertToEnq(obj).subscribe(
        res => {
          this.searchCampaign();
          this.jsonFlag.isRippleLoad = false;
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          this.jsonFlag.isRippleLoad = false;
        }
      );
    }
  }

  deleteMultipleLeads(){
    if(this.checkedIds.length == 0){
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'No lead is selected. Kindly select at least one!')
    }
    else{
      let obj = {
        "baseIds": this.checkedIds.toString()
      }
      this.jsonFlag.isRippleLoad = true;
      this.campaignService.deleteMultiLeads(obj).subscribe(
        res => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Lead(s) archived successfully');
          this.jsonFlag.isRippleLoad = false;
          this.searchCampaign();
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          this.jsonFlag.isRippleLoad = false;
        }
      );
    }
  }

  // CRUD of leads

  saveNewLead(){
    var validation_flag = true;
    if (this.addLead.phone != null && this.addLead.phone != "") {
      if(this.addLead.phone.length != 10){
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Enter valid phone number');
        validation_flag = false;
      }
    }
    else{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Enter contact details');
      validation_flag = false;
    }

    if(this.addLead.source == "-1"){
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Please select source details');
      validation_flag = false;
    }
    // if(!this.validateEmail(this.addLead.emailId)){
    //   validation_flag = this.validateEmail(this.addLead.emailId)
    // }
    if(validation_flag){
      let obj = {
        "name": this.addLead.name,
      	"mobile": this.addLead.phone,
      	"address": this.addLead.address,
      	"email": this.addLead.emailId,
      	"gender": this.addLead.gender,
      	"city": this.addLead.city,
      	"source_id": this.addLead.source,
      	"referred_by": this.addLead.referredBy
      };
      this.jsonFlag.isRippleLoad = true;
      this.campaignService.createLead(obj).subscribe(
        res => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Lead added successfully');
          this.jsonFlag.isRippleLoad = false;
          document.getElementById("addLead").style.display = "none";
          let element = document.getElementsByClassName('modal-backdrop') as HTMLCollectionOf<HTMLElement>;
          for(let i = 0; i < element.length; i++){
            element[i].style.display = "none";
          }
          this.clearLeadForm();
          this.searchCampaign();
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          this.jsonFlag.isRippleLoad = false;
        }
      );
    }
  }


  editLeadRow(row){
    this.editLead.name = row.name;
    this.editLead.phone = row.mobile;
    this.editLead.address = row.address;
    this.editLead.emailId = row.email;
    this.editLead.gender = row.gender;
    this.editLead.city = row.city;
    this.editLead.source = row.source_id;
    this.editLead.referredBy = row.referred_by;
    this.editLead.list_id = row.list_id;
    this.editLead.base_id = row.base_id;

    this.showEditLead = true;
  }

  updateLead(){
    var validation_flag = true;
    if (this.editLead.phone != null && this.editLead.phone != "") {
      if(this.editLead.phone.length != 10){
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Enter valid phone number');
        validation_flag = false;
      }
    }
    else{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Enter contact details');
      validation_flag = false;
    }
    // if(!this.validateEmail(this.editLead.emailId)){
    //   validation_flag = this.validateEmail(this.editLead.emailId)
    // }
    if(validation_flag){
      let obj = {
        "name": this.editLead.name,
      	"mobile": this.editLead.phone,
      	"address": this.editLead.address,
      	"email": this.editLead.emailId,
      	"gender": this.editLead.gender,
      	"city": this.editLead.city,
      	"source_id": this.editLead.source,
      	"referred_by": this.editLead.referredBy,
        "is_active": "Y"
      };
      this.jsonFlag.isRippleLoad = true;
      this.campaignService.updateLead(obj, this.editLead.list_id, this.editLead.base_id).subscribe(
        res => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Lead updated successfully');
          this.jsonFlag.isRippleLoad = false;
          this.showEditLead = false;
          document.getElementById("editLead").style.display = "none";
          let element = document.getElementsByClassName('modal-backdrop') as HTMLCollectionOf<HTMLElement>;
          for(let i = 0; i < element.length; i++){
            element[i].style.display = "none";
          }
          this.clearEditLeadForm();
          this.searchCampaign();
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          this.jsonFlag.isRippleLoad = false;
        }
      );
    }
  }

  deleteLead(row){
    if (confirm('Are you sure you want to delete lead?')){
      this.jsonFlag.isRippleLoad = true;
      this.campaignService.deleteLead(row.list_id, row.base_id).subscribe(
        res => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Lead deleted successfully');
          this.jsonFlag.isRippleLoad = false;
          this.searchCampaign();
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
          this.jsonFlag.isRippleLoad = false;
        }
      );
    }
  }

  clearEditLeadForm(){
    this.editLead.name = "";
    this.editLead.phone = "";
    this.editLead.address = "";
    this.editLead.emailId = "";
    this.editLead.gender = "M";
    this.editLead.city = "";
    this.editLead.source = "-1";
    this.editLead.referredBy = "-1";
    this.editLead.list_id = "";
    this.editLead.base_id = "";
  }

  clearLeadForm(){
    this.addLead.name = "";
    this.addLead.phone = "";
    this.addLead.address = "";
    this.addLead.emailId = "";
    this.addLead.gender = "M";
    this.addLead.city = "";
    this.addLead.source = "-1";
    this.addLead.referredBy = "-1";
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
    this.searchCampaign();
  }

  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.pageIndex = 1;
    this.displayBatchSize = parseInt(num);
    this.searchCampaign();
  }

  validateEmail(email) {
    if (email != '' && email != null) {
      var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (reg.test(email)) {
        return true;
      }
      else {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', 'Enter valid email address');
        return false;
      }
    } else {
      return true;
    }
  }

  toggleFilter(){
    var x = document.getElementById("advance_filter");
    if (x.style.display == "none" || x.style.display == "") {
      x.style.display = "flex";
      document.getElementById("searchBtn1").style.display = "none";
      document.getElementById("advBtn1").style.display = "none";
      document.getElementById("searchBtn2").style.display = "block";
      document.getElementById("advBtn2").style.display = "block";
      document.getElementById("lead-value-container").style.minHeight = "57vh";
    } else {
      x.style.display = "none";
      document.getElementById("searchBtn1").style.display = "block";
      document.getElementById("advBtn1").style.display = "block";
      document.getElementById("searchBtn2").style.display = "none";
      document.getElementById("advBtn2").style.display = "none";
      document.getElementById("lead-value-container").style.minHeight = "61vh";
    }
  }
}
