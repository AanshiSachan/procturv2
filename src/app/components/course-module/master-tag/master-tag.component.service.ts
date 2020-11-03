
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from '../../../../app/services/authenticator.service'

@Injectable()
export class MasterTagService{
    baseUrl: string = '';
    instituteId: string = '';
    Authorization: string;
    headers;

    constructor(private http: HttpClient, private auth: AuthenticatorService) {
        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders(
                { "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.instituteId = id;
        });
        this.baseUrl = this.auth.getBaseUrl();
      
    }
    //fetch all tags present in institute
    fetchAllMasterTags(){
        let url = this.baseUrl +'/api/v2/tag_master/getAll/' + this.instituteId;
        return this.http.get(url, {headers: this.headers}).pipe(
        map(resp =>{
            return resp;
        },error =>{
            return error;
        }))
    }
   //fetch won the basis of  tagId
    fetchTagDetails(id){
        let url = this.baseUrl + '/api/v2/tag_master/getTagDetails/' + this.instituteId + '/' + id;
        return this.http.get(url, {headers: this.headers}).pipe(
        map(resp =>{
            return resp;
        },error =>{
            return error;
        }))
    }
    // add tag in institute
    addMasterTagInInstitute(payload){
        let url = this.baseUrl + '/api/v2/tag_master/create';
        return this.http.post(url, payload, {headers: this.headers}).pipe(
        map(resp =>{
            return resp;
        },error =>{
            return error;
        }))
        
    }
    // update tag
    updateTagDetails(payload){
        let url = this.baseUrl +'/api/v2/tag_master/update';
        return this.http.put(url, payload, {headers:this.headers}).pipe(
        map(resp =>{
            return resp;
        }, err =>{
            return err;
        }))
    }

    //delete tag based on tag id
    deleteTagDetails(tagId){
        let url = this.baseUrl +'/api/v2/tag_master/delete/'+ this.instituteId + '/'+ tagId;
        return this.http.delete(url, { headers: this.headers}).pipe(
        map(resp => {
            return resp;
        }, err=>{
            return err;
        }))
    }
}