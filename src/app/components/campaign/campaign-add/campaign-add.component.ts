import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addCampaign } from '../../../model/add-campaign';
import { NgForm } from '@angular/forms';
import { LoginService } from '../../../services/login-services/login.service';
import { FetchprefilldataService } from '../../../services/fetchprefilldata.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';

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
    referred: "",
    source: ""
  };

  private referralList: any[] = [];
  private sourceList: any[] = [];
  isProfessional: boolean = false;

  constructor(
    private router: Router,
    private login: LoginService,
    private prefill: FetchprefilldataService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService
  ) { }

  ngOnInit() {

    this.fetchPrefillFormData();
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.login.changeInstituteStatus(sessionStorage.getItem('institute_name'));
    this.login.changeNameStatus(sessionStorage.getItem('name'));
  }

  /* Fetch and store the prefill data to be displayed on dropdown menu */
  fetchPrefillFormData() {
    let referralList = this.prefill.getLeadReffered().subscribe((data: any) => {
      this.referralList = data;
    });

    let sourceList = this.prefill.getLeadSource().subscribe(data => {
      this.sourceList = data;
    });

  }


  addCampaign(form: NgForm) {

    if (form.valid) {
      /* Get slot data and store on form */
      this.prefill.addCampaignPostRequest(this.campaignAddFormData).subscribe(
        res => {
          let statusCode = res.statusCode;
          if (statusCode == 200) {
            this.msgService.showErrorMessage(this.msgService.toastTypes.success, 'Lead Added Successfully', '');
            this.clearFormAndMove();
            form.reset();

          }

        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        }
      );
    }
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
      referred: "",
      source: ""
    }
    this.fetchPrefillFormData();

  }

  // toast function 
  showErrorMessage(objType, massage, body) {
    this.msgService.showErrorMessage(objType, massage, body);
  }
}