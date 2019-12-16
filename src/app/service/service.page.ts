import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {

  result : any
  showSpinner = true
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
    
    this.apiService.ApiCall('GET', this.url, null).subscribe(data =>{
      console.log(typeof data)
      let responseResult = JSON.parse(JSON.stringify(data));
      console.log(responseResult.Ack)
      if(responseResult.Ack === 1){
        this.showSpinner = false
        this.result = responseResult.data;
      }else{
        this.showSpinner = false
        this.result = [];
      }
      
      console.log("aa1",this.serviceList);
      console.log("result",this.result);
    
      //alert(this.result['message']);
      //document.getElementById('abc').innerHTML = this.result['message'];
    });
  }
}
