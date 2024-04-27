import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth,updateProfile,signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { user } from '../models/users.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore,setDoc,doc } from '@angular/fire/firestore';
import { getDoc } from 'firebase/firestore';
import { UtilsService } from './utils.service';


@Injectable({
  providedIn: 'root'
})
export class FirebaeService {

  auth = inject(AngularFireAuth);
  fireStorage = inject(AngularFirestore)
  utilSvc = inject(UtilsService)
  // ============= autentificacion===============

  getauth(){
    return getAuth()
  }

  //accede a los datos guardados en el email
  login(user:user){
    return signInWithEmailAndPassword(getAuth(),user.email,user.password)
  }

  //guarda un email y contrasña en firebase
  register(user:user){
    return createUserWithEmailAndPassword(getAuth(),user.email,user.password)
  }

  actualizarUsuario(displayName: string){
    return updateProfile(getAuth().currentUser,{displayName})
  }

  // envia email para restablecer contraseña
  sendRecoberyEmail(email:string){
    return sendPasswordResetEmail(getAuth(),email)
  }

  sigOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilSvc.routetLink('/auth');
  }

  // =============firestorage======================

  setDocument(path: string, data:any){
    return setDoc(doc(getFirestore(),path),data);
  }

  async getDocument(path:string){
    return (await getDoc(doc(getFirestore(),path))).data();
  }

  
}
