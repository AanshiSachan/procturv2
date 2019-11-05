import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnquiryComponent } from './enquiry.component'
import { EnquiryAddComponent } from './enquiry-add/enquiry-add.component';
import { EnquiryBulkaddComponent } from './enquiry-bulkadd/enquiry-bulkadd.component';
import { EnquiryEditComponent } from './enquiry-edit/enquiry-edit.component';
import { EnquiryHomeComponent } from './enquiry-home/enquiry-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: EnquiryComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: EnquiryHomeComponent
                    },
                    {
                        path: 'home',
                        component: EnquiryHomeComponent
                    },
                    {
                        path: 'add',
                        component: EnquiryAddComponent,
                        pathMatch: 'prefix'
                    },
                    {
                        path: 'edit/:id',
                        component: EnquiryEditComponent,
                        pathMatch: 'prefix'
                    },
                    {
                        path: 'upload',
                        component: EnquiryBulkaddComponent,
                        pathMatch: 'prefix'
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class EnquiryRoutingModule {
}