import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { LostBookComponent } from './lost-book/lost-book.component';
import { ScrapBookComponent } from './scrap-book/scrap-book.component';
import { FineCollectionComponent } from './fine-collection/fine-collection.component';
import { IssuedBookComponent } from './issued-book/issued-book.component';
import { OverdueBookComponent } from './overdue-book/overdue-book.component';
import { NeverIssuedComponent } from './never-issued/never-issued.component';
import { ReturnBookComponent } from './return-book/return-book.component';


@NgModule({
  imports: [RouterModule.forChild([
      {
          path: '',
          component: ReportComponent,
          pathMatch: 'prefix',
          children: [
              {
                  path: '',
                  component: LostBookComponent,
                  pathMatch: 'prefix'
              },
              {
                  path: 'home',
                  component: LostBookComponent,
                  pathMatch: 'prefix'
              },
              {
                  path: 'lost',
                  component: LostBookComponent,
                  pathMatch: 'prefix'
              },
              {
                  path: 'scrap',
                  component: ScrapBookComponent,
                  pathMatch: 'prefix'
              },
              {
                  path: 'fine',
                  component: FineCollectionComponent,
                  pathMatch: 'prefix'
              },
              {
                  path: 'issued',
                  component: IssuedBookComponent,
                  pathMatch: 'prefix'
              },
              {
                  path: 'overdue',
                  component: OverdueBookComponent,
                  pathMatch: 'prefix'
              },
              {
                  path: 'never-issued',
                  component: NeverIssuedComponent,
                  pathMatch: 'prefix'
              },
              {
                  path: 'retrun-book',
                  component: ReturnBookComponent,
                  pathMatch: 'prefix'
              }
          ]
      }
  ])],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
