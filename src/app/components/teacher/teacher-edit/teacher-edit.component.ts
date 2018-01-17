import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherAPIService } from '../../../services/teacherService/teacherApi.service';

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrls: ['./teacher-edit.component.scss']
})
export class TeacherEditComponent implements OnInit {

  selectedTeacherId;

  constructor(
    private route : Router,
    private ApiService: TeacherAPIService
  ) {
    if(localStorage.getItem('teacherID'))
    {
      this.selectedTeacherId = localStorage.getItem('teacherID');
    }else{
      this.route.navigateByUrl('teacher');
    }
   }

  ngOnInit() {
    this.getTeacherInfo();
  }

  getTeacherInfo() {
    this.ApiService.getSelectedTeacherInfo(this.selectedTeacherId).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }
}
