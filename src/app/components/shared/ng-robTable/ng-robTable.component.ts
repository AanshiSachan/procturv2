import { Component, Input, Output, EventEmitter, OnChanges, ElementRef, Renderer2, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ColumnSetting, ColumnMap } from './ng-robTable-layout.model';
import * as moment from 'moment';

@Component({
    selector: 'ng-robTable',
    templateUrl: 'ng-robTable.component.html',
    styleUrls: ['./ng-robTable.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RobTableComponent implements OnChanges {
    headerSort: any;
    @Input() records: any[];
    @Input() settings: ColumnSetting[];
    @Input() tableName: string = '';
    @Input() dataStatus: number;
    @Input() primaryKey: string = '';
    @Input() key1: string;
    @Input() reset: boolean;
    @Input() defaultSort:string="";
    @Input() batchListArr:any[] = [];

    @Output() userRowSelect = new EventEmitter();
    @Output() rowsSelected = new EventEmitter<number>();
    @Output() rowIdArr = new EventEmitter<any[]>();
    @Output() sortById = new EventEmitter<string>();
    @Output() rowUserId = new EventEmitter<string>();
    @Output() sortDirection=new EventEmitter<boolean>();


    isAllSelected: boolean = false;
    columnMaps: ColumnMap[];
    selectedRowGroup: any[] = [];
    selectedRow: number;
    rowSelectedCount: number = 0;
    rowSelectedId: any[] = [];


    /* Number of line for skeleton screen */
    dummyArr: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    userIdArray: any = [];
    asc: boolean = false;
    caret = true;

    @ViewChild('headerCheckbox') hc: ElementRef;

    constructor(private rd: Renderer2, private cd: ChangeDetectorRef, private eleRef: ElementRef) { }



    ngOnChanges() {
        this.cd.reattach();        
        this.cd.markForCheck();
        this.dataStatus;
        this.key1;
        this.defaultSort;
        this.refreshTable();
        if (this.settings) {
            this.columnMaps = this.settings
                .map(col => new ColumnMap(col));
        } else {
            this.columnMaps = Object.keys(this.records[0]).map(key => {
                return new ColumnMap({ primaryKey: key });
            });
        }
        this.cd.detectChanges();
        this.cd.detach();
    }

    selectAllRows(ev) {
        this.cd.reattach();
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
        this.cd.detectChanges();
        this.cd.detach();
    }


    getSelectedRows() {
        this.rowSelectedId = [];
        this.userIdArray = [];
        this.records.forEach(e => {
            if (e.uiSelected) {
                this.rowSelectedId.push(e[this.primaryKey]);
                this.userIdArray.push(e.user_id);
            }
        });
        this.rowIdArr.emit(this.rowSelectedId);
        this.rowUserId.emit(this.userIdArray);
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
        this.getSelectedRows();
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
        this.getSelectedRows();
    }

    refreshTable() {
        this.cd.markForCheck();     
        this.headerSort = this.defaultSort;
        if (!this.reset) {
            this.selectedRow = null;
            this.isAllSelected = false;
            this.rowSelectedCount = 0;
            this.rowSelectedId = [];
            this.rowIdArr.emit(this.rowSelectedId);
            this.rowsSelected.emit(this.rowSelectedCount);
            this.records.forEach(x => x.uiSelected = false);
            this.rowSelectedCount = 0;
            this.rowsSelected.emit(this.rowSelectedCount);
            this.getSelectedRows();
        }

    }


    requestSort(ev) {
        this.cd.markForCheck();
        this.caret = true;
        this.headerSort=ev;
        (this.asc) ? (this.asc=false) : (this.asc=true);
        this.sortById.emit(ev);
        this.sortDirection.emit(this.asc);
    }

    getStyle(key, value): any {
        /* for followup date */
        if (key == this.key1) {
            if (value != '') {
                let cmp = moment(value).unix();
                let tod = moment(new Date()).subtract(1, 'd').unix();
                if (cmp > tod) {
                    return 'blueleft';
                }
                else {
                    return 'redleft';
                }
            }
            else {
                return 'left';
            }
        }
        /* else for left and right allignment */
        else {

            if (key == 'enquiry_no') {
                return 'right';
            }
            else if (key == 'enquiry_date') {
                return 'right';
            }
            else if (key == 'name') {
                return 'left';
            }
            else if (key == 'phone') {
                return 'right';
            }
            else if (key == 'statusValue') {
                return 'left';
            }
            else if (key == 'priority') {
                return 'left';
            }
            else if (key == 'follow_type') {
                return 'left';
            }
            else if (key == 'student_class') {
                return 'width25'
            }
            else {
                return 'left';
            }
        }
    }

    isSorted(map):boolean{
        if (map.primaryKey != 'noOfBatchesAssigned') {
            this.cd.markForCheck();
            return  (map.primaryKey==this.headerSort && this.caret);
        }
        else{
            return false;
        }
    }

    getBatchListArr(e: string){
        this.cd.detach();
        return e.trim().split(",");
    }

}