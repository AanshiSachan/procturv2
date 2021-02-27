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
    this.getAssetDetails();
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
    asset_ids: '',  //required
    contact_person_name: '',
    email_id: '', //required
    mobile_no: 0,  //required
    supplier_name: '',  //required
    category_id: 0
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
        value: " Emailss",
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
        primary_key: 'asset_ids',
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
        view: true,
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
    this.staticPageData = this.getDataFromDataSource(startindex);
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
    let t = this.staticPageDataSouece.slice(startindex, startindex + this.displayBatchSize);
    return t;
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
  vendorAllData: any;
  dataforasset: [];
  //get category details
  getCategoryDetails() {
    this.httpService.getMethod('api/v2/asset/category/all?pageOffset=1&pageSize=10&instituteId=' + this.model.institute_id, null).subscribe((res: any) => {
      this.assetcategoryData = res.result.response;
      console.log(this.assetcategoryData)
    },
      err => {
        this.auth.hideLoader();
      })

  }

  getAssetDetails() {
    this.httpService.getMethod('api/v2/asset/all?pageOffset=1&pageSize=10&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        this.assetAllData = res.result.response;
        console.log(this.assetAllData)

      },
      err => {
        this.auth.hideLoader();
      }
    );
  }
  //method use to post form data
  saveVendorDetails() {
    var asset_ids = JSON.parse("[" + this.model.asset_ids + "]");
    this.model.mobile_no = Number(this.model.mobile_no);
    this.model.asset_ids = asset_ids;
    this.httpService.postMethod('api/v2/asset/supplier/create ', this.model).then(
      (res: any) => {
        console.log(res);
      },
      err => {
        console.log(err);

      }
    )
    this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Location Added Successfully");
    $('#modelforvendor').modal('hide');

    this.getVendorDetails()
  }

  //fordropdown
  selectedvalue: number;

  getAssets(object) {
    console.log(object)
    this.httpService.getMethod('api/v2/asset/all?pageOffset=1&pageSize=10&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();

        this.assetAllData = res.result.response;
        if (this.assetAllData.length > 0) {

        }
        for (let data of this.assetAllData) {

        }

        const Data_for_asset_dropdown = this.assetAllData.find(person => {
          if (this.selectedvalue == 107) {
            this.dataforasset = Data_for_asset_dropdown;
            console.log(this.dataforasset)
            return Data_for_asset_dropdown;
          }
          (console.log(person))
        });

        //filter method assetAllData
      },
      err => {

      })

  }

  getVendorDetails() {
    this.httpService.getMethod('api/v2/asset/supplier/all?pageOffset=1&pageSize=10&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        this.vendorAllData = res.result.response;
        console.log(this.vendorAllData)
        this.staticPageData = this.getDataFromDataSource(0);
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  editRow(object) {
    this.isedit = !this.isedit;
    console.log(object);
    this.model = object.data;

    $('#modelforvendor').modal('show');
    //this.router.navigate(['view/website-configuration/faq/category/edit/' + object.data.id])
  }

  updateVendorDetails() {
    // this.isedit = !this.isedit;
    this.httpService.putMethod('api/v2/asset/supplier/update', this.model).then(() => {
      this.getVendorDetails();
    },
      err => {
        this.auth.hideLoader();
      })
    this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "updated successfully")
    $('#modelforvendor').modal('hide');
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
          this.auth.hideLoader();
        }
      );
    }
  }

  //search filter
  searchParams: any;
  tempLocationList = [];

  cancel(param) {
    this.isedit = param;
    this.model = {
      active: true,
      address: '',
      institute_id: sessionStorage.getItem('institute_id'),
      asset_ids: '',  //required
      contact_person_name: '',
      email_id: '', //required
      mobile_no: 0,  //required
      supplier_name: '',
      category_id: 0 //required

    }
  }
}
