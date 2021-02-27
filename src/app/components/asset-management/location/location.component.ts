import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageShowService } from '../../../services/message-show.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { ProductService } from '../../../services/products.service';
import { Location } from './location';
import { NgForm } from '@angular/forms';
//import { $ } from 'protractor';
declare var $;

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  constructor(
    private httpService: ProductService,
    private auth: AuthenticatorService,
    private router: Router,
    private msgService: MessageShowService,
    private currentRout: ActivatedRoute) { }

  ngOnInit(): void {
    this.getLocationDetails();
    this.setTableData();
    this.cancel(false);
  }

  //basic-table ui code
  headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [];
  staticPageDataSouece: any = [];

  //table ui related functions


  setTableData() {
    this.headerSetting = [
      {
        primary_key: 'id',
        value: "Id",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'location_name',
        value: " Location Name",
        charactLimit: 25,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'location_description',
        value: " Location Description",
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
        width: "15%",
        textAlign: "left"
      },
      {
        width: "25%",
        textAlign: "left"
      },
      {
        width: "35%",
        textAlign: "left"
      },
      {
        width: "30%",
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
  @ViewChild('locationaddForm', { static: false }) locationaddForm: NgForm;
  model: Location = new Location();
  isedit = false;
  submitted = false;
  locationData = {
    institute_id: sessionStorage.getItem('institute_id'),
    address: '',
    location_description: '',
    location_name: '',
    active: true,
  }
  //method use to post form data
  saveLocationDetails() {
    if (this.locationaddForm.valid) {
      let obj: any = this.model;
      obj.institute_id = sessionStorage.getItem('institute_id');
      obj.active = true;
      this.httpService.postMethod('api/v2/asset/location/create', obj).then(
        (res: any) => {
          console.log(res);
          this.submitted = true;
        },
        err => {
          console.log(err);

        }
      )
      this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Location Added Successfully");
      $('#modelforlocation').modal('hide');

      this.getLocationDetails();

    }
    else {

      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Please fill all fields");
    }
  }

  getLocationDetails() {
    this.httpService.getMethod('api/v2/asset/location/all?pageOffset=1&pageSize=10&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        this.staticPageDataSouece = res.result.response;
        console.log(this.staticPageDataSouece)
        this.tempLocationList = res.result;
        this.totalRecords = this.staticPageDataSouece.length;
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

    $('#modelforlocation').modal('show');
    //this.router.navigate(['view/website-configuration/faq/category/edit/' + object.data.id])
  }

  updateLocationDetails() {
    // this.isedit = !this.isedit;
    this.httpService.putMethod('api/v2/asset/location/update', this.model).then(() => {
      this.getLocationDetails();
    },
      err => {
        this.auth.hideLoader();
      })
    this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "updated successfully")
    $('#modelforlocation').modal('hide');
  }
  //cancel model
  cancel(param) {
    this.isedit = param;
    //this.locationaddForm.reset();
    this.model.address = '';
    this.model.location_description = '';
    this.model.location_name = '';
  }


  deleteRow(obj) {
    let deleteconfirm = confirm("Are you really want to delete?");
    if (deleteconfirm == true) {
      this.auth.showLoader();
      this.httpService.deleteMethod('api/v2/asset/location/delete/' + obj.data.id + '?instituteId=' + this.model.institute_id).then(
        (res: any) => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage('success', '', 'Location Deleted Successfully');
          this.getLocationDetails();
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

  searchDatabase() {
    //alert("hi")
    console.log(this.searchParams);
    console.log(this.staticPageDataSouece)
    // this.staticPageDataSouece = this.tempIncomelist;
    if (this.searchParams == undefined || this.searchParams == null) {
      this.searchParams = "";

    }
    else {
      let searchData = this.staticPageDataSouece.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchParams.toLowerCase()))
      );
      this.staticPageData = searchData;
    }
  }

}
