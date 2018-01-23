import { Component, Input, Output, EventEmitter, OnChanges, ElementRef, Renderer2, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ColumnSetting, ColumnMap } from './checkbox-layout.model';
import { Event } from '_debugger';
import * as moment from 'moment';

@Component({
    selector: 'proctur-checkbox-table',
    templateUrl: 'checkbox-table.component.html',
    styleUrls: ['./checkbox-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxTableComponent implements OnChanges {
    @Input() records: any[];
    @Input() settings: ColumnSetting[];
    @Input() tableName: string = '';
    @Input() dataStatus: number;
    @Input() primaryKey: string = '';
    @Input() key1:string;

    @Output() userRowSelect = new EventEmitter();
    @Output() rowsSelected = new EventEmitter<number>();
    @Output() rowIdArr = new EventEmitter<any[]>();
    @Output() sortById = new EventEmitter<string>();


    isAllSelected: boolean = false;
    columnMaps: ColumnMap[];
    selectedRowGroup: any[] = [];
    selectedRow: number;
    rowSelectedCount: number = 0;
    rowSelectedId: any[] = [];
    dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];

    @ViewChild('headerCheckbox') hc: ElementRef;

    constructor(private rd: Renderer2, private cd: ChangeDetectorRef, private eleRef: ElementRef) { }

    ngOnChanges() {
        this.cd.markForCheck();
        this.dataStatus;
        this.key1;
        this.refreshTable();
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
        this.cd.markForCheck();
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.target.checked) {
            this.records.forEach(x => x.uiSelected = ev.target.checked);
            this.rowSelectedCount = this.records.length;
            this.rowsSelected.emit(this.rowSelectedCount);
            this.getSelectedRows();
        }
        else {
            this.records.forEach(x => x.uiSelected = ev.target.checked);
            this.rowSelectedCount = 0;
            this.rowsSelected.emit(this.rowSelectedCount);
            this.getSelectedRows();
        }
    }


    getSelectedRows() {
        this.rowSelectedId = [];
        this.records.forEach(e => {
            if (e.uiSelected) {
                this.rowSelectedId.push(e[this.primaryKey]);
            }
        });
        this.rowIdArr.emit(this.rowSelectedId);
    }

    isAllChecked(): boolean {
        return this.records.every(_ => _.uiSelected);
    }


    userRowClicked($event, ev, row) {
        this.cd.markForCheck();
        $event.preventDefault();
        $event.stopPropagation();
        this.selectedRow = ev;
        this.userRowSelect.emit(row);
    }


    removeFromSelectedArr(id): any[] {
        return this.rowSelectedId.filter(e => e != id);
    }


    rowCheckboxChange(eve) {

        this.cd.markForCheck();
        let status = eve.uiSelected;
        /* if the checkbox is already checked uncheck it and perform operation */
        if (status == false) {
            eve.uiSelected = false;
            this.rowSelectedCount--;
            this.rowSelectedId = this.removeFromSelectedArr(eve[this.primaryKey]);
            this.rowIdArr.emit(this.rowSelectedId);
            this.rowsSelected.emit(this.rowSelectedCount);
        }
        else if (status == true) {
            eve.uiSelected = true;
            this.rowSelectedCount++;
            this.rowSelectedId.push(eve[this.primaryKey]);
            this.rowIdArr.emit(this.rowSelectedId);
            this.rowsSelected.emit(this.rowSelectedCount);
        }
    }

    refreshTable() {
        this.cd.markForCheck();
        this.isAllSelected = false;
        this.selectedRow = null;
        this.rowSelectedCount = 0;
        this.rowSelectedId = [];
        this.hc.nativeElement.checked = false;
        this.rowIdArr.emit(this.rowSelectedId);
        this.rowsSelected.emit(this.rowSelectedCount);
    }


    requestSort(ev) {
        this.sortById.emit(ev);
    }

    getColor(key, value): any {
        if (key == this.key1) {
            if (value != '') {
                let cmp = moment(value).unix();
                let tod = moment().unix();
                if (cmp > tod) {
                    return undefined;
                }
                else {
                    return 'red';
                }
            }
            else{
                return null;
            }
        }
        else {
            return null;
        }
    }
    
}