import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'app-data-setup-home',
  templateUrl: './data-setup-home.component.html',
  styleUrls: ['./data-setup-home.component.scss']
})
export class DataSetupHomeComponent implements OnInit {
  type: string = '';
  schoolModel: boolean = false;
  activeSession: any = 'faculty';

  constructor(private auth: AuthenticatorService, private route: Router,
  ) {
    this.schoolModel = this.auth.schoolModel.value;

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
    if (id=='Exam_type') {
      this.route.navigateByUrl("/view/course/setup/exam-type")
    }
    // this.activeSession = id;
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
      'exam-type': 'Exam_type'
    };
    this.activeSession = routesData[pathLastURL];
    console.log(this.activeSession);
  }

}
