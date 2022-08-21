import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { Room } from './model/Room';

@Injectable({
  providedIn: 'root'
})
export class PrefetchRoomsService implements Resolve<Observable<Array<Room>>> {

  constructor(private dataService : DataService, private authService : AuthService) { }

  resolve() {
    return this.dataService.getRooms();
  }
}
