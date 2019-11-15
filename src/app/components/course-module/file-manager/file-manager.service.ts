import { Injectable, } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../../../services/authenticator.service";
import { Observable } from 'rxjs';

@Injectable()
export class FileManagerService {

    baseUrl: string = '';
    Authorization: any;
    headers;
    institute_id;

    constructor(private http: HttpClient, private auth: AuthenticatorService) {
        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });

        this.baseUrl = this.auth.getBaseUrl();
    }


    getAllFolderFiles(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/instFileSystem/getFolder"

        return this.http.post(url, obj, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    getUsedSpace(): Observable<any> {
        let url = this.baseUrl + "/api/v1/instFileSystem/getUsedSpace/" + this.institute_id;

        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    getCategories(): Observable<any> {
        let url = this.baseUrl + "/api/v1/instFileSystem/categories";

        return this.http.get(url, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }

    createFiles(obj): Observable<any> {
        let url = this.baseUrl + "/api/v1/instFileSystem/createFiles"

        return this.http.post(url, obj, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }

    deleteFiles(obj) {
        let url = this.baseUrl + "/api/v1/instFileSystem/deleteFolder"

        return this.http.post(url, obj, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }


    downloadFromAWS(url, file_id) {
        let ur = `${url}/api/v1/instFileSystem/downloadFile/${this.institute_id}/?fileId=${file_id}`;
        return this.http.get(ur, { headers: this.headers, responseType: 'text' }).map(
            res => { return res; },
            err => { return err }
        )
    }

    getAllStandards(){ 
        let url = this.baseUrl + "/api/v1/standards/all/" + this.institute_id + "?active=Y";
        return this.http.get(url , {headers:this.headers}).map(
            (data:any)=>{
                return data;
            },
            (error:any)=>{
                return error;
            }
        )
    }


    getSubjects(obj){
        let url=  this.baseUrl + "/api/v1/subjects/standards/" + obj + "?active=Y";
        return this.http.get(url , {headers:this.headers}).map(
            (data:any)=>{
                return data;
            },
            (error:any)=>{
                return error;
            }
        )
    }

    shareFileWithStudents(obj){
        let url = this.baseUrl + "/api/v1/fileShare/students" ; 
        return this.http.post(url , obj , {headers:this.headers}).map(
            (data:any)=>{
                return data;
            },
            (error:any)=>{
                return error;
            }
        )
    }

    shareFileWithBatches(obj){
        let url = this.baseUrl + "/api/v1/fileShare/batches" ; 
        return this.http.post(url, obj , {headers:this.headers}).map(
            (data:any)=>{
                return data;
            },
            (error:any)=>{
                return error;
            }
        )
    }

    shareFile(obj){
        let url = this.baseUrl + "/api/v1/fileShare";
        return this.http.put(url , obj  , {headers:this.headers}).map(
            (data:any)=>{
                return data;
            },
            (error:any)=>{
                return error;
            }
        )
    }

    editFileShare(obj){
        let url = this.baseUrl + "/api/v1/fileShare";
        return this.http.post(url , obj  , {headers:this.headers}).map(
            (data:any)=>{
                return data;
            },
            (error:any)=>{
                return error;
            }
        )
    }

    courseMapping(){
        let url = this.baseUrl + "/api/v1/institute/courseMapping/" + this.institute_id;
        return this.http.get(url , {headers:this.headers}).map(
            (data:any)=>{
                return data;
            },
            (error:any)=>{
                return error;
            }
        )
    }


    craeteFolder(obj){
        let url=this.baseUrl + "/api/v1/instFileSystem/createFolder";
        return this.http.post(url , obj , {headers:this.headers}).map(
            (data:any)=>{
                return data;
            },
            (error:any)=>{
                return error;
            }
        )
    }


}
