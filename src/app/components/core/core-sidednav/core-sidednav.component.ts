import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'core-sidednav',
  templateUrl: './core-sidednav.component.html',
  styleUrls: ['./core-sidednav.component.scss']
})
export class CoreSidednavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  setActive(ev){
    let id = ev.srcElement.id;
    
    if(id === 'lione' || id === 'li1'){
      id = 'lione';
      document.getElementById('lione').classList.add('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');                        
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('liten').classList.remove('active');                        
    }
    else if(id === 'litwo' || id === 'li2'){
      id = 'litwo';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.add('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');                        
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('liten').classList.remove('active');                        
    } 
  }

}
