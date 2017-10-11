import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {EnquiryComponent} from './enquiry.component'
import {EnquiryAddComponent} from './enquiry-add/enquiry-add.component';
import {EnquiryBulkaddComponent} from './enquiry-bulkadd/enquiry-bulkadd.component';
import {EnquiryManageComponent} from './enquiry-manage/enquiry-manage.component';
import {ActionButtonComponent} from './enquiry-manage/action-button.component';

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
                        component: EnquiryManageComponent
                    },
                    {
                        path: '/manage',
                        component: EnquiryManageComponent,
                        pathMatch: 'prefix',
                    },
                    {
                      path: 'addEnquiry',
                      component: EnquiryAddComponent,
                      pathMatch: 'prefix'
                    },
                    {
                      path: 'addBulkEnquiry',
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