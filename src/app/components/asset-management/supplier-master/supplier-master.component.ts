import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';
import { NgForm } from '@angular/forms';
import { ExcelService } from '../../../services/excel.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
declare var $;
@Component({
  selector: 'app-supplier-master',
  templateUrl: './supplier-master.component.html',
  styleUrls: ['./supplier-master.component.scss']
})
export class SupplierMasterComponent implements OnInit {
  displayBatchSize: number = 25;
  headerSetting: any;
  isedit = false;
  pageIndex: number = 1;
  rowColumns: any;
  selectedvalue: number;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  staticPageData: any = [];
  staticPageDataSouece: any = [];
  tableSetting: any;
  totalRecords: number = 0;
  supplierDataforDownload=[];
  model = {
    id: '',
    active: true,
    address: '',
    institute_id: sessionStorage.getItem('institute_id'),
    contact_person_name: '',
    email_id: '',
    mobile_no: '',
    supplier_name: '',
    category_id: 0,
    asset_ids: [],
    category_ids: [],
  }
  submitted = false;
  assetcategoryData: [];
  assetAllData: [];
  constructor(private httpService: ProductService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService) { }

  ngOnInit(): void {
    this.setTableData();
    this.getCategoryDetails();
    this.getVendorDetails();


  }

  setTableData() {
    this.headerSetting = [
      // {
      //   primary_key: 'id',
      //   value: "#",
      //   charactLimit: 25,
      //   sorting: true,
      //   visibility: true
      // },
      {
        primary_key: 'supplier_name',
        value: " Company Name",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'email_id',
        value: " Email",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'mobile_no',
        value: "Mobile",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'address',
        value: "Address",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'contact_person_name',
        value: "Contact Person",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'asset_names_string',
        value: "Asset Provided",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'action',
        value: "Action",
        charactLimit: 10,
        sorting: false,
        visibility: true,
        view: false,
        edit: true,
        delete: true,
      },
    ]

    this.tableSetting = {
      width: "100%",
      height: "58vh"
    }

    this.rowColumns = [
      // {
      //   width: "5%",
      //   textAlign: "left"
      // },
      {
        width: "18%",
        textAlign: "left"
      },
      {
        width: "15%",
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
      {
        width: "15%",
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
    idField: 'id',
    textField: 'category_name',
    enableCheckAll: false,
    itemsShowLimit: 2
  };

  moderatorSettingsforasset: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'asset_name',
    enableCheckAll: false,
    itemsShowLimit: 2
  }
  vendorAllData: any;
  dataforasset: [];
  //get category details
  getCategoryDetails() {
    this.httpService.getMethod('api/v2/asset/category/all?all=1&instituteId=' + this.model.institute_id, null).subscribe((res: any) => {
      this.assetcategoryData = res.result.response;
    },
      err => {
        this.auth.hideLoader();
      })

  }
  maxlength = 10;
  validateMobile(mobile){
    if(mobile.length<10){
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Please enter 10 digit mobile number");
    }
  }
   ValidateEmail(mail) 
{
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
  {
    return (true)
  }
  this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Please enter valid digit mobile number");
}

  saveVendorDetails() {
 if (this.addVendorForm.valid) {
      let obj: any = {
        active: this.model.active,
        address: this.model.address,
        institute_id: sessionStorage.getItem('institute_id'),
        contact_person_name: this.model.contact_person_name,
        email_id: this.model.email_id,
        mobile_no: this.model.mobile_no,
        supplier_name: this.model.supplier_name,
        category_id: this.model.category_id,
        asset_ids: this.model.asset_ids,
        category_ids: this.model.category_ids,
      }
      let newasset = []
      let asset_ids: any = obj.asset_ids;
     for (let data in asset_ids) {
        newasset.push(asset_ids[data].id);
      }
      //this.model.asset_ids = newasset
      obj.asset_ids = newasset;
      //for cat
      let newcat = [];
      let category_ids: any = this.model.category_ids;
      for (let data in category_ids) {
        newcat.push(category_ids[data].id);
      }
      obj.category_ids = newcat
      if (newcat.length == 0) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Category is manadatory");
      }

      obj.category_id = this.selectedvalue;
      this.httpService.postMethod('api/v2/asset/supplier/create ', obj).then(
        (res: any) => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Supplier added successfully");
          $('#modelforvendor').modal('hide');
          // this.cancel(false);
          this.getVendorDetails();
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].error_message);
          //this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Supplier name/Email duplicate");      
        }
      )
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All Fields Required");

    }

  }

  //fordropdown
  getAssetsForSelectedCat(object) {
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
      this.httpService.getMethod('api/v2/asset/getAssetsWithCategoryName?categoryIdList=' + categoryselectedid + '&instituteId=' + this.model.institute_id, null).subscribe(
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
          this.assetAllData = temp;
          if(this.assetAllData.length==0){
            this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Assets not available under this category");
          }
        },
        err => {

        })
    }

  }

  getVendorDetails() {
    this.auth.showLoader();
    this.httpService.getMethod('api/v2/asset/supplier/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&instituteId=' + this.model.institute_id, null).subscribe(
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

  editRow(object) {
    // let object1 = object.data;
    this.isedit = true;
    // this.model = object.data;
    this.model.active = object.data.active;
    this.model.address = object.data.address;
    this.model.institute_id = object.data.institute_id;
    this.model.contact_person_name = object.data.contact_person_name;
    this.model.email_id = object.data.email_id;
    this.model.mobile_no = object.data.mobile_no;
    this.model.supplier_name = object.data.supplier_name;
    this.model.category_id = object.data.category_id;
    this.model.id = object.data.id;
    //asset_id_for_multiselect
    let temp = object.data.asset_ids;
    let temp2 = object.data.category_ids;
    let asset_names = object.data.asset_names_string.split(',');
    this.model.asset_ids = [];
    for (let i = 0; i < temp.length; i++) {
      let obj = {
        id: '',
        asset_name: ''
      }
      obj.id = temp[i];
      obj.asset_name = asset_names[i];
      this.model.asset_ids.push(obj);

    }
    //category_selcet
    let category_names = object.data.category_names_string.split(',');
    this.model.category_ids = [];
    for (let i = 0; i < temp2.length; i++) {
      let obj2 = {
        id: '',
        category_name: ''
      }
      obj2.id = temp2[i];
      obj2.category_name = category_names[i];
      this.model.category_ids.push(obj2);
    }

    $('#modelforvendor').modal('show');
  }
  updateVendorDetails() {
    if (this.addVendorForm.valid) {
      let obj: any = {
      }
      obj.active = this.model.active;
      obj.address = this.model.address;
      obj.institute_id = sessionStorage.getItem('institute_id');
      obj.contact_person_name = this.model.contact_person_name;
      obj.email_id = this.model.email_id;
      obj.mobile_no = this.model.mobile_no;
      obj.supplier_name = this.model.supplier_name;
      obj.category_id = this.model.category_id;
      obj.asset_ids = this.model.asset_ids;
      obj.category_ids = this.model.category_ids;
      obj.id = this.model.id;
      let newasset = []
      let asset_ids: any = obj.asset_ids;
      for (let data in asset_ids) {
        newasset.push(asset_ids[data].id);
      }
      //this.model.asset_ids = newasset
      obj.asset_ids = newasset;
      //for cat
      let newcat = [];
      let category_ids: any = obj.category_ids;
      for (let data in category_ids) {
        newcat.push(category_ids[data].id);
      }
      obj.category_ids = newcat
      obj.category_id = this.selectedvalue;
      this.httpService.putMethod('api/v2/asset/supplier/update', obj).then(() => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Updated Successfully")
        $('#modelforvendor').modal('hide');
        this.getVendorDetails();
      },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].error_message);
          this.auth.hideLoader();
          //this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select category")
        })
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all mandatory field")
    }
  }
  tempObj
  deleteRowConfirm(object){
this.tempObj =object.data.id;
$('#deletesModal').modal('show');
  }
  deleteRow(obj) {
    this.httpService.deleteMethod('api/v2/asset/supplier/delete/' + obj  + '?instituteId=' + this.model.institute_id).then(
        (res: any) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('success', '', 'Deleted Successfully');
          this.getVendorDetails();
          $('#deletesModal').modal('hide');

        },
        err => {
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.error[0].error_message);
       //this.msgService.showErrorMessage('error', '', ' Pending asset request for supplier');
        this.auth.hideLoader();
        }
      );
   
  }

  //search filter
  searchParams: any;
  tempLocationList = [];

  cancel(param) {
    this.addVendorForm.resetForm();
    this.isedit = false;
    this.model = {
      id: '',
      active: true,
      address: '',
      institute_id: sessionStorage.getItem('institute_id'),
      asset_ids: [],
      contact_person_name: '',
      email_id: '',
      mobile_no: '',
      supplier_name: '',
      category_id: 0,
      category_ids: [],
    }

  }
  //search 

  searchDatabase() {
    this.staticPageData=[];
    if (this.searchParams == undefined || this.searchParams == null) {
      this.searchParams = "";
      this.staticPageData = this.tempLocationList;

    }
    else {
      this.auth.showLoader();
      this.httpService.getMethod('api/v2/asset/supplier/search?searchString='+this.searchParams + '&instituteId='+this.model.institute_id, null).subscribe(
        (res: any) => {
          this.staticPageData = res.result.response;
          this.tempLocationList = res.result.response;
          this.totalRecords = res.result.total_elements;
          this.auth.hideLoader();
          if(this.staticPageData.length==0){
            this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "No Data Found");
          }
        },
        err => {
          this.auth.hideLoader();
        }
      );
      let searchData = this.tempLocationList.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchParams.toLowerCase()))
      );
      this.staticPageData = searchData;
      this.totalRecords = this.staticPageData.length;

    }
  }

  downloadPdf() {
    this.httpService.getMethod('api/v2/asset/supplier/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.supplierDataforDownload = res.result.response;
        for(let i=0;i<this.supplierDataforDownload.length;i++){
          this.supplierDataforDownload[i].id=i+1;
        }
        let arr = [];

        this.supplierDataforDownload.map(
          (ele: any) => {
            let json = [
              // ele.id,
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
        rows = [['Company Name', ' Email', ' Mobile', 'Address', 'Contact Person', 'Asset Provided']]
        let columns = arr;
        this._pdfService.exportToPdf(rows, columns, 'Supplier List');
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }

    );
   
  }
  //download in excel format
  headersetingforexcel: any = [{
    primary_key: 'supplier_name',
    value: " Company Name",
    charactLimit: 25,
   
  },
  {
    primary_key: 'email_id',
    value: " Email",
    
  },
  {
    primary_key: 'mobile_no',
    value: "Mobile",
   
  },
  {
    primary_key: 'address',
    value: "Address",
    
  },
  {
    primary_key: 'contact_person_name',
    value: "Contact Person",
    
  },
  {
    primary_key: 'asset_names_string',
    value: "Asset Provided",
   
  },
  ]
  exportToExcel() {
    this.httpService.getMethod('api/v2/asset/supplier/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.auth.showLoader();
        this.supplierDataforDownload = res.result.response;
        let Excelarr = [];
        this.supplierDataforDownload.map(
          (ele: any) => {
            let json = {}
            this.headersetingforexcel.map((keys) => {
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
  maxlenth(data,limit){
    if(data.length>limit){
      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Please Enter upto"+  " " + limit + " "+ "character only");
    }
}

  
}
