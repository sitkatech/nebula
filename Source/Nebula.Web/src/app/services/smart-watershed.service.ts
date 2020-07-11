import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SmartWatershedService {

  private baseRoute = 'https://swn-lyra-dev.azurewebsites.net';

  constructor(private http: HttpClient) { }

  getSiteLocationGeoJson(): Observable<any> {
    let route = `${this.baseRoute}/api/hydstra/sites/spatial`;
    const result = this.http.get(route);
    return result;
  }

  getTimeSeriesData(timeSeriesObject: Object) : string {
    let route = `${this.baseRoute}`;
    
  }
  
}
