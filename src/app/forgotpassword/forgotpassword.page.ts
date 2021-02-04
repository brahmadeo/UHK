import { Component, OnInit } from '@angular/core';
import { FormGroup , FormBuilder, FormControl, Validator, Validators} from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {

  url = 'http://laraveldevelopers.website/dev21/uhk/public/api/check-forget-password';
  inputUsername: string = '';
  showLoader = false;
  myform: FormGroup;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' }, { type: 'pattern', message: 'Enter valid email Id' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' }, { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],	
  
  }
  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private router: Router, private toastController: ToastController) {

    this.myform = formBuilder.group({
  		email: new FormControl('', Validators.required)
 	  })
   }

  ngOnInit() {
  }
  go(){
    //this.router.navigate(['/changepassword']);
    this.sendPostRequest();
  }

  sendPostRequest(){
    if(this.apiService.getNetworkStatus){

      this.showLoader = true;
       let postData = {
         "email": this.inputUsername
     }
  
     console.log(this.inputUsername)
  
     this.apiService.ApiCall('POST',this.url, postData).subscribe(data => {
      let response = JSON.parse(JSON.stringify(data));
      if(response.Ack === 1 && response.message === 'Success'){
        this.showLoader = false;
        this.presentToast(response.data.message);
        this.router.navigate(['/changepassword']);
      }else if(response.Ack === 0){
        this.showLoader = false;
        this.presentToast(response.data.message);
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
