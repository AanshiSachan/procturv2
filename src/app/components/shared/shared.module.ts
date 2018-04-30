import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { TableLayoutComponent } from './custom-table/table-layout.component';
import { FormatCellPipe } from './custom-checkbox-table/checkbox-format-cell.pipe';
import { StyleCellDirective } from './custom-checkbox-table/checkbox-style-cell.directive';
import { PaginationComponent } from './pagination/pagination.component';
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
import { CustomButtonTableComponent } from './custom-button-table/custom-button-table.component';



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
        QuickFilterComponent,
        AppLoaderComponent,
        PictureCropComponent,
        CommaSeprationAmount,SearchPipe,
        ProcturPopUpComponent,
        SearchPipe,
        CustomButtonTableComponent
    ],
    exports: [
        CommonModule,
        TableLayoutComponent,
        RobTableComponent,
        CheckboxTableComponent,
        PaginationComponent,
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