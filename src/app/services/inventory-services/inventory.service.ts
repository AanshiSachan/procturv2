import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AddCategoryInInventory } from '../../model/add-item-inventory';
import { AuthenticatorService } from '../authenticator.service';

@Injectable()
export class InventoryService {

  /* Declare variable */
  url: string;
  Authorization: string;
  headers: any;
  institute_id: number;
  baseUrl: string = "";

  constructor(
    private http: HttpClient,
    private auth: AuthenticatorService
  ) {
    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders(
        { "Content-Type": "application/json", "Authorization": this.Authorization });
    })
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.baseUrl = this.auth.getBaseUrl();

  }

  fetchAllItems() {
    let url = this.baseUrl + "/api/v1/inventory/item/all/" + this.institute_id;
    return this.http.get(url, { headers: this.headers }).map(
      data => { return data },
      err => { return err }
    );
  }

  fetchAllCategories() {
    let url = this.baseUrl + "/api/v1/inventory/category/all/" + this.institute_id;
    return this.http.get(url, { headers: this.headers }).map(
      data => { return data },
      err => { return err }
    );
  }

  updateInventoryItem(data) {
    data.institution_id = this.institute_id;
    let url = this.baseUrl + "/api/v1/inventory/item";
    return this.http.put(url, data, { headers: this.headers }).map(
      data => { return data },
      err => { return err }
    );
  }

  fetchAllMasterCategoryItem() {
    let url = this.baseUrl + "/api/v1/standards/all/" + this.institute_id;
    return this.http.get(url, { headers: this.headers }).map(
      data => { return data },
      err => { return err }
    );
  }

  deleteRowFromItem(rowID) {
    this.url = this.baseUrl + "/api/v1/inventory/item/" + rowID;
    return this.http.delete(this.url, { headers: this.headers }).map(
      data => { return data },
      err => { return err }
    );
  }

  getCourseOnBasisOfMasterCourse(data_id) {
    let url = this.baseUrl + "/api/v1/subjects/standards/" + data_id;
    return this.http.get(url, { headers: this.headers }).map(
      data => { return data },
      err => { return err }
    );
  }

  addItemDetailsInCategory(data: AddCategoryInInventory) {
    data.institution_id = this.institute_id;
    let url = this.baseUrl + "/api/v1/inventory/item";
    return this.http.post(url, data, { headers: this.headers }).map(
      data => { return data },
      err => { return err }
    );
  }

  addQuantityInStock(data) {
    data.institution_id = this.institute_id;
    let url = this.baseUrl + "/api/v1/inventory/item/stockUpdate/";
    return this.http.put(url, data, { headers: this.headers }).map(
      data => { return data },
      err => { return err }
    );
  }

  getItemDetailsForSubBranches(item_id) {
    let url = this.baseUrl + "/api/v1/inventory/item/" + this.institute_id + "/" + item_id;
    return this.http.get(url, { headers: this.headers }).map(
      data => { return data },
      err => { return err }
    );
  }

  getAllSubBranchesInfo() {
    let url = this.baseUrl + '/api/v1/institutes/all/subBranches/' + this.institute_id;
    return this.http.get(url, { headers: this.headers }).map(
      data => { return data },
      err => { return err }
    );
  }

  getSubBranchItemInfo(dataId) {
    let url = this.baseUrl + '/api/v1/inventory/item/all/' + dataId;
    return this.http.get(url, { headers: this.headers }).map(
      data => { return data },
      err => { return err }
    );
  }

  allocateItemToSubBranch(data) {
    data.institution_id = this.institute_id;
    let url = this.baseUrl + '/api/v1/inventory/item/allocate/subBranch';
    return this.http.post(url, data, { headers: this.headers }).map(
      data => { return data },
      err => { return err }
    );
  }

  getInventoryItemHistory(item_id) {
    let url = this.baseUrl + "/api/v1/inventory/item/txHistory/" + item_id;
    return this.http.get(url, { headers: this.headers }).map(
      data => { return data },
      err => { return err }
    )
  }

}
