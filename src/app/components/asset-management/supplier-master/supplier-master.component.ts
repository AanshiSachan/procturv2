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
  constructor(private httpService: ProductService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService,
    private _pdfService: ExportToPdfService,
    private excelService: ExcelService) { }


  ngOnInit(): void {
    this.setTableData();
    this.cancel(false);
    this.getCategoryDetails();
    // this.getAssetDetails();
    this.getVendorDetails();
   

  }
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
    active: true,
    address: '',
    institute_id: sessionStorage.getItem('institute_id'),
    contact_person_name: '',
    email_id: '', //required
    mobile_no: '',  //required
    supplier_name: '',  //required
    category_id: 0,
    asset_ids: [],
    category_ids:[],
  }


  setTableData() {
    this.headerSetting = [
      {
        primary_key: 'id',
        value: "#",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
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
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'mobile_no',
        value: "Mobile",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'address',
        value: "Address",
        charactLimit: 25,
        sorting: true,
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
        sorting: true,
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

        // editCondition: 'converted == 0',
        // deleteCondition: 'converted == 0'
      },
    ]

    this.tableSetting = {
      width: "100%",
      height: "58vh"
    }

    this.rowColumns = [
      {
        width: "5%",
        textAlign: "left"
      },
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
        width: "10%",
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
    console.log(startindex)
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
  submitted = false;
  assetcategoryData: [];
  assetAllData: [];
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
      // console.log(this.assetcategoryData)
    },
      err => {
        this.auth.hideLoader();
      })

  }
  maxlength = 10;
  saveVendorDetails() {
    if (this.addVendorForm.valid) {
      let newasset = []
      let asset_ids: any = this.model.asset_ids;
      console.log(asset_ids)
      for (let data in asset_ids) {
        console.log(asset_ids[data].id)
        newasset.push(asset_ids[data].id);
      }
      this.model.asset_ids = newasset
      //for cat
      let newcat =[];
      let category_ids:any =this.model.category_ids;
      for (let data in category_ids) {
        newcat.push(category_ids[data].id);
      }
      this.model.category_ids = newcat
      this.model.category_id = this.selectedvalue;
      this.httpService.postMethod('api/v2/asset/supplier/create ', this.model).then(
        (res: any) => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Vendor Added Successfully");
          this.getVendorDetails();
        },
        err => {

          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Supplier Name is Duplicate");
          $('#modelforvendor').modal('hide');
        }
      )
    }
    else {
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "All Fields Required");
      $('#modelforvendor').modal('hide');
    }
    $('#modelforvendor').modal('hide');
  }

  //fordropdown
  selectedvalue: number;

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
    console.log(categoryselectedid)
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
            // console.log(a);
          }
          console.log(temp);
          this.assetAllData = temp;
          console.log(this.assetAllData);
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
        this.tempLocationList = res.result;
        this.totalRecords = res.result.total_elements;
        this.auth.hideLoader();
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  editRow(object) {
    this.isedit = true;
    console.log(object);
    this.model = object.data;
    this.model.active = object.data.active;
    this.model.address = object.data.address;
    this.model.institute_id = object.data.institute_id;
    //this.model.asset_ids = object.model.asset_ids;
    this.model.contact_person_name = object.data.contact_person_name;
    this.model.email_id = object.data.email_id;
    this.model.mobile_no = object.data.mobile_no;
    this.model.supplier_name = object.data.supplier_name;
    this.model.category_id = object.data.category_id;
    //asset_id_for_multiselect
    let temp = object.data.asset_ids;
    let temp2 =object.data.category_ids;
    let asset_names = object.data.asset_names_string.split(',');
    console.log(asset_names);
    console.log(temp);
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
let category_names= object.data.category_names_string.split(',');
console.log(temp2)
console.log(category_names);
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
    console.log(this.model.asset_ids)
  }
  // );
  // $('#modelforvendor').modal('show');
  // this.getVendorDetails();
  // }

  updateVendorDetails() {
    if(this.addVendorForm.valid){
  let newasset = [];
    let asset_ids: any = this.model.asset_ids;
    console.log(asset_ids)
    for (let data in asset_ids) {
      console.log(asset_ids[data].id)
      newasset.push(asset_ids[data].id);
    }
    this.model.asset_ids = newasset;
    console.log(newasset);

    let newassetcat = [];
    let category_ids: any = this.model.category_ids;
    console.log(category_ids)
    for (let data in category_ids) {
      console.log(category_ids[data].id)
      newassetcat.push(category_ids[data].id);
    }
    this.model.category_ids = newassetcat;
    console.log(newassetcat);
    let mobile_no: any = Number(this.model.mobile_no);
    this.model.mobile_no = mobile_no;
    // this.model.mobile_no = Number(this.model.mobile_no);
    this.model.category_id = this.selectedvalue;

    this.httpService.putMethod('api/v2/asset/supplier/update', this.model).then(() => {
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Asset Supplier is Updated Successfully")
      $('#modelforvendor').modal('hide');
      this.getVendorDetails();
    },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "please select category")
      })
    }
    else{
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please Fill All Required Fields")
    }
  }
  //cancel model

  deleteRow(obj) {
    let deleteconfirm = confirm("Are you really want to delete?");
    if (deleteconfirm == true) {
      this.auth.showLoader();
      this.httpService.deleteMethod('api/v2/asset/supplier/delete/' + obj.data.id + '?instituteId=' + this.model.institute_id).then(
        (res: any) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('success', '', 'Supplier Deleted Successfully');
          this.getVendorDetails();
        },
        err => {
          this.msgService.showErrorMessage('error', '', 'Delete when no pending asset request for supplier');
        }
      );
    }
  }

  //search filter
  searchParams: any;
  tempLocationList = [];

  cancel(param) {
    this.isedit = false;
    this.model = {
      active: true,
      address: '',
      institute_id: sessionStorage.getItem('institute_id'),
      asset_ids: [],  //required
      contact_person_name: '',
      email_id: '', //required
      mobile_no: '',  //required
      supplier_name: '',
      category_id: 0 ,
      category_ids:[],
      

    }


  }
  //search 

  searchDatabase() {
    //alert("hi")
    console.log(this.searchParams);
    console.log(this.staticPageData)
    // this.staticPageDataSouece = this.tempIncomelist;
    if (this.searchParams == undefined || this.searchParams == null) {
      this.searchParams = "";

    }
    else {
      let searchData = this.staticPageData.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchParams.toLowerCase()))
      );
      this.staticPageData = searchData;
    }
  }

  downloadPdf() {
    this.httpService.getMethod('api/v2/asset/supplier/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.supplierDataforDownload = res.result.response;
        //this.auth.showLoader();
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
    this._pdfService.exportToPdf(rows, columns, 'Vendor List');
    this.auth.hideLoader();
  }
//download in excel format
exportToExcel(){
  this.httpService.getMethod('api/v2/asset/supplier/all?all=1&instituteId=' + this.model.institute_id, null).subscribe(
    (res: any) => {
      this.auth.showLoader();
      this.supplierDataforDownload= res.result.response;
      console.log( this.supplierDataforDownload = res.result.response)
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
      'asset_vendor'
    );
     // console.log(this.locationDataforDownload)
      this.auth.hideLoader();
  },
    err => {
      this.auth.hideLoader();
    }
    
  );
  this.auth.hideLoader();
}
}
