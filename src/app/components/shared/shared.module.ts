import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

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

import { TooltipModule } from '../../../assets/imported_modules/ngx-bootstrap/tooltip';

import { CustomizingPipe } from './ng-robAdvanceTable/customizing.pipe';
import { CustomNamePipe } from './quick-filter/custom-name.pipe';

/* Advanced Table Declaration */
import { RobAdvanceTableComponent } from './ng-robAdvanceTable/ng-robAdvanceTable.component';

import { ProcturPopUpComponent } from './proctur-popup/proctur-popup.component';
import { SearchPipe } from './pipes/tablesSearchPipe';

import { DropMenuComponent } from './ng-robAdvanceTable/dropmenu/dropmenu.component';

import { RobTooltipComponent } from './rob-tooltip/rob-tooltip.component';

import { OnlyNumber } from './onlynumber.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TooltipModule.forRoot(),
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
        CustomizingPipe,
        CustomNamePipe,
        DropMenuComponent,
        RobTooltipComponent,
        OnlyNumber
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
        CustomizingPipe,
        CustomNamePipe,
        DropMenuComponent,
        RobTooltipComponent,
        OnlyNumber
    ],
    entryComponents: [
        DropMenuComponent,
    ],
    providers: [
        CurrencyPipe,
        DecimalPipe
    ]
})
export class SharedModule { }