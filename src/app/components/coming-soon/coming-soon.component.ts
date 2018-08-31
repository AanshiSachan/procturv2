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
    else {
    }
  }


}
