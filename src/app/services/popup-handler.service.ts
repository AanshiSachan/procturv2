import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PopupHandlerService {

  private messageSource = new BehaviorSubject<string>('');
  
  constructor(){}

  currentMessage = this.messageSource.asObservable();

  changeMessage(message: string){
    this.messageSource.next(message);
  }

}