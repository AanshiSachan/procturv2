import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login-services/login.service';

@Component({
  selector: 'overlay-menu',
  templateUrl: './overlay-menu.component.html',
  styleUrls: ['./overlay-menu.component.scss']
})
export class OverlayMenuComponent implements OnInit {

  constructor(private log: LoginService) { }

  ngOnInit() {
  }

  screenClicked() {
    this.log.changeMenuStatus(false);
    document.getElementById('menu-close').classList.add('hide');
    document.getElementById('menu-open').classList.remove('hide');
  }

}
