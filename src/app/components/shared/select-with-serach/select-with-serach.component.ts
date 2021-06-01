import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-with-serach',
  templateUrl: './select-with-serach.component.html',
  styleUrls: ['./select-with-serach.component.scss']
})
export class SelectWithSerachComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  players = [
    {id: 1, playerName: 'Cristiano Ronaldo'},
    {id: 2, playerName: 'Lionel Messi'},
    {id: 3, playerName: 'Neymar Jr'},
    {id: 4, playerName: 'Toni Kroos'},
    {id: 5, playerName: 'Luiz Suarez', disabled: true},
    {id: 6, playerName: 'Karim Benzema'},
    {id: 7, playerName: 'Eden Hazard'},
  ];
  
}
