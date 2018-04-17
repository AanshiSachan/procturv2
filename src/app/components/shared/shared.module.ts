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

/* Fixed Header Table declaration */
import { RobTableComponent } from './ng-robTable/ng-robTable.component';
import { RobTableCellPipe } from './ng-robTable/ng-robTable-format-cell.pipe';
import { RobTableCellDirective } from './ng-robTable/ng-robTable-cell.directive';
import { CommaSeprationAmount } from './pipes/commaSepratorPipe';

import { ProcturPopUpComponent } from './proctur-popup/proctur-popup.component';
import { SearchPipe } from './pipes/tablesSearchPipe';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        TableLayoutComponent,
        RobTableComponent,
        CheckboxTableComponent,
        FormatCellPipe,
        RobTableCellPipe,
        StyleCellDirective,
        RobTableCellDirective,
        PaginationComponent,
        ImageUploadComponent,
        QuickFilterComponent,
        AppLoaderComponent,
        PictureCropComponent,
        CommaSeprationAmount,
        ProcturPopUpComponent,
<<<<<<< HEAD
        
=======
        SearchPipe
>>>>>>> f2acc3e768add19d00120c9f3edc6b0ecf6af061
    ],
    exports: [
        CommonModule,
        TableLayoutComponent,
        RobTableComponent,
        CheckboxTableComponent,
        PaginationComponent,
        ImageUploadComponent,
        QuickFilterComponent,
        AppLoaderComponent,
        PictureCropComponent,
        CommaSeprationAmount,
        ProcturPopUpComponent,
        SearchPipe
    ],
    providers: [CurrencyPipe]
})
export class SharedModule { }