import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private router: Router) { }

  ApiCall(method, url: string, postData: any): Observable<any>{

    if(method == 'POST'){

      return this.http.post(url, postData, {headers: new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Basic dWhrOnhpZ21hcHJvMTIz'})});
    }else{
       return this.http.get(url, {headers: new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Basic dWhrOnhpZ21hcHJvMTIz'})});
    }
    
  }
}
