import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InstituteSettingsComponent } from './institute-settings.component';
import { SharedModule } from '../shared/shared.module';
import { InstituteSettingService } from '../../services/institute-setting-service/institute-setting.service';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: InstituteSettingsComponent,
                pathMatch: 'prefix',
            }
        ]),
        SharedModule,
        FormsModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        InstituteSettingsComponent
    ],
    providers: [
        InstituteSettingService
    ]
})

export class InstituteSettingModule {

}