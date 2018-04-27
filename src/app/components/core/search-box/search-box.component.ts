import { Component, OnInit, OnChanges, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'search-box',
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, OnChanges {

    private searchResult: any[] = [];

    private recentlySearched = new Set;

    @Input() searchValue: any;

    @Input() studentResult: any[] = [];
    @Input() enquiryResult: any[] = [];
    @Input() resultStat: any = 1;

    @Output() closeSearch = new EventEmitter<any>();
    @Output() searchAgain = new EventEmitter<string>();
    @Output() enqSelected = new EventEmitter<any>();
    @Output() stuSelected = new EventEmitter<any>();
    @Output() viewAll = new EventEmitter<any>();
    

    constructor(private router: Router, private cd: ChangeDetectorRef, private renderer: Renderer2, private eRef: ElementRef) {
    }

    ngOnInit() {

        if (sessionStorage.getItem('recentSearch') != null && sessionStorage.getItem('recentSearch') != undefined && sessionStorage.getItem('recentSearch') != '' && this.recentlySearched.size == 0 && sessionStorage.getItem('recentSearch') != '{}') {
            this.recentlySearched = JSON.parse(sessionStorage.getItem('recentSearch'));
        }
    }

    ngOnChanges() {
        this.studentResult;
        this.enquiryResult;
        this.searchValue;
        this.updateResult();
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
            if(this.recentlySearched.size <= 10){
                this.recentlySearched.add(this.searchValue);
                sessionStorage.setItem('recentSearch', JSON.stringify(this.recentlySearched));
            }
            else{
                this.recentlySearched.delete(this.recentlySearched[0]);
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

    deleteRecent(rs){
        this.recentlySearched.delete(rs);
    }


    fullView(id){
        console.log(id);
        this.viewAll.emit(id);
    }

}