import { Component, OnInit, HostListener, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'enquiry-table',
    templateUrl: './table-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class TableComponent implements OnInit {

    @Input() header: any;
    @Input() rows: any;
    @Input() isAllSelected: any;

    @Output() selectAllRows = new EventEmitter<boolean>();
    @Output() sort = new EventEmitter<string>();
    @Output() toggle = new EventEmitter<string>();
    @Output() userSelectRow = new EventEmitter<any>();
    @Output() multipleSelectRow = new EventEmitter<boolean>();

    row:any;
    column:any;
    constructor() {
    }

    /* OnInit function to listen the changes in message value from service */
    ngOnInit() { }

    allSelector(next: boolean): void {
        this.selectAllRows.emit(next);
    }

    RowClicked(): any{
       return this.row;
    }

    sortById(): string{
        return this.column
    }

    toggleHeader() {
        
    }

    rowCheckBox() {
        return this.row;
    }

}