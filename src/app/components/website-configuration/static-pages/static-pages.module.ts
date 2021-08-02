import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticPagesRoutingModule } from './static-pages-routing.module';
import { StaticPagesComponent } from './static-pages.component';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { SharedModule } from '../../shared/shared.module';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';
import { EditorModule } from '@tinymce/tinymce-angular';


@NgModule({
  declarations: [StaticPagesComponent, ListComponent, AddEditComponent],
  imports: [
    CommonModule,
    StaticPagesRoutingModule,
    SharedModule,
    EditorModule
  ],
  providers: [
    ProductService,
    AuthenticatorService
  ]
})
export class StaticPagesModule { }
