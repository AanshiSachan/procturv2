import { Component, OnInit, OnChanges, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { LoginService } from '../../../services/login-services/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'input-box',
    templateUrl: './input-box.component.html',
    styleUrls: ['./input-box.component.scss']
})
export class SearchBoxComponent implements OnInit, OnChanges {
    
    @Output() value = new EventEmitter<any>();

    constructor(private router: Router, private cd: ChangeDetectorRef, private renderer: Renderer2, private eRef: ElementRef){
    }

    ngOnInit() {
    }

    ngOnChanges() {

    }

    // @HostListener("document:click", ['$event'])
    // onWindowClick(event) {
    //   if(this.eRef.nativeElement.contains(event.target)) {
    //   } else {
    //     if(!event.target.classList.contains('search-item')){
    //         this.closeSearch.emit(false);
    //     }
    //   }
    // }
    
}