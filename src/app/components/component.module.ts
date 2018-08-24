import { NgModule } from '@angular/core';
import { FormsModule} from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ComponentRoutingModule } from './component-routing.module';
import { ComponentsComponent } from './components.component';
import { SharedModule } from '../components/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ManageExamModule } from './master/master.module';

@NgModule({
    imports: [
        CommonModule,
        ComponentRoutingModule,
        BsDatepickerModule.forRoot(),
        SharedModule,
        FormsModule
    ],
    declarations: [
        ComponentsComponent
    ],
    entryComponents: [
    ],
    providers: [

    ],
    exports: [
    ]
})
export class ComponentModule {

}
