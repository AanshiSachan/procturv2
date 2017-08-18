import { Component, OnInit } from '@angular/core';
import { FetchenquirycampaignService } from '../../services/fetchenquirycampaign.service';
import { Observable } from 'rxjs/Rx';
import { EnquiryCampaign } from '../../model/enquirycampaign';
import 'rxjs/Rx';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-enquiry-manage',
  templateUrl: './enquiry-manage.component.html',
  styleUrls: ['./enquiry-manage.component.css']
})

export class EnquiryManageComponent implements OnInit {

  rows: any = [];
  optionsModel: any[];
  myOptions: IMultiSelectOption[];

  constructor(private enquire: FetchenquirycampaignService) {
    this.enquire.getAllEnquiry().subscribe(data => {
      /*       console.log(data); */
      this.rows = data;
    })
  }

  ngOnInit() {
    this.myOptions = [
      { name: 'Enquiry ID', id: 'institute_enquiry_id' }, { name: 'Institute ID', id: 'institution_id' }, { name: 'Enquiry No', id: 'enquiry_no' }, { name: 'Name', id: 'name' }, { name: 'Phone', id: 'phone' }, { name: 'Email', id: 'email' }, { name: 'Standard', id: 'standard' },
      { name: 'Gender', id: 'Gender' }, { name: 'Subjects', id: 'subjects' }, { name: 'Status', id: 'status' }, { name: 'Status Value', id: 'statusValue' }, { name: 'is Converted', id: 'is_converted' },
      { name: 'Follow up Date', id: 'followUpDate' }, { name: 'Occupation ID', id: 'occupation_id' }, { name: 'School ID', id: 'school_id' }, { name: 'Enquiry Date', id: 'enquiry_date' },
      { name: 'Standard ID', id: 'standard_id' }, { name: 'Subject ID', id: 'subject_id' }, { name: 'Reffered by', id: 'referred_by' }, { name: 'Source ID', id: 'source_id' },
      { name: 'Priority', id: 'priority' }, { name: 'Follow type', id: 'follow_type' }, { name: 'Assigned Name', id: 'assigned_name' }, { name: 'Is recent', id: 'is_recent' },
      { name: 'Slot ID', id: 'slot_id' }, { name: 'Slot', id: 'slot' }, { name: 'Update Date', id: 'updateDate' }, { name: 'Is Dashboard', id: 'isDashbord' }, { name: 'Is Report', id: 'isRport' }, { name: 'Total Count', id: 'totalcount' }, { name: 'New Enquiry Count', id: 'newEnqcount' }, { name: 'Enquiry Date', id: 'enquiry_no_date' },
      { name: 'Person Name', id: 'name_person' }, { name: 'Follow up date', id: 'followUpDateTime' }, { name: 'Standard subject', id: 'standard_subject' }, { name: 'Closed Reason', id: 'closedReasonText' }, { name: 'Follow up Time', id: 'followUpTime' }, { name: 'Filtered Status', id: 'filtered_statuses' }, { name: 'Filtered Slot', id: 'filtered_slots' }
    ];
  }

  toggle() {
    console.log(this.optionsModel);

/*     const isChecked = this.isChecked(col);

    if (isChecked) {
      this.columns = this.columns.filter(c => {
        return c.id !== col.id;
      });
    } else {
      this.columns = [...this.columns, col]; */
    }

 /*    isChecked(col) {
      return this.columns.find(c => {
        return c.name === col.name;
      });
    } */

  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-primary',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: false,
    showCheckAll: true,
    showUncheckAll: true,
    closeOnClickOutside: true,
  };
  myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };
  columns: any = [
    { name: 'Enquiry ID', prop: 'institute_enquiry_id' }, { name: 'Institute ID', prop: 'institution_id' }, { name: 'Enquiry No', prop: 'enquiry_no' },
    { name: 'Name', prop: 'name' }, { name: 'Phone', prop: 'phone' }, { name: 'Email', prop: 'email' }, { name: 'Standard', prop: 'standard' },
    { name: 'Gender', prop: 'Gender' }, { name: 'Subjects', prop: 'subjects' },
    { name: 'Status', prop: 'status' }, { name: 'Status Value', prop: 'statusValue' },
    { name: 'is Converted', prop: 'is_converted' }, { name: 'Follow up Date', prop: 'followUpDate' },
    { name: 'Occupation ID', prop: 'occupation_id' }, { name: 'School ID', prop: 'school_id' },
    { name: 'Enquiry Date', prop: 'enquiry_date' }, { name: 'Standard ID', prop: 'standard_id' },
    { name: 'Subject ID', prop: 'subject_id' }, { name: 'Reffered by', prop: 'referred_by' },
    { name: 'Source ID', prop: 'source_id' }, { name: 'Priority', prop: 'priority' }, { name: 'Follow type', prop: 'follow_type' }, { name: 'Assigned Name', prop: 'assigned_name' },
    { name: 'Is recent', prop: 'is_recent' }, { name: 'Slot ID', prop: 'slot_id' }, { name: 'Slot', prop: 'slot' }, { name: 'Update Date', prop: 'updateDate' },
    { name: 'Is Dashboard', prop: 'isDashbord' }, { name: 'Is Report', prop: 'isRport' }, { name: 'Total Count', prop: 'totalcount' }, { name: 'New Enquiry Count', prop: 'newEnqcount' },
    { name: 'Enquiry Date', prop: 'enquiry_no_date' }, { name: 'Person Name', prop: 'name_person' }, { name: 'Follow up date', prop: 'followUpDateTime' }, { name: 'Standard subject', prop: 'standard_subject' },
    { name: 'Closed Reason', prop: 'closedReasonText' }, { name: 'Follow up Time', prop: 'followUpTime' }, { name: 'Filtered Status', prop: 'filtered_statuses' }, { name: 'Filtered Slot', prop: 'filtered_slots' }
  ];
}
