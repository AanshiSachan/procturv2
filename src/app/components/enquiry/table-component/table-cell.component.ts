import { Component, OnInit, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';



@Component({
    selector: 'table-cell',
    templateUrl: './table-cell.component.html',
})


export class TableCellComponent implements OnInit {

    @Input() rowData:any;
    @Input() index:any;

    headerArr: any[] = [
        { id: 'enquiry_no', title: 'Enquiry No.', filter: false, show: true },
        { id: 'enquiry_date', title: 'Enquiry Date', filter: false, show: true },
        { id: 'name', title: 'Name', filter: false, show: true },
        { id: 'phone', title: 'Contact No.', filter: false, show: true },
        { id: 'statusValue', title: 'Status', filter: false, show: true },
        { id: 'priority', title: 'Priority', filter: false, show: true },
        { id: 'follow_type', title: 'Follow type', filter: false, show: true },
        { id: 'followUpDate', title: 'Follow up Date', filter: false, show: true },
        { id: 'actions', title: 'Action', filter: false, show: true },
        { id: 'updateDate', title: 'Update Date', filter: false, show: true },
        { id: 'assigned_name', title: 'Assigned To', filter: false, show: true },
        { id: 'email', title: 'Email', filter: false, show: false },
        { id: 'Gender', title: 'Gender', filter: false, show: false },
        { id: 'standard', title: 'Standard', filter: false, show: false },
        { id: 'subjects', title: 'Subjects', filter: false, show: false }
    ];



    constructor() {
    }

    /* OnInit function to listen the changes in message value from service */
    ngOnInit() { }

}