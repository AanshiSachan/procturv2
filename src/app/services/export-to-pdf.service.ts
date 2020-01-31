import { Injectable } from '@angular/core';
var jsPDF = require('jspdf');
require('jspdf-autotable');

@Injectable()
export class ExportToPdfService {

  constructor() {

  }

  exportToPdf(rows, columns,fileName,columnStyles={}) {
    let pdf = new jsPDF('l', 'pt', 'a4');
    pdf.autoTable({
      head: rows,
      body: columns,
      margin:10,
      padding:20,
      styles: {
        cellWidth: 20,
        overflow: 'linebreak',
        cellPadding: 10,
        valign: 'middle',
      },
      columnStyles: columnStyles,
    });
    pdf.save(fileName + '_export_' + new Date().getTime() + '.pdf');

  }
}