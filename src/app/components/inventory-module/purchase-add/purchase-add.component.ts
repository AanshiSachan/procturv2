import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { element } from 'protractor';

@Component({
  selector: 'app-purchase-add',
  templateUrl: './purchase-add.component.html',
  styleUrls: ['./purchase-add.component.scss']
})
export class PurchaseAddComponent implements OnInit {
  categoryAllData: any = [];
  supplierAllData: any = [];
  pageIndex: number = 1;
  displayBatchSize: number = 25;
  itemArray = [];
  itemData = [];
  total: number = 0;
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
    this.httpService.getData(this.url + 'purchase/getCategoryAndItem?supplierId=' + obj + '&instituteId=' + this.model.institute_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.categoryAllData = res.result;
        console.log(this.categoryAllData);
        let items: any = [];
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
        this.supplierAllData = res.result.response;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  getItemAgainscat(e) {
    let id = e.target.value;
    id = +id;
    console.log(e.target.value)
    this.categoryAllData.forEach(element => {

      if (element && element.categoryId === id) {
        this.itemArray = element.items;
      }
    });
  }
  getItemData(e) {debugger;
    this.itemData;
    let id = e;
    id = +id;
    this.isChange = true;
    this.itemArray.forEach(element => {
      if (element && element.item_id === id) {
        let data = element;
        data.subtotal = Number(data.unit_cost) * Number(data.available_units);
        data.Prevsubtotal = data.unit_cost * data.available_units;
        // this.total = this.total - data.Prevsubtotal;
        this.total = this.total + data.subtotal;
        this.itemData.push(data);
      }
    })
    console.log(this.itemData)
  }


  status: boolean = true;
  editdata(param) {
    this.status = param;
  }

  unit_cost: number;
  available_units: number
  isChange: boolean = false;
  totals(obj) {
    console.log(obj)
    this.isChange = true;
    obj.subtotal = obj.unit_cost * obj.available_units;
    obj.Prevsubtotal = obj.unit_cost * obj.available_units;
    obj.Prevsubtotal = obj.subtotal;
    //this.total = this.total - obj.Prevsubtotal;
    this.total = this.total + obj.subtotal;
    
    
  }
}
