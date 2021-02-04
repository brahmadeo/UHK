// import { Injectable } from '@angular/core';
// //import { Storage } from '@ionic/storage';

// @Injectable({
//     providedIn: 'root'
// })
// export class Userdata {
//     HAS_LOGGED_IN = 'hasLoggedIn';

//     constructor(){

//     }

//     isLoggedIn(): Promise<boolean>{
//         return this.storage.get("HAS_LOGGED_IN").then(()=>{
//             return true;
//         });
//     }

//     login(username: string): Promise<any> {
//         return this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
//           return window.dispatchEvent(new CustomEvent('user:login'));
//         });
//       }
// }