import { Component, Input, Output, OnChanges, ElementRef, Renderer2, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { ColumnSetting, ColumnMap } from './layout.model';
import { document } from '../../../../assets/imported_modules/ngx-bootstrap/utils/facade/browser';

@Component({
    selector: 'proctur-table',
    templateUrl: 'table-layout.component.html',
    styleUrls: ['./table-layout.component.scss'],
    /* changeDetection: ChangeDetectionStrategy.OnPush */
})
export class TableLayoutComponent implements OnChanges {
    @Input() records: any[];
    @Input() settings: ColumnSetting[];
    @Input() isMulti: boolean = false;
    @Input() tableName: string = '';
    @Input() dummyArr: any[];
    @Input() columnMap: any[];
    @Input() dataStatus: boolean;
    @Input() direction: number;
    @Input() sortingEnabled: boolean;
    @Output() sortData = new EventEmitter<String>();
    isAllSelected: boolean = false;
    columnMaps: ColumnMap[];
    selectedRowGroup: any[] = [];
    sortedBy: string = null;

    constructor(private rd: Renderer2, private cd: ChangeDetectorRef) { }

    ngOnChanges() {
        this.sortingEnabled;
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


    getSortedData(ev) {
        if (this.sortingEnabled) {
            this.sortedBy = ev;
            this.sortData.emit(ev);
        }
        //console.log(ev);

    }


    getCaretVisiblity(e): boolean {
        if (this.sortingEnabled && this.sortedBy == e) {
            return true;
        }
        
        else {
            return false;
        }
    }
}