import { Component} from '@angular/core';

@Component({
  selector: 'campaign-pop-up',
  templateUrl: './campaign-pop-up.component.html',
  styleUrls: ['./campaign-pop-up.component.scss']
})
export class CampaignPopUpComponent{

  constructor() { }

  /* Customiized click detection strategy */
  inputClicked() {
    var nodelist = document.querySelectorAll('.form-ctrl');
    [].forEach.call(nodelist, (elm) => {
      elm.addEventListener('blur', function (event) {
        if (event.target.value != '') {
          event.target.parentNode.classList.add('has-value');
        } else {
          event.target.parentNode.classList.remove('has-value');
        }
      });
    });

    /* var dropdowns = document.getElementsByClassName("bulk-dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    } */

  }

}
