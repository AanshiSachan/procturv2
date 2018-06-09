import { Directive , ElementRef , Renderer, HostListener } from '@angular/core';

@Directive({
    selector:"[courseInput]"
  })

  export class CourseInput { 

    constructor(private el: ElementRef, private renderer: Renderer) {}

    /* When focus is removed and the value of tag is examined and class added accordingly */
    @HostListener('document:click', ['$event'])
    handleClick(event: Event) {
      this.el.nativeElement.addEventListener('blur', function(event){
        if (event.target.value != '') {
          event.target.parentNode.classList.add('has-value');
        } else {
          event.target.parentNode.classList.remove('has-value');
        }
      });
    }
  }