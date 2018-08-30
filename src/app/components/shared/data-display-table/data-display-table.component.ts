import { Component, OnInit, Input, EventEmitter, Output, OnChanges, ChangeDetectorRef } from '@angular/core';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';
import { PaginationService } from '../../../services/pagination-service/pagination.service';

@Component({
  selector: 'data-display-table',
  templateUrl: './data-display-table.component.html',
  styleUrls: ['./data-display-table.component.scss']
})
export class DataDisplayTableComponent implements OnInit, OnChanges {
  @Input() displayData: any;
  @Input() displayKeys: any;
  @Output() editView = new EventEmitter();
  isEditRow: string;
  editObject: any;
  keysArray: any;
  recordCount: any;
  // PageIndex: number = 1;
  // sizeArr: any[] = [25, 50, 100, 150, 200, 500];
  recordsTrimmed: any[] = [];
  constructor(
    private _tablePreferencesService: TablePreferencesService,
    private _paginationService: PaginationService
  ) { }

  ngOnInit() {
    this.keysArray = this.displayKeys.keys;
    if (this.displayKeys.selectAll.checked) {
      this.toggleAllCheckBox();
    }
    this._paginationService.setPageIndex(1);
    this._paginationService.setDisplayBatchSize(50);
  }

  notifyMe(e) {
    this.keysArray = e.keys;
  }

  onSelect(value, data) {
    console.log(value, data);
  }

  // evaluate css condition
  getClass(id, condition, data) {
    if (condition != undefined)
      return eval(data[id] + condition);
  }

  toggleCheckbox(event, obj, key) {
    console.log(event.currentTarget.checked, obj);
    let flag = true;
    this.displayData.forEach(element => {
      if (element[key] == obj[key]) {
        element.checked = event.currentTarget.checked;
      }
      if (!element.checked) {
        flag = false;
      }
    });
    this.displayKeys.selectAll.checked = flag;
  }

  recordSelected(e) {
    console.log(e);
    this.editView.emit(e);


  }

  SelectAlleventTrigger() {
    this.editView.emit({ 'obj': this.displayData, option: 'selectAll' })
  }

  changeView(obj, mode) { // You can give any function name
    console.log(obj);
    this.isEditRow = "";
    this.editView.emit({ 'obj': obj, option: mode })
  }

  // this function is used for select or deselect all checkbox
  toggleAllCheckBox() {
    this.displayKeys.selectAll.checked = !this.displayKeys.selectAll.checked;
    this.recordsTrimmed.forEach(element => {
      element.checked = this.displayKeys.selectAll.checked;
    });
  }

  ngOnChanges() {
    this.recordCount = this.displayData.length;
    this.keysArray = this.displayKeys.keys;
    this.updateTableBatchSize(this._paginationService.getDisplayBatchSize());
    console.log('chnages :', this.displayKeys);
    if (this.displayData.length > 0 && this.keysArray.length > 0) {
      this.keysArray[0].type = null;
      this.sortData(this.keysArray[0]);
    }

  }

  // this function is used for column wise sorting
  sortData(key) {
    // console.log(this.displayData, key);
    if (key.allowSortingFlag != undefined) {
      if (key.type == "asc" || key.type == "desc") {
        key.type = key.type == "asc" ? "desc" : "asc";
        this.recordsTrimmed = this.recordsTrimmed.reverse();
        return;
      }
      else {
        this.keysArray.forEach(element => {
          if (element.primaryKey == key.primaryKey) {
            element.filter = true;
            element.type = element.type == null ? "asc" : (element.type == "asc") ? "desc" : "asc";
          }
          else {
            element.type = null;
            element.filter = false;
          }
        });

        if (key["header"] != "ID") {
          let sortedArray = this.recordsTrimmed.sort((obj1, obj2) => {
            let a = obj1[key.primaryKey];
            let b = obj2[key.primaryKey];
            // for case insensitive compare 
            if ((typeof obj1[key.primaryKey] === "string") && (obj1[key.primaryKey] != null && obj2[key.primaryKey] != null)) {
              a = obj1[key.primaryKey].toLowerCase();
              b = obj2[key.primaryKey].toLowerCase();
            }
            if (a == null) {
              return -1;
            }
            if (b == null) {
              return 1;
            }

            if (this.checkValueType(a) > this.checkValueType(b)) {
              return 1;
            }
            else if (this.checkValueType(a) < this.checkValueType(b)) {
              return -1
            }
            return 0;
          });

          this.recordsTrimmed = sortedArray;
          console.log(this.recordsTrimmed);
        }
        else {
          this.newSortArray(key);
        }

      }
    }
  }

  // convert string as type 
  checkValueType(value: any) {

    if (/^\d{2}([-])[a-zA-Z]{3}([-])\d{4}/.test(value)) { //date
      console.log(Date.parse(value));
      value = Date.parse(value);;
    }
    else if (/[^A-Za-z0-9]+/g.test(value)) {
      console.log(value);
      return 'both';
    }
    else if (typeof value == "string") {
      if (value.match(/^-{0,1}\d+$/)) {  //int
        return parseInt(value);
      } else if (value.match(/^\d+\.\d+$/)) { //float
        return parseInt(value);
      }
    } // else end
    return value;
  }

  editRow(id, obj) {
    console.log(id);
    this.isEditRow = id;
    this.editObject = obj;
  }

  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.recordsTrimmed = this._paginationService.updateTableBatchSize(num, this.displayData);
    if (this.recordsTrimmed.length > 0) {
      this._paginationService.setPageIndex(1);
      this.sortData(this.keysArray[0]);
    }
  }

  fectchTableDataByPage($event) {
    this.recordsTrimmed = this._paginationService.fectchTableDataByPage($event, this.displayData);
  }

  /* Fetch next set of data from server and update table */
  fetchNext() {
    this.recordsTrimmed = this._paginationService.fetchNext(this.displayData);
  }

  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    this.recordsTrimmed = this._paginationService.fetchPrevious(this.displayData);
  }

  newSortArray(key) {
    // Regular expression to separate the digit string from the non-digit strings.
    let reParts = /\d+|\D+/g;
    // Regular expression to test if the string has a digit.
    let reDigit = /\d/;
    let sortedArray = this.recordsTrimmed.sort((obj1, obj2) => {
      let a = obj1[key.primaryKey];
      let b = obj2[key.primaryKey];
      // for case insensitive compare 
      if ((typeof obj1[key.primaryKey] === "string") && (obj1[key.primaryKey] != null && obj2[key.primaryKey] != null)) {
        a = obj1[key.primaryKey].toLowerCase();
        b = obj2[key.primaryKey].toLowerCase();
      }
      let aParts = a.match(reParts);
      let bParts = b.match(reParts);
      let isDigitPart;

      if (aParts && bParts && (isDigitPart = reDigit.test(aParts[0])) == reDigit.test(bParts[0])) {
        // Loop through each substring part to compare the overall strings.
        let len = Math.min(aParts.length, bParts.length);
        for (var i = 0; i < len; i++) {
          let aPart: any = aParts[i];
          let bPart: any = bParts[i];

          // If comparing digits, convert them to numbers (assuming base 10).
          if (isDigitPart) {
            aPart = parseInt(aPart, 10);
            bPart = parseInt(bPart, 10);
          }
          // If the substrings aren't equal, return either -1 or 1.
          if (aPart != bPart) {
            return aPart < bPart ? -1 : 1;
          }
          // Toggle the value of isDigitPart since the parts will alternate.
          isDigitPart = !isDigitPart;
        }
      }
      // Use normal comparison.
      return Number((a >= b)) - Number((a <= b));
    });
  }

}
