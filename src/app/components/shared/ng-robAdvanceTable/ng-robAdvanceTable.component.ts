import { Component, Input, Output, EventEmitter, OnChanges, ElementRef, Renderer2, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ColumnData, ColumnMapData } from './ng-robAdvanceTable.model';
import * as moment from 'moment';
import { DropData, DropMapData } from './dropmenu/dropmenu.model';
import { CustomizingPipe } from './customizing.pipe';
import { CellHoverEvent } from '../../../../assets/imported_modules/ngx-bootstrap/datepicker/models';

@Component({
    selector: 'rob-table',
    templateUrl: 'ng-robAdvanceTable.component.html',
    styleUrls: ['./ng-robAdvanceTable.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RobAdvanceTableComponent implements OnChanges {

    headerSort: any;

    @Input() records: any[] = [];
    @Input() settings: ColumnData[];
    @Input() tableName: string = '';
    @Input() dataStatus: number;
    @Input() primaryKey: string = '';
    @Input() key1: string;
    @Input() reset: boolean;
    @Input() defaultSort: string = "";
    @Input() isMulti: boolean = true;
    @Input() hasMenu: boolean = false;
    @Input() dropType: number;
    @Input() menuOptions: DropData[];

    @Output() userRowSelect = new EventEmitter();
    @Output() rowsSelected = new EventEmitter<number>();
    @Output() rowIdArr = new EventEmitter<any[]>();
    @Output() sortById = new EventEmitter<string>();
    @Output() rowUserId = new EventEmitter<string>();
    @Output() sortDirection = new EventEmitter<boolean>();
    @Output() multiOptionSelected = new EventEmitter<any>();

    recordCount: any;

    isAllSelected: boolean = false;
    recordsTrimmed: any[] = [];
    columnMaps: ColumnMapData[];
    selectedRowGroup: any[] = [];
    selectedRow: number;
    rowSelectedCount: number = 0;
    rowSelectedId: any[] = [];

    /* Number of line for skeleton screen */
    dummyArr: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    userIdArray: any = [];
    asc: boolean = true;
    caret = true;

    PageIndex: number = 1;
    displayBatchSize: number = 50;
    sizeArr: any[] = [25, 50, 100, 150, 200, 500];


    @ViewChild('headerCheckbox') hc: ElementRef;

    constructor(private rd: Renderer2, private cd: ChangeDetectorRef, private eleRef: ElementRef) { }



    ngOnChanges() {
        this.cd.markForCheck();
        this.dataStatus;
        this.key1;
        this.defaultSort;
        this.menuOptions;
        this.recordCount = this.records.length;
        this.updateTableBatchSize(this.displayBatchSize);
        this.refreshTable();
        if (this.settings) {
            this.columnMaps = this.settings
                .map(col => new ColumnMapData(col));
        } else {
            this.columnMaps = Object.keys(this.records[0]).map(key => {
                return new ColumnMapData({ primaryKey: key });
            });
        }

    }
    getColor(key, data) {
        let obj3 = {
            'color': 'blue'
        }
        if (key == "student_category") {
            let obj = {
                'color': 'green'
            }
            let obj1 = {
                'color': 'red'
            }

            

            if (data == "active") {
                return obj
            }
            else if (data == "inactive") {
                return obj1
            }
            else if (data == "archived") {
                return obj3;
            }
        }

        if(key == "Closed" || key == "open" || key == "inProgress" || key == "Converted" || key == "studentAdmitted" || key == "totalcount" || key == "newEnqCount"){
            if (data != "0"){
                let obj= {
                    'color' : 'blue',
                    'text-decoration' : 'underline'
                }
                return obj;
            }
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
        this.userIdArray = [];
        this.records.forEach(e => {
            if (e.uiSelected) {
                this.rowSelectedId.push(e);
                this.userIdArray.push(e.user_id);
            }
        });

        this.rowIdArr.emit(this.rowSelectedId);
        this.rowUserId.emit(this.userIdArray);
    }

    isAllChecked(): boolean {
        return this.records.every(_ => _.uiSelected);
    }


    userRowClicked($event, ev, row, key) {
        this.cd.markForCheck();
        $event.preventDefault();
        $event.stopPropagation();
        this.selectedRow = ev;
        if(key == "Closed" || key == "open" || key == "inProgress" || key == "Converted" || key == "studentAdmitted" || key == "totalcount" || key == "newEnqCount"){
            this.userRowSelect.emit(
                {
                    key:key,
                    data:row[key],
                    source:row.key,
                    status:row.data.status
                }
            );
        }
        else{
            this.userRowSelect.emit(row);
        }
        

        this.getSelectedRows();
        console.log(row);
    
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
            this.rowSelectedId = this.removeFromSelectedArr(eve);
            this.rowIdArr.emit(this.rowSelectedId);
            this.rowsSelected.emit(this.rowSelectedCount);
        }
        else if (status == true) {
            eve.uiSelected = true;
            this.rowSelectedCount++;
            this.rowSelectedId.push(eve);
            this.rowIdArr.emit(this.rowSelectedId);
            this.rowsSelected.emit(this.rowSelectedCount);
        }
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
        this.headerSort = ev;
        (this.asc) ? (this.asc = false) : (this.asc = true);

        let type = this.typeOfDataSelected(ev);
      

        if (type === 0) {
            this.sortNumber(ev);
        }
        else if (type === 1) {
            this.sortName(ev);
        }
        else if (type === 2) {
            this.sortDate(ev);
        }

        this.fectchTableDataByPage(this.PageIndex);

    }

    sortNumber(e): any {
        if (this.asc) {
            this.records.sort((a, b) => {
                return a[e] - b[e];
            });
        }
        else {
            this.records.sort((a, b) => {
                return b[e] - a[e];
            });
        }
    }

    sortName(e): any {
        if (this.asc) {
            this.records.sort((a: string, b: string) => {
                let x = a[e].toLowerCase();
                let y = b[e].toLowerCase();
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }
        else {
            this.records.sort((a, b) => {
                let y = a[e];
                let x = b[e];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        }
    }

    sortDate(e): any {

        if (this.asc) {
            this.records.sort((a, b) => {
                return new Date(a[e]).getTime() - new Date(b[e]).getTime();
            });
        }
        else {
            this.records.sort((a, b) => {
                return new Date(b[e]).getTime() - new Date(a[e]).getTime();
            });
        }
    }

    typeOfDataSelected(i: string): number {

        if (i.includes('id') && i.length == 2) {
            return 0
        }
        if (i.includes('no') && i.length == 2) {
            return 0
        }
        else if (i.includes('name')) {
            return 1
        }
        else if (i.includes('email')) {
            return 1
        }
        else if (i.includes('date')) {
            return 2
        }

        else {
            return 0
        }
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
                return 'left';
            }
            else if (key == 'enquiry_date') {
                return 'left';
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

    isSorted(map): boolean {
        this.cd.markForCheck();
        return (map.primaryKey == this.headerSort && this.caret);
    }

    recordSelected(e) {
        this.multiOptionSelected.emit(e);
    }

    /* Fetches Data as per the user selected batch size */
    updateTableBatchSize(num) {

        this.displayBatchSize = parseInt(num);
        let index: number;
        let clone = this.records.map(e => {
            return e;
        });

        if (this.displayBatchSize >= this.records.length) {
            index = this.records.length;
        }
        else if (this.displayBatchSize < this.records.length) {
            index = this.displayBatchSize;
        }

        this.recordsTrimmed = clone.splice(0, index);
    }

    /* Fetch table data by page index */
    fectchTableDataByPage(index) {
        this.PageIndex = index;
        let clone = this.records.map(e => {
            return e;
        });

        let startIndex = this.displayBatchSize * (index - 1);

        let endIndex: number;

        /* page index is not valid then select max limmit */
        if (this.records.length <= (this.displayBatchSize + startIndex)) {
            endIndex = this.records.length;
        }
        else if (this.records.length > (this.displayBatchSize + startIndex)) {
            endIndex = this.displayBatchSize + startIndex;
        }

        this.recordsTrimmed = clone.slice(startIndex, endIndex);

    }

    /* Fetch next set of data from server and update table */
    fetchNext() {
        this.PageIndex++;
        this.fectchTableDataByPage(this.PageIndex);
    }

    /* Fetch previous set of data from server and update table */
    fetchPrevious() {
        this.PageIndex--;
        this.fectchTableDataByPage(this.PageIndex);
    }

}