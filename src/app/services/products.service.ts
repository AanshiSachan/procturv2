import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

/** created by laxmi */
@Injectable()
export class ProductService {


    urls: any = {
        // //test
        // siteUrl:"http://localhost:8080",
        // apiBaseUrl:"http://localhost:8080",
        siteUrl: "https://elearntest.proctur.com/api",
        apiBaseUrl: "https://elearntest.proctur.com/api/v1/",
        apiAdminUrl: "http://proc-product-api.us-east-2.elasticbeanstalk.com/prod/", //"http://localhost:8080/prod/",
        masterSiteUrl: "https://elearntest.proctur.com/api/master/site_master/",
        enquryUrl: "https://app.proctur.com/StdMgmtWebAPI/api/v1/extLeads/website",

        // prod
        // siteUrl: "https://elearn.proctur.com/api",
        // apiBaseUrl: "https://elearn.proctur.com/api/v1/",
        // apiAdminUrl: "https://elearn.proctur.com/api/v1/admin/",
        // masterSiteUrl: "https://elearn.proctur.com/api/master/site_master/",
        // enquryUrl: "https://app.proctur.com/StdMgmtWebAPI/api/v1/extLeads/website",

    }

    subscription: any;

    header: HttpHeaders = new HttpHeaders({
        "Content-Type": "application/json",
        // 'X-Platform': 'web',
        "x-prod-inst-id": '100058',
        "x-prod-user-id": 'zin'
    });
    constructor(
        private _http: HttpClient
    ) {

    }

    createHeader(type) {
        // this.headerJson['x-prod-inst-id'] = '100058';
        // this.headerJson['x-prod-user-id'] = 'zin';
        // if (window.sessionStorage) {
        //     if (sessionStorage.getItem('userCreadentials') != null) {
        //         let obj = JSON.parse(sessionStorage.getItem('userCreadentials'));

        //     }

        //     if (sessionStorage.getItem('siteScreadentials') != null) {
        //         let obj = JSON.parse(sessionStorage.getItem('siteScreadentials'));
        //         this.headerJson['X-Access-Token'] = obj['portal_access_token'];
        //     }
        // }
        // let headers: HttpHeaders = new HttpHeaders(this.headerJson);
        // return headers;
    }

    searchMethod(method, url, body, params, plateform) {
        let fullUrl = this.urls.apiAdminUrl + url;
        let _httpRequest = new HttpRequest(method, fullUrl, body, {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                // 'X-Platform': 'web',
                "x-prod-inst-id": '100058',
                "x-prod-user-id": 'zin'
            }),
            params: params,
            responseType: 'json',
            reportProgress: true,
            withCredentials: false
        });
        return new Promise((resolve, reject) => {
            if (this.subscription) {
                //   resolve('');
                this.subscription.unsubscribe();
            }

            this.subscription = this._http.request(_httpRequest).subscribe(
                data => {
                    if (data['statusText'] == "OK" && data["body"]) {
                        resolve(data);
                    }
                },
                error => {
                    reject(error);
                });
        });
    }

    // for search method 
    getData(url, plateform = 'web') {
        return this._http.get(url, { headers: this.header }).map(
            data => {
                return data;
            },
            err => {
                return err;
            }
        )
    }

    callMethods(method, url, body, params, plateform) {
        let fullUrl = this.urls.apiAdminUrl + url;
        let _httpRequest = new HttpRequest(method, fullUrl, body, {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                // 'X-Platform': 'web',
                "x-prod-inst-id": '100058',
                "x-prod-user-id": 'zin'
            }),
            params: params,
            responseType: 'json',
            reportProgress: true,
            withCredentials: false
        });
        return new Promise((resolve, reject) => {
            this._http.request(_httpRequest).subscribe(
                data => {
                    if (data['statusText'] == "OK" && data["body"]) {
                        resolve(data);
                    }
                },
                error => {
                    reject(error);
                });
        });
    }

    patchMethod(url, body, plateform = 'web') {
        return new Promise((resolve, reject) => {
            this.callMethods('PATCH', url, body, null, plateform)
                .then(
                    (data) => {
                        resolve(data);
                    },
                    (err) => {
                        reject(err);
                    }
                );
        });
    }

    deleteMethod(url, plateform = 'web') {
        return new Promise((resolve, reject) => {
            this.callMethods('DELETE', url, null, null, plateform)
                .then(
                    (data) => {
                        resolve(data);
                    },
                    (err) => {
                        reject(err);
                    }
                );
        });
    }

    postMethod(url, body, plateform = 'web') {
        return new Promise((resolve, reject) => {
            this.callMethods('POST', url, body, null, plateform)
                .then(
                    (data) => {
                        resolve(data);
                    },
                    (err) => {
                        reject(err);
                    }
                );
        });
    }

    getMethodWithoutParam(url, plateform) {
        return new Promise((resolve, reject) => {
            this.callMethods('GET', url, null, null, plateform)
                .then(
                    (data) => {
                        resolve(data);
                    },
                    (err) => {
                        reject(err);
                    }
                );
        });
    }

    getMethod(url, params, plateform = 'web') {
        if (params) {
            url = url + '?';
            let keysArray = Object.keys(params);
            for (let i = 0; i < keysArray.length; i++) {
                url = url + keysArray[i] + '=' + params[keysArray[i]];
                if (i <= keysArray.length - 2) {
                    url = url + '&';
                }
            }
        }
        url=  this.urls.apiAdminUrl + url;
        return this._http.get(url, {
            headers: {
                "Content-Type": "application/json",
                // 'X-Platform': 'web',
                "x-prod-inst-id": '100058',
                "x-prod-user-id": 'zin'
            }
        }).map(
            data => {
                return data;
            },
            err => {
                return err;
            }
        )

    }

    putMethod(url, body, plateform = 'web') {
        return new Promise((resolve, reject) => {
            this.callMethods('PUT', url, body, null, plateform)
                .then(
                    (data) => {
                        resolve(data);
                    },
                    (err) => {
                        reject(err);
                    }
                );
        });
    }

}
