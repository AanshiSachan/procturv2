import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { InstituteDetailsComponent } from './institute-details.component';
import { InstituteDetailService } from '../../services/institute-details/institute-details.service';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: InstituteDetailsComponent,
                pathMatch: 'prefix',
            }
        ]),
        SharedModule,
        FormsModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        InstituteDetailsComponent
    ],
    providers: [
        InstituteDetailService
    ]
})

export class InstituteDetailsModule {

}