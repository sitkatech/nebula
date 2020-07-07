import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SmartWatershedService {
  constructor(private http: HttpClient) { }

  getSiteLocationGeoJson(): Observable<any> {
    let route = 'https://swn-lyra-dev.azurewebsites.net/api/hydstra/sites/spatial';
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'
        })
       };
    const result = this.http.get(route, httpOptions);
    return result;
  }
  
}
