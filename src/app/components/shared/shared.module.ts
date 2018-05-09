import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

import { TableLayoutComponent } from './custom-table/table-layout.component';
import { FormatCellPipe } from './custom-table/format-cell.pipe';
import { StyleCellDirective } from './custom-table/style-cell.directive';
import { PaginationComponent } from './pagination/pagination.component';
import { QuickFilterComponent } from './quick-filter/quick-filter.component';
import { AppLoaderComponent } from './app-loader/app-loader.component';
import { PictureCropComponent } from './img-cropper/picture-crop.component';

/* Fixed Header Table declaration */
import { RobTableComponent } from './ng-robTable/ng-robTable.component';
import { RobTableCellPipe } from './ng-robTable/ng-robTable-format-cell.pipe';
import { RobTableCellDirective } from './ng-robTable/ng-robTable-cell.directive';
import { CommaSeprationAmount } from './pipes/commaSepratorPipe';


/* Advanced Table Declaration */
import { RobAdvanceTableComponent } from './ng-robAdvanceTable/ng-robAdvanceTable.component';

import { ProcturPopUpComponent } from './proctur-popup/proctur-popup.component';
import { SearchPipe } from './pipes/tablesSearchPipe';

import { DropMenuComponent } from './ng-robAdvanceTable/dropmenu/dropmenu.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        TableLayoutComponent,
        RobTableComponent,
        RobAdvanceTableComponent,
        FormatCellPipe,
        RobTableCellPipe,
        StyleCellDirective,
        RobTableCellDirective,
        PaginationComponent,
        QuickFilterComponent,
        AppLoaderComponent,
        PictureCropComponent,
        CommaSeprationAmount,
        ProcturPopUpComponent,
        SearchPipe,
        DropMenuComponent
    ],
    exports: [
        CommonModule,
        TableLayoutComponent,
        RobTableComponent,
        RobAdvanceTableComponent,
        PaginationComponent,
        QuickFilterComponent,
        AppLoaderComponent,
        PictureCropComponent,
        CommaSeprationAmount,
        ProcturPopUpComponent,
        SearchPipe,
        DropMenuComponent
    ],
    entryComponents: [
        DropMenuComponent
    ],
    providers: [
        CurrencyPipe
    ]
})
export class SharedModule { }