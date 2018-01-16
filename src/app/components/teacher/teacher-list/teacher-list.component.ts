import { Component, OnInit } from '@angular/core';
import { TeacherAPIService } from '../../../services/teacherService/teacherApi.service';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {

  teacherListDataSource: any;

  constructor(
    private ApiService : TeacherAPIService
  ) { }

  ngOnInit() {
    this.getDataFromServer();
  }

  getDataFromServer(){
    this.ApiService.getAllTeacherList().subscribe(
      data => {
        this.teacherListDataSource = data; 
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }



}
