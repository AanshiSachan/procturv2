import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'app-data-setup-home',
  templateUrl: './data-setup-home.component.html',
  styleUrls: ['./data-setup-home.component.scss']
})
export class DataSetupHomeComponent implements OnInit {
  type: string = '';
  schoolModel:boolean =true;
  activeSession: any = 'faculty';
  
  constructor( private auth: AuthenticatorService) { 
    this.auth.schoolModel.subscribe((data) => {
      this.schoolModel = data = 'true' ? true : false;
    });
  }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.type = 'batch';
        } else {
          this.type = 'course';
        }
      }
    )
    this.setActiveClass();
  }

  toggle(id) {
    this.activeSession = id;
  }

  setActiveClass() {
    // this.RemoveActiveTabs();
    let pathLastURL;
    var str = window.location.href;
    var res = str.substring(str.lastIndexOf("/view/course/setup") + 19, str.length);
    pathLastURL = res;
    var get_module_name = res.substring(0, res.indexOf("/"));
    if (get_module_name != '') {
      pathLastURL = get_module_name;
    }

    console.log(pathLastURL);
    let routesData = {
      'teacher': 'faculty',
      'academic': 'academic',
      'manage-exam-grades': 'Exam_Grades',
      'classroom': 'classroom',
      'master-tag': 'master_tag',
    };
      this.activeSession = routesData[pathLastURL];
      console.log(this.activeSession);
  }

}
