import { Directive, ElementRef, Renderer, HostListener } from '@angular/core';

@Directive({
  selector: "[enquiryInput]"
})
export class EnquiryInput {

  constructor(private el: ElementRef, private renderer: Renderer) { }

  /* When focus is removed and the value of tag is examined and class added accordingly */
  @HostListener('document:click', ['$event'])

  handleClick(event: Event) {
    this.el.nativeElement.addEventListener('blur', function (event) {
      if (event.target.value != '') {
        event.target.parentNode.classList.add('has-value');
      } else {
        event.target.parentNode.classList.remove('has-value');
      }
    });
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
    this.el.nativeElement.addEventListener('focusout', function (event) {
      if (event.target.nodeName == "INPUT") {
        if (event.target.value != '') {
          event.target.parentNode.classList.add('has-value');
        } else {
          event.target.parentNode.classList.remove('has-value');
        }
      }
    });

    this.el.nativeElement.addEventListener('click', function (event) {
      if (event.target.nodeName == "INPUT") {
        if (event.target.value != '') {
          event.target.parentNode.classList.add('has-value');
        } else {
          event.target.parentNode.classList.remove('has-value');
        }
      }
    });
  }
}