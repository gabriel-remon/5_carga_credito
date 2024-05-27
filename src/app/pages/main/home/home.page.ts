import { Component, OnInit, inject } from '@angular/core';
import { FirebaeService } from 'src/app/services/firebae.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaeService)
  utilSvc = inject(UtilsService)
  user;
  qrActual = "";
  creditoActual = 0;
  tipoCuenta = "admin"
  qrCargados = [[], []]
  qrValidos:[string[],number[]] = [[
    "8c95def646b6127282ed50454b73240300dccabc", //= 10
    "ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172", //= 50
    "2786f4877b9091dcad7f35751bfcf5d5ea712b2f" //= 100"
  ],
  [10, 50, 100]
  ]
  


  constructor(
    private plataform: Platform,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  ngOnInit(): void {
    this.user = this.utilSvc.getUser()
    console.log(this.user)
    if (this.plataform.is("capacitor")) {

      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners().then();

    }

    //funcion que carga los qr de la base de datos y calcula los puntos actuales
  }

  async scanQr() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: [],
        LensFacing: LensFacing.Back
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss()

    if (data) {
      this.qrActual = data?.barcode?.displayValue.strip()
      this.cargarCredito(this.qrActual)
    }
  }


  cargarCredito(qr: string) {
    this.qrValidos[0].forEach(async (value, index) => {
      if (qr == value) {
        const alert = await this.alertController.create({
          buttons: ['ok']
        })
        if (!this.qrCargados[0].includes(qr)) {
          const puntos :number = this.qrValidos[1][index]
          alert.header = "Se cargaron " + puntos + " puntos"
          this.qrCargados[0].push(this.qrValidos[0][index])
          this.creditoActual = this.creditoActual + puntos //cambiar por funcion que actualiza base de datos

        } else if (!this.qrCargados[1].includes(qr) && this.tipoCuenta == "admin") {
          const puntos :number = this.qrValidos[1][index]
          alert.header = "Se cargaron " + puntos + " puntos"
          this.qrCargados[1].push(this.qrValidos[0][index])
          this.creditoActual = this.creditoActual + puntos //cambiar por funcion que actualiza base de datos
        } else {
          alert.header = "el qr ya esta cargado"
          console.log("el qr ya esta cargado")
        }

        await alert.present();
        return;
      }
    })
  }

  singOut() {
    this.firebaseSvc.sigOut()
  }


  async limpiarPuntos(){
    this.qrCargados= [[],[]] //cambiar por funcion que impia en base de datos
    this.creditoActual =0
    const alert = await this.alertController.create({
      message: "Se borraron todos sus puntos",
      buttons: ['ok']
    })
    await alert.present()
  }

  /*
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Desbloquear alarma',
      message: 'Por favor ingrese su contraseña para desbloquear',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'contraseña',
        }],
      buttons: [{
        text: 'Aceptar',
        handler: (data) => {
          let passwordSave = this.utilSvc.getFrontLocalStorage('password').password;
          // Aquí puedes acceder a los valores ingresados por el usuario
          if (passwordSave == data.password) {
            this.alertCustom('alarma desbloqueada')
            Motion.removeAllListeners()
            this.titulo_alarma = "Alarma desactivada";
            this.estado_alarma = false;
          } else {
            this.alertCustom('contraseña incorrecta')
            this.audio5.play()
            this.flashActivate()
            this.vibrar()
            this.bloquearDetecionPorSegundos(5)
          }
        }
      }]
    });

    await alert.present();
  }
*/

}
