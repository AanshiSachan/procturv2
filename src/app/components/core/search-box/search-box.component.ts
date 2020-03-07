import { Component, OnInit, OnChanges, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { CommonServiceFactory } from '../../../services/common-service';

@Component({
    selector: 'search-box',
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, OnChanges {

    @Input() searchValue: any;
    @Input() studentResult: any[] = [];
    @Input() enquiryResult: any[] = [];
    @Input() resultStat: any = 1;

    @Output() closeSearch = new EventEmitter<any>();
    @Output() searchAgain = new EventEmitter<string>();
    @Output() enqSelected = new EventEmitter<any>();
    @Output() stuSelected = new EventEmitter<any>();
    @Output() actionSelected = new EventEmitter<any>();
    @Output() closeMenu = new EventEmitter<any>();
    @Output() viewAll = new EventEmitter<any>();
    private searchResult: any[] = [];
    private recentlySearched = new Set;
    hasStudent: boolean = false;
    hasEnquiry: boolean = false;
    isRippleLoad:boolean = false;

    constructor(
        private router: Router,
        private cd: ChangeDetectorRef,
        private renderer: Renderer2,
        private eRef: ElementRef,
        private log: LoginService,
        private _http: HttpService,
        private commonService: CommonServiceFactory
    ) {

        // this.auth.currentInstituteId.subscribe(id => {
        //     this.institute_id = id;
        //   });
    }

    ngOnInit() {
        if (sessionStorage.getItem('recentSearch') != null && sessionStorage.getItem('recentSearch') != undefined && sessionStorage.getItem('recentSearch') != '' && this.recentlySearched.size == 0 && sessionStorage.getItem('recentSearch') != '{}') {
            this.recentlySearched = JSON.parse(sessionStorage.getItem('recentSearch'));
        }

        this.log.currentPermissions.subscribe(e => {
            if (e != '' && e != null && e != undefined && e != []) {
                let perm = JSON.parse(sessionStorage.getItem('permissions'));
                if (perm != '' && perm != null && perm != undefined && perm != []) {
                    let permissionArray: any[] = perm;
                    let id = '115';
                    let id2 = '110';
                    let id3 = '301';
                    let id4 = '303';
                    if (permissionArray.indexOf(id) != -1 || permissionArray.indexOf(id2) != -1) {
                        this.hasEnquiry = true;
                        if (permissionArray.indexOf(id3) != -1) { // if Students-Manage Students assign give full access to cutome user --laxmi 
                            this.hasStudent = true;
                        }
                    }
                    else if (permissionArray.indexOf(id3) != -1 || permissionArray.indexOf(id4) != -1) {
                        this.hasStudent = true;
                    }
                }
            }
            else {
                this.hasEnquiry = false;
                this.hasStudent = false;
                let type = sessionStorage.getItem('userType');
                if (type == '0') {
                    this.hasEnquiry = true;
                    this.hasStudent = true;
                }
            }
        });
    }

    ngOnChanges() {
        this.studentResult;
        this.enquiryResult;
        this.searchValue;
        this.updateResult();
        this.studentResult.forEach((student)=>{
            student.thumbnail_url= student.thumbnail_url+ '?' + Math.random().toFixed(2);
            student.whatsapp_no = 'https://api.whatsapp.com/send?phone=+' + (student.country_calling_code) + '-' + (student.phone);
        });
        this.enquiryResult.forEach((enquiry)=>{
            enquiry.whatsapp_no = 'https://api.whatsapp.com/send?phone=+' + (enquiry.country_calling_code) + '-' + (enquiry.phone);
        });
    }

    @HostListener("document:click", ['$event'])
    onWindowClick(event) {
        if (this.eRef.nativeElement.contains(event.target)) {
        } else {
            if (!event.target.classList.contains('search-item')) {
                this.closeSearch.emit(false);
            }
        }
    }

    updateResult() {
        this.searchResult = this.studentResult.concat(this.enquiryResult);
        if (this.searchValue != null && this.searchValue != undefined) {
            if (this.recentlySearched.size <= 5) {
                this.recentlySearched.add(this.searchValue);
                sessionStorage.setItem('recentSearch', JSON.stringify(this.recentlySearched));
            }
            else {
                let value = this.recentlySearched.values();
                let del = value.next().value;
                this.recentlySearched.delete(del);
                this.recentlySearched.add(this.searchValue);
                sessionStorage.setItem('recentSearch', JSON.stringify(this.recentlySearched));
            }

        }
    }

    searchThisAgain(rs) {
        this.searchAgain.emit(rs);
    }

    studentSelected(s) {
        this.stuSelected.emit(s);
    }

    enquirySelected(e) {
        this.enqSelected.emit(e);
    }

    deleteRecent(rs) {
        this.recentlySearched.delete(rs);
    }

    fullView(id) {
        //console.log(id);
        this.viewAll.emit(id);
    }

    performAction(a: string, d) {
        sessionStorage.setItem('global_search_edit_student', 'true');
        switch (a) {
            case 'studentEdit': {
                let obj = {
                    action: a,
                    data: d
                }
                this.actionSelected.emit(obj);
                break;
            }
            case 'studentFee': {
                let obj = {
                    action: a,
                    data: d
                }
                this.actionSelected.emit(obj);
                break;
            }
            case 'studentInventory': {
                let obj = {
                    action: a,
                    data: d
                }
                this.actionSelected.emit(obj);
                break;
            }
            case 'studentLeave': {
                let obj = {
                    action: a,
                    data: d
                }
                this.actionSelected.emit(obj);
                break;
            }
            case 'studentDelete': {
                let obj = {
                    action: a,
                    data: d
                }
                this.actionSelected.emit(obj);
                break;
            }
            case 'studentReortCard': {
                // let obj = {
                //     action: a,
                //     data: d
                // }
                 console.log(d.id);
                 this.downloadStudentReportCard(d.id);
                break;
            }
            case 'enquiryEdit': {
                let obj = {
                    action: a,
                    data: d
                }
                this.actionSelected.emit(obj);
                break;
            }
            case 'enquiryUpdate': {
                let obj = {
                    action: a,
                    data: d
                }
                this.actionSelected.emit(obj);
                break;
            }

        }
    }


    downloadStudentReportCard(student_id) {
     this.isRippleLoad = true;
        let url='/api/v1/reports/Student/downloadReportCard/'+sessionStorage.getItem('institute_id') + '/' + student_id;
        this._http.getData(url).subscribe(
          (res: any) => {
            this.isRippleLoad = false;
            this.closeSearch.emit(false);
            this.closeMenu.emit(false);
            if(res.document!=""){
              let byteArr = this.commonService.convertBase64ToArray(res.document);
              let fileName = res.docTitle;
              let file = new Blob([byteArr], { type: 'application/pdf;charset=utf-8;' });
              let url = URL.createObjectURL(file);
              let dwldLink = document.getElementById('downloadFileClick1');
              dwldLink.setAttribute("href", url);
              dwldLink.setAttribute("download", fileName);
              document.body.appendChild(dwldLink);
              dwldLink.click();          
            }
            else{
              this.commonService.showErrorMessage('info', 'Info', "Document does not have any data.");
            }
          },
          err => {
            this.isRippleLoad = false;
            this.commonService.showErrorMessage('error', '', err.error.message);
          }
        )
       }
}