import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-service-inner',
  templateUrl: './service-inner.page.html',
  styleUrls: ['./service-inner.page.scss'],
})
export class ServiceInnerPage implements OnInit {

  private url: string = "http://laraveldevelopers.website/dev21/uhk/public/api/service-details"
  private service_id : string = "";
  private jsonObject : any;
  private showSpinner = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private apiService: ApiService, private toastController: AlertController) { }

  ngOnInit() {
    this.service_id = this.activatedRoute.snapshot.paramMap.get('id'); 
    console.log("service inner id: "+this.activatedRoute.snapshot.paramMap.get('id'));

    this.serviceDetailsApiCall();
  }

  go(){
  	this.router.navigate(['/clientele'])
  }

  // Api call for service details
  serviceDetailsApiCall(){
    this.showSpinner = true;
    this.apiService.ApiCall('GET', this.url+"/"+this.service_id, null).subscribe(data =>{
      console.log(data.Ack);
      if(data.Ack === 1){
        this.showSpinner = false;
        this.jsonObject = data.data;
        console.log(this.jsonObject.description)
        // setting description of services
        document.getElementById('desc').innerHTML = this.jsonObject.description;
      }else if(data.Ack === 0){
        this.showSpinner = false;
        this.presentToast(data.message);
      }
    });
  }

  async presentToast(mess: string) {
    const toast = await this.toastController.create({
      message: mess
      
    });
    toast.present();
  }
}
