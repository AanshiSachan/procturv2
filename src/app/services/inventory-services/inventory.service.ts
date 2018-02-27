import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { instituteInfo } from '../../model/instituteinfo';
import { EnquiryCampaign } from '../../model/enquirycampaign';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { AddCategoryInInventory } from '../../model/add-item-inventory';
import { AuthenticatorService } from '../authenticator.service';

@Injectable()
export class InventoryService {

  /* Declare variable */
  instituteData: instituteInfo;
  url: string;
  urlCampaign: string;
  Authorization: string;
  headers: Headers;
  headersEncoded: Headers;
  instituteFormData: any = {};
  row: any = [];
  filtered = [];
  institute_id: number;
  urlDownloadTemplate: string;
  urlDownloadAllEnquiry: string;
  urlFetchAllSms: string;
  baseUrl: string = "";

  constructor(private http: Http, private auth: AuthenticatorService) {
    this.Authorization = this.auth.getAuthToken();
    this.institute_id = this.auth.getInstituteId();
    this.baseUrl = this.auth.getBaseUrl();
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);

    this.headersEncoded = new Headers();
    this.headersEncoded.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  }

  fetchAllItems() {
    let url = this.baseUrl + "/api/v1/inventory/item/all/" + this.institute_id;

    return this.http.get(url, { headers: this.headers }).map(
      data => { return data.json() },
      err => {
      }
    );
  }


  fetchAllCategories() {
    let url = this.baseUrl + "/api/v1/inventory/category/all/" + this.institute_id;

    return this.http.get(url, { headers: this.headers }).map(
      data => { return data.json() },
      err => {
      }
    );
  }


  updateInventoryItem(data) {
    data.institution_id = this.institute_id;
    let url = this.baseUrl + "/api/v1/inventory/item";
    return this.http.put(url, data, { headers: this.headers }).map(
      data => {
        return data.json()
      },
      err => {
      }
    );
  }

  fetchAllMasterCategoryItem() {
    let url = this.baseUrl + "/api/v1/standards/all/" + this.institute_id;
    return this.http.get(url, { headers: this.headers }).map(
      data => {
        return data.json();
      },
      err => {
      }
    );
  }

  deleteRowFromItem(rowID) {
    this.url = this.baseUrl + "/api/v1/inventory/item/" + rowID;
    return this.http.delete(this.url, { headers: this.headers }).map(
      data => {
        return data.json();
      },
      err => {
      }
    );
  }

  getCourseOnBasisOfMasterCourse(data_id) {
    let url = this.baseUrl + "/api/v1/subjects/standards/" + data_id;
    return this.http.get( url, { headers: this.headers }).map(
      data => {
        return data.json();
      },
      err => {
      }
    );
  }

  addItemDetailsInCategory(data: AddCategoryInInventory) {
    data.institution_id = this.institute_id;
    let url = this.baseUrl + "/api/v1/inventory/item";
    return this.http.post( url, data, { headers: this.headers }).map(
      data => {
        return data.json();
      },
      err => {
      }
    );
  }


  addQuantityInStock(data) {
    data.institution_id = this.institute_id;
    let url = this.baseUrl + "/api/v1/inventory/item/stockUpdate/";
    return this.http.put( url, data, { headers: this.headers }).map(
      data => {
        return data.json();
      },
      err => {
      }
    );
  }

  getItemDetailsForSubBranches(item_id) {
    let url = this.baseUrl + "/api/v1/inventory/item/" + this.institute_id + "/" + item_id;
    return this.http.get( url, { headers: this.headers }).map(
      data => {
        return data.json();
      },
      err => {
        console.log("error fetching template", err);
      }
    );
  }

  getAllSubBranchesInfo() {
    let url = this.baseUrl + '/api/v1/institutes/all/subBranches/' + this.institute_id;
    return this.http.get( url, { headers: this.headers }).map(
      data => {
        return data.json();
      },
      err => {
        console.log("error fetching template", err);
      }
    );
  }

  getSubBranchItemInfo(dataId) {
    let url = this.baseUrl + '/api/v1/inventory/item/all/' + dataId;
    return this.http.get( url, { headers: this.headers }).map(
      data => {
        return data.json();
      },
      err => {
        console.log("error fetching template", err);
      }
    );
  }

  allocateItemToSubBranch(data) {
    data.institution_id = this.institute_id;
    console.log(data);
    let url = this.baseUrl + '/api/v1/inventory/item/allocate/subBranch';
    return this.http.post( url, data, { headers: this.headers }).map(
      data => {
        return data.json();
      },
      err => {
        console.log("error fetching template", err);
      }
    );
  }

  getInventoryItemHistory(item_id) {
    let url = this.baseUrl + "/api/v1/inventory/item/txHistory/" + item_id;
    return this.http.get(url , {headers : this.headers}).map(
      res => {
        return res.json();
      },
      error => {
        return error.json();
      }
    )
  }

}
