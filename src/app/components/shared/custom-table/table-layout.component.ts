import { Component, Input, OnChanges, ElementRef, Renderer2, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ColumnSetting, ColumnMap } from './layout.model';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';

@Component({
    selector: 'proctur-table',
    templateUrl: 'table-layout.component.html',
    /* changeDetection: ChangeDetectionStrategy.OnPush */
})
export class TableLayoutComponent implements OnChanges {
    @Input() records: any[];
    @Input() settings: ColumnSetting[];
    @Input() isMulti: boolean = false;
    @Input() tableName: string = '';
    isAllSelected: boolean = false;
    columnMaps: ColumnMap[];
    selectedRowGroup: any[] = [];

    constructor(private rd: Renderer2, private cd: ChangeDetectorRef) { }

    ngOnChanges() {

        if (this.settings) {
            this.columnMaps = this.settings
                .map(col => new ColumnMap(col));
        } else {
            this.columnMaps = Object.keys(this.records[0]).map(key => {
                return new ColumnMap({ primaryKey: key });
            });
        }
        
    }


    selectAllRows(ev) {
        if (ev) {
            this.records.forEach(el => {
                el.isSelected = true;
            })
        }
        else {
            this.records.forEach(el => {
                el.isSelected = false;
            })
        }
    }


}