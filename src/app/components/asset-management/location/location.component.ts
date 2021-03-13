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
  headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  sizeArr: any[] = [2, 50, 100, 150, 200, 500, 1000];
  pageIndex: number = 1;
  totalRecords: number = 0;
  displayBatchSize: number = 25;
  staticPageData: any = [];
  //table ui data
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
        primary_key: 'address',
        value: "Address",
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
    this.getLocationDetails();


  }
  updateTableBatchSize(event) {
    this.pageIndex = 1;
    this.displayBatchSize = event;
    this.fetchTableDataByPage(this.pageIndex);
  }
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
          this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', "Location Added Successfully");
          $('#modelforlocation').modal('hide');
          this.getLocationDetails();
        },
        err => {
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', "Location name is duplicate");
        }
      )
      $('#modelforlocation').modal('hide');
      this.getLocationDetails();
    }
    else {

      this.msgService.showErrorMessage(this.msgService.toastTypes.info, '', "Please fill all fields");
    }
  }

  getLocationDetails() {
    this.httpService.getMethod('api/v2/asset/location/all?pageOffset=' + this.pageIndex + '&pageSize=' + this.displayBatchSize + '&instituteId=' + this.model.institute_id, null).subscribe(
      (res: any) => {
        //this.auth.hideLoader();
        this.staticPageData = res.result.response;
        this.tempLocationList = res.result.response;
        this.totalRecords = res.result.total_elements;
      },
      err => {
        this.auth.hideLoader();
      }
    );
  }

  editRow(object) {
    this.isedit = true;
    this.model.id = object.data.id;
    this.model.institute_id = object.data.institute_id;
    this.model.address = object.data.address;
    this.model.location_description = object.data.location_description;
    this.model.location_name = object.data.location_name;

    $('#modelforlocation').modal('show');
    // this.getLocationDetails();
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
    //this.locationaddForm.reset();
    this.isedit = param;
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
          this.msgService.showErrorMessage('error', '', 'Location can not be  deleted asset linked to this location');
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
    console.log(this.staticPageData)
    // this.staticPageDataSouece = this.tempIncomelist;
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
    }
  }
  //code for tooltip

}
