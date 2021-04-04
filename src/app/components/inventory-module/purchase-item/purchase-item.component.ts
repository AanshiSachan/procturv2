import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
@Component({
  selector: 'app-purchase-item',
  templateUrl: './purchase-item.component.html',
  styleUrls: ['./purchase-item.component.scss']
})
export class PurchaseItemComponent implements OnInit {
  purchaseAllData:any=[];
  rowColumns: any;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [];
  staticPageDataSouece: any = [];
  institution_id;
  constructor(private httpService: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService) { 
      this.institution_id =sessionStorage.getItem('institution_id')
    }

  ngOnInit(): void {
 this.getPurchaseDetails();
  }
  getPurchaseDetails() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/inventory/purchase/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&&instituteId=' + this.institution_id).subscribe(
      (res: any) => {
        this.purchaseAllData = res.result.response;
        let purchaseData =[];
for(let keys of  this.purchaseAllData){
     console.log(keys);
 // console.log(this.purchaseAllData[keys]);
  for(let data of keys.purchased_item_list){
    console.log(data);
    purchaseData.push(data)
  }
console.log(purchaseData)
}
        // this.staticPageData = res.result.response;
        // this.tempLocationList = res.result.response;
        // this.totalRecords = res.result.total_elements;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
}
