import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { ApiService } from '../services/api.service';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { mapTo } from 'rxjs/operators';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {

  private online$: Observable<boolean> = undefined;
  result : any
  showSpinner = false
  serviceList = [
    {
      image: "assets/images/arrow.png",
      text: "abcd..."
    },
    {
      image: "assets/images/gaurd.png",
      text: "abcde..."
    },
    {
      image: "assets/images/canera.png",
      text: "abcdef..."
    },
    {
      image: "assets/images/gaurd.png",
      text: "abcde..."
    },
    {
      image: "assets/images/gaurd.png",
      text: "abcdef..."
    },
    {
      image: "assets/images/gaurd.png",
      text: "abcde..."
    },
    {
      image: "assets/images/gaurd.png",
      text: "abcdef..."
    },
    {
      image: "assets/images/gaurd.png",
      text: "abcde..."
    },
    {
      image: "assets/images/gaurd.png",
      text: "abcdef..."
    }
  ]
  
 
  url: string = "http://laraveldevelopers.website/dev21/uhk/public/api/get-service";
  
  constructor(private router: Router, private http: HttpClient, private apiService: ApiService) { 

    this.apiCallForServiceList();
    
  }

  ngOnInit() {
  }


  go(){
  	this.router.navigate(['/service-inner'])
  }

  /* Api Call */
  apiCallForServiceList(){
    this.showSpinner = true;
    
    this.apiService.ApiCall('GET', this.url, null).subscribe(data =>{
      console.log(typeof data)
      //let responseResult = JSON.parse(JSON.stringify(data));
      console.log("hereee "+JSON.parse(JSON.stringify(data)).data)
      if(data.Ack === 1){
        this.showSpinner = false
        this.result = JSON.parse(JSON.stringify(data)).data;
      }else if(data.Ack === 0){
        this.showSpinner = false
        this.result = [];
      }
      //console.log("aa1",this.serviceList);
      console.log("result",this.result);
    
      //alert(this.result['message']);
      //document.getElementById('abc').innerHTML = this.result['message'];

    });
  }
  goServiceDetails(id: any){
    this.router.navigate(['/service-inner']);
  }
}
