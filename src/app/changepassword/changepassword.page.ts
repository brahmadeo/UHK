import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {

  url = 'http://laraveldevelopers.website/dev21/uhk/public/api/update-forget-password';
  inputPassword: string = '';
  inputConfirmPassword: string = '';
  showLoader = false;
  myform: FormGroup;

  validation_messages = {
    'password': [
      { type: 'required', message: 'Password is required.' }, { type: 'minlength', message: 'Enter new password' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm Password is required.' }, { type: 'minlength', message: 'Confirm password' }
    ],	
  
  }
  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private router: Router, private toastController: ToastController) {

    this.myform = formBuilder.group({
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required)
 	  })
   }

  ngOnInit() {
  }
  ApiCallForChangePassword(){
    if(this.inputPassword === this.inputConfirmPassword){
      this.presentToast("method called password changed");
      this.sendPostRequest();
    }else{
      this.presentToast("Password not matched");
    }
    
  }

  sendPostRequest(){
    if(this.apiService.getNetworkStatus){

      this.showLoader = true;
       let postData = {
         "user_id": window.localStorage.getItem("user_id"),
         "password": this.inputPassword
     }
  
     console.log(this.inputPassword)
  
     this.apiService.ApiCall('POST',this.url, postData).subscribe(data => {
      let response = JSON.parse(JSON.stringify(data));
      if(response.Ack === 1){
        this.showLoader = false;
        this.router.navigate(['/login1']);
        this.presentToast(response.data.message);
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
  /* Toast message */
  async presentToast(mess: string) {
    const toast = await this.toastController.create({
      message: mess,
      duration: 1000
    });
    toast.present();
  }
}
