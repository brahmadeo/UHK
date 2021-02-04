import { Component, OnInit, NgModule } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { IonicRatingModule } from 'ionic4-rating';
import { FormGroup, ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { Router } from '@angular/router';


@NgModule({
  imports:[ IonicRatingModule]
})
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  urlUserData = "http://laraveldevelopers.website/dev21/uhk/public/api/check-device-id";
  urlFetchFeedback = 'http://laraveldevelopers.website/dev21/uhk/public/api/feedback';
  urlSubmitFeedback = "http://laraveldevelopers.website/dev21/uhk/public/api/submit-feedback";
  urlSubmitRate = '';
  username = "";
  isRating = false
  showSpinner = false
  userData = {};
  result = [];
  result1 = [
    {
      name: 'Brahma',
      description: 'Very nice app'
    },
    {
      name: 'Brahmanand',
      description: 'Very nice app1'
    },
    {
      name: 'Brahmadeo',
      description: 'Very nice app2'
    }
  ]
  //customForm : FormGroup; 

  validation_messages = {
    'subject':[{type:'required', message: 'Subject required'}],
    //'rating':[{type:'required', message: 'Rating required'}],
    'description':[{type:'required', message: 'description required'}],
    
  }
  myform: FormGroup;
  constructor(private apiService: ApiService, private toastController: ToastController, private formBuilder: 
    FormBuilder, private modalController: ModalController, private router:Router) {
    this.myform = new FormGroup({
      name: new FormControl('',[Validators.required]),
      subject: new FormControl('',[Validators.required]),
      //rating: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      
    })
  }

  ngOnInit() {
    //this.username = window.localStorage.getItem("user_name");
    this.ApiCallForFetchRating();
    this.ApiCallForUserdetails();
  }
  onModelChange(e:any){
    console.log(e)
  }
  writeFeedback(e){
    this.isRating = true
  }
  formSubmit(){
    if(this.apiService.getNetworkStatus){
      this.ApiCallForSubmitRate();
    }else{
      this.presentToast("Please check your internet connection !")
    }
    
  }

  // async writeFeedback() {
  //   console.log("fab clicked")
  //   const modal = await this.modalController.create({
  //     component: FeedbackComponent,
  //     componentProps: {
  //       'firstName': 'Douglas',
  //       'lastName': 'Adams',
  //       'middleInitial': 'N'
  //     }
  //   });
  //   return await modal.present();
  // }

  /* To show toast message */
  async presentToast(mess: string) {
    const toast = await this.toastController.create({
      message: mess,
      duration: 1000
    });
    toast.present();
  }
/*========== Api call for fetching feedback start===========*/
  ApiCallForFetchRating(){
    console.log("fetching called")
    if (this.apiService.getNetworkStatus) {
      this.result = []
      this.showSpinner = true
      this.apiService.ApiCall('POST', this.urlFetchFeedback, null).subscribe(data =>{
        if(data.Ack === 1){
          this.showSpinner = false
          console.log("dataaa", data.data)
          this.result = data.data;
          
        }else if(data.Ack === 0){
          this.showSpinner = false
        }
      }, error =>{
        this.showSpinner = false
      });
      
    }else{
      this.presentToast("Please check your internet connection!");
    }
  }
  /*========== Api call for fetching feedback end===========*/

  /*========== Api call for fetching user data start===========*/
  ApiCallForUserdetails(){
    console.log("fetching called")
    let postData = {
      //user_id: window.localStorage.getItem('user_id'),
      device_id: localStorage.getItem("device_id")
      
    }
    if (this.apiService.getNetworkStatus) {
      this.userData = {}
      this.apiService.ApiCall('POST', this.urlUserData, postData).subscribe(data =>{
        
        if(data.Ack === 1){
          console.log("response "+JSON.parse(JSON.stringify(data)).data)
          console.log("response1 "+JSON.parse(JSON.stringify(data)).data.username)
          alert(data.data.username);
          this.userData = data.data;
          this.username = data.data.username;
          
        }else if(data.Ack === 0){
          this.presentToast(data.message)
        }
      }, error =>{
        this.presentToast(error)
      });
      
    }else{
      this.presentToast("Please check your internet connection!");
    }
  }
  /*========== Api call for fetching user data end===========*/

  /*========== Api call for submit feedback start===========*/
  ApiCallForSubmitRate(){
    if (this.apiService.getNetworkStatus) {
      this.result = []
      this.showSpinner = true
      
      let postData = {
        //user_id: window.localStorage.getItem('user_id'),
        username: this.username,
        name: this.myform.value.subject,
        description: this.myform.value.description
      }
      console.log('here '+window.localStorage.getItem('user_id'), this.myform.value.name, this.myform.value.description);
      this.apiService.ApiCall('POST', this.urlSubmitFeedback, postData).subscribe(data =>{
        if(data.Ack === 1){
          this.presentToast("Review submitted successfully")
          this.showSpinner = false
          console.log("dataaa", data.data)
          this.router.navigateByUrl('/home1')
          //this.result = data.data;
        }else if(data.Ack === 0){
          this.showSpinner = false
        }
      }, error =>{
        this.showSpinner = false
      });
      
    }else{
      this.presentToast("Please check your internet connection!");
    }
  }
  /*========== Api call for submit feedback end===========*/
}
