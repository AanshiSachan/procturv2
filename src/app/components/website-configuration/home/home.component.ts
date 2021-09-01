import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
showMenu:any="";
showArpMenu:any="";
  menus = [

    // {
    //   title : "Domain",
    //   routerLink: 'view/website-configuration/url'
    // },
    {
      title : "Images",
      routerLink: 'view/website-configuration/images'
    },
    
    {
      title : "Static Page (More)",
      routerLink: 'view/website-configuration/static-pages/list'
    },
    {
      title : "Image Slider",
      routerLink: 'view/website-configuration/slider/list'
    },
    {
      title : "Manage Content (Other Links)",
      routerLink: 'view/website-configuration/manage-content'
    },
    {
      title : "3rd Party Integration",
      routerLink: 'view/website-configuration/third-party-auth'
    },
    {
      title : "Contact Info",
      routerLink: 'view/website-configuration/contact-info'
    },
    {
      title : "Text colour",
      routerLink: 'view/website-configuration/theme'
    },
    {
      title : "FAQs",
      routerLink: 'view/website-configuration/faq/category/list'
    },
    {
      title : "Testimonial",
      routerLink: 'view/website-configuration/testimonial/list'
    }
   

  ]
  activeSession: any = 'Images';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('institute_id') == '100058' || sessionStorage.getItem('institute_id') == '100127'){
      this.showArpMenu ='show';
      this.activeSession ="";
    }else{
      this.showArpMenu ='hide';
    }
    
    this.setActiveClass();
    if(sessionStorage.getItem('institute_id') == '100058' || sessionStorage.getItem('institute_id') == '100127'){
    // this.showMenu = 'show';
     this.menus.push({
      title : "Domain",
      routerLink: 'view/website-configuration/url'});
    }
  }

  setActiveClass() {
    // this.RemoveActiveTabs();
    let pathLastURL;
    var str = window.location.href;
    var res = str.substring(str.lastIndexOf("/view/website-configuration") + 28, str.length);
    pathLastURL = res;
    var get_module_name = res.substring(0, res.indexOf("/"));
    if (get_module_name != '') {
      pathLastURL = get_module_name;
    }

    console.log(pathLastURL);
    let routesData = {
      'images': 'Images',
      'static-pages': 'Static Page (More)',
      'manage-content': 'Manage Content (Other Links)',
      'slider': 'Image Slider',
      'third-party-auth': '3rd Party Integration',
      'contact-info': 'Contact Info',
      'theme': 'Text colour',
      'faq': 'FAQs',
      'testimonial': 'Testimonial',
      'url': 'Domain'
    };
      this.activeSession = routesData[pathLastURL];
      console.log(this.activeSession);
  }

  toggler(title) {
    this.activeSession = title;
  }

  navigateToLink(link) {
    this.router.navigateByUrl(link);
  }

}
