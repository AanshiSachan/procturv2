import { Component, OnInit,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-purchase-view',
  templateUrl: './purchase-view.component.html',
  styleUrls: ['./purchase-view.component.scss']
})
export class PurchaseViewComponent implements OnInit {
  purchaseAllData:any=[];
  rowColumns: any;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [];
  staticPageDataSouece: any = [];
  viewDatas:any =[];
  institute_id =sessionStorage.getItem('institute_id')
  constructor(private httpService: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService) { }

  ngOnInit(): void {
   this.viewDatas =sessionStorage.getItem('viewData');
  
    this.getViewDataById();
  }
  DataForView=[];
getViewDataById(){
  this.auth.showLoader();
  this.httpService.getData('/api/v1/inventory/purchase/' + this.viewDatas + '?instituteId=' + this.institute_id).subscribe((res: any) => {
    this.DataForView = res.result;
    this.auth.hideLoader();
 
   
  },
    err => {
      this.auth.hideLoader();
    })
}
ngOnDestory(){
  sessionStorage.removeItem('viewData');
}
printData(divName){
  //window.print();
  var printContents = document.getElementById(divName).innerHTML;
			var originalContents = document.body.innerHTML;

			document.body.innerHTML = printContents;

			window.print();

			document.body.innerHTML = originalContents;
}
}
  
