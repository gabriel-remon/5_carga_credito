import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { user } from 'src/app/models/users.model';
import { FirebaeService } from 'src/app/services/firebae.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  form = new FormGroup({
    uid: new FormControl("",),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(5)]),
    name: new FormControl("", [Validators.required])
  })

  firebaseSvc = inject(FirebaeService);
  utilsSvc = inject(UtilsService);

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading()
      await loading.present();

      this.firebaseSvc.register(this.form.value as user).then(async res => {

        await this.firebaseSvc.actualizarUsuario(this.form.value.name)

        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);
        this.setUserInfo(uid);

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

  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading()
      await loading.present();

      let path = `users/${uid}`
      delete this.form.value.password;

      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {

        this.utilsSvc.saveInLocalStorage("user", this.form.value)
        this.utilsSvc.routetLink("/main/home")
        this.form.reset()

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

  ngOnInit() {
  }
}
