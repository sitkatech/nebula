import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuItemDto } from '../shared/models/generated/menu-item-dto';
import { ApiService } from '../shared/services';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {
  constructor(private apiService: ApiService) { }

  getMenuItems(): Observable<Array<MenuItemDto>> {
    let route = `/menuItems`;
    return this.apiService.getFromApi(route);
  }
}
