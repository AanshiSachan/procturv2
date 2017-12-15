import { Component, OnInit, HostListener, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router';



@Component({
    selector: 'header',
    templateUrl: './table-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class TableHeaderComponent implements OnInit {

    @Input() header: any;
    @Input() isAllSelected: any;
    @Output() sort = new EventEmitter<string>();
    @Output() toggle = new EventEmitter<string>();
    constructor() {
     }

    /* OnInit function to listen the changes in message value from service */
    ngOnInit() {}

}