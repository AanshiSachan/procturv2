import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { StandardServices } from '../../../services/course-services/standardPost.service';

@Component({
  selector: 'app-schedule-home',
  templateUrl: './schedule-home.component.html',
  styleUrls: ['./schedule-home.component.scss']
})
export class ScheduleHomeComponent implements OnInit {
  createNewStandard: boolean = false;
  createNewSubject: boolean = false;
  no_standard_name: boolean = false;
  no_subject_name: boolean = false;
  tabsArr: any[] = [
    {
      name: 'Standard',
      id: 'standard'
    }, {
      name: 'Subject',
      id: 'subject'
    }, {
      name: 'Courses',
      id: 'courses'
    }, {
      name: 'Exam',
      id: 'exam'
    }, {
      name: 'Class',
      id: 'class'
    }
  ];
  currentView: string = 'standard';

  newStandardDetails: any = {
    institution_id: "",
    is_active: "Y",
    standard_name: ""
  }
  constructor(private standardServiceObj: StandardServices, private toastCtrl: AppComponent) { }

  ngOnInit() {
  }

  /* Function to set the id for setActive function to act upon */
  classActiveToggle(e) {

    switch (e.target.id) {
      case 'standard':
        document.getElementById('standard').parentElement.classList.add('active');
        document.getElementById('subject').parentElement.classList.remove('active');
        document.getElementById('courses').parentElement.classList.remove('active');
        document.getElementById('exam').parentElement.classList.remove('active');
        document.getElementById('class').parentElement.classList.remove('active');
        break;

      case 'subject':
        document.getElementById('standard').parentElement.classList.remove('active');
        document.getElementById('subject').parentElement.classList.add('active');
        document.getElementById('courses').parentElement.classList.remove('active');
        document.getElementById('exam').parentElement.classList.remove('active');
        document.getElementById('class').parentElement.classList.remove('active');
        break;

      case 'courses':
        document.getElementById('standard').parentElement.classList.remove('active');
        document.getElementById('subject').parentElement.classList.remove('active');
        document.getElementById('courses').parentElement.classList.add('active');
        document.getElementById('exam').parentElement.classList.remove('active');
        document.getElementById('class').parentElement.classList.remove('active');
        break;

      case 'exam':
        document.getElementById('standard').parentElement.classList.remove('active');
        document.getElementById('subject').parentElement.classList.remove('active');
        document.getElementById('courses').parentElement.classList.remove('active');
        document.getElementById('exam').parentElement.classList.add('active');
        document.getElementById('class').parentElement.classList.remove('active');
        break;

      case 'class':
        document.getElementById('standard').parentElement.classList.remove('active');
        document.getElementById('subject').parentElement.classList.remove('active');
        document.getElementById('courses').parentElement.classList.remove('active');
        document.getElementById('exam').parentElement.classList.remove('active');
        document.getElementById('class').parentElement.classList.add('active');
        break;
    }
  }
  /* Function to set the createNewStandard View On/Off */
  toggleCreateNewStandard() {
    if (this.createNewStandard == false) {
      this.createNewStandard = true;
    } else {
      this.newStandardDetails = {
        institution_id: "",
        is_active: "Y",
        standard_name: ""
      }
      this.no_standard_name = false;
      this.createNewStandard = false;
    }
  }
  /* Function to set the createNewStandard View On/Off */
  toggleCreateNewSubject() {
    if (this.createNewSubject == false) {
      this.createNewSubject = true;
    } else {
      this.no_subject_name = false;
      this.createNewSubject = false;
    }
  }

  /* function to set-unset isActive status for add standard */
  toggleStandardActive(event) {
    if (event) {
      this.newStandardDetails.is_active = "Y";
    }
    else {
      this.newStandardDetails.is_active = "N";
    }
  }
  /* Function to create a New Standard */
  addNewStandard() {
    if (this.newStandardDetails.standard_name == "") {
      this.no_standard_name = true;
    } else {
      this.newStandardDetails.institution_id = sessionStorage.getItem('institute_id');
      this.standardServiceObj.createNewStandard(this.newStandardDetails).subscribe(res => {
        let data = {
          type: "success",
          title: "Standard Added",
          body: "New Standard added Successfull!"
        }
        this.toastCtrl.popToast(data);
      },
        err => {
          let errorObj = JSON.parse(JSON.stringify(err._body));
          let error_JSON = JSON.parse(errorObj);
          let data = {
            type: "error",
            title: "",
            body: error_JSON.message
          }
          this.toastCtrl.popToast(data);
        })
    }
  }

  switchView(id) {
    this.currentView = id;
  }
}
