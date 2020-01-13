import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeSession:any;

  constructor() { }

  ngOnInit() {
    this.setActiveSession();
  }

  setActiveSession(){
    let pathLastURL;
    const str = window.location.href;
    const res = str.substring(str.lastIndexOf('/manage-offers') + 15, str.length);
    pathLastURL = res;
    const get_module_name = res.substring(0, res.indexOf('/'));
    if (get_module_name !== '') {
      pathLastURL = get_module_name;
    }
    const routesData = {
      'coupon': 'coupon',
      'voucher': 'voucher',
    };
    if (document.getElementById(routesData[pathLastURL])) {
      this.activeSession = routesData[pathLastURL];
    }
  }


  toggleActiveSession(item) {
    this.activeSession = item;
  }

}
