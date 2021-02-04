import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, ToastController, Events } from '@ionic/angular';
import  { ApiService} from '../services/api.service';

import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login1',
  templateUrl: './login1.page.html',
  styleUrls: ['./login1.page.scss'],
})
export class Login1Page implements OnInit {

	result = null;
	url: string = 'http://laraveldevelopers.website/dev21/uhk/public/api/sales-login'

	inputUsername: string = "";
	inputEmail: string = "";
	inputPassword: string = "";

	showLoader = false

	myform: FormGroup;


validation_messages = {
	'username': [
		{ type: 'required', message: 'Username is required.' },
		{ type: 'minlength', message: 'Username must be at least 5 characters long.' },
		{ type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
		{ type: 'pattern', message: 'Entervalid email Id' },
		{ type: 'validUsername', message: 'Your username has already been taken.' },
    	{ type: 'validEmail', message: 'Enter valid email Id.' }
	],
  
	'email': [
		{ type: 'required', message: 'Email is required.' }, { type: 'pattern', message: 'Enter valid email Id' }
	],
	'password': [
		{ type: 'required', message: 'Password is required.' }, { type: 'minlength', message: 'Password must be at least 5 characters long.' }
	],	

}




  constructor(private router: Router, private alertCtrl: AlertController, private toastController: ToastController, formBuilder: FormBuilder, 
	private apiService: ApiService, private events: Events){

  	
  		this.myform = formBuilder.group({
  		username: new FormControl('', Validators.required),
 		//email: new FormControl('', [Validators.required, Validators.pattern(".+\@.+\..+")]),
 		password: new FormControl('' , [Validators.required, Validators.minLength(5)]),
 		/*pswRepeat: new FormControl('', [Validators.required, Validators.minLength(5)])*/
 	})

   }
   ngOnInit() {
}
   ionViewDidLoad(){ 
    
}

  go(){

  	console.log(this.inputEmail);

  	if(this.inputUsername == ""  || this.inputPassword =="" ){
  	 console.log('validated');
		/*this.presentToast(); */
		this.presentAlert('Field should not be empty');

  	}else if(this.inputUsername == 'uttam' && this.inputPassword == "12345"){
    
       this.router.navigate(['/name']);

    }else{
		this.presentToast('Wrong credentials')
	}
  }

  /* Alert Dialog */
  async presentAlert(mess: string) {
    const alert = await this.alertCtrl.create({
    message: mess,
    subHeader: 'Dialog',
    buttons: ['Dismiss']
   });

   await alert.present(); 
   
  }

  /* Toast message */
  async presentToast(mess: string) {
    const toast = await this.toastController.create({
      message: mess,
      duration: 1000
    });
    toast.present();
  }

  /* Api Call */
  sendPostRequest() {
	  if(this.apiService.getNetworkStatus){
		console.log("fcm token when api call "+ localStorage.getItem("fcm_token"));
		this.showLoader = true;
	 	let postData = {
			 "email": this.inputUsername,
			 "password": this.inputPassword,
			 "fcm_token": localStorage.getItem("fcm_token")
	 }

	 console.log(this.inputUsername+" , ", this.inputPassword)

	 this.apiService.ApiCall('POST',this.url, postData).subscribe(data => {
		let response = JSON.parse(JSON.stringify(data));
		if(response.Ack === 1){

			this.events.publish('userData', "login");
			
			this.showLoader = false;
			window.localStorage.setItem('user_id', JSON.parse(JSON.stringify(response.data)).id)
			window.localStorage.setItem('user_name', JSON.parse(JSON.stringify(response.data)).name)
			//this.storage.set('userId', response.data)
			console.log("user: "+response.data.name);

			let navigationExtra : NavigationExtras = {
				state : {
					special: response.data.name
				}
			}
			
			this.router.navigate(['/name'], navigationExtra);
		}else if(response.Ack === 0){
			this.showLoader = false;
			this.presentToast('Something went wrong!')
		}
	 }, error => {
		 this.showLoader = false;
		 this.presentToast(error);
	 });

	  }else{
		  this.presentToast("Please check your internet connection!")
	  }
   }

   forgotPassword(){
	  this.router.navigate(['/forgotpassword']);
   }
}
