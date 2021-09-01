import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LyraService {
  private baseRoute = 'https://swn-lyra-dev.azurewebsites.net';

  constructor(private http: HttpClient) { }

  getSiteLocationGeoJson(): Observable<any> {
    let route = `${this.baseRoute}/api/spatial/site_info`;
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
    let route = `${this.baseRoute}/api/plot/multi_variable?json=${JSON.stringify(timeSeriesObject)}`;
    return this.http.get(route);
  }

  downloadTimeSeriesData(timeSeriesObject: Object) {
    let route = `${this.baseRoute}/api/plot/multi_variable/data?f=csv&json=${JSON.stringify(timeSeriesObject)}`;
    return this.http.get(route, {
      responseType: 'arraybuffer'
    });
  }
  
}
