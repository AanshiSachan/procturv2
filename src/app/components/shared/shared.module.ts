import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { TableLayoutComponent } from './custom-table/table-layout.component';
import { FormatCellPipe } from './custom-table/format-cell.pipe';
import { StyleCellDirective } from './custom-table/style-cell.directive';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        TableLayoutComponent,
        FormatCellPipe,
        StyleCellDirective,
        PaginationComponent
    ],
    exports: [
        CommonModule,
        TableLayoutComponent,
        PaginationComponent
    ],
    providers: [CurrencyPipe]
})
export class SharedModule { }