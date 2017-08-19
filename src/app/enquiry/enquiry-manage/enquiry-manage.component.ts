import { Component, OnInit } from '@angular/core';
import { FetchenquirycampaignService } from '../../services/fetchenquirycampaign.service';
import { Observable } from 'rxjs/Rx';
import { EnquiryCampaign } from '../../model/enquirycampaign';
import 'rxjs/Rx';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';


@Component({
  selector: 'app-enquiry-manage',
  templateUrl: './enquiry-manage.component.html',
  styleUrls: ['./enquiry-manage.component.css']
})

export class EnquiryManageComponent implements OnInit {

  rows: any = [];
  optionsModel: any[];
  myOptions: IMultiSelectOption[];
  source: LocalDataSource;
  progress: number = 0;

  settings = {
    mode: 'external', hideSubHeader: true,
    actions: { add: false, edit: false, delete: false, columnTitle: '', position: 'right' },
    columns: {
      enquiry_no: { title: 'Enquiry No', filter: false, show: true }, name: { title: 'Name', filter: false, show: true }, phone: { title: 'Phone No', filter: false, show: true }, email: { title: 'Email', filter: false, show: true }, enquiry_date: { title: 'Enquiry Date', filter: false, show: true }, referred_by: { title: 'Reffered By', filter: false, show: true }, priority: { title: 'Priority', filter: false, show: true }, follow_type: { title: 'Follow type', filter: false, show: true }, status: { title: 'Status', filter: false, show: false }, institute_enquiry_id: { title: 'Enquiry ID', filter: false, show: false }, institution_id: { title: 'Institute ID', filter: false, show: false }, standard: { title: 'Standard', filter: false, show: false }, Gender: { title: 'Gender', filter: false, show: false }, subjects: { title: 'Subjects', filter: false, show: false }, statusValue: { title: 'Status Value', filter: false, show: false }, is_converted: { title: 'Is Converted', filter: false, show: false }, followUpDate: { title: 'Follow up Date', filter: false, show: false }, occupation_id: { title: 'Occupation ID', filter: false, show: false }, school_id: { title: 'School ID', filter: false, show: false }, standard_id: { title: 'Standard ID', filter: false, show: false }, subject_id: { title: 'Subject ID', filter: false, show: false }, source_id: { title: 'Source ID', filter: false, show: false }, assigned_name: { title: 'Assigned Name', filter: false, show: false }, is_recent: { title: 'Is recent', filter: false, show: false }, slot_id: { title: 'Slot ID', filter: false, show: false }, slot: { title: 'Slot', filter: false, show: false }, updateDate: { title: 'Update Date', filter: false, show: false }, isDashbord: { title: 'Is Dashboard', filter: false, show: false }, isRport: { title: 'Is Report', filter: false, show: false }, totalcount: { title: 'Total Count', filter: false, show: false }, newEnqcount: { title: 'New Enquiry Count', filter: false, show: false }, enquiry_no_date: { title: 'Enquiry Date', filter: false, show: false }, name_person: { title: 'Person Name', filter: false, show: false }, followUpDateTime: { title: 'Follow up date', filter: false, show: false }, standard_subject: { title: 'Standard subject', filter: false, show: false }, closedReasonText: { title: 'Closed Reason', filter: false, show: false }, followUpTime: { title: 'Follow up Time', filter: false, show: false }, filtered_statuses: { title: 'Filtered Status', filter: false, show: false }, filtered_slots: { title: 'Filtered Slot', filter: false, show: false },
    },
  };

  settingUpdater = {
    mode: 'external', hideSubHeader: true,
    actions: { add: false, edit: false, delete: false, columnTitle: '', position: 'right' },
    columns: {
      enquiry_no: { title: 'Enquiry No', filter: false, show: true }, name: { title: 'Name', filter: false, show: true }, phone: { title: 'Phone No', filter: false, show: true }, email: { title: 'Email', filter: false, show: true }, enquiry_date: { title: 'Enquiry Date', filter: false, show: true }, referred_by: { title: 'Reffered By', filter: false, show: true }, priority: { title: 'Priority', filter: false, show: true }, follow_type: { title: 'Follow type', filter: false, show: true }, status: { title: 'Status', filter: false, show: false }, institute_enquiry_id: { title: 'Enquiry ID', filter: false, show: false }, institution_id: { title: 'Institute ID', filter: false, show: false }, standard: { title: 'Standard', filter: false, show: false }, Gender: { title: 'Gender', filter: false, show: false }, subjects: { title: 'Subjects', filter: false, show: false }, statusValue: { title: 'Status Value', filter: false, show: false }, is_converted: { title: 'Is Converted', filter: false, show: false }, followUpDate: { title: 'Follow up Date', filter: false, show: false }, occupation_id: { title: 'Occupation ID', filter: false, show: false }, school_id: { title: 'School ID', filter: false, show: false }, standard_id: { title: 'Standard ID', filter: false, show: false }, subject_id: { title: 'Subject ID', filter: false, show: false }, source_id: { title: 'Source ID', filter: false, show: false }, assigned_name: { title: 'Assigned Name', filter: false, show: false }, is_recent: { title: 'Is recent', filter: false, show: false }, slot_id: { title: 'Slot ID', filter: false, show: false }, slot: { title: 'Slot', filter: false, show: false }, updateDate: { title: 'Update Date', filter: false, show: false }, isDashbord: { title: 'Is Dashboard', filter: false, show: false }, isRport: { title: 'Is Report', filter: false, show: false }, totalcount: { title: 'Total Count', filter: false, show: false }, newEnqcount: { title: 'New Enquiry Count', filter: false, show: false }, enquiry_no_date: { title: 'Enquiry Date', filter: false, show: false }, name_person: { title: 'Person Name', filter: false, show: false }, followUpDateTime: { title: 'Follow up date', filter: false, show: false }, standard_subject: { title: 'Standard subject', filter: false, show: false }, closedReasonText: { title: 'Closed Reason', filter: false, show: false }, followUpTime: { title: 'Follow up Time', filter: false, show: false }, filtered_statuses: { title: 'Filtered Status', filter: false, show: false }, filtered_slots: { title: 'Filtered Slot', filter: false, show: false },
    },
  };

  constructor(private enquire: FetchenquirycampaignService) {

    this.enquire.getAllEnquiry().subscribe(data => {
      var timer = setInterval(() => {
        this.progress = this.progress + Math.floor(Math.random() * 10) + 1;
        console.log(this.progress +"before 99");
        if (this.progress > 99) {
          console.log(this.progress +"after 99");
          clearInterval(timer);
        }
      }, 100);
      this.rows = data;
      this.source = new LocalDataSource(this.rows);
      console.log(this.progress +'outside interval');
    });

  }

  ngOnInit() {
    this.myOptions = [
      { name: 'Enquiry ID', id: 'institute_enquiry_id' }, { name: 'Institute ID', id: 'institution_id' }, { name: 'Enquiry No', id: 'enquiry_no' }, { name: 'Name', id: 'name' }, { name: 'Phone', id: 'phone' }, { name: 'Email', id: 'email' }, { name: 'Standard', id: 'standard' }, { name: 'Gender', id: 'Gender' }, { name: 'Subjects', id: 'subjects' }, { name: 'Status', id: 'status' }, { name: 'Status Value', id: 'statusValue' }, { name: 'is Converted', id: 'is_converted' }, { name: 'Follow up Date', id: 'followUpDate' }, { name: 'Occupation ID', id: 'occupation_id' }, { name: 'School ID', id: 'school_id' }, { name: 'Enquiry Date', id: 'enquiry_date' }, { name: 'Standard ID', id: 'standard_id' }, { name: 'Subject ID', id: 'subject_id' }, { name: 'Reffered by', id: 'referred_by' }, { name: 'Source ID', id: 'source_id' }, { name: 'Priority', id: 'priority' }, { name: 'Follow type', id: 'follow_type' }, { name: 'Assigned Name', id: 'assigned_name' }, { name: 'Is recent', id: 'is_recent' }, { name: 'Slot ID', id: 'slot_id' }, { name: 'Slot', id: 'slot' }, { name: 'Update Date', id: 'updateDate' }, { name: 'Is Dashboard', id: 'isDashbord' }, { name: 'Is Report', id: 'isRport' }, { name: 'Total Count', id: 'totalcount' }, { name: 'New Enquiry Count', id: 'newEnqcount' }, { name: 'Enquiry Date', id: 'enquiry_no_date' }, { name: 'Person Name', id: 'name_person' }, { name: 'Follow up date', id: 'followUpDateTime' }, { name: 'Standard subject', id: 'standard_subject' }, { name: 'Closed Reason', id: 'closedReasonText' }, { name: 'Follow up Time', id: 'followUpTime' }, { name: 'Filtered Status', id: 'filtered_statuses' }, { name: 'Filtered Slot', id: 'filtered_slots' }
    ];
  }
  toggle() {
    var item = this.optionsModel.pop();
    this.settingUpdater.columns[item].show = !this.settings.columns[item].show;
    this.settings = Object.assign({}, this.settingUpdater);
  }
  mySettings: IMultiSelectSettings = {
    enableSearch: true, buttonClasses: 'btn material-icons filter-btn', dynamicTitleMaxItems: 3, displayAllSelectedText: true, showCheckAll: false, showUncheckAll: false, closeOnClickOutside: true, checkedStyle: 'glyphicon',
  };
  myTexts: IMultiSelectTexts = {
    checkAll: 'Select all', uncheckAll: 'Unselect all', checked: 'item selected', checkedPlural: 'items selected', searchPlaceholder: 'Find', defaultTitle: '', allSelected: 'All selected',
  };
  onSearch(query: string = '') {

    if (query != '') {
      this.source.setFilter([
        { field: 'institute_enquiry_id', search: query }, { field: 'institution_id', search: query }, { field: 'enquiry_no', search: query }, { field: 'name', search: query }, { field: 'phone', search: query }, { field: 'email', search: query }
      ], false);
    }
  }
}
