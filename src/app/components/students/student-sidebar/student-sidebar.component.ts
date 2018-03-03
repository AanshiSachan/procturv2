import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { instituteInfo } from '../../../model/instituteinfo';


@Component({
  selector: 'student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.scss']
})
export class StudentSidebarComponent implements OnInit, OnChanges {

  @Input() rowData: any;
  @Input() customComponent: any;
  @Input() studentDetails: any;

  @Output() closeSide = new EventEmitter<any>();
  @Output() editStudent = new EventEmitter<any>();
  @Output() deleteStudent = new EventEmitter<any>();
  @Output() editNotes = new EventEmitter<any>();


  @ViewChild('imgDisp') im: ElementRef;
  private showMenu: boolean = false;
  containerWidth: string = "70px";
  studentServerImage: any = '';
  readonly: boolean = true;

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


  constructor(private rend: Renderer2, private eRef: ElementRef) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.rowData;
    this.studentDetails;
    this.customComponent;
    this.fetchStudentDetails(this.studentDetails);
  }


  emitEdit() {
    this.editStudent.emit(this.rowData.student_id);
  }


  emitDelete() {
    this.deleteStudent.emit(this.rowData);
  }

  emitNotes() {
    this.editNotes.emit(this.rowData);
  }

  closeSideBar(ev) {
    this.closeSide.emit(null);
  }

  fetchStudentDetails(ev) {
    // console.log(ev.photo);
    if (ev.photo != '' || ev.photo != null) {
      this.studentServerImage = ev.photo;
    }
    else {
      this.studentServerImage = '';
    }

  }


  getImageFile(f) {

  }

  /* open action menu on click */
  openMenu(ev) {
    this.showMenu = !this.showMenu;
  }

  /* close action menu on events  */
  closeMenu() {
    this.showMenu = false;
  }


  @HostListener("document:click", ['$event'])
  onWindowClick(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
    } else {
      this.showMenu = false;
    }
  }



}
