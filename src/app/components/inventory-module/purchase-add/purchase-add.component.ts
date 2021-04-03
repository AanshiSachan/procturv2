import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';

@Component({
  selector: 'app-purchase-add',
  templateUrl: './purchase-add.component.html',
  styleUrls: ['./purchase-add.component.scss']
})
export class PurchaseAddComponent implements OnInit {
  categoryAllData:any=[];
  supplierAllData:any=[];
  pageIndex: number = 1;
  displayBatchSize:number=25;
  url = `/api/v1/inventory/`;
  model = {
    id: '',
     asset_id: '',
     supplier_id: '',
     expiry_date: '',
     institute_id: sessionStorage.getItem('institute_id'),
     purchase_amount: '',
     purchase_date: '',
     purchased_by_user_id: '',
     quantity: '',
     service_date: '',
     unit: '',
     user_type: '',
    category_id: '',
   }

  constructor(
    private httpService: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService) { 
      this.model.institute_id = sessionStorage.getItem('institution_id');
     
    }


  ngOnInit(): void {
    this.getVendorDetails();
  }
  getCategoryItem(obj) {
   // this.auth.showLoader();
   console.log(obj)
    this.httpService.getData(this.url + 'purchase/getCategoryAndItem?supplierId='+obj + '&instituteId=' + this.model.institute_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.categoryAllData =res.result;
        console.log(this.categoryAllData);
        let items:any=[];
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  getVendorDetails() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/inventory/supplier/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&sortBy=supplierName&instituteId=' + this.model.institute_id).subscribe(
      (res: any) => {
        this.supplierAllData =res.result.response;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
}
