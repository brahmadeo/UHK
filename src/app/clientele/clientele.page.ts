import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-clientele',
  templateUrl: './clientele.page.html',
  styleUrls: ['./clientele.page.scss'],
})
export class ClientelePage implements OnInit {

  url = "http://laraveldevelopers.website/dev21/uhk/public/api/cms";
  result = [];
  showSpinner = false;
  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.apiCallForCmsList();
  }

  go(){
  	this.router.navigate(['/notice'])
  }
  goCms(cms_id){
    console.log("iddd: "+ cms_id);
    let navigationExtras : NavigationExtras = {
      state: {
        cmsId : cms_id
      }
    }

    switch(cms_id){
      case 1:
        this.router.navigate(['/home1'], navigationExtras)
      break;
      case 2:
        this.router.navigate(['/about'], navigationExtras)
      break;
      
      case 3:
        this.router.navigate(['/notice'], navigationExtras)
      break;

      case 4:
        this.router.navigate(['/address'], navigationExtras)
      break;
    }
  }

  /*============  Api call for cms listing start============*/
  apiCallForCmsList(){
    this.showSpinner = true;
    
    this.apiService.ApiCall('POST', this.url, null).subscribe(data =>{
      console.log(typeof data)
      //let responseResult = JSON.parse(JSON.stringify(data));
      console.log("hereee "+JSON.parse(JSON.stringify(data)).data)
      if(data.Ack === 1){
        this.showSpinner = false
        this.result = JSON.parse(JSON.stringify(data)).data;

        console.log("res clientele "+ JSON.stringify(this.result[1]));
      }else if(data.Ack === 0){
        this.showSpinner = false
        this.result = [];
      }
      //console.log("aa1",this.serviceList);
      console.log("result cms",this.result);
    
      //alert(this.result['message']);
      //document.getElementById('abc').innerHTML = this.result['message'];

    });
  }
  /*============  Api call for cms listing end ============*/

}
