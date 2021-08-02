import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../website-configuration/home/home.component';
import { ImagesComponent } from './images/images.component';
import {ManageContentComponent} from './manage-content/manage-content.component';
import {ContactInfoComponent} from '../website-configuration/contact-info/contact-info.component';
import {ThirdPartyAuthComponent} from './third-party-auth/third-party-auth.component';
import {ThemeComponent} from './theme/theme.component';
import {UrlComponent} from './url/url.component';
import { ArpAutomationComponent } from './arp-automation/arp-automation.component';



const routes: Routes = [
  {
      path: '',
      component: HomeComponent,
      pathMatch: 'prefix',
      children: [
          {
            path: 'home',
            component: HomeComponent
          },
          {
            path: 'images',
            component: ImagesComponent
          },
          {
            path: 'static-pages',
            loadChildren: () => import('../website-configuration/static-pages/static-pages.module').then(m => m.StaticPagesModule),
            pathMatch: 'prefix'
          },
          {
            path: 'manage-content',
            component: ManageContentComponent
          },
          {
            path: 'slider',
            loadChildren: () => import('../website-configuration/slider/slider.module').then(m => m.SliderModule),
            pathMatch: 'prefix'
          },
          {
            path: 'contact-info',
            component: ContactInfoComponent
          },
          {
            path: 'third-party-auth',
            component: ThirdPartyAuthComponent
          },
          {
            path: 'theme',
            component: ThemeComponent
          },
          {
            path: 'faq',
            loadChildren: () => import('../website-configuration/faq/faq.module').then(m => m.FaqModule),
            pathMatch: 'prefix'
          },
          {
            path: 'testimonial',
            loadChildren: () => import('../website-configuration/testimonial/testimonial.module').then(m => m.TestimonialModule),
            pathMatch: 'prefix'
          },
          {
            path: 'url',
            component: UrlComponent
          },
          {
            path: 'arp-automation',
            component: ArpAutomationComponent
          },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteConfigurationRoutingModule { }
