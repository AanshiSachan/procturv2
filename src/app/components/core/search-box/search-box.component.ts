import { Component, OnInit, OnChanges, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'search-box',
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, OnChanges {
    
    searchResult: any[] = [];
    @Input() searchValue: any;
    @Input() studentResult: any[] = [];
    @Input() enquiryResult: any[] = [];
    @Output() closeSearch = new EventEmitter<any>();

    constructor(private router: Router, private cd: ChangeDetectorRef, private renderer: Renderer2, private eRef: ElementRef){
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.studentResult;
        this.enquiryResult;
        this.updateResult();

    }

    @HostListener("document:click", ['$event'])
    onWindowClick(event) {
      if(this.eRef.nativeElement.contains(event.target)) {
      } else {
        if(!event.target.classList.contains('search-item')){
            this.closeSearch.emit(false);
        }
      }
    }

    updateResult(){
        this.searchResult = this.studentResult.concat(this.enquiryResult);
    }
    
}