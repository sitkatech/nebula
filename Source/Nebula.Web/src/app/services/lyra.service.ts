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

  getRSBTopoJson(): Observable<any> {
    let route = `${this.baseRoute}/api/spatial/regional_subbasins`;
    return this.http.get(route);
  }

  getTimeSeriesPlot(timeSeriesObject: Object) : Observable<any> {
    let route = `${this.baseRoute}/api/plot/multi_variable?json=${JSON.stringify(timeSeriesObject)}`;
    return this.http.get(route);
  }

  downloadTimeSeriesData(timeSeriesObject: Object) {
    let route = `${this.baseRoute}/api/plot/multi_variable/data?f=csv&json=${JSON.stringify(timeSeriesObject)}`;
    return this.http.get(route, {
      responseType: 'arraybuffer'
    });
  }

  getRegressionPlot(regressionObject: Object) : Observable<any> {
    let route = `${this.baseRoute}/api/plot/regression?json=${JSON.stringify(regressionObject)}`;
    return this.http.get(route);
  }

  downloadRegressionData(regressionObject: Object) {
    let route = `${this.baseRoute}/api/plot/regression/data?f=csv&json=${JSON.stringify(regressionObject)}`;
    return this.http.get(route, {
      responseType: 'arraybuffer'
    });
  }
  
}
