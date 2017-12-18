import { Component, OnInit, HostListener, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';



@Component({
    selector: 'body',
    templateUrl: './table-body.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class TableBodyComponent implements OnInit {

    @Input() source:any[] = [];
    fetchingDataMessage:string = 'Loading'
    constructor() {
     }

    /* OnInit function to listen the changes in message value from service */
    ngOnInit() {
    }

}