import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoaderHandlingService {

  private loaderSource = new BehaviorSubject<boolean>(false);

  constructor(){}
  
  currentLoad = this.loaderSource.asObservable();

  /* Function to update the message which can be read across multiple components */
  changeLoaderStatus(progress: boolean){
    this.loaderSource.next(progress);
  }
}