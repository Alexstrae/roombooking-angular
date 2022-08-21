import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Booking } from './model/Booking';
import { Layout, LayoutCapacity, Room } from './model/Room';
import { User } from './model/User';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getRooms(): Observable<Array<Room>> {
    return this.http
      .get<Array<Room>>(environment.restUrl + '/api/rooms/', {withCredentials : true})
      .pipe(map((data) => data.map((room) => Room.fromHttp(room))));
  }

  getUsers(): Observable<Array<User>> {
    return this.http
      .get<Array<User>>(environment.restUrl + '/api/users/')
      .pipe(map((data) => data.map((user) => User.fromHttp(user))));
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(environment.restUrl + '/api/users/', user);
  }

  addUser(user: User, password: String): Observable<User> {
    const fullUser = { name: user.name, password: password };
    return this.http.post<User>(environment.restUrl + '/api/users/', fullUser);
  }

  updateRoom(room: Room): Observable<Room> {
    return this.http.put<Room>(
      environment.restUrl + '/api/rooms/',
      this.getCorrectedRoom(room), {withCredentials : true}
    );
  }

  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(
      environment.restUrl + '/api/rooms/',
      this.getCorrectedRoom(room)
    );
  }

  deleteRoom(roomId: number): Observable<any> {
    return this.http.delete(`${environment.restUrl}/api/rooms/${roomId}`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${environment.restUrl}/api/users/${userId}`);
  }

  resetUserPassword(userId: number): Observable<any> {
    return this.http.get(`${environment.restUrl}/api/users/resetPassword/${userId}`);
  }

  getBookings(date: string): Observable<Array<Booking>> {
    return this.http.get<Array<Booking>>(environment.restUrl + "/api/bookings/" + date).pipe(map((data => data.map(booking => Booking.fromHttp(booking)))));
  }

  getBooking(id : string): Observable<Booking> {
    return this.http.get<Booking>(environment.restUrl + '/api/bookings' + '?id=' + id).pipe(map(data => Booking.fromHttp(data)));
  }

  getAllBookings(): Observable<Array<Booking>> {
    return of(new Array<Booking>());
  }

  addBooking(booking: Booking): Observable<Boolean> {
    return of(false);
  }

  editBooking(editedBooking: Booking): Observable<Booking> {
    return of(new Booking());
  }

  deleteBooking(id: number) : Observable<any> {
    return this.http.delete(environment.restUrl + "/api/bookings/" + id);
  }

  validateUser(name: string, password: string) : Observable<{result : string}> {
    const authData = btoa(`${name}:${password}`);
    const headers = new HttpHeaders().append('Authorization', 'Basic ' + authData);
    return this.http.get<{result : string}>(environment.restUrl + '/api/basicAuth/validate', {headers : headers, withCredentials : true})
  }

  getRole() : Observable<{role : string}> {
    const headers = new HttpHeaders().append('X-Requested-With', 'XMLHttpRequest')
    return this.http.get<{role : string}>(environment.restUrl + '/api/users/currentUserRole', {headers, withCredentials : true})
  }

  private getCorrectedRoom(room: Room) {
    const correctedRoom = {
      id: room.id,
      name: room.name,
      location: room.location,
      capacities: new Array<any>(),
    };
    for (const lc of room.capacities) {
      let correctedLayout;
      for (let member in Layout) {
        if (Layout[member as keyof typeof Layout] === lc.layout) {
          correctedLayout = member;
          break;
        }
      }
      const correctedLC = { capacity: lc.capacity, layout: correctedLayout };
      correctedRoom.capacities.push(correctedLC);
    }
    return correctedRoom;
  }
}
