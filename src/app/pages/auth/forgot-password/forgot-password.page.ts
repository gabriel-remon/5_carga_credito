import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { user } from 'src/app/models/users.model';
import { FirebaeService } from 'src/app/services/firebae.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email : new FormControl("",[Validators.required,Validators.email])
  })

  firebaseSvc = inject(FirebaeService);
  utilsSvc = inject(UtilsService);

  async submit(){
    if(this.form.valid){
      const loading = await this.utilsSvc.loading()
      await loading.present();

      this.firebaseSvc.sendRecoberyEmail(this.form.value.email).then(res=>{
        
        this.utilsSvc.presentToast({
          message: "correo enviado con exito",
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'mail-outline'
        })

        this.utilsSvc.routetLink('/auth')
        this.form.reset()

      }).catch(err=>{
        console.log(err);

        this.utilsSvc.presentToast({
          message: err.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      }).finally(()=>{
        loading.dismiss()
      })
    }

  }




  ngOnInit() {
  }

}
