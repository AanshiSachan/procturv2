import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {

  constructor(private router: Router) {
    
      }
    
      ngOnInit() {
        if (sessionStorage.getItem('userid') == null) {
          this.router.navigate(['/authPage']);
        }
        else{
          this.removeFullscreen();
        }
      }
    
    
      removeFullscreen() {
        var header = document.getElementsByTagName('core-header');
        var sidebar = document.getElementsByTagName('core-sidednav');
        [].forEach.call(header, function (el) {
          el.classList.remove('hide');
        });
        [].forEach.call(sidebar, function (el) {
          el.classList.remove('hide');
        });
      }
    
    }
    