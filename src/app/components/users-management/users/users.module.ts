import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';
import { BsDatepickerModule } from '../../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module';
import { UserRouting } from './users.routing';


@NgModule({
    declarations: [
        UsersComponent,
    ],
    exports: [],
    imports: [
        BsDatepickerModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        UserRouting
    ],
    providers: []
})

export class UserModule {

}