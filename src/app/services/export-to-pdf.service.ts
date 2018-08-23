import { Injectable } from '@angular/core';
var jsPDF = require('jspdf');
require('jspdf-autotable');

@Injectable()
export class ExportToPdfService {

  constructor() {

  }
  exportToPdf(rows, columns) {
    let pdf = new jsPDF('l', 'pt', 'a4');
    pdf.autoTable({
      head: rows,
      body: columns,
      styles: {
        cellWidth: 20
      }
    });
    pdf.save('table.pdf');
  }
}
