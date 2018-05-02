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
    @Input() dummyArr: any[] ;
    @Input() columnMap: any[] ;
    @Input() dataStatus: boolean;
    @Output() sortData = new EventEmitter<String>();
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


    getSortedData(ev) {
        console.log(ev.target)
        for(let i=0; i<this.settings.length ; i++){
            if(ev.target.id == this.settings[i].header){
                this.sortData.emit(this.settings[i].primaryKey);
            }
        }
        
    }

}