import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { TooltipModule } from 'ngx-bootstrap-custome/tooltip';
import { EnquiryUpdatePopupComponent } from '../leads/enquiry-update-popup/enquiry-update-popup.component';
import { FormatCellPipe } from './custom-table/format-cell.pipe';
import { StyleCellDirective } from './custom-table/style-cell.directive';
import { TableLayoutComponent } from './custom-table/table-layout.component';
import { DataDisplayTableComponent } from './data-display-table/data-display-table.component';
import { PictureCropComponent } from './img-cropper/picture-crop.component';
import { CustomizingPipe } from './ng-robAdvanceTable/customizing.pipe';
import { DropMenuComponent } from './ng-robAdvanceTable/dropmenu/dropmenu.component';
import { RobAdvanceTableComponent } from './ng-robAdvanceTable/ng-robAdvanceTable.component';
import { RobTableCellDirective } from './ng-robTable/ng-robTable-cell.directive';
import { RobTableCellPipe } from './ng-robTable/ng-robTable-format-cell.pipe';
import { RobTableComponent } from './ng-robTable/ng-robTable.component';
import { PaginationComponent } from './pagination/pagination.component';
import { CommaSeprationAmount } from './pipes/commaSeprator.pipe';
import { ProcturDate } from './pipes/proctur-date.pipe';
import { SearchPipe } from './pipes/tablesSearch.pipe';
import { PreferencePopupComponent } from './preference-popup/preference-popup.component';
import { ProcturPopUpComponent } from './proctur-popup/proctur-popup.component';
import { CustomNamePipe } from './quick-filter/custom-name.pipe';
import { QuickFilterComponent } from './quick-filter/quick-filter.component';
import { RobTooltipComponent } from './rob-tooltip/rob-tooltip.component';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TooltipModule.forRoot(),
        BsDatepickerModule
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
        FormsModule,
        BsDatepickerModule,
        TableLayoutComponent,
        RobTableComponent,
        RobAdvanceTableComponent,
        PaginationComponent,
        QuickFilterComponent,
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
