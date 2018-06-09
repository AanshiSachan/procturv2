import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CampaignComponent } from './campaign.component'
import { CampaignHomeComponent } from './campaign-home/campaign-home.component';
import { CampaignAddComponent } from './campaign-add/campaign-add.component';
import { CampaignBulkComponent } from './campaign-bulk/campaign-bulk.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CampaignComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: CampaignHomeComponent
                    },
                    {
                        path: 'list',
                        component: CampaignHomeComponent,
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'add',
                        component: CampaignAddComponent,
                        pathMatch: 'prefix'
                    },
                    {
                        path: 'bulk',
                        component: CampaignBulkComponent,
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
export class CampaignRoutingModule {
}