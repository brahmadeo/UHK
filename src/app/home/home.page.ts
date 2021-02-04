import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  urlHome = "http://laraveldevelopers.website/dev21/uhk/public/api/cms";
  showSpinner = false;
  response = [];
  result = {};

  constructor(private router: Router, private apiService: ApiService) {}

  go(){
  	this.router.navigate(['/slideshow'])
  }
 
   /*====== Api call for Notice start ====== */
   apiCallForCmsList(){
    this.showSpinner = true;
    
    this.apiService.ApiCall('POST', this.urlHome, null).subscribe(data =>{
      console.log(typeof data)
      //let responseResult = JSON.parse(JSON.stringify(data));
      console.log("hereee "+JSON.parse(JSON.stringify(data)).data)
      if(data.Ack === 1){
        this.showSpinner = false
        this.response = JSON.parse(JSON.stringify(data)).data;

        console.log("res 11 "+ this.response[1])
        for(var i=0; i<this.response.length; i++){
          if(i===2){
            this.result = this.response[i];
            if(this.response[i].description!=null){
              document.getElementById("description").innerHTML = this.response[i].description;
            }
          }
        }
      }else if(data.Ack === 0){
        this.showSpinner = false
        this.response = [];
      }
      //console.log("aa1",this.serviceList);
      console.log("result cms",this.result);
    
      //alert(this.result['message']);
      //document.getElementById('abc').innerHTML = this.result['message'];

    });
  }
  /*====== Api call for Notice end ====== */
}
