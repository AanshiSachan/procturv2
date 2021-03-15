import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';
import { NgForm } from '@angular/forms';
import { isForOfStatement } from 'typescript';
declare var $;
@Component({
  selector: 'app-supplier-master',
  templateUrl: './supplier-master.component.html',
  styleUrls: ['./supplier-master.component.scss']
})
export class SupplierMasterComponent implements OnInit {
  constructor(private httpService: ProductService,
    private auth: AuthenticatorService,
    private msgService: MessageShowService) { }


  ngOnInit(): void {
    this.setTableData();
    this.cancel(false);
    this.getCategoryDetails();
    // this.getAssetDetails();
    this.getVendorDetails();
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
        value: " Supplier Name",
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
        value: "Phone",
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
    enableCheckAll: false
  };

  moderatorSettingsforasset: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'asset_name',
    enableCheckAll: false
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
      let mobileno = Number(this.model.mobile_no);
      this.model.category_id = this.selectedvalue;
      this.httpService.postMethod('api/v2/asset/supplier/create ', this.model).then(
        (res: any) => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Vendor Added Successfully");
          $('#modelforvendor').modal('hide');
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
    this.httpService.getMethod('api/v2/asset/supplier/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        this.staticPageData = res.result.response;
        this.tempLocationList = res.result;
        this.totalRecords = res.result.total_elements;
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
    let temp = object.data.asset_ids;
    let asset_names = object.data.asset_names_string.split();
    console.log(asset_names);
    console.log(temp);
    // for (let i = 0; i < temp.length; i++) {
    //   let obj = {
    //     id: '',
    //     asset_names: ''
    //   }
    //   obj.id = temp[i];
    //   obj.asset_names = asset_names[i];
    //   this.model.asset_ids.push(obj);

    // }
    $('#modelforvendor').modal('show');
    console.log(this.model.asset_ids)
  }
  // );
  // $('#modelforvendor').modal('show');
  // this.getVendorDetails();
  // }

  updateVendorDetails() {
    let newasset = []
    let asset_ids: any = this.model.asset_ids;
    console.log(asset_ids)
    for (let data in asset_ids) {
      console.log(asset_ids[data].id)
      newasset.push(asset_ids[data].id);
    }
    this.model.asset_ids = newasset;
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
      category_id: 0 //required

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
}
