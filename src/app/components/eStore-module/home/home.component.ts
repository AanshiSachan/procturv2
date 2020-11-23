import { Component, OnInit } from '@angular/core';
import { role } from '../../../model/role_features';
import { AuthenticatorService } from '../../../services/authenticator.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  jsonFlag = {
    isProfessional: false,
    isShowEcourseMapping: false,
  }
  jsonEstoreFlags = {
    isEstoreMenu: false,
    isManageProduct: false,
    isManageOffer: false,
    isRegisterUser: false,
    isSalesReport: false,
    isCouponReport: false
  }
  role_feature = role.features;



  constructor(private auth: AuthenticatorService) {

  }

  ngOnInit() {
    const permittedRoles = sessionStorage.getItem('permitted_roles');
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.jsonFlag.isProfessional = true;
        } else {
          this.jsonFlag.isProfessional = false;
        }
      }
    );
// Changes done by Nalini - To handle role based conditions
    if (sessionStorage.getItem('userType') != '0' || sessionStorage.getItem('username') != 'admin') {
      if (sessionStorage.getItem('permissions') != '' && sessionStorage.getItem('permissions') != null) {
        this.jsonEstoreFlags.isManageOffer = this.role_feature.ESTORE_MANAGE_OFFER;
        this.jsonEstoreFlags.isManageProduct = this.role_feature.ESTORE_MANAGE_PRODUCT;
        this.jsonEstoreFlags.isRegisterUser = this.role_feature.ESTORE_REGISTER_USER;
        this.jsonEstoreFlags.isSalesReport = this.role_feature.REPORT_PRODUCT_SALES;
        this.jsonEstoreFlags.isCouponReport = this.role_feature.REPORT_PRODUCT_COUPON;
      }
    } else {
      let array = Object.keys(this.jsonEstoreFlags);
      array.forEach((flag) => {
        this.jsonEstoreFlags[flag] = true;
      });
    }

  }

}
