import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomErrorPageComponent} from './custom-error-page/custom-error-page.component';
import {CalendarComponent} from './calendar/calendar.component';
import { CustomComponent } from './custom.component';
import { ErrorPopupComponent } from './error-popup/error-popup.component';

@NgModule({
    imports:[
        CommonModule
    ],
    declarations:[
        CustomErrorPageComponent,
        CalendarComponent,
        CustomComponent,
        ErrorPopupComponent
    ],

})
export class CustomModule{

}