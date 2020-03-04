import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticatorService } from '../../../services/authenticator.service';


@Injectable()
export class FileService {

    baseUrl: string = '';
    Authorization: any;
    headers;
    institute_id;
    storageData: any = {
        storage_allocated: 10,
        uploaded_size: 1,
        width: 1
    }
    constructor(
        private http: HttpClient,
        private auth: AuthenticatorService) {
        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        this.baseUrl = this.auth.getBaseUrl();
    }
}
