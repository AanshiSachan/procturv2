import { Directive, ElementRef, Renderer, HostListener, NgZone } from '@angular/core';

@Directive({
  selector: "[enquiryInput]"
})
export class EnquiryInput {

  constructor(private el: ElementRef, private renderer: Renderer, private zone: NgZone) { }

  /* When focus is removed and the value of tag is examined and class added accordingly */
  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {

    this.zone.runOutsideAngular(() => {
      this.el.nativeElement.addEventListener('blur', this.labelHandler.bind(this));
    });
  }


  labelHandler(event){
    if (event.target.value != '') {
      event.target.parentNode.classList.add('has-value');
      event.stopPropagation();
    } else {
      event.target.parentNode.classList.remove('has-value');
      event.stopPropagation();
    }
  }

}



@Directive({
  selector: "[enquiryDate]"
})
export class EnquiryDateInput {

  constructor(private el: ElementRef, private renderer: Renderer) { }

  /* When focus is removed and the value of tag is examined and class added accordingly */
  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {

    /* function to add remove has-value class */
    this.el.nativeElement.childNodes[1].addEventListener('blur', function (event) {
      if (event.target.value != '') {
        event.target.parentNode.classList.add('has-value');
      } else {
        event.target.parentNode.classList.remove('has-value');
      }
    });
  }
}