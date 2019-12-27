import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../../services/employee-service/employee.service';
import * as moment from 'moment';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss']
})
export class AddEditEmployeeComponent implements OnInit {

  isRippleLoad: boolean = false;
  employeeId: any = '';
  containerWidth: any = "200px";
  @ViewChild('circle1') circle1: ElementRef;
  @ViewChild('circle2') circle2: ElementRef;
  @ViewChild('circle3') circle3: ElementRef;
  firstPage: boolean = true;
  secondPage: boolean = false;
  thirdPage: boolean = false;
  times: any[] = ['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
  minArr: any[] = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  designationList: any = [];
  employeeList: any = [];
  rolesList: any = [];
  employeeDetails: any = {
    emp_name: '',
    phone_pro: '',
    email_pri: '',
    address: '',
    joining_date: moment().format('YYYY-MM-DD'),
    year_of_experience: 0,
    designation_id: '-1',
    dob: '',
    emp_manager_id: '-1',
    role_id: '-1',
    emp_type: '1',
    highest_qualification: '',
    aadhar_card_no: '',
    pan_card_no: ''
  };
  salaryDet: any = {
    id: -1,
    salary_type: '1',
    basic: '',
    ta: '',
    da: '',
    hra: '',
    pf: '',
    esi: '',
    tax: '',
    total: '',
    class_hour_rate: '',
    sal_comp1: 0,
    sal_comp2: 0,
    sal_comp3: 0
  };
  sameTimeFilter: any = {
    startTime: {
      hr: '10 AM',
      min: '00'
    },
    endTime: {
      hr: '6 PM',
      min: '00'
    }
  };
  workingDays: any = {
    id: '-1',
    week: [
      {
        uiSelected: false,
        day: 'Sunday',
        in_time: {
          hr: '10 AM',
          min: '00'
        },
        out_time: {
          hr: '6 PM',
          min: '00'
        }
      },
      {
        uiSelected: false,
        day: 'Monday',
        in_time: {
          hr: '10 AM',
          min: '00'
        },
        out_time: {
          hr: '6 PM',
          min: '00'
        }
      },
      {
        uiSelected: false,
        day: 'Tuesday',
        in_time: {
          hr: '10 AM',
          min: '00'
        },
        out_time: {
          hr: '6 PM',
          min: '00'
        }
      },
      {
        uiSelected: false,
        day: 'Wednesday',
        in_time: {
          hr: '10 AM',
          min: '00'
        },
        out_time: {
          hr: '6 PM',
          min: '00'
        }
      },
      {
        uiSelected: false,
        day: 'Thursday',
        in_time: {
          hr: '10 AM',
          min: '00'
        },
        out_time: {
          hr: '6 PM',
          min: '00'
        }
      },
      {
        uiSelected: false,
        day: 'Friday',
        in_time: {
          hr: '10 AM',
          min: '00'
        },
        out_time: {
          hr: '6 PM',
          min: '00'
        }
      },
      {
        uiSelected: false,
        day: 'Saturday',
        in_time: {
          hr: '10 AM',
          min: '00'
        },
        out_time: {
          hr: '6 PM',
          min: '00'
        }
      }
    ]
  }
  profile_pic: string = '';
  addProfDet: boolean = false;
  inventoryItemList: any = [];
  allocateItem: any = {
    item_id: -1,
    emp_id: -1,
    alloted_units: 0
  };
  allocationHistory: any = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private apiService: EmployeeService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(
      (res: any) => {
        if (res.hasOwnProperty('id')) {
          this.employeeId = res.id;
          this.getEmployeeDetails(res.id);
          this.getEmployeeSalary(res.id);
          this.getEmployeeWorkingTime(res.id);
          this.fetchUserInventoryDetails(res.id);
        } else {
          this.employeeId = '-1';
        }
      }
    )
    this.getAllDesignationList();
    this.getEmployeeList();
    this.fetchUserRoleList();
    this.fetchInventoryItemList();
  }

  ////////////////////Toggle View Function////////////////////////////////////

  onTabChange(id) {
    this.circle1.nativeElement.classList.remove('active');
    this.circle2.nativeElement.classList.remove('active');
    this.circle3.nativeElement.classList.remove('active');
    this[id].nativeElement.classList.add('active');
    this.firstPage = false;
    this.secondPage = false;
    this.thirdPage = false;
    if (id == "circle1") {
      this.firstPage = true;
    } else if (id == "circle2") {
      this.secondPage = true;
    } else {
      this.thirdPage = true;
    }
  }

  ///// First Page Function ///////////////////////////////

  getEmployeeDetails(res) {
    this.isRippleLoad = true;
    this.apiService.getEmployeeDetails(res).subscribe(
      res => {
        console.log(res);
        this.isRippleLoad = false;
        this.employeeDetails = res;
        this.employeeDetails.emp_type = res.emp_type.toString();
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
      }
    )
  }

  getAllDesignationList() {
    this.isRippleLoad = true;
    this.apiService.fetchDesignationList().subscribe(
      res => {
        this.isRippleLoad = false;
        this.designationList = res;
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', 'error', err.error.message);
      }
    )
  }

  getEmployeeList() {
    this.isRippleLoad = true;
    this.apiService.fetchEmployeeList().subscribe(
      res => {
        this.isRippleLoad = false;
        this.employeeList = res;
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  fetchUserRoleList() {
    this.isRippleLoad = true;
    this.apiService.getRoles().subscribe(
      res => {
        this.isRippleLoad = false;
        this.rolesList = res;
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  makeJsonToSend(data) {
    if (data.emp_name.trim() == "" || data.emp_name.trim() == null) {
      this.messageNotifier('error', '', 'Please enter Employee Name');
      return false;
    }
    if (data.phone_pro.trim() == "" || data.phone_pro.trim() == null) {
      this.messageNotifier('error', '', 'Please enter contact number');
      return false;
    } else {
      if (!this.validateNumber(data.phone_pro)) {
        this.messageNotifier('error', '', 'Please enter correct contact number');
        return false;
      }
    }
    if (data.email_pri.trim() != "" && data.email_pri.trim() == null) {
      if (!this.validateCaseSensitiveEmail(data.email_pri)) {
        this.messageNotifier('error', '', 'Please enter correct email');
        return false;
      }
    }
    if (data.dob == "" || data.dob == null) {
      this.messageNotifier('error', '', 'Please enter date of birth');
      return false;
    }
    if (data.emp_type == '2') {
      if (data.role_id == '-1') {
        this.messageNotifier('error', '', 'Please enter role');
        return false;
      }
    } else {
      data.role_id = "";
    }
    if (data.joining_date == "" || data.joining_date == null) {
      this.messageNotifier('error', '', 'Please enter joining date');
      return false;
    }
    if (data.aadhar_card_no != "" && data.aadhar_card_no != null) {
      if (data.aadhar_card_no.trim().length != 12) {
        this.messageNotifier('error', '', 'Please enter valid aadhar card number');
        return false;
      }
    }
    if (data.pan_card_no != "" && data.pan_card_no != null) {
      if (data.pan_card_no.trim().length != 10) {
        this.messageNotifier('error', '', 'Please enter valid PAN card number');
        return false;
      }
    }
    let obj: any = {
      emp_name: data.emp_name.trim(),
      phone_pro: data.phone_pro,
      email_pri: data.email_pri,
      address: data.address,
      joining_date: moment(data.joining_date).format('YYYY-MM-DD'),
      year_of_experience: data.year_of_experience,
      designation_id: Number(data.designation_id),
      dob: moment(data.dob).format('YYYY-MM-DD'),
      emp_manager_id: Number(data.emp_manager_id) == -1 ? null : Number(data.emp_manager_id),
      role_id: data.role_id,
      emp_type: Number(data.emp_type),
      highest_qualification: data.highest_qualification,
      aadhar_card_no: data.aadhar_card_no,
      pan_card_no: data.pan_card_no
    };
    return obj;
  }


  addNewUser() {
    let check = this.makeJsonToSend(this.employeeDetails);
    console.log(check);
    if (check == false) {
      return;
    }
    else {
      this.isRippleLoad = true;
      this.apiService.createNewUser(check).subscribe(
        res => {
          console.log(res);
          this.isRippleLoad = false;
          this.messageNotifier('success', 'Successfully Added', '');
          this.clearEmployeeDetails();
        },
        err => {
          this.isRippleLoad = false;
          this.messageNotifier('error', '', err.error.message);
        }
      )
    }
  }

  clearEmployeeDetails() {
    this.employeeDetails = {
      emp_name: '',
      phone_pro: '',
      email_pri: '',
      address: '',
      joining_date: moment().format('YYYY-MM-DD'),
      year_of_experience: 0,
      designation_id: '-1',
      dob: '',
      emp_manager_id: '-1',
      role_id: '-1',
      emp_type: '1'
    };
  }

  upadateUserDet() {
    let check = this.makeJsonToSend(this.employeeDetails);
    console.log(check);
    if (check == false) {
      return;
    } else {
      check.emp_id = this.employeeId;
      this.isRippleLoad = true;
      this.apiService.updateDetails(check).subscribe(
        res => {
          this.isRippleLoad = false;
          this.messageNotifier('success', 'Successfully Updated', '');
        },
        err => {
          this.isRippleLoad = false;
          this.messageNotifier('error', '', err.error.message);
        }
      )
    }
  }

  setImage(e) {
    this.profile_pic = e;
  }

  ///////////////////////Second Page Funcion////////////////////////


  //Salary Function


  getEmployeeSalary(empId) {
    this.isRippleLoad = true;
    this.apiService.getSalaryStructure(empId).subscribe(
      res => {
        this.isRippleLoad = false;
        this.salaryDet = res;
      },
      err => {
        this.isRippleLoad = false;
      }
    )
  }

  validateSalaryStructure(data) {
    let obj: any = {};
    if (data.salary_type == "1") {
      if (Number(data.basic) == 0 || Number(data.basic) < 0) {
        this.messageNotifier('error', '', 'Please enter basic salary');
        return false;
      }
      obj = {
        salary_type: '1',
        basic: Number(data.basic),
        ta: Number(data.ta),
        da: Number(data.da),
        hra: Number(data.hra),
        pf: Number(data.pf),
        esi: Number(data.esi),
        tax: Number(data.tax),
        total: Number(data.basic + data.ta + data.da + data.hra + data.pf + data.esi + data.tax),
        class_hour_rate: '',
        sal_comp1: 0,
        sal_comp2: 0,
        sal_comp3: 0
      }
    } else {
      if (Number(data.class_hour_rate) == 0 || Number(data.class_hour_rate) < 0) {
        this.messageNotifier('error', '', 'Please enter hourly class rate');
        return false;
      }
      obj = {
        salary_type: '1',
        basic: 0,
        ta: 0,
        da: 0,
        hra: 0,
        pf: 0,
        esi: 0,
        tax: 0,
        total: 0,
        class_hour_rate: Number(data.class_hour_rate),
        sal_comp1: 0,
        sal_comp2: 0,
        sal_comp3: 0
      }
    }
    return obj;
  }

  saveNewSalaryStruct() {
    let data: any = this.validateSalaryStructure(this.salaryDet);
    if (data == false) {
      return;
    }
    data.emp_id = this.employeeId;
    this.isRippleLoad = true;
    this.apiService.createSalaryStructure(data).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageNotifier('success', 'Saved Successfully', 'Salary Structure Saved Successfully');
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  updateSalaryStructure() {
    let data: any = this.validateSalaryStructure(this.salaryDet);
    if (data == false) {
      return;
    }
    data.id = this.salaryDet.id;
    this.isRippleLoad = true;
    this.apiService.updateSalaryStructure(data, this.employeeId).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageNotifier('success', 'Updated Successfully', 'Salary Structure Updated Successfully');
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  // Working Hours

  getEmployeeWorkingTime(empid) {
    this.isRippleLoad = true;
    this.apiService.getWorkingHours(empid).subscribe(
      res => {
        this.isRippleLoad = false;
        this.makeJsonToRender(res);
      },
      err => {
        this.isRippleLoad = false;
      }
    )
  }

  makeJsonToRender(res) {
    this.workingDays.id = res.id;
    for (let i = 0; i < this.workingDays.week.length; i++) {
      for (let j = 0; j < res.week.length; j++) {
        if (this.workingDays.week[i].day == res.week[j].day) {
          this.workingDays.week[i].uiSelected = true;
          this.workingDays.week[i].in_time = this.makeHrMinObject(res.week[j].in_time);
          this.workingDays.week[i].out_time = this.makeHrMinObject(res.week[j].out_time);
          break;
        }
      }
    }
  }

  applySameDateFilter() {
    let validateTime = this.validateTimeDuration(this.sameTimeFilter.startTime, this.sameTimeFilter.endTime);
    if (validateTime == false) {
      return;
    }
    this.workingDays.week.map(
      ele => {
        ele.in_time.hr = this.sameTimeFilter.startTime.hr;
        ele.in_time.min = this.sameTimeFilter.startTime.min;
        ele.out_time.hr = this.sameTimeFilter.endTime.hr;
        ele.out_time.min = this.sameTimeFilter.endTime.min;
      }
    )
  }

  validateWorkingHours(data) {
    let dataToSend: any = [];
    for (let i = 0; i < data.week.length; i++) {
      if (data.week[i].uiSelected) {
        let timeValidate = this.validateTimeDuration(data.week[i].in_time, data.week[i].out_time);
        if (timeValidate == false) {
          return false;
        }
        let obj: any = {
          day: data.week[i].day,
          in_time: this.makeFinalTimeFormatting(data.week[i].in_time.hr, data.week[i].in_time.min),
          out_time: this.makeFinalTimeFormatting(data.week[i].out_time.hr, data.week[i].out_time.min),
        }
        dataToSend.push(obj);
      }
    }
    if (dataToSend.length == 0) {
      this.messageNotifier('error', '', 'You haven"t selected day of week');
      return false;
    } else {
      return dataToSend;
    }
  }

  saveNewWorkingHours() {
    let dataObject = this.validateWorkingHours(this.workingDays);
    if (dataObject == false) {
      return;
    }
    let obj: any = {};
    obj.emp_id = Number(this.employeeId);
    obj.week = dataObject;
    this.isRippleLoad = true;
    this.apiService.createWorkingHours(obj).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageNotifier('success', 'Saved Successfully', 'Working Hours Saved Successfully');
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  updateWorkingHours() {
    let dataObject = this.validateWorkingHours(this.workingDays);
    if (dataObject == false) {
      return;
    }
    let obj: any = {};
    obj.emp_id = Number(this.employeeId);
    obj.week = dataObject;
    obj.id = Number(this.workingDays.id);
    this.isRippleLoad = true;
    this.apiService.updateWorkingHours(obj, this.employeeId).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageNotifier('success', 'Updated Successfully', 'Working Hours Updated Successfully');
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  ///// Inventory Item List/////////////////////

  fetchInventoryItemList() {
    this.apiService.getItemList().subscribe(
      res => {
        this.inventoryItemList = res;
      },
      err => {
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  fetchUserInventoryDetails(emp_id) {
    this.isRippleLoad = true;
    this.apiService.getInventoryHistory(emp_id).subscribe(
      res => {
        this.isRippleLoad = false;
        this.allocationHistory = res;
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  allocateInventory() {
    if (this.allocateItem.item_id == "-1") {
      this.messageNotifier('error', '', "You haven't selected any item");
      return;
    } else {
      if (Number(this.allocateItem.alloted_units) == 0) {
        this.messageNotifier('error', '', "You haven't provided quantity");
        return;
      }
    }
    this.allocateItem.emp_id = this.employeeId;
    this.isRippleLoad = true;
    this.apiService.allocateInventory(this.allocateItem).subscribe(
      res => {
        this.isRippleLoad = false;
        this.messageNotifier('success', 'Allocated', 'Inventory allocated successfully');
        this.allocateItem = {
          item_id: -1,
          emp_id: -1,
          alloted_units: 0
        };
      },
      err => {
        this.isRippleLoad = false;
        this.messageNotifier('error', '', err.error.message);
      }
    )
  }

  // Helper Function

  messageNotifier(type, title, msg) {
    let data = {
      type: type,
      title: title,
      body: msg
    }
    this.toastCtrl.popToast(data);
  }

  validateCaseSensitiveEmail(email) {
    if (email != '' && email != null) {
      var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (reg.test(email)) {
        return true;
      }
      else {
        return false;
      }
    } else {
      return true;
    }
  }

  validateNumber(inputtxt) {
    let phoneno = /^\d{10}$/;
    if ((inputtxt.match(phoneno))) {
      return true;
    }
    else {
      return false;
    }
  }

  validateTimeDuration(startTime, endTime) {
    let start_Time = moment(this.breakTimeIntoHrMin(startTime.hr, startTime.minute), 'h:mma');
    let end_Time = moment(this.breakTimeIntoHrMin(endTime.hr, endTime.minute), 'h:mma');
    if (!(start_Time.isBefore(end_Time))) {
      this.messageNotifier('error', '', 'Please enter correct start time and end time');
      return false;
    }
  }

  breakTimeIntoHrMin(time, minute) {
    let hrMeri = time.split(' ');
    return hrMeri[0] + ":" + minute + hrMeri[1]
  }

  makeFinalTimeFormatting(time, min) {
    let hrMeri = time.split(' ');
    return hrMeri[0] + ":" + min + " " + hrMeri[1]
  }

  makeHrMinObject(time) {
    let obj: any = {};
    obj.hr = time.split(':')[0] + " " + time.split(':')[1].split(' ')[1];
    obj.min = time.split(':')[1].split(" ")[0];
    return obj;
  }

}
