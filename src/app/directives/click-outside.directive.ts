import {Directive, ElementRef,Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
  selector: '[clickout]'
})

export class ClickOutside{

  constructor(private ref: ElementRef) {}

}
