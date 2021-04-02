import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import { MessageShowService } from '../../../services/message-show.service';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';


declare var $;
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  selectedvalue: number;
  headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [];
  staticPageDataSouece: any = [];
  isedit = false;
 supplierDataforDownload:[];
  model = {
    supplier_id:'',
       company_name:'',
       supplier_name:'',
       address:'',
       email_id:'',
       phone_no:'',
       institution_id:'',
       item_ids:[],
       item_names:'',
  }
  
  submitted = false;
  assetcategoryData: [];
  assetAllData: [];
  itemAllData:[];
  categoryAllData:[];
  url = `/api/v1/inventory/`;
  constructor(
    private httpService: HttpService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService) { 
      this.model.institution_id = sessionStorage.getItem('institution_id');
     
    }

 ngOnInit(): void {
    this.setTableData();
    this.getCategoryDetails();
    this.getVendorDetails();
   

  }

  setTableData() {
    this.headerSetting = [
      {
        primary_key: 'company_name',
        value: "Company Name",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'supplier_name',
        value: " Supplier Name",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'address',
        value: " Address",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
     
      {
        primary_key: 'email_id',
        value: "Email Id",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'phone_no',
        value: "Mobile",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'category_names',
        value: "Category Name",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'item_names',
        value: "Item Name",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'action',
        value: "Action",
        charactLimit: 10,
        sorting: false,
        visibility: true,
        view: true,
        edit: true,
        delete: true,
},
    ]

    this.tableSetting = {
      width: "100%",
      height: "58vh"
    }

    this.rowColumns = [
      {
        width: "13%",
        textAlign: "left"
      },
      {
        width: "13%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "20%",
        textAlign: "left"
      },
      {
        width: "15%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },

    ]
  }

  //pagination code
  fetchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.getDataFromDataSource(startindex);
  }
  fetchNext() {
    this.pageIndex++;
    this.fetchTableDataByPage(this.pageIndex);
  }
  fetchPrevious() {
    if (this.pageIndex != 1) {
      this.pageIndex--;
      this.fetchTableDataByPage(this.pageIndex);
    }
  }
  getDataFromDataSource(startindex) {
    this.getVendorDetails();


  }
  updateTableBatchSize(event) {
    this.pageIndex = 1;
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.pageIndex);
  }

  //crud for location
  @ViewChild('addVendorForm', { static: false }) addVendorForm: NgForm;
  
  moderatorSettings: any = {
    singleSelection: false,
    idField: 'category_id',
    textField: 'category_name',
    enableCheckAll: false,
    itemsShowLimit: 2
  };

  moderatorSettingsforitem: any = {
    singleSelection: false,
    idField: 'item_ids',
    textField: 'item_name',
    enableCheckAll: false,
    itemsShowLimit: 2
  }
  vendorAllData: any;
  dataforasset: [];
  //get category details
  getCategoryDetails() {
    this.auth.showLoader();
    this.httpService.getData(this.url + 'category/all/' + this.model.institution_id).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.categoryAllData =res;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  maxlength = 10;
 
  //fordropdown
 getItemForSelectedCat(object) {
   console.log(object)
    const CategoryId = object.map((object) => {
      if (object == undefined) {
        return false
      }
      else {
        return object.id;
      }

    });
    var categoryselectedid = CategoryId.join();
    if (categoryselectedid === undefined) {

    }
    else {
      //api/v2/asset/getAssetsWithCategoryName?categoryIdList=' + categoryselectedid + '&instituteId=' + this.model.institute_id
      this.httpService.getData('/api/v1/inventory/item/getItemsByCategory/123').subscribe(
        (res: any) => {
          let result = res.result;
          let keys = Object.keys(result);
          let temp: any = [];
          for (let i = 0; i < keys.length; i++) {
            let a = result[keys[i]];
            for (let j = 0; j < a.length; j++) {
              temp.push(a[j]);
            }
          }
          this.itemAllData = temp;
        },
        err => {

        })
 }

  }
  getVendorDetails() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/inventory/supplier/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&sortBy=supplierName&instituteId=' + this.model.institution_id).subscribe(
      (res: any) => {
        this.staticPageData = res.result.response;
        this.tempLocationList = res.result.response;
      this.totalRecords = res.result.total_elements;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  saveSupplierDetails(obj){
    this.isedit =false;
    if(this.addVendorForm.valid){
      this.httpService.postData(this.url + 'supplier/create', obj).subscribe(
        (res: any) => {
           $('#add1Modal').modal('hide');
          this.auth.hideLoader();
          if (res.statusCode == 200) {
            this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Item added successfully');
            this.getVendorDetails();
          }
        },
        err => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
        }
      )
   }
   else{
    this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all manadatory fields"); 
   } 

  }
  editRow(object) {
    this.isedit = true;
     this.model.supplier_id = object.data.subject_id;
     this.model.supplier_name = object.data.supplier_name;
     this.model.company_name = object.data.company_name;
     this.model.phone_no= object.data.phone_no;
     this.model.email_id =object.data.email_id;
     this.model.item_ids =object.data.item_ids;
     this.model.item_names=object.data.item_names;
    // this.category_model.category_name = object.data.category_name;
    // this.category_model.desc = object.data.desc;
    // this.category_model.category_id = object.data.category_id;
    $('#add1Modal').modal('show');
  }
  //search filter
  updateSupplierDetails(){

  }
  searchParams: any;
  tempLocationList = [];

  cancel(param) {
    this.addVendorForm.resetForm();
    this.isedit = false;
    this.model = {
       supplier_id:'',
       company_name:'',
       supplier_name:'',
       address:'',
       email_id:'',
       phone_no:'',
       institution_id:'',
       item_ids:[]
    }

 }
  //search 

  searchDatabase() {
  if (this.searchParams == undefined || this.searchParams == null) {
    this.searchParams = "";
    this.staticPageData = this.tempLocationList;

    }
    else {
      let searchData = this.tempLocationList.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchParams.toLowerCase()))
      );
      this.staticPageData = searchData;
      this.totalRecords = this.staticPageData.length;
   
    }
  }
 downloadPdf() {
    this.httpService.getData('api/v2/asset/supplier/all?all=1&instituteId=' + this.model.institute_id).subscribe(
      (res: any) => {
        this.supplierDataforDownload = res.result.response;
    },
      err => {
        this.auth.hideLoader();
      }
      
    );
    let arr = [];
   
    this.supplierDataforDownload.map(
      (ele: any) => {
        let json = [
         
          ele.supplier_name,
          ele.email_id,
          ele.mobile_no,
          ele.address,
          ele.contact_person_name,
          ele.asset_names_string
       ]
        arr.push(json);
      })

    let rows = [];
    rows = [['Company Name', ' Email', ' Mobile','Address','Contact Person','Asset Provided']]
    let columns = arr;
    this._pdfService.exportToPdf(rows, columns, 'Supplier List');
    this.auth.hideLoader();
  }
//download in excel format
exportToExcel(){
  this.httpService.getData('api/v2/asset/supplier/all?all=1&instituteId=' + this.model.institute_id).subscribe(
    (res: any) => {
      this.auth.showLoader();
      this.supplierDataforDownload= res.result.response;
     let Excelarr = [];
      this.supplierDataforDownload.map(
      (ele: any) => {
        let json = {}
        this.headerSetting.map((keys) => {
          json[keys.value] = ele[keys.primary_key]
        })
        Excelarr.push(json);
      }
    )
    this.excelService.exportAsExcelFile(
      Excelarr,
      'asset_Supplier'
    );
     this.auth.hideLoader();
  },
    err => {
      this.auth.hideLoader();
    }
    
  );
  this.auth.hideLoader();
}

}
