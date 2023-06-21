import { Component, NgModule, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})



export class PagesComponent implements OnInit {
  public linkTheme = document.querySelector('#theme');
  constructor() { }

  ngOnInit(): void {

    const url =  `./assets/css/colors/megna.css`;

    this.linkTheme?.setAttribute('href',url);

  }

  
}
