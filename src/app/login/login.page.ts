import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidator } from '../Utility/PasswordValidator';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ApiService } from '../services/api.service';
import { Network } from '@ionic-native/network/ngx';

//import {  RequestOptions } from 'selenium-webdriver/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

url: string = "http://laraveldevelopers.website/dev21/uhk/public/api/add-device-id";
result = null;
inputEmail: string = "";
inputPassword: string = "";
rePassword: string = "";

showLoader = false

UUID = null;

	validation_messages = {

	'username': [
		{ type: 'required', message: 'Username is required.' },
		{ type: 'minlength', message: 'Username must be at least 5 characters long.' },
		{ type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
		{ type: 'pattern', message: 'Entervalid email Id' },
		{ type: 'validUsername', message: 'Your username has already been taken.' },

	],
  
	
	'name': [
		{ type: 'required', message: 'Name is required.' }, {type: 'minlength', message: 'Username must be at least 5 characters long.'},
		{type: 'maxlength', message: 'Username cannot be more than 25 characters long.'}
	],
	'email': [
		{ type: 'required', message: 'Email is required.' }, { type: 'pattern', message: 'Enter valid email Id' }
	],
	'phone': [
		{ type: 'required', message: 'Enter phone no.' }, { type: 'minlength', message: 'Phone must be at least 10 digit.' },
		
	],

}

	myform : FormGroup; 

ngOnInit() {
  
  }

 constructor(private http: HttpClient, private router: Router, private alertCtrl: AlertController, private toastController: ToastController, formBuilder: FormBuilder, private uniqueDeviceId: UniqueDeviceID, private apiService: ApiService, private network: Network ) { 

  this.network.onConnect().subscribe(() => {
    console.log("connected");
   

    // watch network for a disconnect
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
     
    });
    
  });
	
 	this.myform = formBuilder.group({
		name: new FormControl('' , [Validators.required, Validators.minLength(5), Validators.maxLength(25)]),
 		email: new FormControl('', [Validators.required, Validators.pattern(".+\@.+\..+")]),
 		phone: new FormControl('', [Validators.required])
   })
   
   this.uniqueDeviceId.get()
   .then((uuid: any) => this.UUID = uuid)
   .catch((error: any) => alert(error));
 }



 logForm(){
	 if(this.apiService.getNetworkStatus){
    this.sendPostRequest();
   }else{
     this.presentToast("Please check your internet connection!");
   }
 } 

 /* To show alertDialog */
  async presentAlert(mess: string) {
    const alert = await this.alertCtrl.create({
    message: mess,
    subHeader: 'Dialog',
    buttons: ['Dismiss']
   });
   await alert.present(); 
  }

/* To show toast message */
  async presentToast(mess: string) {
    const toast = await this.toastController.create({
      message: mess,
      duration: 1000
    });
    toast.present();
  }

  /* Api Call */
  sendPostRequest() {
  this.showLoader = true
   // var headers = new Headers();
   //alert(this.myform.value.name+" "+ this.myform.value.email+" "+this.myform.value.phone)
   console.log(this.myform.value.name+" "+ this.myform.value.email+" "+this.myform.value.phone);

    let postData = {
            "username": this.myform.value.name,
            "email": this.myform.value.email,
            "phone": this.myform.value.phone,
            "device_id": this.UUID
            //"device_id": "6653f6bc-22d6-56d4-3582-400511111108"
    }
    this.apiService.ApiCall('POST',this.url, postData).subscribe(data =>{
      let response = JSON.parse(JSON.stringify(data));
        if(response.Ack === 1){
          this.showLoader = false;
          let navigationExtra : NavigationExtras = {
            state : {
              cmsId: 1
            }
          }
          this.router.navigate(['/home1'], navigationExtra);
        }else if(response.Ack === 0){
          this.showLoader = false;
          this.presentToast(data['message']);
        }
       }, error => {
         this.showLoader = false;
        this.presentToast(error);
        console.log(error);
    });
  }
}
