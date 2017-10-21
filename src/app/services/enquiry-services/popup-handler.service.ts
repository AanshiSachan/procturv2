import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PopupHandlerService {

  private messageSource = new BehaviorSubject<string>('');

  private rowDataSource = new BehaviorSubject<string>('');

  private actionButtonSource = new BehaviorSubject<boolean>(false);

  constructor(){}

  
  /* Message variable */
  currentMessage = this.messageSource.asObservable();
  
  currentRowJson = this.rowDataSource.asObservable();

  currentActionValue = this.actionButtonSource.asObservable();

  /* Function to update the message which can be read across multiple components */
  changeMessage(message: string){
    this.messageSource.next(message);
  }

  /* Function to update the user selected rowData to JSON.stringify */
  changeRowData(data: string){
    this.rowDataSource.next(data);
  }

  /* Function to update disable and enable action button */
  changeActionStatus(data: boolean){
    this.actionButtonSource.next(data);
  }

}