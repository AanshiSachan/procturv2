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

    if(id.substring(0,2) === "li"){
      this.toggler(id);
    }
    else{
      let x = document.getElementById(id).parentElement.id;
      if(x.substring(0,2) === "li"){
        this.toggler(x);
      }
      else{
        x = document.getElementById(x).parentElement.id;
        if(x.substring(0,2) === "li"){
          this.toggler(x);
        }
        else{
          x = document.getElementById(x).parentElement.id;
          this.toggler(x);
        }
      }
    }

  }

  toggler(id){
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
      document.getElementById('lieleven').classList.remove('active');                      
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
      document.getElementById('lieleven').classList.remove('active');                     
    }
    else if(id === 'lithree' || id === 'li3'){
      id = 'lithree';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.add('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');                        
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('liten').classList.remove('active'); 
      document.getElementById('lieleven').classList.remove('active');                       
    }
    else if(id === 'lifour' || id === 'li4'){
      id = 'lifour';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.add('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');                        
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('liten').classList.remove('active'); 
      document.getElementById('lieleven').classList.remove('active');                       
    }
    else if(id === 'lifive' || id === 'li5'){
      id = 'lifive';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.add('active');
      document.getElementById('lisix').classList.remove('active');                        
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('liten').classList.remove('active');
      document.getElementById('lieleven').classList.remove('active');                        
    } 
    else if(id === 'lisix' || id === 'li6'){
      id = 'lisix';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.add('active');                        
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('liten').classList.remove('active');  
      document.getElementById('lieleven').classList.remove('active');                      
    }
    else if(id === 'liseven' || id === 'li7'){
      id = 'liseven';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');                        
      document.getElementById('liseven').classList.add('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('liten').classList.remove('active');  
      document.getElementById('lieleven').classList.remove('active');                      
    }
    else if(id === 'lieight' || id === 'li8'){
      id = 'lieight';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');                        
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.add('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('liten').classList.remove('active'); 
      document.getElementById('lieleven').classList.remove('active');                       
    }
    else if(id === 'linine' || id === 'li9'){
      id = 'linine';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');                        
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.add('active');
      document.getElementById('liten').classList.remove('active');                        
      document.getElementById('lieleven').classList.remove('active');
    }
    else if(id === 'liten' || id === 'liX'){
      id = 'liten';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');                        
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('liten').classList.add('active');
      document.getElementById('lieleven').classList.remove('active');                 
    }
    else if(id === 'lieleven' || id === 'li11'){
      id = 'lieleven';
      document.getElementById('lione').classList.remove('active');
      document.getElementById('litwo').classList.remove('active');
      document.getElementById('lithree').classList.remove('active');
      document.getElementById('lifour').classList.remove('active');
      document.getElementById('lifive').classList.remove('active');
      document.getElementById('lisix').classList.remove('active');                        
      document.getElementById('liseven').classList.remove('active');
      document.getElementById('lieight').classList.remove('active');
      document.getElementById('linine').classList.remove('active');
      document.getElementById('liten').classList.remove('active');
      document.getElementById('lieleven').classList.add('active');
    }
  }

}
