import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { AppComponent } from '../../../app.component';
import { EnquiryCampaign } from '../../../model/enquirycampaign';
import { instituteInfo } from '../../../model/instituteinfo';
import { addEnquiryForm } from '../../../model/add-enquiry-form';
import { FetchenquiryService } from '../../../services/enquiry-services/fetchenquiry.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { PostEnquiryDataService } from '../../../services/enquiry-services/post-enquiry-data.service';
import { LoginService } from '../../../services/login-services/login.service';
import { Logger } from '@nsalaun/ng-logger';
import * as moment from 'moment';


@Component({
  selector: 'app-enquiry-add',
  templateUrl: './enquiry-add.component.html',
  styleUrls: ['./enquiry-add.component.scss']
})
export class EnquiryAddComponent implements OnInit {

  /* Variable Declarations */
  enqstatus: any = [];
  enqPriority: any = [];
  enqFollowType: any = [];
  enqAssignTo: any = [];
  enqStd: any = [];
  isProfessional: boolean = false;
  enqSub: any = [];
  enqScholarship: any = [];
  enqSub2: any = [];
  school: any = [];
  sourceLead: any = [];
  refferedBy: any = [];
  occupation: any = [];
  lastDetail: any = [];
  enquiryConfirm: any = [];
  confimationPop: boolean = false;
  updatePop: boolean = false;
  newEnqData: addEnquiryForm = {
    name: "",
    phone: "",
    email: "",
    gender: "",
    phone2: "",
    email2: "",
    dob: null,
    curr_address: "",
    parent_name: "",
    parent_phone: "",
    parent_email: "",
    city: "",
    occupation_id: "-1",
    school_id: "-1",
    qualification: "",
    grade: "",
    enquiry_date: moment().format('YYYY-MM-DD'),
    standard_id: "-1",
    subject_id: "-1",
    referred_by: "-1",
    source_id: "-1",
    fee_committed: "",
    discount_offered: "",
    priority: "cold_call",
    enquiry: "",
    follow_type: "call",
    followUpDate: moment().format('YYYY-MM-DD'),
    religion: null,
    link: "",
    slot_id: null,
    closedReason: "",
    demo_by_id: "",
    status: "0",
    assigned_to: "-1",
    followUpTime: "",
    lead_id: -1,
    enqCustomLi: []
  };
  additionDetails: boolean = false;
  todayDate: number = Date.now();
  isSourcePop: boolean = false;
  isInstitutePop: boolean = false;
  isReferPop: boolean = false;
  newEnquiryFormGroup: FormGroup;
  componentPrefill: any = [];
  componentListObject: any = {};
  emptyCustomComponent: any;
  componentRenderer: any = [];
  isCustomComponentValid: boolean = true;
  isCustomComponentStillValid: boolean = false;
  isFormValid: boolean = false;
  lastUpdated: any;
  errorMessage: any;
  submitError: boolean = false;
  addNextCheck: boolean = false;
  isEnquiryAdmin: boolean = false;
  busy: Subscription;
  isNewInstitute: boolean = true;
  private customComponents: any[] = [];
  /* Institute List for edit and delete purpose */
  instituteList: any;

  isNewSource: boolean = true;
  /* Institute List for edit and delete purpose */
  sourceList: any;

  isNewRefer: boolean = true;
  /* Institute List for edit and delete purpose */
  referList: any;

  /*hourArr: any[] = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  minArr: any[] = ['', '00', '15', '30', '45'];
  meridianArr: any[] = ['', "AM", "PM"];
  hour: string = ''; minute: string = ''; meridian: string = '';*/

  hourArr:any[]=['','1','2','3','4','5','6','7','8','9','10','11','12'];
  minArr:any[]=['','00','15','30','45'];
  meridianArr:any[]=['',"AM","PM"];
  hour:string = '';
  minute:string='';
  meridian:string=''

  times: any[] = ['', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 AM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 PM']
  timeObj: any = {
    fhour: '',
    fminute: '',
    fmeridian: '',
    whour: '',
    wminute: '',
    wmeridian: '',
  };
  followUpTime: any="";


  /* Model for Creating Institute */
  createInstitute = {
    instituteName: "",
    isActive: "Y"
  }

  /* Model for Creating Source */
  createSource = {
    name: "",
    inst_id: sessionStorage.getItem('institute_id'),
  }

  /* Model for Creating Reference */
  createReferer = {
    name: "",
    inst_id: sessionStorage.getItem('institute_id')
  }

  constructor(private prefill: FetchprefilldataService, private router: Router,
    private logger: Logger, private appC: AppComponent, private poster: PostEnquiryDataService, private login: LoginService) {
    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    if (sessionStorage.getItem('Authorization') == null) {
      this.router.navigate(['/authPage']);
    }
  }

  timeChange(ev, id) {
    if (id === 'followUpTime') {
      if(ev.split(' ')[0] != ''){
        this.timeObj.fhour = ev.split(' ')[0];
        this.timeObj.fmeridian = ev.split(' ')[1];
      }
      else{
        this.timeObj.fhour = '';
        this.timeObj.fmeridian = '';
      }
    }
    else {
      if(ev.split(' ')[0] != ''){
        this.timeObj.whour = ev.split(' ')[0];
        this.timeObj.wmeridian = ev.split(' ')[1];
      }
      else{
        this.timeObj.whour = '';
        this.timeObj.wmeridian = '';
      }
    }
  }
  /* OnInit Initialized */
  ngOnInit() {
    this.isEnquiryAdministrator();
    this.busy = this.FetchEnquiryPrefilledData();

    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));

    /* Model for Enquiry Data */
    this.newEnqData = {
      name: "",
      phone: "",
      email: "",
      gender: "",
      phone2: "",
      email2: "",
      curr_address: "",
      parent_name: "",
      parent_phone: "",
      parent_email: "",
      city: "",
      occupation_id: "-1",
      school_id: "-1",
      qualification: "",
      grade: "",
      enquiry_date: moment().format('YYYY-MM-DD'),
      standard_id: "-1",
      subject_id: "-1",
      referred_by: "-1",
      source_id: "-1",
      fee_committed: "",
      discount_offered: "",
      priority: "cold_call",
      enquiry: "",
      follow_type: "call",
      followUpDate: moment().format('YYYY-MM-DD'),
      religion: null,
      link: "",
      slot_id: null,
      closedReason: "",
      demo_by_id: "",
      status: "0",
      assigned_to: "-1",
      followUpTime: "",
      lead_id: -1,
      enqCustomLi: []
    };
  }




  /* Function for Toggling Form Visibility */
  toggleForm(event) {
    let eleid = event.srcElement.id;
    //console.log(eleid);
    if (eleid == "openBasic") {
      var academic = document.getElementById('academicDetails').classList;
      academic.remove('active');
      var basic = document.getElementById('basicDetails').classList;
      basic.add('active');
    }
    else if (eleid == "closeBasic") {
      var basic = document.getElementById('basicDetails').classList;
      basic.remove('active');
      var academic = document.getElementById('academicDetails').classList;
      academic.add('active');
    }
    else if (eleid == "openAcademic") {
      var basic = document.getElementById('basicDetails').classList;
      //console.log(basic);
      basic.remove('active');
      var academic = document.getElementById('academicDetails').classList;
      //console.log(academic);
      academic.add('active');
    }
    else if (eleid == "closeAcademic") {
      var academic = document.getElementById('academicDetails').classList;
      academic.remove('active');
      var basic = document.getElementById('basicDetails').classList;
      basic.add('active');
    }
  }





  /* Function to fetch prefill data for form creation */
  FetchEnquiryPrefilledData() {


    this.prefill.getEnqStatus().subscribe(
      data => { this.enqstatus = data; },
      err => {
        //  console.log(err); 
      }
    );



    this.prefill.getEnqPriority().subscribe(
      data => { this.enqPriority = data; },
      err => {
        //  console.log(err); 
      }
    );



    this.prefill.getFollowupType().subscribe(
      data => { this.enqFollowType = data },
      err => {
        //  console.log(err); 
      }
    );



    this.prefill.getAssignTo().subscribe(
      data => { this.enqAssignTo = data; },
      err => {
        //   console.log(err); 
      }
    );





    this.prefill.getEnqStardards().subscribe(
      data => { this.enqStd = data; },
      err => {
        //  console.log(err);
      }
    );



    this.prefill.getSchoolDetails().subscribe(
      data => {
        this.school = data;
        this.instituteList = this.school;

        this.instituteList.forEach(el => {
          el.edit = false;
        });
      },
      err => {
        //  console.log(err);
      }
    );



    this.prefill.getLeadSource().subscribe(
      data => {
        this.sourceLead = data;
        this.sourceList = this.sourceLead;
        this.sourceList.forEach(el => {
          el.edit = false;
        });
      },
      err => {
        //   console.log(err);
      }
    );



    this.prefill.getLeadReffered().subscribe(
      data => {
        this.refferedBy = data;
        this.referList = this.refferedBy;

        this.referList.forEach(el => {
          el.edit = false;
        });
      },
      err => {
        //  console.log(err);
      }
    );



    this.prefill.getOccupation().subscribe(
      data => { this.occupation = data; },
      err => {
        //   console.log(err); 
      }
    );



    this.prefill.fetchLastDetail().subscribe(
      data => {
        this.lastDetail = data;
        //console.log(this.lastDetail);
      },
      err => {
        // console.log(err);
      }
    );



    return this.prefill.fetchCustomComponentEmpty()
      .subscribe(
        data => {
          data.forEach(el => {

            let obj = {
              data: el,
              id: el.component_id,
              is_required: el.is_required,
              is_searchable: el.is_searchable,
              label: el.label,
              prefilled_data: this.createPrefilledData(el.prefilled_data.split(',')),
              selected: [],
              selectedString: '',
              type: el.type,
              value: el.enq_custom_value
            }
            this.customComponents.push(obj);

          });
          this.emptyCustomComponent = this.componentListObject;
        }
      );
  }






  /* Custom Compoenent array creater */
  createPrefilledData(dataArr: any[]): any[] {
    let customPrefilled: any[] = [];
    dataArr.forEach(el => {
      let obj = {
        data: el,
        checked: false
      }
      customPrefilled.push(obj);
    });

    return customPrefilled;
  }




  /* if custom component is of type multielect then toggle the visibility of the dropdowm */
  multiselectVisible(elid) {
    let targetid = elid + "multi";
    if (elid != null && elid != '') {
      if (document.getElementById(targetid).classList.contains('hide')) {
        document.getElementById(targetid).classList.remove('hide');
      }
      else {
        document.getElementById(targetid).classList.add('hide');
      }
    }
  }






  /* if custom component is of type multielect then update the selected or unselected data*/
  updateMultiSelect(data, id) {
    this.customComponents.forEach(el => {
      if (el.id == id) {
        el.prefilled_data.forEach(com => {
          //console.log(com);
          if (com.data == data.data) {
            /* Component checked */
            if (com.checked) {
              el.selected.push(com.data);
              if (el.selected.length != 0) {
                document.getElementById(id + 'wrapper').classList.add('has-value');
              }
              else {
                document.getElementById(id + 'wrapper').classList.remove('has-value');
              }
              //console.log(com.selected);
              el.selectedString = el.selected.join(',');
              el.value = el.selectedString;
            }
            /* Component unchecked */
            else {
              if (el.selected.length != 0) {
                document.getElementById(id + 'wrapper').classList.add('has-value');
              }
              else if (el.selected.length == 0) {
                document.getElementById(id + 'wrapper').classList.remove('has-value');
              }
              //console.log(com.selected);
              var index = el.selected.indexOf(data.data);
              if (index > -1) {
                el.selected.splice(index, 1);
              }
              el.selectedString = el.selected.join(',');
              el.value = el.selectedString;

            }
          }
        });
      }
    });

  }










  /* Function to Toggle visibility of additional details div */
  showAdditionDetails() {
    this.additionDetails = !this.additionDetails;
  }






  /* On Phone Number input by user update model and fetch lead records if any */
  updatePhoneFetchRecords() {
    this.prefill.fetchLeadDetails(this.newEnqData.phone).subscribe(
      data => { this.updateForm(data) },
      err => { }
    );
  }






  /* Function to fetch lead details on basis of the phone number provided by user */
  getLeadDetails() {
    //console.log(this.newEnqData.phone);
    if (this.validatePhone(this.newEnqData.phone)) {
      this.prefill.fetchLeadDetails(this.newEnqData.phone).subscribe(
        data => { this.updateForm(data) },
        err => {
          let data = {
            type: "error",
            title: "Unable to fetch lead",
            body: err.message
          }
          this.appC.popToast(data);
        }
      );
    }
  }





  /* Function to validate the number provided by user  and return data back to getLeadDetails*/
  validatePhone(num) {
    //console.log(num);
    if (num != null) {
      return this.newEnqData.phone.length === 10;
    }
  }




  /* Update the form fields onn basis of the data retreived from getLeadDetails*/
  updateForm(data) {
    this.newEnqData.curr_address = data.address;
    this.newEnqData.assigned_to = data.assigned_to;
    this.newEnqData.city = data.city;
    this.newEnqData.email = data.email;
    this.newEnqData.gender = data.gender;
    this.newEnqData.name = data.name;
    this.newEnqData.referred_by = data.referred_by;
    this.newEnqData.source_id = data.source_id;
  }




  /* Function to fetch subject when user selects a standard from dropdown */
  fetchSubject(value) {
    if (value != null && value != '' && value != '-1') {
      this.newEnqData.subject_id = '-1';
      this.enqSub = [];
      this.newEnqData.standard_id = value;
      this.prefill.getEnqSubjects(this.newEnqData.standard_id).subscribe(
        data => {
          this.enqSub = data;
        }
      )
    }
    else {
      this.newEnqData.subject_id = '-1';
      this.enqSub = [];
    }

  }




  /* Function to clear the form data */
  clearFormData() {
    this.newEnqData = {
      name: "",
      phone: "",
      email: "",
      gender: "",
      phone2: "",
      email2: "",
      curr_address: "",
      parent_name: "",
      parent_phone: "",
      parent_email: "",
      city: "",
      occupation_id: "-1",
      school_id: "-1",
      qualification: "",
      grade: "",
      enquiry_date: moment().format('YYYY-MM-DD'),
      standard_id: "-1",
      subject_id: "-1",
      referred_by: "-1",
      source_id: "-1",
      fee_committed: "",
      discount_offered: "",
      priority: "cold_call",
      enquiry: "",
      follow_type: "call",
      followUpDate: moment().format('YYYY-MM-DD'),
      religion: null,
      link: "",
      slot_id: null,
      closedReason: "",
      demo_by_id: "",
      status: "0",
      assigned_to: "-1",
      followUpTime: "",
      lead_id: -1,
      enqCustomLi: []
    };
    this.hour = '';
    this.minute = '';
    this.meridian = '';
    this.customComponents.forEach(el => {
      el.value = '';
      el.selectedString = '';
      el.selected = [];
    });

  }

  updateCustomComponent(v, comp) {
    if (v) {
      this.customComponents.forEach(e => {
        if (e.id === comp.id) {
          e.value = v;
        }
      })
    }
    else {
      this.customComponents.forEach(e => {
        if (e.id === comp.id) {
          e.value = v;
        }
      })
    }
  }

  getCustomComponents(): any[] {
    let tempArr: any[] = [];
    this.customComponents.forEach(e => {
      if (e.hasOwnProperty('value')) {
        if (typeof e.value == 'string') {
          if (e.value.trim() != '') {
            let obj: any = {};
            obj.component_id = e.id;
            obj.enq_custom_id = 0;
            obj.enq_custom_value = e.value;
            tempArr.push(obj);
          }
        }
        else if (typeof e.value == 'boolean') {
          if(e.value){
            let obj: any = {};
            obj.component_id = e.id;
            obj.enq_custom_id = 0;
            obj.enq_custom_value = "Y";
            tempArr.push(obj);
          }
          /* else{
            let obj: any = {};
            obj.component_id = e.id;
            obj.enq_custom_id = 0;
            obj.enq_custom_value = "N";
            tempArr.push(obj);
          } */
        }
      }
    });
    return tempArr;
  }


  /* Function to submit validated form data */
  submitForm(form: NgForm) {
    //Validates if the custom component required fields are selected or not
    let customComponentValidator = this.validateCustomComponent();

    /* Validate the predefine required fields of the form */
    this.isFormValid = this.ValidateFormDataBeforeSubmit();

    /* Upload Data if the formData is valid */
    if (this.isFormValid && customComponentValidator) {
      if (this.validateTime()) {
        this.newEnqData.enqCustomLi = this.getCustomComponents();
        console.log(this.newEnqData.enqCustomLi);
        if (this.hour != '') {
          this.newEnqData.followUpTime = this.hour + ":" + this.minute + " " + this.meridian;
        }
        this.poster.postNewEnquiry(this.newEnqData).subscribe(
          data => {
            this.enquiryConfirm = data;
            this.prefill.fetchLastDetail().subscribe(data => {
              this.lastDetail = data;
              if (this.addNextCheck) {
                let msg = {
                  type: "success",
                  title: "New Enquiry Added",
                  body: "Your enquiry has been submitted"
                }

                //form.reset();
                this.appC.popToast(msg);
                this.clearFormData();
              }
              else {
                this.openConfirmationPopup();
                //form.reset();
                this.clearFormData();
              }
            },
              err => {

              });
          },
          err => {
            let data = {
              type: "error",
              title: "Error Posting New Enquiry",
              body: err.message + " mobile number is already in use, please provide another primary contact"
            }
            this.appC.popToast(data);
          }
        );
      }
      else {
        let msg = {
          type: 'error',
          title: 'Invalid Time Input',
          body: 'Please select a valid time for follow up'
        }
        this.appC.popToast(msg);
      }
    }
    else {
      let msg = {
        type: 'error',
        title: 'Academic Data Incomplete',
        body: 'Please fill the mandatory required field'
      }
      this.appC.popToast(msg);
      this.submitError = true;
    }
  }





  validateTime(): boolean {
    /* some time selected by user or nothing*/
    if ((this.hour != '' && this.minute != '' && this.meridian != '') || (this.hour == '' && this.minute == '' && this.meridian == '')) {
      return true;
    }
    else {
      return false;
    }
  }



  validateCustomComponent(): boolean {

    let temp: boolean = true;

    this.customComponents.forEach(el => {
      //console.log(el);
      if (el.is_required == 'Y' && el.value == '') {
        if (temp) {
          temp = false;
        }
      }
    });
    return temp;
  }




  /* Validate the Entire FormData Once Before Uploading= */
  ValidateFormDataBeforeSubmit(): boolean {

    if ((this.newEnqData.name == null || this.newEnqData.name == "") || (this.newEnqData.enquiry_date == null || this.newEnqData.enquiry_date == "" || this.newEnqData.source_id == "" || this.newEnqData.source_id == "-1")) {
      return false;
    }
    else {
      return true;
    }
  }





  /* fetch the data of last updated enquiry */
  updateLastUpdatedDetails() {
    this.prefill.fetchLastDetail().subscribe(data => {
      this.lastDetail = data;
    },
      err => {
        //  console.log(err);
      }
    )
  }





  /* Function to open confirmation popup on succesfull form submission  */
  openConfirmationPopup() {
    //  console.log("confirmation popup opened");
    this.confimationPop = true;
  }





  /* Function to close the confirmation popup */
  closePopUp() {
    // console.log("confirmation popup closed");
    this.confimationPop = false;
  }





  /* function to open update popup */
  openUpdatePopup() {
    this.closePopUp();
    this.updatePop = true;
    // console.log("edit popup opened");
  }





  /* Function to close update popup */
  closeUpdatePopup() {
    this.updatePop = false;
  }




  /* function to open popup to add source */
  showAddSourcePops() {
    //console.log('clicked');
    this.isSourcePop = true;
  }




  /* function to hide popup to add source */
  hideAddSourcePops() {
    this.isSourcePop = false;
  }








  /* function to show popup for adding reference */
  showAddReferPops() {
    this.isReferPop = true;
  }




  /* function to hide popup for adding reference */
  hideAddReferPops() {
    this.isReferPop = false;
  }







  /* Reload the Enquiry Form and clear data */
  reloadEnquiryForm() {
    this.clearFormData();
    this.closePopUp();
  }



  customComponentUpdated(val, data) {
    this.componentListObject[data.component_id].enq_custom_value = val;
    // console.log(this.componentListObject);
  }


  navigateToEdit() {
    let val: any;
    this.prefill.fetchLastDetail().subscribe(el => {
      this.router.navigate(['/enquiry/edit/' + el.institute_enquiry_id]);
    }
    )
  }





  /* --------------------------------------------------------------------------------------------------------- */
  /* ---------------------------------------------- Institute Editor Logic ------------------------------------------------- */
  /* --------------------------------------------------------------------------------------------------------- */

  /* function to open popup to add institute */
  openAddInstitute() {
    this.isInstitutePop = true;
  }

  /* function to hide popup to add institute */
  closeInstituteAdder() {
    this.isInstitutePop = false;
    this.isNewInstitute = false;
    this.createInstitute.instituteName = '';
    this.fetchInstituteInfo();
  }

  /* function to set-unset isActive status for add institute */
  toggleInstituteActive(event) {
    if (event) {
      this.createInstitute.isActive = "Y";
    }
    else {
      this.createInstitute.isActive = "N";
    }

  }

  /* function to add institute data to server */
  addInstituteData() {
    this.prefill.createNewInstitute(this.createInstitute).subscribe(el => {
      if (el.message === "OK") {
        this.prefill.getSchoolDetails().subscribe(
          data => {
            this.school = data;
            this.instituteList = this.school;
            this.instituteList.forEach(el => {
              el.edit = false;
            });

            this.closeAddInstitute();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'Failed To Add Institute',
              body: 'There was an error processing your request'
            }
            this.appC.popToast(alert);
          }
        );
        // console.log("institute Added");
      }
      else {
        // console.log("Institute Name already exist!");
      }
    });
  }

  /* toggle visibility of new institute form */
  toggleInstituteAdd() {

    let icon = document.getElementById('add-institute-icon').innerHTML;
    if (icon == '+') {
      this.isNewInstitute = true;
      document.getElementById('add-institute-icon').innerHTML = '-';
    }
    else if (icon == '-') {
      this.isNewInstitute = false;
      this.createInstitute.instituteName = '';
      document.getElementById('add-institute-icon').innerHTML = '+';
    }
  }

  /* close add new institute */
  closeAddInstitute() {
    this.isNewInstitute = false;
    document.getElementById('add-institute-icon').innerHTML = '+';
    this.createInstitute.instituteName = '';
  }

  fetchInstituteInfo() {
    this.prefill.getSchoolDetails().subscribe(
      data => {
        this.school = data;
        this.instituteList = this.school;
        this.instituteList.forEach(el => {
          el.edit = false;
        });
      },
    )
  }

  editInstitute(id) {
    this.instituteList.forEach(el => {
      if (el.school_id == id) {
        el.edit = true;
      }
    });
  }

  cancelEditInstitute(id) {
    this.fetchInstituteInfo();
  }

  updateInstitute(id) {
    this.instituteList.forEach(el => {
      if (el.school_id == id) {
        this.poster.updateInstituteDetails(id, el).subscribe(
          res => {
            let alert = {
              type: 'success',
              title: 'institute Name Update',
            }
            this.appC.popToast(alert);
            this.fetchInstituteInfo();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'We coudn\'t process your request',
              body: err.message
            }
            this.appC.popToast(alert);
            this.fetchInstituteInfo();
          }
        )
      }
    });
  }

  deleteInstitute(id) {
    this.poster.deleteInstitute(id).subscribe(
      res => {
        let alert = {
          type: 'success',
          title: 'Institute Record Deleted',
          body: " The institute data has been removed from your account"
        }
        this.appC.popToast(alert);
        this.fetchInstituteInfo();
      },
      err => {
        let alert = {
          type: 'error',
          title: 'Your Delete Request Has Been Denied',
          body: "The requested institute is currently in use and cannot be deleted"
        }
        this.appC.popToast(alert);
        this.fetchInstituteInfo();
      }
    )
  }







  /* --------------------------------------------------------------------------------------------------------- */
  /* ---------------------------------------------- Reference Editor Logic ------------------------------------------------- */
  /* --------------------------------------------------------------------------------------------------------- */


  /* function to open popup to add Reference */
  openAddRefer() {
    this.isReferPop = true;
  }

  /* function to hide popup to add Reference */
  closeReferAdder() {
    this.isReferPop = false;
    this.isNewRefer = false;
    this.createReferer.name = '';
    this.fetchReferInfo();
  }


  /* function to add Reference data to server */
  addReferData() {
    this.prefill.createReferer(this.createReferer).subscribe(
      el => {
        this.prefill.getLeadReffered().subscribe(
          res => {
            this.refferedBy = res;
            this.referList = this.refferedBy;
            this.referList.forEach(el => {
              el.edit = false;
            });
            this.closeAddRefer();

          }
        )
      },
      err => {

      }
    );
  }



  /* toggle visibility of new Reference form */
  toggleReferAdd() {

    let icon = document.getElementById('add-refer-icon').innerHTML;
    if (icon == '+') {
      this.isNewRefer = true;
      document.getElementById('add-refer-icon').innerHTML = '-';
    }
    else if (icon == '-') {
      this.isNewRefer = false;
      this.createReferer.name = '';
      document.getElementById('add-refer-icon').innerHTML = '+';
    }
  }



  /* close add new Reference */
  closeAddRefer() {
    this.isNewRefer = false;
    document.getElementById('add-refer-icon').innerHTML = '+';
    this.createReferer.name = '';
  }



  fetchReferInfo() {
    this.prefill.getLeadReffered().subscribe(
      data => {
        this.refferedBy = data;
        this.referList = this.refferedBy;
        this.referList.forEach(el => {
          el.edit = false;
        });
      },
    )
  }



  editRefer(id) {
    this.referList.forEach(el => {
      if (el.id == id) {
        el.edit = true;
      }
    });
  }



  cancelEditRefer(id) {
    this.fetchReferInfo();
  }



  updateRefer(id) {
    this.referList.forEach(el => {
      if (el.id == id) {
        let data = {
          id: id,
          name: el.name,
          inst_id: sessionStorage.getItem('institute_id')
        };
        this.poster.updateReferDetails(data).subscribe(
          res => {

            let alert = {
              type: 'success',
              title: 'Reference Updated',
            }
            this.appC.popToast(alert);
            this.fetchReferInfo();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'Failed To Update Reference',
              body: 'There was an error processing your request'
            }
            this.appC.popToast(alert);
          }
        )
      }
    });
  }



  deleteRefer(id) {
    this.referList.forEach(el => {
      if (el.id == id) {
        let data = {
          id: id,
          name: el.name,
          inst_id: sessionStorage.getItem('institute_id')
        };
        this.poster.deleteRefer(data).subscribe(
          res => {
            let alert = {
              type: 'success',
              title: 'Reference Deleted',
            }
            this.appC.popToast(alert);
            this.fetchReferInfo();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'Failed To Delete Reference',
              body: 'The requested referer is currently in use and cannot be deleted'
            }
            this.appC.popToast(alert);
          }
        )
      }
    });
  }








  /* --------------------------------------------------------------------------------------------------------- */
  /* ---------------------------------------------- Source Editor Logic ------------------------------------------------- */
  /* --------------------------------------------------------------------------------------------------------- */

  /* function to open popup to add Source */
  openAddSource() {
    this.isSourcePop = true;
  }

  /* function to hide popup to add Source */
  closeSourceAdder() {
    this.isSourcePop = false;
    this.isNewSource = false;
    this.createSource.name = '';
    this.fetchSourceInfo();
  }




  /* function to add Source data to server */
  addSourceData() {
    this.prefill.createSource(this.createSource).subscribe(
      el => {
        this.fetchSourceInfo();
        this.closeAddSource();
      },
      err => {

      }
    );
  }



  /* toggle visibility of new Source form */
  toggleSourceAdd() {

    let icon = document.getElementById('add-source-icon').innerHTML;
    if (icon == '+') {
      this.isNewSource = true;
      document.getElementById('add-source-icon').innerHTML = '-';
    }
    else if (icon == '-') {
      this.isNewSource = false;
      this.createSource.name = '';
      document.getElementById('add-source-icon').innerHTML = '+';
    }
  }



  /* close add new Source */
  closeAddSource() {
    this.isNewSource = false;
    document.getElementById('add-source-icon').innerHTML = '+';
    this.createSource.name = '';
  }


  /* Source fetch via API*/
  fetchSourceInfo() {
    this.prefill.getLeadSource().subscribe(
      data => {
        this.sourceLead = data;
        this.sourceList = this.sourceLead;
        this.sourceList.forEach(el => {
          el.edit = false;
        });
      },
    )
  }


  /* Source edit open*/
  editSource(id) {
    this.sourceList.forEach(el => {
      if (el.id == id) {
        el.edit = true;
      }
    });
  }


  /* Source edit cancel*/
  cancelEditSource(id) {
    this.fetchSourceInfo();
  }

  /* Source update*/
  updateSource(id) {
    this.sourceList.forEach(el => {
      if (el.id == id) {
        let data = {
          id: id,
          name: el.name,
          inst_id: sessionStorage.getItem('institute_id')
        }
        this.poster.updateSourceDetails(data).subscribe(
          res => {
            let alert = {
              type: 'success',
              title: 'Source Updated',
            }
            this.appC.popToast(alert);
            this.fetchSourceInfo();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'Failed To Update Source',
              body: 'There was an error processing your request'
            }
            this.appC.popToast(alert);
          }
        )
      }
    });
  }

  timeChanges(ev, id) {
     // debugger
      if(ev.split(' ')[0] != ''){
        this.hour = ev.split(' ')[0];
        this.meridian = ev.split(' ')[1];

        //console.log(this.hour + "" +this.meridian)
      }
      else{
        this.hour = '';
        this.meridian = '';
      }
    
    
  }

  /* Source delete*/
  deleteSource(id) {
    this.sourceList.forEach(el => {
      if (el.id == id) {
        let data = {
          id: id,
          name: el.name,
          inst_id: sessionStorage.getItem('institute_id')
        }
        this.poster.deleteSource(data).subscribe(
          res => {
            let alert = {
              type: 'success',
              title: 'Source Deleted',
              body: 'Your request has been processed'
            }
            this.appC.popToast(alert);
            this.fetchSourceInfo();
          },
          err => {
            let alert = {
              type: 'error',
              title: 'Failed To Delete Source',
              body: 'The requested source is currently in use and cannot be deleted'
            }
            this.appC.popToast(alert);
          }
        )
      }
    });
  }



  /* Customiized click detection strategy */
  inputClicked(ev) {
    if (ev.target.classList.contains('form-ctrl')) {
      if (ev.target.classList.contains('bsDatepicker')) {
        var nodelist = document.querySelectorAll('.bsDatepicker');
        [].forEach.call(nodelist, (elm) => {
          elm.addEventListener('focusout', function (event) {
            event.target.parentNode.classList.add('has-value');
          });

        });
      }
      else if ((ev.target.classList.contains('form-ctrl')) && !(ev.target.classList.contains('bsDatepicker'))) {
        //document.getElementById(ev.target.id).click();
        ev.target.addEventListener('blur', function (event) {
          if (event.target.value != '') {
            event.target.parentNode.classList.add('has-value');
          } else {
            event.target.parentNode.classList.remove('has-value');
          }
        });
      }
    }
  }




  isEnquiryAdministrator() {
    if (sessionStorage.getItem('permissions') == null || sessionStorage.getItem('permissions') == undefined || sessionStorage.getItem('permissions') == '') {
      this.isEnquiryAdmin = true;
    }
    else {
      let permissions: any[] = [];
      permissions = JSON.parse(sessionStorage.getItem('permissions'));
      /* User has permission to view all enquiries */
      if (permissions.includes('115')) {
        this.isEnquiryAdmin = true;
      }
      /* User is not authorized as enquiry admin and see only enquiry assigned to him */
      else {
        this.isEnquiryAdmin = false;
      }
    }
  }


  getLastAddName(): string {
    //console.log(this.lastDetail.name);
    return this.lastDetail.name;
  }

  getLastEnqNum() {
    return this.lastDetail.enquiry_no;
  }

  getLastUpdateTime() {
    //console.log(this.lastDetail);
    return moment(this.lastDetail.enquiry_creation_datetime).fromNow();
  }

  clearAddEnquiryDate() {
    this.newEnqData.enquiry_date = "";
  }

  clearAddFollowUpDate() {
    this.newEnqData.followUpDate = "";
    this.hour = '';
    this.minute = '';
    this.meridian = '';
  }


}
