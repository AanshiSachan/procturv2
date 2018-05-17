import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HelpHomeComponent } from './help-home.component';
import { HomeComponent } from './home/home.component';
import {chatBotComponent} from '../chatbot/chatbot.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: HelpHomeComponent,
                pathMatch: 'prefix',
                children: [
                    // {
                    //     path: '',
                    //     redirectTo: 'faq'
                    // },
                    // //  {
                    // //     path: 'chatbot',
                    // //     component: chatBotComponent
                    // // },
                      {
                         path: 'faq',
                        loadChildren: 'app/components/help-home/faq/faq.module#FaqModule',
                        pathMatch: 'prefix'
                    },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class HelpHomeRoutingModule {
    
}