import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { TableLayoutComponent } from './custom-table/table-layout.component';
import { FormatCellPipe } from './custom-checkbox-table/checkbox-format-cell.pipe';
import { StyleCellDirective } from './custom-checkbox-table/checkbox-style-cell.directive';
import { PaginationComponent } from './pagination/pagination.component';
import { ImageUploadComponent } from './image-uploader/image-upload.component';
import { QuickFilterComponent } from './quick-filter/quick-filter.component';
import { CheckboxTableComponent } from './custom-checkbox-table/checkbox-table-layout.component';
import { AppLoaderComponent } from './app-loader/app-loader.component';
import { PictureCropComponent } from './img-cropper/picture-crop.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        TableLayoutComponent,
        CheckboxTableComponent,
        FormatCellPipe,
        StyleCellDirective,
        PaginationComponent,
        ImageUploadComponent,
        QuickFilterComponent,
        AppLoaderComponent,
        PictureCropComponent
    ],
    exports: [
        CommonModule,
        TableLayoutComponent,
        CheckboxTableComponent,
        PaginationComponent,
        ImageUploadComponent,
        QuickFilterComponent,
        AppLoaderComponent,
        PictureCropComponent
    ],
    providers: [CurrencyPipe]
})
export class SharedModule { }