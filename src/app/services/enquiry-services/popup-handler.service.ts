import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PopupHandlerService {

  private messageSource = new BehaviorSubject<string>('');
  
  constructor(){}

  /* Message variable */
  currentMessage = this.messageSource.asObservable();

  /* Function to update the message which can be read across multiple components */
  changeMessage(message: string){
    this.messageSource.next(message);
  }

}