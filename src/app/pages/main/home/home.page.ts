import { Component, OnInit, inject } from '@angular/core';
import { FirebaeService } from 'src/app/services/firebae.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaeService)
  utilSvc = inject(UtilsService)

  ngOnInit() {
  }


  singOut(){
    this.firebaseSvc.sigOut()
  }
}
