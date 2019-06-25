import { Component, OnInit, Input, EventEmitter, Output, OnChanges, ChangeDetectorRef } from '@angular/core';
import { TablePreferencesService } from '../../../services/table-preference/table-preferences.service';
import { PaginationService } from '../../../services/pagination-service/pagination.service';
declare var $;
@Component({
  selector: 'data-display-table',
  templateUrl: './data-display-table.component.html',
  styleUrls: ['./data-display-table.component.scss']
})
export class DataDisplayTableComponent implements OnInit, OnChanges {
  @Input() displayData: any;
  @Input() displayKeys: any;
  @Output() editView = new EventEmitter();
  @Output() selectAllView = new EventEmitter();
  isEditRow: string;
  editObject: any;
  keysArray: any;
  recordCount: any;
  sortKey: any;
  recordsTrimmed: any[] = [];
  selectedRecord: any[] = [];
  tempData: any[] = [];
  isCourse: boolean = true;
  constructor(
    private _tablePreferencesService: TablePreferencesService,
    private _paginationService: PaginationService
  ) { }

  ngOnInit() {
    this.keysArray = this.displayKeys.keys;
    if (this.displayKeys.defaultSort == undefined) {
      this.sortKey = this.keysArray[0];
    }
    else {
      this.sortKey = this.displayKeys.defaultSort;
    }
    if (sessionStorage.getItem('course_structure_flag') == "0") {
      this.isCourse = false;
      if (!this.isCourse) {
        this.keysArray.forEach((element, index) => {
          if (element.header == 'Master Course') {
            element.primaryKey = 'standard_name';
          }
        });
      }
    }

    if (this.displayKeys.selectAll.checked) {
      this.toggleAllCheckBox();
    }
    this._paginationService.setPageIndex(1);
    this._paginationService.setDisplayBatchSize(50);
  }

  ngOnChanges() {
    // console.log('chnages :', this.displayKeys);
    if (this.displayData.length > 0) {
      this.recordCount = this.displayData.length;
      this.keysArray = this.displayKeys.keys;
      if (!this.isCourse) {
        this.keysArray.forEach((element, index) => {
          if (element.header == 'Master Course') {
            element.primaryKey = 'standard_name';
          }
        });
      }
      this.updateTableBatchSize(this._paginationService.getDisplayBatchSize());
    }
    else {
      this.tempData = this.displayData;
      this.recordsTrimmed = Object.assign([], this.displayData);
      this.recordCount = this.displayData.length;
      // this.displayKeys.displayMessage = "Data not found";
    }
  }

  notifyMe(e) {
    if (e == 'clearRow') {
      this.isEditRow = "";
    } else {
      this.keysArray = e.keys;
      this.keysArray[0].type = null;
      this.sortData(this.keysArray[0]);
    }
    console.log('notifyMe');
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
    // console.log(event.currentTarget.checked, obj);
    this.selectedRecord = [];
    let flag = true;
    this.displayData.forEach(element => {
      if (element[key] == obj[key]) {
        element.checked = event.currentTarget.checked;
      }
      if (!element.checked) {
        flag = false;
      }
      if (element.checked == true) {
        this.selectedRecord.push(element);
      }
    });
    this.displayKeys.selectAll.checked = flag;
  }

  recordSelected(e) {
    console.log(e);
    this.editView.emit(e);
  }

  SelectAlleventTrigger() {
    this.selectAllView.emit({ 'data': this.selectedRecord, option: 'selectAll' })
  }

  changeView(obj, mode) { // You can give any function name
    console.log(obj);
    this.isEditRow = "";
    this.editView.emit({ 'obj': obj, option: mode })
  }

  // this function is used for select or deselect all checkbox
  toggleAllCheckBox() {
    this.displayKeys.selectAll.checked = !this.displayKeys.selectAll.checked;
    this.selectedRecord = [];
    this.recordsTrimmed.forEach(element => {
      element.checked = this.displayKeys.selectAll.checked;
      this.selectedRecord.push(element);
    });
  }

  // this function is used for column wise sorting
  sortData(key) {
    let indexValue = 0;
    // console.log(this.recordsTrimmed,this.displayData);
    if (this.sortKey.header != key.header) {
      this.sortKey = key;
    }
    if (key.allowSortingFlag != undefined) {
      if (key.type == "asc" || key.type == "desc") {
        key.type = key.type == "asc" ? "desc" : "asc";
        this.recordsTrimmed = this.recordsTrimmed.reverse();
        return;
      }
      else {
        this.keysArray.forEach((element, index) => {
          if (element.primaryKey == key.primaryKey) {
            element.filter = true;
            if (element.type == null) {
              element.type = 'asc';
              indexValue = index;
            }
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
          // console.log(this.recordsTrimmed);          
        }
        else {
          this.newSortArray(key);
        }
        if (key.sortingType == 'desc') {
          this.keysArray[indexValue].type = key.type = 'desc';
          key.sortingType = null;
          this.recordsTrimmed = this.recordsTrimmed.reverse()
        }
        // console.log(key);
      }
    }
  }


  rowClick(index) {
    if (index == (this.recordsTrimmed.length - 1)) {
      $(".dd-list-container").css("bottom", "-30px");
    }
  }

  checkCondition(data) {
    let strExp = '';

    let len = this.displayKeys.actionSetting.condition.length;
    if (!len) {
      return true;
    }
    let conditionArray = this.displayKeys.actionSetting.condition;
    for (let i in conditionArray) {
      if (conditionArray[i].nextOperation != undefined) {
        strExp = strExp + "'" + data[conditionArray[i].key] + "'" + conditionArray[i].condition + "'" + conditionArray[i].checkValue + "'";
        if (conditionArray[Number(i) + 1].nextOperation != undefined)
          strExp = strExp + conditionArray[i].nextOperation;
      }
      else {
        if (conditionArray[i].insideOperation != undefined && conditionArray[i].checkValue.length > 0) {
          strExp = strExp + conditionArray[i].outerOperation + '('
          for (let j in conditionArray[i].checkValue) {
            strExp = strExp + data[conditionArray[i].key] + conditionArray[i].condition + conditionArray[i].checkValue[j];
            if (Number(j) < conditionArray[i].checkValue.length - 1) {
              strExp = strExp + conditionArray[i].insideOperation;
            }
          }
        }
        else {
          strExp ='('
          if (conditionArray[i].nextOperation == undefined) {
            strExp = strExp + "'" + data[conditionArray[i].key] + "'" + conditionArray[i].condition + "'" + conditionArray[i].checkValue + "'";
          }
        }
        strExp = strExp + ')';
      }
    }


    if (eval(strExp))
      return true;
    else
      return false;

    // return eval(strExp);

  }

  getTypeCheck(data, value: any, key, index) {
    // debugger;
    // console.log(key);
    if (key.operation) {

      switch (key.operation) {
        case 'add': {
          let strExp = '';
          let len = key.primaryKey.length;
          for (let i in key.primaryKey) {
            if (Number(i) < len)
              strExp = data[key.primaryKey[i]] + '+';
          }
          // console.log(strExp, eval(strExp));
          break;
        }
        case 'sub': {
          let strExp = '';
          let len = key.primaryKey.length - 1;
          for (let i in key.primaryKey) {
            strExp += data[key.primaryKey[i]]
            if (Number(i) < len)
              strExp += '-';
          }
          // console.log(strExp, eval(strExp));
          value = eval(strExp);
          break;
        }
        case 'mul': {
          break;
        }
        case 'divide': {
          break;
        }
        default:
      }
    }
    if (key.primaryKey == this.keysArray[0].primaryKey) {
      return value;
    }
    if ((!isNaN(value)) && (value != '') && (value != null)) {
      // return value ;
      if (key.amountValue) {

        return '₹ ' + value.toLocaleString('en-IN');
      } else {
        return value;
      }

    }
    else
      return value;
  }

  // convert string as type
  checkValueType(value: any) {

    if (/^\d{2}([-])[a-zA-Z]{3}([-])\d{4}/.test(value)) { //date
      // console.log(Date.parse(value));
      value = Date.parse(value);;
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

  isShow(option, object) {
    switch (option.condition) {
      case "==": {
        if (object[option.key] == option.value) {
          return true;
        }
        else {
          return false;
        }

      }
      default: {
        return true;
      }
    }
  }

  editRow(id, obj, type) {
    console.log(id, obj);
    this.recordsTrimmed = Object.assign([], this.displayData);
    if (type == 'editRow') {
      this.isEditRow = id;
      this.editObject = obj;
      this.recordsTrimmed.forEach((obj) => {
        obj.course_type = obj.tempName;
      })
    }
    else {

      this.editView.emit({ 'data': obj, type: type })
    }
  }

  handleEvent(obj, type) {
    this.editView.emit({ 'data': obj, type: type })
  }

  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.recordsTrimmed = this._paginationService.updateTableBatchSize(num, Object.assign([], this.displayData));
    if (this.recordsTrimmed.length > 0) {
      this._paginationService.setPageIndex(1);
      this.sortKey.type = null;
      this.sortData(this.sortKey);
    }
  }

  fectchTableDataByPage($event) {
    this.recordsTrimmed = this._paginationService.fectchTableDataByPage($event, Object.assign([], this.displayData));
    // console.log(this.recordsTrimmed,this.displayData);
    this.sortKey.type = null;
    this.sortData(this.sortKey);
  }

  /* Fetch next set of data from server and update table */
  fetchNext() {
    this.recordsTrimmed = this._paginationService.fetchNext(Object.assign([], this.displayData));
    this.sortKey.type = null;
    this.sortData(this.sortKey);
  }

  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    this.recordsTrimmed = this._paginationService.fetchPrevious(Object.assign([], this.displayData));
    this.sortKey.type = null;
    this.sortData(this.sortKey);
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

    this.recordsTrimmed = sortedArray;
  }

}
