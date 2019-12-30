import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from './authenticator.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class HttpService {

  public routeList = [];
  baseUrl: string = '';
  Authorization: any;
  headers: any;
  institute_id: any;
  private dataSource = new BehaviorSubject<String>(null);
  data = this.dataSource.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthenticatorService,
  ) {
    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    })
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.baseUrl = this.auth.getBaseUrl();

  }

  updatedDataSelection(type: String){
    this.dataSource.next(type);
  }

  getData(objecturl) {
    let url = this.baseUrl + objecturl;
    return this.http.get(url, { headers: this.headers }).map(
      data => {
        return data;
      },
      err => {
        return err;
      }
    )
  }

  postData(objecturl, obj) {
    let url = this.baseUrl + objecturl;
    return this.http.post(url, obj, { headers: this.headers }).map(
      data => {
        return data;
      },
      err => {
        return err;
      }
    )
  }

  putData(objecturl, obj) {
    let url = this.baseUrl + objecturl;
    return this.http.put(url, obj, { headers: this.headers }).map(
      data => {
        return data;
      },
      err => {
        return err;
      }
    )
  }

  deleteData(objecturl, obj) {
    let url = this.baseUrl + objecturl;
    let object = {
      headers: this.headers,
      body: obj
    }
    return this.http.delete(url, object).map(
      data => {
        return data;
      },
      err => {
        return err;
      }
    )
  }

  downloadRecording(objecturl, file_type) {
    let url = this.baseUrl + objecturl;
    let headers = new HttpHeaders({ "Content-Type": file_type, "Authorization": this.Authorization });
    return this.http.get(url, { headers: headers , "responseType": 'blob'}).map(
      data => {
        return data;
      },
      err => {
        return err;
      }
    )
  }

}
