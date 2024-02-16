import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LyraService {
  private baseRoute = environment.lyraBaseURL;

  constructor(private http: HttpClient) { }

  getSiteLocationGeoJson(): Observable<any> {
    const route = `${this.baseRoute}/api/spatial/site_info`;
    return this.http.get(route);
  }

  getRSBTopoJson(): Observable<any> {
    const route = `${this.baseRoute}/api/spatial/regional_subbasins`;
    return this.http.get(route);
  }

  getTimeSeriesAnalysisPlot(multiVariableMultiSiteObject: Object) : Observable<any> {
    const route = `${this.baseRoute}/api/plot/multi_variable?json=${JSON.stringify(multiVariableMultiSiteObject)}`;
    return this.http.get(route);
  }

  downloadTimeSeriesAnalysisData(multiVariableMultiSiteObject: Object) {
    const route = `${this.baseRoute}/api/plot/multi_variable/data?f=csv&json=${JSON.stringify(multiVariableMultiSiteObject)}`;
    return this.http.get(route, {
      responseType: 'arraybuffer'
    });
  }

  getRegressionPlot(regressionObject: Object) : Observable<any> {
    const route = `${this.baseRoute}/api/plot/regression?json=${JSON.stringify(regressionObject)}`;
    return this.http.get(route);
  }

  downloadRegressionData(regressionObject: Object) {
    const route = `${this.baseRoute}/api/plot/regression/data?f=csv&json=${JSON.stringify(regressionObject)}`;
    return this.http.get(route, {
      responseType: 'arraybuffer'
    });
  }

  getDiversionScenarioPlot(diversionScenarioObject: Object) : Observable<any> {
    const route = `${this.baseRoute}/api/plot/diversion_scenario?json=${JSON.stringify(diversionScenarioObject)}`;
    return this.http.get(route);
  }

  downloadDiversionScenarioData(diversionScenarioObject: Object) {
    const route = `${this.baseRoute}/api/plot/diversion_scenario/data?f=csv&json=${JSON.stringify(diversionScenarioObject)}`;
    return this.http.get(route, {
      responseType: 'arraybuffer'
    });
  }
  
}
