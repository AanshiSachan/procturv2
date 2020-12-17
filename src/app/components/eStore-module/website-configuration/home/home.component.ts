import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  menus = [
    {
      title : "Images",
      routerLink: 'view/e-store/website-configuration/images'
    },
    {
      title : "Static Pages",
      routerLink: 'view/e-store/website-configuration/static-pages/list'
    },
    {
      title : "Manage Content",
      routerLink: 'view/e-store/website-configuration/manage-content'
    },
    {
      title : "Slider",
      routerLink: 'view/e-store/website-configuration/slider/list'
    },
    {
      title : "3rd Party Authorization",
      routerLink: 'view/e-store/website-configuration/third-party-auth'
    },
    {
      title : "Contact Info",
      routerLink: 'view/e-store/website-configuration/contact-info'
    },
    {
      title : "Theme Options",
      routerLink: 'view/e-store/website-configuration/theme'
    },
    {
      title : "FAQs",
      routerLink: 'view/e-store/website-configuration/faq/home'
    },
    {
      title : "Testimonial",
      routerLink: 'view/e-store/website-configuration/testimonial/list'
    }
  ]
  activeSession: any = 'Images';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setActiveClass();
  }

  setActiveClass() {
    // this.RemoveActiveTabs();
    let pathLastURL;
    var str = window.location.href;
    var res = str.substring(str.lastIndexOf("/view/e-store/website-configuration") + 36, str.length);
    pathLastURL = res;
    var get_module_name = res.substring(0, res.indexOf("/"));
    if (get_module_name != '') {
      pathLastURL = get_module_name;
    }

    console.log(pathLastURL);
    let routesData = {
      'images': 'Images',
      'static-pages': 'Static Pages',
      'manage-content': 'Manage Content',
      'slider': 'Slider',
      'third-party-auth': '3rd Party Authorization',
      'contact-info': 'Contact Info',
      'theme': 'Theme Options',
      'faq': 'FAQs',
      'testimonial': 'Testimonial'
    };
      this.activeSession = routesData[pathLastURL];
  }

  toggler(title) {
    this.activeSession = title;
  }

  navigateToLink(link) {
    this.router.navigateByUrl(link);
  }

}
