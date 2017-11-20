import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomCommonComponent } from './custom-common.component';
import {CustomCommonRoutingModule} from './custom-common-routing.module';

/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CreateCustomCompComponent } from './create-custom-comp/create-custom-comp.component';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        CustomCommonRoutingModule
      ],
    declarations: [
        CustomCommonComponent,
        CreateCustomCompComponent
    ],
    entryComponents: [
      ],
    providers: [
    ]  
})
export class CustomCommonModule {
    
}