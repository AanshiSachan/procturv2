import {
  Component, OnInit, ViewChild, Input, Output, EventEmitter, HostListener,
  AfterViewInit, OnDestroy, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef,
  SimpleChanges, OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { updateEnquiryForm } from '../../../../model/update-enquiry-form';
import * as moment from 'moment';
import { FetchprefilldataService } from '../../../../services/fetchprefilldata.service';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'enquiry-sidebar',
  templateUrl: './enquiry-sidebar.component.html',
  styleUrls: ['./enquiry-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnquirySidebarComponent implements OnChanges, OnDestroy {



  hourArr: any[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  minArr: any[] = ['', '00', '15', '30', '45'];
  meridianArr: any[] = ['', "AM", "PM"];
  hour: string = ''; minute: string = ''; meridian: string = '';

  rowData: any;
  instituteEnqId: any;

  @Input() enquiryRow: any;
  @Input() priorityArr: any;
  @Input() statusArr: any;
  @Input() followupArr: any;
  @Input() row: any;
  @Input() customComp: any[];

  @Output() updateEnq = new EventEmitter<any>();
  @Output() cancelUpdate = new EventEmitter<any>();



  @ViewChild('hourpar') h: ElementRef;
  @ViewChild('minutepar') min: ElementRef;
  @ViewChild('meridianpar') mer: ElementRef;
  @ViewChild('acc') acc: ElementRef;



  updateFormData: updateEnquiryForm = {
    comment: "",
    status: "",
    statusValue: "",
    institution_id: sessionStorage.getItem('institute_id'),
    isEnquiryUpdate: "Y",
    closedReason: null,
    slot_id: null,
    priority: "",
    follow_type: "",
    followUpDate: "",
    commentDate: moment().format('YYYY-MM-DD'),
    followUpTime: "",
    followUpDateTime: '',
    isEnquiryV2Update: "N",
    isRegisterFeeUpdate: "N",
    amount: null,
    paymentMode: null,
    paymentDate: null,
    reference: null,
  }



  updateFormComments: any = []; updateFormCommentsBy: any = []; updateFormCommentsOn: any = [];



  constructor(private prefill: FetchprefilldataService, private cd: ChangeDetectorRef, private appC: AppComponent) { }



  ngOnChanges() {
    this.cd.markForCheck();
    this.enquiryRow;
    this.priorityArr;
    this.statusArr;
    this.priorityArr;
    this.row;
    this.customComp;
    this.instituteEnqId = this.enquiryRow;
    this.rowData = this.row;
    this.updateFormData.priority = "";
    this.updateFormData.follow_type = "";
    this.updateFormData.statusValue = "";
    this.hour = "";
    this.minute = "";
    this.meridian = "";
    this.getDetailsById(this.instituteEnqId);
  }



  ngOnDestroy() {
  }


  getDetailsById(id) {
    this.cd.markForCheck();
    this.updateFormData.priority = this.rowData.priority;
    this.updateFormData.follow_type = this.rowData.follow_type;
    this.updateFormData.statusValue = this.rowData.statusValue;
    this.prefill.fetchAllDataEnquiry(id).subscribe(res => {
      this.updateFormData.followUpDate = res.followUpDate;
      this.cd.markForCheck();
      let followUpDateTime = res.followUpDate + " " + res.followUpTime
      if (res.followUpTime != '' && res.followUpTime != null) {
        this.hour = moment(followUpDateTime).format('h');
        this.h.nativeElement.classList.add('has-value');
        this.minute = moment(followUpDateTime).format('mm');
        this.min.nativeElement.classList.add('has-value');
        this.meridian = moment(followUpDateTime).format('a').toString().toUpperCase();
        this.mer.nativeElement.classList.add('has-value');
      }
      else {
        this.h.nativeElement.classList.remove('has-value');
        this.min.nativeElement.classList.remove('has-value');
        this.mer.nativeElement.classList.remove('has-value');
      }
      this.updateFormComments = res.comments;
      this.updateFormCommentsOn = res.commentedOn;
      this.updateFormCommentsBy = res.commentedBy;
    });
  }


  getPriority(id): string {
    let temp: string = ""
    this.priorityArr.forEach(el => {
      if (el.data_key === id) {
        temp = el.data_value;
      }
    });
    //console.log(temp);
    return temp;
  }



  getStatus(id): string {
    let temp: string = ""
    this.statusArr.forEach(el => {
      if (el.data_key === id) {
        temp = el.data_value;
      }
    });
    return temp;
  }



  getFollowUp(id): string {
    let temp: string = ""
    this.followupArr.forEach(el => {
      if (el.data_key === id) {
        temp = el.data_value;
      }
    });
    return temp;
  }



  getStatusReverse(id): string {
    let temp: string = ""
    this.statusArr.forEach(el => {
      if (el.data_value === id) {
        temp = el.data_key;
      }
    });
    return temp;
  }




  getFollowUpReverse(id): string {
    let temp: string = ""
    this.followupArr.forEach(el => {
      if (el.data_value === id) {
        temp = el.data_key;
      }
    });
    return temp;
  }




  getPriorityReverse(id): string {
    let temp: string = ""
    this.priorityArr.forEach(el => {
      if (el.data_value === id) {
        temp = el.data_key;
      }
    });
    //console.log(temp);
    return temp;
  }




  clearupdateDate() {
    this.updateFormData.followUpDate = "";
    this.hour = '';
    this.minute = '';
    this.meridian = '';
  }




  closeSideNav() {
    this.cancelUpdate.emit(null);
  }



  createUpdateForm() {
    if (this.validateTime()) {
      this.updateFormData.comment = "Enquiry Updated. " + this.updateFormData.comment;
      this.updateFormData.priority = this.updateFormData.priority == "" ? "" : this.getPriorityReverse(this.updateFormData.priority);
      this.updateFormData.status = this.updateFormData.statusValue == "" ? "" : this.getStatusReverse(this.updateFormData.statusValue);
      this.updateFormData.follow_type = this.updateFormData.follow_type == "" ? "" : this.getFollowUpReverse(this.updateFormData.follow_type);
      this.updateFormData.followUpTime = this.hour + ":" + this.minute + " " + this.meridian;
      this.updateFormData.followUpDate = moment(this.updateFormData.followUpDate).format('YYYY-MM-DD');
      this.pushUpdatedEnquiry(this.updateFormData);
    }
    else {
      let msg = {
        type: 'error',
        title: 'Invalid Time Input',
        body: 'Please select a valid time for follow up'
      }
      this.appC.popToast(msg);
    }
  }


  /* Push the updated enquiry to server */
  pushUpdatedEnquiry(obj) {
    this.updateEnq.emit(obj);
    this.updateFormData.comment = "";
    this.updateFormData.priority = this.updateFormData.priority == "" ? "" : this.getPriority(this.updateFormData.priority);
    this.updateFormData.status = this.updateFormData.statusValue == "" ? "" : this.getStatus(this.updateFormData.statusValue);
    this.updateFormData.follow_type = this.updateFormData.follow_type == "" ? "" : this.getFollowUp(this.updateFormData.follow_type);
  }



  validateTime(): boolean {
    /* some time selected by user or nothing*/
    if ((this.hour != '' && this.minute != '' && this.meridian != '') || (this.hour == '' && this.minute == '' && this.meridian == '')) {
      return true;
    }
    else {
      return false;
    }
  }




  /* Customiized click detection strategy */
  inputClicked(ev) {
    document.getElementById("bulk-drop").classList.add("hide");
    if (ev.target.classList.contains('form-ctrl')) {
      if (ev.target.classList.contains('bsDatepicker')) {
        var nodelist = document.querySelectorAll('.bsDatepicker');
        [].forEach.call(nodelist, (elm) => {
          elm.addEventListener('focusout', function (event) {
            event.target.parentNode.classList.add('has-value');
          });

        });
      }
      else if ((ev.target.classList.contains('form-ctrl')) && !(ev.target.classList.contains('bsDatepicker'))) {
        //document.getElementById(ev.target.id).click();
        ev.target.addEventListener('blur', function (event) {
          if (event.target.value != '') {
            event.target.parentNode.classList.add('has-value');
          } else {
            event.target.parentNode.classList.remove('has-value');
          }
        });
      }
    }
  }



}