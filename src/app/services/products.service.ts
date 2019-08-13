import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';

/** created by laxmi */
@Injectable()
export class ProductService {


    urls: any = {
        // //test
        // siteUrl:"http://localhost:5200/api",
        // apiBaseUrl:"http://localhost:5200/api/v1/",
        siteUrl: "https://elearntest.proctur.com/api",
        apiBaseUrl: "https://elearntest.proctur.com/api/v1/",
        apiAdminUrl: "https://elearntest.proctur.com/api/v1/admin/",
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
    headerJson: any = {
        "Content-Type": "application/json",
        // 'X-Platform': 'web',
        "X-Access-Token": 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjo1MSwiaW5zdGl0dXRlX2lkIjo5OTk5OTksImlhdCI6MTUzOTg1OTM2MX0.vhVUlNyp0HgLViatCVA78rijiXA2mnlIptOeYmJolQA',
        "X-Auth-Token": 'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjBlWEJsSWpvaVlXUnRhVzRpTENKaFpHMXBibDlwWkNJNk1URXNJbUZqWTI5MWJuUmZhV1FpT2pVeExDSmxiV0ZwYkY5cFpDSTZJbXRqWVdkMWNuVTVPVUJuYldGcGJDNWpiMjBpTENKcFlYUWlPakUxTXprNE5qVTROVGQ5LjM3eGlDeUtnZUlTa2FWSHRhZGpSYmxnMVZxcXR3N0xnRDlKS3F1LVJyLTQ='
    }

    constructor(
        private _http: HttpClient
    ) { }

    createHeader(type) {
        this.headerJson['X-Platform'] = type;
        if (window.sessionStorage) {
            if (sessionStorage.getItem('userCreadentials') != null) {
                let obj = JSON.parse(sessionStorage.getItem('userCreadentials'));
                this.headerJson['X-Auth-Token'] = obj['session_token'];
            }

            if (sessionStorage.getItem('siteScreadentials') != null) {
                let obj = JSON.parse(sessionStorage.getItem('siteScreadentials'));
                this.headerJson['X-Access-Token'] = obj['portal_access_token'];
            }
        }
        let headers: HttpHeaders = new HttpHeaders(this.headerJson);
        return headers;
    }

    searchMethod(method, url, body, params, plateform) {
        let fullUrl = this.urls.apiAdminUrl + url;
        let _httpRequest = new HttpRequest(method, fullUrl, body, {
            headers: this.createHeader(plateform),
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
        return new Promise((resolve, reject) => {
            this.searchMethod('GET', url, null, null, plateform)
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

    callMethods(method, url, body, params, plateform) {
        let fullUrl = this.urls.apiAdminUrl + url;
        let _httpRequest = new HttpRequest(method, fullUrl, body, {
            headers: this.createHeader(plateform),
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
