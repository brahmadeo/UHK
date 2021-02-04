import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service'

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  url = "http://laraveldevelopers.website/dev21/uhk/public/api/cms-details";
  showSpinner = false;
  response = [];
  result = {};
  cmsId = 0;
  constructor(private router: Router, private apiService: ApiService) {
    if(this.router.getCurrentNavigation().extras.state){
      this.cmsId = this.router.getCurrentNavigation().extras.state.cmsId
    } 
  }

  ngOnInit() {
    this.apiCallForCms();
  }

  go(){
  		this.router.navigate(['/service'])
  }
/*====== Api call for About start ====== */
  apiCallForCms(){
    this.showSpinner = true;
    let actualUrl = this.url +"/"+ this.cmsId;
    this.apiService.ApiCall('POST', actualUrl, null).subscribe(data =>{
      console.log(typeof data)
      //let responseResult = JSON.parse(JSON.stringify(data));
      console.log("hereee "+JSON.parse(JSON.stringify(data)).data)
      if(data.Ack === 1){
        this.showSpinner = false
        this.result = data.data
        this.response = JSON.parse(JSON.stringify(data)).data;
        if(data.data.description!=null){
           document.getElementById("aboutDescription").innerHTML = data.data.description;
        }
      }else if(data.Ack === 0){
        this.showSpinner = false
        this.result = {};
      }
      //console.log("aa1",this.serviceList);
      console.log("result cms",this.result);
    
      //alert(this.result['message']);
      //document.getElementById('abc').innerHTML = this.result['message'];

    });
  }
  /*====== Api call for About end ====== */

}
