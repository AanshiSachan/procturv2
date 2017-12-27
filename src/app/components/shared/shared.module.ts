import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { TableLayoutComponent } from './custom-table/table-layout.component';
import { FormatCellPipe } from './custom-table/format-cell.pipe';
import { StyleCellDirective } from './custom-table/style-cell.directive';
import { PaginationComponent } from './pagination/pagination.component';
import { ImageUploadComponent } from './image-uploader/image-upload.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        TableLayoutComponent,
        FormatCellPipe,
        StyleCellDirective,
        PaginationComponent,
        ImageUploadComponent
    ],
    exports: [
        CommonModule,
        TableLayoutComponent,
        PaginationComponent,
        ImageUploadComponent
    ],
    providers: [CurrencyPipe]
})
export class SharedModule { }