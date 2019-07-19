import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from '../authenticator.service';
import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';

@Injectable()
export class TopicListingService {

  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;


  private drl = "assets/data.json";
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

  getSatndard() {
    let url = this.baseUrl + "/api/v1/standards/all/" + this.institute_id + "?active=Y"
    return this.http.get(url, { headers: this.headers }).map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    )
  }

  getSubject(obj) {
    let url = this.baseUrl + "/api/v1/subjects/standards/" + obj + "?active=Y"
    return this.http.get(url, { headers: this.headers }).map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    )
  }

  postTopic(obj) {
    let url = this.baseUrl + "/api/v1/topic_manager/add/" + this.institute_id;
    return this.http.post(url, obj, { headers: this.headers }).map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    )
  }

  getZeroLevelTopics(subject_id){
    let url = this.baseUrl + "/api/v1/topic_manager/add/" + this.institute_id +"/subjects/"+subject_id+"/topics";
    return this.http.get(url, { headers: this.headers }).map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    )
  }

  getAllTopicsSubTopics(subject_id){
    let url = this.baseUrl + "/api/v1/topic_manager/standards/-1/subjects/"+subject_id+"/topics";
    return this.http.get(url, { headers: this.headers }).map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    )
  }

  getSubTopics(parent_topic_id){
    let url = this.baseUrl + "/api/v1/topic_manager/subTopicList/" + this.institute_id +"/"+parent_topic_id;
    return this.http.get(url, { headers: this.headers }).map(
      data => {
        return data;
      },
      error => {
        return error;
      }
    )
  }

}
