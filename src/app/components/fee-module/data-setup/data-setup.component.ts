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
  isTemplateNotLinkWithCourseAndStandard: boolean;
  isFeeStructLinked: boolean;
  is_tax_enabled: boolean;

  constructor(private auth: AuthenticatorService,
    private router: Router) {
     // this.toggle(this.activeSession) 
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
    this.schoolModel = this.auth.schoolModel.value;
    this.is_tax_enabled = sessionStorage.getItem("enable_tax_applicable_fee_installments") == '1' ? true : false;
    this.isFeeStructLinked = sessionStorage.getItem("is_fee_struct_linked")=='true';
    this.setActiveClass();
  }

  toggle(id) {
    this.activeSession = id;
  }

  setActiveClass() {
    let pathLastURL;
    var str = window.location.href;
    var res = str.substring(str.lastIndexOf("/view/fee/data-setup") + 21, str.length);
    pathLastURL = res;
    var get_module_name = res.substring(0, res.indexOf("/"));
    if (get_module_name != '') {
      pathLastURL = get_module_name;
    }

    let routesData = {
      'fee-type': 'fee_types',
      'fee-structure': 'structure',
      'discount-reason': 'discount',
    };
    this.activeSession = routesData[pathLastURL];
  }

}
