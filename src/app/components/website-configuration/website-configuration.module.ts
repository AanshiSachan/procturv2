import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteConfigurationRoutingModule } from './website-configuration-routing.module';
import { WebsiteConfigurationComponent } from './website-configuration.component';
import { HomeComponent } from './home/home.component';
import { ImagesComponent } from './images/images.component';
import { ManageContentComponent } from './manage-content/manage-content.component';
import { SliderComponent } from './slider/slider.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { ThirdPartyAuthComponent } from './third-party-auth/third-party-auth.component';
import { ThemeComponent } from './theme/theme.component';
import { FaqComponent } from './faq/faq.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import {FileUploadModule} from 'primeng/fileupload';
import {SharedModule} from '../shared/shared.module';
import { ListComponent } from './testimonial/list/list.component';
import { AddEditComponent } from './testimonial/add-edit/add-edit.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { UrlComponent } from './url/url.component';
import { ArpAutomationComponent } from './arp-automation/arp-automation.component';


@NgModule({
  declarations: [WebsiteConfigurationComponent, HomeComponent, ImagesComponent, ManageContentComponent, ContactInfoComponent, ThirdPartyAuthComponent, ThemeComponent, FaqComponent, TestimonialComponent, ListComponent, AddEditComponent, UrlComponent, ArpAutomationComponent],
  imports: [
    CommonModule,
    WebsiteConfigurationRoutingModule,
    FileUploadModule,
    SharedModule,
    EditorModule
  ]
})
export class WebsiteConfigurationModule { }
