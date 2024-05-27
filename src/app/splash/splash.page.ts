import { Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(public router:Router) { 
    setTimeout(()=>{
      this.router.navigateByUrl('auth');
    },10);
  }

  ngOnInit() {/*
    setTimeout(() => {
      this.router.navigateByUrl('main')
    }, 4000);*/
  }

}
