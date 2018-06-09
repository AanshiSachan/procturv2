import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AlertService {

    public messageList = new BehaviorSubject<any>('');

    public currentMessage = this.messageList.asObservable();

    constructor(private router: Router) {

    }

    changeErrorObject(key: string) {
        this.messageList.next(key);
    }

}