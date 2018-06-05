import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../../services/employee-service/employee.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss']
})
export class AddEditEmployeeComponent implements OnInit {

  employeeId: any = '';
  employeeDetails: any = {
    address: '',
    attendance_device_id: '',
    designation: '1',
    email_pri: '',
    email_sec: '',
    emp_name: '',
    id_fileType: '',
    joining_date: moment().format('YYYY-MM-DD'),
    leaving_date: '',
    phone_pro: '',
    phone_sec: '',
    photo_id_card: '',
    profile_pic: '',
    user_id: ''
  };
  containerWidth: any = "200px";
  @ViewChild('idCardEmployee') idCardEmployee: ElementRef; userList
  designationList: any = [];

  constructor(
    private auth: AuthenticatorService,
    private route: Router,
    private activateRoute: ActivatedRoute,
    private apiService: EmployeeService
  ) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(
      (res: any) => {
        if (res != '' && res != null) {
          this.employeeId = res;
          this.getEmployeeDetails(res);
        } else {
          this.employeeId = '-1';
        }
      }
    )
    this.getDesignationList();
  }

  getEmployeeDetails(res) {
    this.apiService.getEmployeeDetails(res).subscribe(
      res => {
        this.employeeDetails = res;
      },
      err => {
        console.log(err);
      }
    )
  }

  getDesignationList() {
    this.apiService.designationList().subscribe(
      res => {
        this.designationList = res;
      },
      err => {
        console.log(err);
      }
    )
  }

  setImage(e) {
    this.employeeDetails.profile_pic = e;
  }

  uploadIdCard() {
    this.idCardEmployee.nativeElement.click();
  }

  onChangeIdCardUpload() {
    let fileBrowser = this.idCardEmployee.nativeElement;
    this.idCardEmployee.nativeElement.innerHTML = fileBrowser.files[0].name;
    if (fileBrowser.files && fileBrowser.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(fileBrowser.files[0]);
      reader.onload = () => {
        this.employeeDetails.photo_id_card = reader.result.split(',')[1];
      }
    }
  }


}
