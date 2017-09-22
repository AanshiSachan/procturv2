import { Directive , ElementRef , Renderer, HostListener } from '@angular/core';

@Directive({
    selector:"[formInput]"
  })

  export class FormInput { 

    constructor(private el: ElementRef, private renderer: Renderer) {
        console.log(renderer.listen);
    }

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