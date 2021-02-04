import { FormControl, FormGroup } from '@angular/forms';
import { Network } from '@ionic-native/network/ngx';
import { Events } from '@ionic/angular';

export class Connectivity{

    public constructor(private network: Network){
      
    }

    public isConnected(){
       this.network.onConnect().subscribe(() => {
            console.log('network connected!');
            return true;
            // We just got a connection but we need to wait briefly
             // before we determine the connection type. Might need to wait.
            // prior to doing any api requests as well.
            setTimeout(() => {
              if (this.network.type === 'wifi') {
                console.log('we got a wifi connection, woohoo!');
              }
            }, 3000);
            
          });
    }
}