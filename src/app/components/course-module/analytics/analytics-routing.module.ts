import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllVideosComponent } from './all-videos/all-videos.component';
import { AnalyticsComponent } from './analytics.component';
import { DateWiseComponent } from './date-wise/date-wise.component';


const routes: Routes = [
    {
        path: '',
        component: AnalyticsComponent,
        pathMatch: 'prefix',
        children: [
            {
                path: '',
                component: DateWiseComponent
            },
            {
                path: 'datewise',
                component: DateWiseComponent
            },

            {
                path: 'allvideos',
                component: AllVideosComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
