import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'rxjs/Rx';
import { AuthenticatorService } from "../authenticator.service";

@Injectable()
export class getSMSService {

    baseUrl: string = '';
    institute_id: string;
    Authorization: string;
    headers;


    /* set default value for each url, header and autherization on service creation */
    constructor(private http: HttpClient, private auth: AuthenticatorService, ) {
        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        this.baseUrl = this.auth.getBaseUrl();

    }

    getCamapignView(campaignID){
        ///StdMgmtWebAPI/api/v1/campaign/fetch/<Institute Id>/<campaign msg id>
        let campignViewURL =this.baseUrl + '/api/v1/campaign/fetch/'+this.institute_id+'/'+campaignID;
        return this.http.get(campignViewURL, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    // delete campign
    deleteCampaign(campaignID){
        let deleteURL =this.baseUrl + '/api/v1/campaign/delete/campaign/'+this.institute_id+'/'+campaignID;
        return this.http.delete(deleteURL, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    fetchCampainSMSReport(){
        let urlCampaign =this.baseUrl +'/api/v1/campaign/fetch/'+this.institute_id;
        return this.http.post(urlCampaign, {}, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )
    }

    fetchSmsReport(obj) {

        obj.from_date = obj.from_date == '' ? moment().format('YYYY-MM-DD') : moment(obj.from_date).format('YYYY-MM-DD');
        obj.to_date = obj.to_date == '' ? '' : moment(obj.to_date).format('YYYY-MM-DD');

        let urlSmsReport = this.baseUrl + "/api/v1/alerts/config/smsReport";

        return this.http.post(urlSmsReport, obj, { headers: this.headers }).map(
            res => {
                return res;
            },
            err => {
                return err;
            }
        )

    }

}