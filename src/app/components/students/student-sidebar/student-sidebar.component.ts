import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { instituteInfo } from '../../../model/instituteinfo';


@Component({
  selector: 'student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.scss']
})
export class StudentSidebarComponent implements OnInit, OnChanges {

  @Input() studentData: any;

  @Output() closeSide = new EventEmitter<any>()


  /* Model for institute Data for fetching student enquiry */
  currRow: instituteInfo = {
    school_id: -1,
    standard_id: -1,
    batch_id: -1,
    name: "",
    is_active_status: 1,
    mobile: "",
    language_inst_status: -1,
    subject_id: -1,
    slot_id: "",
    master_course_name: "",
    course_id: -1,
  };


  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.studentData;
    this.currRow = this.studentData;
    this.fetchStudentDetails();
  }




  closeSideBar(ev) {
    this.closeSide.emit(null);
  }

  fetchStudentDetails() {
    console.log(this.currRow);
  }




}
