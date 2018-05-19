import { Component, OnInit, OnChanges, HostListener, ElementRef, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2, NgZone, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { DropData, DropMapData } from './dropmenu.model'

@Component({
    selector: 'drop-menu',
    templateUrl: 'dropmenu.component.html',
    styleUrls: ['./dropmenu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropMenuComponent implements OnChanges {

    @Input() menuOptions: DropData[];
    @Input() records: any[];
    @Input() dropType: number = 1;
    @Input() info: any;

    columnMaps: DropMapData[];
    private showMenu: boolean = false;
    @Output() selectedRecord = new EventEmitter<any>();

    isDropdown: boolean = true;
    isChequeUpdatable: boolean = true;


    constructor(private cd: ChangeDetectorRef, private renderer: Renderer2, private eRef: ElementRef, private zone: NgZone) { }

    ngOnChanges() {

        /* Data from cheque table */
        if (this.info.hasOwnProperty('cheque_status_id')) {
            if (this.info.cheque_status_id == 2) {
                this.isChequeUpdatable = false;
            }
            else{
                this.isChequeUpdatable = true;
            }
        }

        this.menuOptions;
        if (this.dropType == 1) {
            this.isDropdown = false
        }

        if (this.menuOptions) {
            this.columnMaps = this.menuOptions
                .map(col => new DropMapData(col));
        }
        else {
            this.columnMaps = Object.keys(this.records[0]).map(key => {
                return new DropMapData({ key: key });
            });
        }
    }

    /* open action menu on click */
    openMenu(ev) {
        this.showMenu = !this.showMenu;
    }

    /* close action menu on events  */
    closeMenu(): void {
        this.showMenu = false;
    }

    selectOption(option) {
        let obj = {
            action: option,
            data: this.info
        }
        this.selectedRecord.emit(obj);
        this.closeMenu();
    }

}