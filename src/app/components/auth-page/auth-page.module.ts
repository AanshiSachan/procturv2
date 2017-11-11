import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthPageComponent } from './auth-page.component';
import {AuthPageRoutingModule} from './auth-page-routing.module';

/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthListPopupComponent } from './auth-list-popup/auth-list-popup.component';
import { LoginInput } from './auth-directives/auth-directives.directive';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AuthPageRoutingModule,
        CommonModule
      ],
    declarations: [
        AuthPageComponent,
        LoginPageComponent,
        AuthListPopupComponent,
        LoginInput
    ],
    entryComponents: [
      ],
    providers: [
    ]  
})
export class AuthPageModule {
    
}