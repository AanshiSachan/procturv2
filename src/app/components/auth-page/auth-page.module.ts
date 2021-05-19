import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthPageComponent } from './auth-page.component';
import {AuthPageRoutingModule} from './auth-page-routing.module';

/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginPageComponent } from './login-page/login-page.component';
import { SharedModule } from '../shared/shared.module';
import { NotConfiguredComponent } from './not-configured/not-configured.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AuthPageRoutingModule,
        CommonModule,
        SharedModule
      ],
    declarations: [
        AuthPageComponent,
        LoginPageComponent,
        NotConfiguredComponent
    ],
    entryComponents: [
      ],
    providers: [
    ]  
})
export class AuthPageModule {
    
}