import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef,  HostListener, ChangeDetectionStrategy } from '@angular/core';
import { instituteInfo } from '../../../model/instituteinfo';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentSidebarComponent implements OnInit, OnChanges {

  isProfessional: boolean;
  @Input() rowData: any;
  @Input() customComponent: any;
  @Input() studentDetails: any;

  @Output() closeSide = new EventEmitter<any>();
  @Output() editStudent = new EventEmitter<any>();
  @Output() deleteStudent = new EventEmitter<any>();
  @Output() editNotes = new EventEmitter<any>();
  @Output() leaveEvent = new EventEmitter<any>();
  @Output() pdcEdit = new EventEmitter<any>();
  @Output() invEdit = new EventEmitter<any>();

  @Output() openCourseAssigned = new EventEmitter<boolean>();

  //@ViewChild('acc') acc: ElementRef;
  @ViewChild('one') one: ElementRef;
  @ViewChild('two') two: ElementRef;


  @ViewChild('imgDisp') im: ElementRef;
  private showMenu: boolean = false;
  containerWidth: string = "50px";
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


  constructor(
    private eRef: ElementRef, 
    private auth: AuthenticatorService,
     private cd: ChangeDetectorRef
    ) {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )

  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.rowData;
    this.studentDetails;
    this.customComponent;
    this.cd.markForCheck();
    this.fetchStudentDetails(this.studentDetails);
  }


  emitEdit() {
    this.cd.markForCheck();
    this.editStudent.emit(this.rowData.student_id);
  }


  emitDelete() {
    this.cd.markForCheck();
    this.deleteStudent.emit(this.rowData);
  }

  emitLeave() {
    this.cd.markForCheck();
    this.leaveEvent.emit(this.rowData.student_id);
  }

  emitEditLeave() {
    this.cd.markForCheck();
    this.pdcEdit.emit(this.rowData.student_id);
  }

  emitEditInv() {
    this.cd.markForCheck();
    this.invEdit.emit(this.rowData.student_id);
  }

  emitNotes() {
    this.cd.markForCheck();
    this.editNotes.emit(this.rowData);
  }

  closeSideBar(ev) {
    this.cd.markForCheck();
    this.closeSide.emit(null);
  }

  fetchStudentDetails(ev) {
    this.cd.markForCheck();
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
  openMenu() {
    this.cd.reattach();
    this.showMenu = !this.showMenu;
    this.cd.detectChanges();
    this.cd.detach();
  }

  /* close action menu on events  */
  closeMenu() {
    this.cd.markForCheck();
    this.showMenu = false;
  }

  toggleAccordian(id) {
    this.cd.markForCheck();
    if (id === 'one') {
      this.one.nativeElement.classList.toggle('liclosed');
      this.two.nativeElement.classList.add('liclosed');
    }
    else if (id === 'two') {
      this.two.nativeElement.classList.toggle('liclosed');
      this.one.nativeElement.classList.add('liclosed');
    }
  }



  @HostListener("document:click", ['$event'])
  onWindowClick(event) {

    if (this.eRef.nativeElement.contains(event.target)) {
    } else {
      this.cd.reattach();
      this.showMenu = false;
      this.cd.detectChanges();
      this.cd.detach();
    }
  }


  getBatchListArr(): any[] {
    this.cd.detach();
    return this.rowData.batchesAssigned ? this.rowData.batchesAssigned.split(',') : this.rowData.batchesAssigned;

  }


  editCourseAllocated() {
    this.openCourseAssigned.emit(true);
  }

}
