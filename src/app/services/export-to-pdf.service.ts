import { Injectable } from '@angular/core';
var jsPDF = require('jspdf');
require('jspdf-autotable');

@Injectable()
export class ExportToPdfService {

  constructor() {

  }
  exportToPdf(rows, columns,fileName) {
    let pdf = new jsPDF('l', 'pt', 'a4');
    pdf.autoTable({
      head: rows,
      body: columns,
      styles: {
        cellWidth: 20,
        overflow: 'linebreak',
        cellPadding: 10,
        valign: 'middle',
      },
    });
    pdf.save(fileName + '_export_' + new Date().getTime() + '.pdf');

  }
}
