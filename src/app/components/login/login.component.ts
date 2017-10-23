import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login-services/login.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginAuth } from '../../model/login-auth';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginDataForm: LoginAuth;
  loading = false;
  returnUrl: string;

  constructor(private login: LoginService, private route: Router, private actroute: ActivatedRoute){
    
    if(sessionStorage.getItem('Authorization') != null){
      this.route.navigate(['/enquiry']);
    }
  }

  ngOnInit() {
    /* hide header and sidebar from the view onInit to give the user the full screen view of the web app  */
    this.fullscreenLogin();
 
    this.loginDataForm = {
      alternate_email_id: null,
      password: null
    }
 
  }


  /* Function to hide element with tag name header and sidebar */
  fullscreenLogin() {
    var header = document.getElementsByTagName('core-header');
    var sidebar = document.getElementsByTagName('core-sidednav');

    [].forEach.call(header, function (el) {
      el.classList.add('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.add('hide');
    });
  }

  
  /**/
  loginViaServer() {
    
    this.loading = true;

    this.login.postLoginDetails(this.loginDataForm).subscribe(el => {
      if (el.data == null) {
        this.loading = false;
        alert('Invalid Username or Password!!, please try again later');
      }
      else {
        console.log(el);
        sessionStorage.setItem('institute_id', el.data.institution_id);
        sessionStorage.setItem('institute_type', el.data.institute_type);

        sessionStorage.setItem('logo_url', el.data.logo_url);
        sessionStorage.setItem('inst_announcement', el.data.inst_announcement);

        sessionStorage.setItem('userid', el.data.userid);
        sessionStorage.setItem('userType', el.data.userType);
        sessionStorage.setItem('password', el.data.password);

        let Authorization = btoa(el.data.userid +"|" +el.data.userType +":" +el.data.password +":" +el.data.institution_id);

        sessionStorage.setItem('Authorization', Authorization);
        
        this.route.navigate(['/enquiry']);  
        this.removeFullscreen();
      }
    });
  }



  removeFullscreen() {
    var header = document.getElementsByTagName('core-header');
    var sidebar = document.getElementsByTagName('core-sidednav');

    document.getElementById('login-center-block').classList.add('hide');

    [].forEach.call(header, function (el) {
      el.classList.remove('hide');
    });
    [].forEach.call(sidebar, function (el) {
      el.classList.remove('hide');
    });
  }

}