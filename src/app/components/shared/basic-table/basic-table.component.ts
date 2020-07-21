import { Component, OnInit, Input, Output, OnChanges, ElementRef, Renderer2, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { PaginationService } from '../../../services/pagination-service/pagination.service';

@Component({
  selector: 'app-basic-table',
  templateUrl: './basic-table.component.html',
  styleUrls: ['./basic-table.component.scss']
})
export class BasicTableComponent implements OnInit, OnChanges {

  @Input() headers: any[];
  @Input() displayData: any[];
  @Input() tableSetting: any[];
  @Input() datatarget: any;
  @Input() rowColumnSetting: any[];
  @Output() editView = new EventEmitter();
  @Output() deleteView = new EventEmitter();
  @Output() viewView = new EventEmitter();
  tableRows: any[] = [];

  currentKey: string = '';
  currentOrder: string = '';

  constructor(private _paginationService: PaginationService,) { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.tableRows = this.displayData;
    console.log(this.tableRows)
  }

  editRow(row) {
    this.editView.emit({ 'data': row })
  }

  deleteRow(row) {
    this.deleteView.emit({ 'data': row })
  }
  viewRow(row) {
    this.viewView.emit({ 'data': row })
  }

  sortByCol(key) {
    let order = 'asc';
    if (this.currentKey != "") {
      if (key == this.currentKey) {
        if (this.currentOrder == 'desc') {
          order = 'asc';
          this.currentOrder = 'asc';
        }
        else {
          order = 'desc';
          this.currentOrder = 'desc';
        }
      }
      else {
        this.currentKey = key;
        this.currentOrder = 'asc';
        order = 'asc';
      }
    }
    else {
      order = 'asc';
      this.currentKey = key;
      this.currentOrder = 'asc';
    }
    this.tableRows.sort(this.compareValues(key, order));
  }

  compareValues(key, order) {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }


}
