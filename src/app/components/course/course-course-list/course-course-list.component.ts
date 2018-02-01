import { Component, OnInit } from '@angular/core';
import { CourseListService } from '../../../services/course-services/course-list.service';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-course-list',
  templateUrl: './course-course-list.component.html',
  styleUrls: ['./course-course-list.component.scss']
})
export class CourseCourseListComponent implements OnInit {

  courseList: any;

  constructor(
    private apiService: CourseListService,
    private toastCtrl: AppComponent,
  ) { }

  ngOnInit() {
    this.getCourseListForTable();
  }

  getCourseListForTable() {
    this.apiService.getCourseListFromServer().subscribe(
      data => {
        console.log(data);
        this.courseList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

}
