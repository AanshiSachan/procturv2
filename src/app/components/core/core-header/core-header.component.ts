import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'core-header',
  templateUrl: './core-header.component.html',
  styleUrls: ['./core-header.component.scss']
})
export class CoreHeaderComponent implements OnInit {

  instituteName: string;
  userName: string;
  menuToggler: boolean = false;

  ngOnInit() {
    
    this.log.currentInstitute.subscribe(res => {
      this.instituteName = res;
    });

    this.log.currentUsername.subscribe(res => {
      this.userName = res;
    });

  }

  constructor(private log: LoginService, private router: Router) {
  }

  logout() {
    if (this.log.logoutUser()) {
      this.router.navigate(['/authPage']);
      window.location.reload(true);
    }
  }

  triggerOverlayMenu(){
    if(this.menuToggler){
      this.menuToggler = false;
      document.getElementById('menu-close').classList.add('hide');
      document.getElementById('menu-open').classList.remove('hide');
      this.log.changeMenuStatus(this.menuToggler);
    }
    else{
      this.menuToggler = true;
      document.getElementById('menu-close').classList.remove('hide');
      document.getElementById('menu-open').classList.add('hide');
      this.log.changeMenuStatus(this.menuToggler);
    }
  }

  goToHome(){
    this.router.navigate(['/home']);
  }

}
