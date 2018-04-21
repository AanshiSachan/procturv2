import { Component, OnInit } from '@angular/core';
import { BiometricServiceService } from '../../../services/biometric-service/biometric-service.service';
import { AppComponent } from '../../../app.component';
import { AuthenticatorService } from "../../../services/authenticator.service";
@Component({
  selector: 'app-biometric',
  templateUrl: './biometric.component.html',
  styleUrls: ['./biometric.component.scss']
})
export class BiometricComponent implements OnInit {

  masterCourse: any[] = [];
  master: any = "";
  courses: any[] = [];
  masterCourseNames: boolean = true;
  students: any = "";
  constructor(private reportService: BiometricServiceService,
    private appc: AppComponent,
    private institute_id: AuthenticatorService) { }

  ngOnInit() {
    this.getMasterCourses();
  }
  getMasterCourses() {
    this.reportService.getAllData().subscribe(
      (data: any) => {
        this.masterCourse = data;
      },
      (error) => {
        return error;
      }
    )
  }
  getCourses(i) {
    this.reportService.getCourses(i).subscribe(
      (data: any) => {
        console.log(data);
        this.courses = data.coursesList;
      },
      (error) => {
        return error;
      }
    )

  }
  showMaster(i) {
    if (i == 1) {
      this.masterCourseNames = true;
    }
    else {
      this.masterCourseNames = false;
    }
  }
}
