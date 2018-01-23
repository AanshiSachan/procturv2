import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import { addCampaign } from '../../../model/add-campaign';
import 'rxjs/Rx';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn, NgForm } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from '../../../../assets/imported_modules/multiselect-dropdown';
import * as moment from 'moment';
import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';

@Component({
  selector: 'app-campaign-add',
  templateUrl: './campaign-add.component.html',
  styleUrls: ['./campaign-add.component.scss']
})
export class CampaignAddComponent implements OnInit {

  private campaignAddFormData: addCampaign = {
    name: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    city: "",
    referred:"",
    source:""   
  };

  private referralList: any[] = [];
  private sourceList: any[] = [];

  isProfessional: boolean = false;

  constructor(private router: Router, private login: LoginService, private appC: AppComponent, private prefill: FetchprefilldataService ) { }

  ngOnInit() {

    this.fetchPrefillFormData();

    this.isProfessional = sessionStorage.getItem('institute_type') == 'LANG';
    //console.log(this.isProfessional);
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));

    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

  /* Fetch and store the prefill data to be displayed on dropdown menu */
  fetchPrefillFormData() {

    let referralList = this.prefill.getLeadReffered().subscribe(data => {
      this.referralList = data;
    });

    let sourceList = this.prefill.getLeadSource().subscribe(data => {
      this.sourceList = data;
    });

  }
    
  
    






  /* Customiized click detection strategy */
  inputClicked() {
    var nodelist = document.querySelectorAll('.form-ctrl');
    [].forEach.call(nodelist, (elm) => {
      elm.addEventListener('blur', function (event) {
        if (event.target.value != '') {
          event.target.parentNode.classList.add('has-value');
        } else {
          event.target.parentNode.classList.remove('has-value');
        }
      });
    });

  }

  addCampaign(form: NgForm){

    if (form.valid) {
      /* Get slot data and store on form */
      // this.campaignAddFormData.phone = form.controls.cNumber.value;
      // this.campaignAddFormData.phone = form.controls.cNumber.value;
      // this.campaignAddFormData.phone = form.controls.cNumber.value;
      // this.campaignAddFormData.phone = form.controls.cNumber.value;
      // this.campaignAddFormData.phone = form.controls.cNumber.value;
      // this.campaignAddFormData.phone = form.controls.cNumber.value;
      // this.campaignAddFormData.phone = form.controls.cNumber.value;
      // this.campaignAddFormData.phone = form.controls.cNumber.value;

      console.log(this.campaignAddFormData);

      this.prefill.addCampaignPostRequest(this.campaignAddFormData).subscribe(
        res => {

          let statusCode = res.statusCode;
          if (statusCode == 200) {
            let alert = {
              type: 'success',
              title: 'Lead Added Successfully',
              body: ''
            }
            this.appC.popToast(alert);
            // localStorage.removeItem('tempImg');
            // form.reset();
            // document.getElementById('preview-img').src = '';
            this.clearFormAndMove();
            form.reset();
          }

        },
        err => {
          console.log(err);
        }
      );
    }

    console.log(form.controls);
    console.log("button working");
  }


  clearFormAndMove() {
    // this.navigateTo('studentForm');
    this.campaignAddFormData = {
      name: "",
      phone: "",
      email: "",
      gender: "",
      address: "",
      city: "",
      referred:"",
      source:"" 
    }
    this.fetchPrefillFormData();
    
  }


}