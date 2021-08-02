import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SliderRoutingModule } from './slider-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { SliderComponent } from './slider.component';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [ListComponent, AddEditComponent, SliderComponent],
  imports: [
    CommonModule,
    SliderRoutingModule,
    SharedModule,
    EditorModule
  ]
})
export class SliderModule { }
