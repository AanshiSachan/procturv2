import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap-custome/tooltip';

import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormatCellPipe } from './custom-table/format-cell.pipe';
import { RobTableCellPipe } from './ng-robTable/ng-robTable-format-cell.pipe';
import { CommaSeprationAmount } from './pipes/commaSeprator.pipe';
import { CustomizingPipe } from './ng-robAdvanceTable/customizing.pipe';
import { CustomNamePipe } from './quick-filter/custom-name.pipe';
import { SearchPipe } from './pipes/tablesSearch.pipe';
import { ProcturDate } from './pipes/proctur-date.pipe';

import { TableLayoutComponent } from './custom-table/table-layout.component';
import { PaginationComponent } from './pagination/pagination.component';
import { QuickFilterComponent } from './quick-filter/quick-filter.component';
import { AppLoaderComponent } from './app-loader/app-loader.component';
import { PictureCropComponent } from './img-cropper/picture-crop.component';
import { RobTableComponent } from './ng-robTable/ng-robTable.component';
import { RobAdvanceTableComponent } from './ng-robAdvanceTable/ng-robAdvanceTable.component';
import { ProcturPopUpComponent } from './proctur-popup/proctur-popup.component';
import { DropMenuComponent } from './ng-robAdvanceTable/dropmenu/dropmenu.component';
import { RobTooltipComponent } from './rob-tooltip/rob-tooltip.component';
import { DataDisplayTableComponent } from './data-display-table/data-display-table.component';
import { PreferencePopupComponent } from './preference-popup/preference-popup.component';

import { StyleCellDirective } from './custom-table/style-cell.directive';
import { RobTableCellDirective } from './ng-robTable/ng-robTable-cell.directive';
import { EnquiryUpdatePopupComponent } from '../enquiry-update-popup/enquiry-update-popup.component';





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
        ProcturDate,
        CustomizingPipe,
        CustomNamePipe,
        DropMenuComponent,
        RobTooltipComponent,
        DataDisplayTableComponent,
        PreferencePopupComponent,
        EnquiryUpdatePopupComponent

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
        ProcturDate,
        CustomizingPipe,
        CustomNamePipe,
        DropMenuComponent,
        RobTooltipComponent,
        DataDisplayTableComponent,
        PreferencePopupComponent,
        EnquiryUpdatePopupComponent
    ],
    entryComponents: [
        DropMenuComponent,
    ],
    providers: [
        CurrencyPipe, DecimalPipe
    ]
})
export class SharedModule { }