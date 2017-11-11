import { Component} from '@angular/core';
import {LoginService} from '../../../services/login-services/login.service';
import {Router} from '@angular/router';


@Component({
  selector: 'core-header', 
  templateUrl: './core-header.component.html',
  styleUrls: ['./core-header.component.scss']
})
export class CoreHeaderComponent{
 
  constructor(private log : LoginService, private router: Router){}

  logout(){
    //console.log("logging user out");
    if(this.log.logoutUser()){
      this.router.navigate(['/authPage']);
    }
  }

}
