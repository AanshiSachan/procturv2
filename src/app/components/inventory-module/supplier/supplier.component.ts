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
  totalRow: number = 0;
  searchData: any = [];
  searchflag: boolean = false;
  pagedSupplierData: any[] = [];
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
       supplier_id:0,
       company_name:'',
       supplier_name:'',
       address:'',
       email_id:'',
       phone_no:'',
       institute_id:sessionStorage.getItem('institution_id'),
       item_ids:[40,58],  
       category_ids:[],   
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
      this.model.institute_id = sessionStorage.getItem('institution_id');
     
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
    idField: 'item_id',
    textField: 'item_name',
    enableCheckAll: false,
    itemsShowLimit: 2
  }
  vendorAllData: any;
  dataforasset: [];
  //get category details
  getCategoryDetails() {
    this.auth.showLoader();
    this.httpService.getData(this.url + 'category/all/' + this.model.institute_id).subscribe(
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
   let categoryids:any =[];
   for(let data of object){
     categoryids.push(data.category_id)
  }
  console.log(categoryids);
  let selectcategory =categoryids.split(',');
  console.log(selectcategory)
   if (selectcategory === undefined) {
  }
    else {
      //api/v2/asset/getAssetsWithCategoryName?categoryIdList=' + categoryselectedid + '&instituteId=' + this.model.institute_id
      this.httpService.getData('/api/v1/inventory/item/getItemsByCategory/'+this.model.institute_id + '?category_id_list='+selectcategory).subscribe(
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
 supplierAllData:any=[];
  getVendorDetails() {
    this.auth.showLoader();
    this.httpService.getData('/api/v1/inventory/supplier/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&sortBy=supplierName&instituteId=' + this.model.institute_id).subscribe(
      (res: any) => {
        this.supplierAllData =res.result.response;
        this.staticPageData = res.result.response;
        this.totalRow =  res.result.length;
        this.auth.hideLoader();
        this.tempLocationList = res.result.response;
        this.totalRecords = res.result.total_elements;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  saveSupplierDetails(){
  if(this.addVendorForm.valid){
    delete(this.model.category_ids)
  
    let item_ids =[58,40];
    this.model.item_ids =item_ids;
      this.httpService.postData(this.url + 'supplier/create', this.model).subscribe(
        (res: any) => {
           $('#add1Modal').modal('hide');
          this.auth.hideLoader();
          if (res.statusCode == 200) {
            this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Supplier details is Added successfully ');
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
//category_ids: [48, 50]
//category_names: "Equipments,Uniformatory"
// item_ids: [40, 58]
// item_names: "Bags2,sdfsdf"
     this.isedit = true;
     this.model.supplier_id = object.data.supplier_id;
     this.model.supplier_name = object.data.supplier_name;
     this.model.company_name = object.data.company_name;
     this.model.phone_no= object.data.phone_no;
     this.model.email_id =object.data.email_id;
     //this.model.item_ids =object.data.item_ids;
     this.model.address =object.data.address;
  //    let temp = object.data.item_ids;
  //   let item_names = object.data.item_names.split(',');
  //  this.model.item_ids = [];
  //   for (let i = 0; i < temp.length; i++) {
  //     let obj:any = {
  //       id: '',
  //       item_name: ''
  //     }
  //     obj.id = temp[i];
  //     obj.item_name = item_names[i];
  //     this.model.item_ids.push(obj);

  //   }
  //    let temp2 =object.data.category_ids;
  //    console.log(temp2);
  //    let category_names= object.data.category_names.split(',');
  //   console.log(category_names);
  //   for (let i = 0; i < temp2.length; i++) {
  //     let obj2 = {
  //       id: '',
  //       category_name: ''
  //     }
  //     obj2.id = temp2[i];
  //     obj2.category_name = category_names[i];
  //     this.model.category_ids.push(obj2);
  //    }


   $('#add1Modal').modal('show');
  }
  //search filter
  updateSupplierDetails(){debugger
    if(this.addVendorForm.valid){
     let obj = {
        supplier_id: this.model.supplier_id,
        institute_id: sessionStorage.getItem('institution_id'),
        company_name: this.model.company_name,
        supplier_name: this.model.supplier_name,
        address: this.model.address,
        email_id: this.model.email_id,
        phone_no: this.model.phone_no,
        item_ids:[40,58]
      }
      // let newasset = [];
      //   let item_ids: any = this.model.item_ids;
      //   for (let data in item_ids) {
      //    newasset.push(item_ids[data].id);
      //   }
      //   this.model.item_ids = newasset;
      //  let newassetcat = [];
      //   let category_ids: any = this.model.category_ids;
      //  for (let data in category_ids) {
      //     newassetcat.push(category_ids[data].id);
      //   }
      //   this.model.category_ids = newassetcat;
         
         $('#add1Modal').modal('show');
         this.auth.hideLoader();
         this.httpService.putData('/api/v1/inventory/supplier/update',obj).subscribe(() => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', " Supplier is Updated Successfully")
         this.getVendorDetails();
         $('#add1Modal').modal('hide');
        },
          err => {
            this.auth.hideLoader();
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message)
          })
        }
        else{
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please Fill All Required Fields")
        }
  }
  tempObj={
    supplier_id:''
  }
  showConfirm(obj){
    
    this.tempObj=obj;
    this.tempObj.supplier_id =obj.data.supplier_id
    $('#deletesModal').modal('show');
  }
  deleteRow(obj) {
  
   this.auth.showLoader();
    this.httpService.deleteData(this.url + 'supplier/delete/' + obj.supplier_id +'?instituteId='+ this.model.institute_id, null).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage('success', '', 'Supplier Deleted Successfully');
        this.getVendorDetails();
        $('#deletesModal').modal('hide');
      },
      err => {
        this.msgService.showErrorMessage('error', '', err.error.message);
        this.auth.hideLoader();
      }
    );

  }
  searchParams: any;
  tempLocationList = [];
  cancel(param) {
   this.isedit = false;
    this.model = {
       supplier_id:0,
       company_name:'',
       supplier_name:'',
       address:'',
       email_id:'',
       phone_no:'',
       institute_id:'',
       item_ids:[],
       category_ids:[],
    }
    this.addVendorForm.resetForm(this.model);
 }
  //search 

  /* ==========================================Download Data for supplier=============*/
  downloadPdf() {
    this.httpService.getData('/api/v1/inventory/supplier/all?all=1&instituteId=' + this.model.institute_id).subscribe(
      (res: any) => {
        this.supplierAllData = res.result.response;
    },
      err => {
        this.auth.hideLoader();
      }
      
    );
  let arrforSupplier =[];
this.supplierAllData.map(
    (ele: any) => {
      let json = [
        ele.company_name,
        ele.supplier_name,
        ele.address,
        ele.email_id,
        ele.phone_no,
        ele.category_names,
        ele.item_names,
       
     ]
     arrforSupplier.push(json);
    })

  let rows = [];
  rows = [['Company Name',  'Supplier Name','Address', 'Email Id','Mobile','Category Name', 'Item Name']]
  let columns = arrforSupplier;
  this._pdfService.exportToPdf(rows, columns, 'Supplier List');
  this.auth.hideLoader();
}
supplierDataForDownload=[
  {
    primary_key: 'company_name',
    value: "Company Name",
   },
   {
    primary_key: 'supplier_name',
    value: "Supplier Name",
   },
   {
    primary_key: 'address',
    value: "Address",
   },
   {
    primary_key: 'email_id',
    value: "Email Id",
   },
   {
    primary_key: 'phone_no',
    value: "Mobile",
   },
   {
    primary_key: 'category_names',
    value: "Category Name",
   },
  {
    primary_key: 'item_names',
    value: "Item Name",
  },
 
]
exportToExcel(){
  this.httpService.getData('/api/v1/inventory/supplier/all?all=1&instituteId=' + this.model.institute_id).subscribe(
    (res: any) => {
      this.supplierAllData = res.result.response;
  },
    err => {
      this.auth.hideLoader();
    }
    
  );
let Excelarr = [];
      this.supplierAllData.map(
      (ele: any) => {
        let json = {}
        this.supplierDataForDownload.map((keys) => {
          json[keys.value] = ele[keys.primary_key]
        })
        Excelarr.push(json);
      }
    )
    this.excelService.exportAsExcelFile(
      Excelarr,
      'inventory_item'
    );
     this.auth.hideLoader();

}
//pagination code
fetchTableDataByPage(index) {
  this.pageIndex = index;
  let startindex = this.displayBatchSize * (index - 1);
  this.getDataFromDataSource(startindex);
}

getDataFromDataSource(startindex) {
  this.getVendorDetails();
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
updateTableBatchSize(event) {
  this.pageIndex = 1;
  this.displayBatchSize = event;
  this.fetchTableDataByPage(this.pageIndex);
}
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

}
