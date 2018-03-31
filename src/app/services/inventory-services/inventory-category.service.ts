import { Injectable } from '@angular/core';
import { AuthenticatorService } from '../authenticator.service';
import { AddCategory } from '../../model/inventory-category';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class InventoryCategoryService {

  baseUrl = '';
  Authorization: any;
  headers;

  constructor(
    private http: HttpClient,
    private auth: AuthenticatorService
  ) {
    this.Authorization = this.auth.getAuthToken();
    this.baseUrl = this.auth.getBaseUrl();
    this.headers = new HttpHeaders(
      { "Content-Type": "application/json", "Authorization": this.Authorization });
  } 

  // Getting all category list from server
  getCategoryList() {
    let institution_id = this.auth.getInstituteId();
    let url = this.baseUrl + '/api/v1/inventory/category/all/' + institution_id;
    return this.http.get(url , { headers: this.headers }).map(
      success => {
        return success;
      },
      err => {
        return err;
      }
    )
  }

  // Add new category to the category list
  setNewCategory(data: AddCategory) {
    data.institution_id = this.auth.getInstituteId();
    let url = this.baseUrl + '/api/v1/inventory/category';
    return this.http.post(url, data, { headers: this.headers }).map(
      success => {
        return success;
      },
      err => {
        return err;
      }
    );
  }

  // to update the existing row
  updateExisting(data: any){

    let url = this.baseUrl + '/api/v1/inventory/category';
    return this.http.put(url, data, { headers: this.headers }).map(
      success => {
        return success;
      },
      err => {
        return err;
      }
    );
  }

}
