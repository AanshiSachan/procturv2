import { Component, OnInit } from '@angular/core';
import { CourseListService } from '../../../../services/course-services/course-list.service';
import { AppComponent } from '../../../../app.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {

  courseName;

  constructor(
    private apiService: CourseListService,
    private toastCtrl: AppComponent,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(
      params => {
        if (params.course_name != undefined && params.course_name != "" && params.course_name != null) {
          this.courseName = params.course_name;
        } else {
          this.router.navigateByUrl('../courselist');
        }
      }
    )
  }

  ngOnInit() {
    this.getSelectedCourse(this.courseName);
  }

  getSelectedCourse(data) {
    this.apiService.getSeletedMasterCourseEdit(data).subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.log(error);
      }
    )
  }

}
