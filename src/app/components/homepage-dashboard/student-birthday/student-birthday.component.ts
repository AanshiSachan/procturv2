import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-student-birthday',
  templateUrl: './student-birthday.component.html',
  styleUrls: ['./student-birthday.component.scss']
})
export class StudentBirthdayComponent implements OnInit {
  todaysDate: any = new Date();
  ScheduledData: any = [];

  constructor(
    private http: HttpService
  ) { }

  ngOnInit() {
    this.getBirthDaySchedule();
  }

  getBirthDaySchedule() {
    this.http.getData('/api/v1/students/birthday-details/' + sessionStorage.getItem('institution_id')).subscribe(
      (res: any) => {
        this.ScheduledData = res.response;
      },
      (err) => {
        console.log(err);
      }
  );
  }

}
