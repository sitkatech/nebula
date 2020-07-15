import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SmartWatershedService {

  private baseRoute = 'https://swn-lyra-dev.azurewebsites.net';

  constructor(private http: HttpClient) { }

  getSiteLocationGeoJson(): Observable<any> {
    let route = `${this.baseRoute}/api/hydstra/sites/spatial`;
    return this.http.get(route);
  }

  getAvailableVariables(site: string): Observable<any> {
    let route = `${this.baseRoute}/api/hydstra/sites/variables`;
    let params = new HttpParams();
    params = params.append('site_list', site);
    params = params.append('datasource', 'A');
    return this.http.get(route, {params: params});
  }

  getTimeSeriesData(timeSeriesObject: Object) : Observable<any> {
    let route = `${this.baseRoute}/api/plot/trace`;
    let params = new HttpParams();
    Object.keys(timeSeriesObject).forEach(x => {
      params = params.append(x, timeSeriesObject[x]);
    });
    return this.http.get(route, {params: params});
  }
  
}
