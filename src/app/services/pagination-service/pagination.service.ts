import { Injectable } from '@angular/core';

@Injectable()
export class PaginationService {
  PageIndex: number = 1;
  displayBatchSize: number = 50;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500];
  pagesToShow: number = 10;
  constructor() { }

  setPageIndex(index) {
    this.PageIndex = index;
  }

  getPageIndex() {
    return this.PageIndex;
  }

  getDisplayBatchSize() {
    return this.displayBatchSize;
  }

  getPagesToShow() {
    return this.pagesToShow;
  }

  setDisplayBatchSize(num) {
    this.displayBatchSize = num;
  }

  getSizeArr() {
    return this.sizeArr;
  }
  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num, array) {
    this.displayBatchSize = parseInt(num);
    let index: number;
    let clone = array.map(e => {
      return e;
    });

    if (this.displayBatchSize >= array.length) {
      index = array.length;
    }
    else if (this.displayBatchSize < array.length) {
      index = this.displayBatchSize;
    }
    return clone.splice(0, index);

  }

  /* Fetch table data by page index */
  fectchTableDataByPage(index, array) {
    this.PageIndex = index;
    let clone = array.map(e => {
      return e;
    });
    let startIndex = this.displayBatchSize * (index - 1);
    let endIndex: number;
    /* page index is not valid then select max limit */
    if (array.length <= (this.displayBatchSize + startIndex)) {
      endIndex = array.length;
    }
    else if (array.length > (this.displayBatchSize + startIndex)) {
      endIndex = this.displayBatchSize + startIndex;
    }
    return clone.slice(startIndex, endIndex);
  }

  /* Fetch next set of data from server and update table */
  fetchNext(array) {
    this.PageIndex++;
    return this.fectchTableDataByPage(this.PageIndex, array);
  }

  /* Fetch previous set of data from server and update table */
  fetchPrevious(array) {
    this.PageIndex--;
    return this.fectchTableDataByPage(this.PageIndex, array);
  }
}
