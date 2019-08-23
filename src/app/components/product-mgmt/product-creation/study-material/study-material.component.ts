import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-study-material',
  templateUrl: './study-material.component.html',
  styleUrls: ['./study-material.component.scss']
})
export class StudyMaterialComponent implements OnInit {

  @Input()
  product_id: any;
  @Input()
  prodForm: any;
  @Output() nextForm = new EventEmitter<string>();
  @Output() startForm = new EventEmitter<string>();
  @Output() toggleLoader = new EventEmitter<boolean>();
  subjectList:any[]=[{name:'History'},{name:'Geography'},{name:'Physics'}];
  studyMaterial:any[]=[{"course_type":"PG-DAC","is_test_series":"N","course_type_id":512,"total_assigned_student_count":0,"master_course_ids":null,"eCourseMapping":null,"categoryList":[]},{"course_type":"New Db Migrationgvf","is_test_series":"N","course_type_id":736,"total_assigned_student_count":0,"master_course_ids":null,"eCourseMapping":null,"categoryList":[]},{"course_type":"New Db Migration","is_test_series":"N","course_type_id":737,"total_assigned_student_count":0,"master_course_ids":null,"eCourseMapping":null,"categoryList":[]},{"course_type":"testiii","is_test_series":"N","course_type_id":706,"total_assigned_student_count":0,"master_course_ids":null,"eCourseMapping":null,"categoryList":["Assignment","Audio Notes","EBook","Images","Notes","Youtube URL"]},{"course_type":"Primary","is_test_series":"N","course_type_id":676,"total_assigned_student_count":0,"master_course_ids":null,"eCourseMapping":null,"categoryList":["Assignment","Audio Notes","EBook","Images","Notes","Youtube URL"]},{"course_type":"HTML","is_test_series":"N","course_type_id":612,"total_assigned_student_count":0,"master_course_ids":null,"eCourseMapping":null,"categoryList":["Assignment","Audio Notes","EBook","Images","Notes","Youtube URL"]},{"course_type":"Gate Review :D","is_test_series":"N","course_type_id":4,"total_assigned_student_count":0,"master_course_ids":null,"eCourseMapping":null,"categoryList":[]},{"course_type":"Primary-EE","is_test_series":"N","course_type_id":677,"total_assigned_student_count":0,"master_course_ids":null,"eCourseMapping":null,"categoryList":["Assignment","Audio Notes","EBook","Images","Notes","Youtube URL"]},{"course_type":"GATE New","is_test_series":"N","course_type_id":5,"total_assigned_student_count":0,"master_course_ids":null,"eCourseMapping":null,"categoryList":[]},{"course_type":"CDAC","is_test_series":"N","course_type_id":678,"total_assigned_student_count":0,"master_course_ids":null,"eCourseMapping":null,"categoryList":[]},{"course_type":"aditya","is_test_series":"N","course_type_id":616,"total_assigned_student_count":0,"master_course_ids":null,"eCourseMapping":null,"categoryList":["Assignment","Audio Notes","EBook","Images","Notes","Youtube URL"]},{"course_type":"Gogo","is_test_series":"N","course_type_id":501,"total_assigned_student_count":0,"master_course_ids":null,"eCourseMapping":null,"categoryList":[]},{"course_type":"New db migrationbf","is_test_series":"N","course_type_id":735,"total_assigned_student_count":0,"master_course_ids":null,"eCourseMapping":null,"categoryList":[]}];



  constructor(private router: Router) { }

  ngOnInit() {
  }

  toggleRows(event) {
    console.log(event);
    let operation = event.target.attributes['data'].value;
    let length = event.target.parentNode.parentNode.parentNode.children.length;
    for (let i = 1; i < length; i++) {
      let child_el = event.target.parentNode.parentNode.parentNode.children[i];
      if (operation == 'hide') {
        child_el.classList.remove('fade-in');
        child_el.classList.add('fade-out');

        event.target.classList.remove('btn-close');
        event.target.classList.add('btn-open');
        event.target.attributes['data'].value = 'show';
      }
      else {
        child_el.classList.remove('fade-out');
        child_el.classList.add('fade-in');

        event.target.classList.add('btn-close');
        event.target.classList.remove('btn-open');
        event.target.attributes['data'].value = 'hide';
      }
    }

  }

  gotoBack() {
    this.router.navigateByUrl('/products');
  }

  gotoNext() {
    this.nextForm.emit();
  }
}
