import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-data-setup',
  templateUrl: './data-setup.component.html',
  styleUrls: ['./data-setup.component.scss']
})
export class DataSetupComponent implements OnInit {
  type: string = '';
  schoolModel: boolean = false;
  activeSession: any = 'fee_types';

  constructor(private auth: AuthenticatorService,
    private router: Router) {
      this.toggle(this.activeSession) 
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
    if (id == 'fee_types') {
      this.router.navigateByUrl("/view/fee/data-setup/fee-type-v2");
    } else if (id == 'fee_structure') {
      this.router.navigateByUrl("/view/fee/data-setup/fee-structure")
    } else if (id == 'fee_discount') {
      this.router.navigateByUrl("/view/fee/data-setup/discount-reason")
    }
    this.activeSession = id;
  }

  setActiveClass() {
    // this.RemoveActiveTabs();
    let pathLastURL;
    var str = window.location.href;
    var res = str.substring(str.lastIndexOf("/view/fee/setup") + 19, str.length);
    pathLastURL = res;
    var get_module_name = res.substring(0, res.indexOf("/"));
    if (get_module_name != '') {
      pathLastURL = get_module_name;
    }

    console.log(pathLastURL);
    let routesData = {
      'teacher': 'fee_types',
      'academic': 'fee_structure',
      'manage-exam-grades': 'fee_discount',
    };
    this.activeSession = routesData[pathLastURL];
    console.log(this.activeSession);
  }

}
