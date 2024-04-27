import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { user } from 'src/app/models/users.model';
import { FirebaeService } from 'src/app/services/firebae.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email : new FormControl("",[Validators.required,Validators.email]),
    password : new FormControl("",[Validators.required,Validators.minLength(5)])
  })

  firebaseSvc = inject(FirebaeService);
  utilsSvc = inject(UtilsService);

  async submit(){
    if(this.form.valid){
      const loading = await this.utilsSvc.loading()
      await loading.present();

      this.firebaseSvc.login(this.form.value as user).then(res=>{
        
        this.getUserInfo(res.user.uid)

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


  async getUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading()
      await loading.present();

      let path = `users/${uid}`
     
      this.firebaseSvc.getDocument(path).then((res:user)  => {

        this.utilsSvc.saveInLocalStorage("user", res)
        this.utilsSvc.routetLink("/main/home")
        this.form.reset();

        this.utilsSvc.presentToast({
          message: `te damos la bienvenida ${res?.name}`,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'person-circle-outline'
        })

      }).catch(err => {
        console.log(err);

        this.utilsSvc.presentToast({
          message: err.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })
      }).finally(() => {
        loading.dismiss()
      })
    }

  }


  acceso1(){
    this.form.controls['email'].setValue("adminjuan@gmail.com")
    this.form.controls['password'].setValue("admin1")
  }
  acceso2(){
    this.form.controls['email'].setValue("adminpepe@gmail.com")
    this.form.controls['password'].setValue("admin2")
  }
  acceso3(){
    this.form.controls['email'].setValue("adminluis@gmail.com")
    this.form.controls['password'].setValue("admin3")
  }

  ngOnInit() {
  }

}
