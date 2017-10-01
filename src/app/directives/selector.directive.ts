import { Directive, ElementRef , Renderer, HostListener } from '@angular/core';

@Directive({
  selector: '[Iselector]'
})
export class SelectorDirective {

  constructor(private el: ElementRef, private renderer: Renderer) {  
  }

  @HostListener('document:click', ['$event'])
  handleClick(elm: Event) {
    this.el.nativeElement.addEventListener('focus', function(elm){
      if (elm.tagName == 'SELECT'){
        var allOptions = elm.getElementsByTagName('option');
        var allreadyCustomDropDown = elm.parentNode.querySelector('.customDropdown');
        if (allreadyCustomDropDown != null){
            allreadyCustomDropDown.remove();
        }
        if (allOptions.length > 0) {
            var listWrapper = document.createElement('ul');
            listWrapper.classList.add('customDropdown');
            for (var i = 0; i < allOptions.length; i++) {
                var list = document.createElement('li');
                list.innerHTML = allOptions[i].innerHTML;
                listWrapper.appendChild(list);
            }
            elm.parentNode.appendChild(listWrapper);
            elm.parentNode.classList.add('customSelectWrapper');
/*             listWrapper.querySelectorAll('li').forEach(function(liList) {
                liList.addEventListener('click', function() {
                    liList.parentNode.parentNode.querySelector('.form-ctrl').value = liList.innerHTML;
                    liList.parentNode.parentNode.classList.add('has-value');
                    liList.parentNode.classList.remove('visibleDropdown');
                    liList.parentNode.parentNode.querySelector('.form-ctrl').style.opacity = 1;
                })
            }) */
        }
    }
    });
  }

}
