import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Booking } from './model/Booking';
import { Layout, LayoutCapacity, Room } from './model/Room';
import { User } from './model/User';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private rooms: Array<Room>;
  private users: Array<User>;
  private bookings : Array<Booking>;

  constructor() {
    this.rooms = new Array<Room>();
    const room1 = new Room();

    room1.id = 1;
    room1.name = 'First Room';
    room1.location = 'First Floor';

    const capacity1 = new LayoutCapacity();
    capacity1.layout = Layout.THEATER;
    capacity1.capacity = 50;

    const capacity2 = new LayoutCapacity();
    capacity2.layout = Layout.USHAPE;
    capacity2.capacity = 20;

    room1.capacities.push(capacity1);
    room1.capacities.push(capacity2);

    const room2 = new Room();
    room2.id = 2;
    room2.name = 'Second Room';
    room2.location = 'Third Floor';

    const capacity3 = new LayoutCapacity();
    capacity3.layout = Layout.BOARD;
    capacity3.capacity = 10;

    room2.capacities.push(capacity3);

    this.rooms.push(room1);
    this.rooms.push(room2);

    this.users = new Array<User>();

    const user1 = new User();
    user1.id = 1;
    user1.name = 'Matt';
    const user2 = new User();
    user2.id = 2;
    user2.name = 'Diana';
    const user3 = new User();
    user3.id = 3;
    user3.name = 'Suzanne';
    this.users.push(user1);
    this.users.push(user2);
    this.users.push(user3);

    this.bookings = new Array<Booking>();

    const booking1 = new Booking();
    booking1.title = 'Sprint Meeting';
    booking1.user = user1;
    booking1.id = 1;
    booking1.layout = Layout.BOARD;
    booking1.participants = 5;
    booking1.room = room1;
    booking1.startTime = '10:00';
    booking1.endTime = '15:00';
    booking1.date = formatDate(new Date(), 'yyyy-MM-dd', 'en-GB');

    const booking2 = new Booking();
    booking2.title = 'Retro';
    booking2.user = user2;
    booking2.id = 2;
    booking2.layout = Layout.USHAPE;
    booking2.participants = 10;
    booking2.room = room2;
    booking2.startTime = '15:00';
    booking2.endTime = '17:00';
    booking2.date = formatDate(new Date(), 'yyyy-MM-dd', 'en-GB');

    this.bookings.push(booking1);
    this.bookings.push(booking2);

   }

   getRooms() : Observable<Array<Room>>{
    return of(this.rooms);
   }

   getUsers() : Observable<Array<User>>{
    return of(this.users);
   }

   updateUser(user : User) : Observable<User> {
    const originalUser = this.users.find(u => u.id === user.id);
    originalUser!.name = user.name;
    return of(originalUser!);
   }

   addUser(user : User, password : String) : Observable<User> {
    const id : number = Math.max(...this.users.map (u => u.id)) + 1;
    user.id = id;
    this.users.push(user);
    return of(user);
   }

   updateRoom(room: Room) : Observable<Room> {
    const originalRoom = this.rooms.find(r => r.id === room.id);
    originalRoom!.name = room.name;
    originalRoom!.capacities = room.capacities;
    originalRoom!.location = room.location;
    return of(room);
   }

   addRoom(room : Room) : Observable<Room> {
    const id : number = Math.max(...this.rooms.map (u => u.id)) + 1;
    room.id = id;
    this.rooms.push(room);
    return of(room);
   }

   deleteRoom(roomId : number) : Observable<boolean> {
   const room = this.rooms.find(r => r.id === roomId);
   if(room != null) {
   this.rooms.splice(this.rooms.indexOf(room), 1);
   return of(true);
   }
  return of(false);
  }

  deleteUser(userId : number) : Observable<boolean> {
    const user = this.users.find(u => u.id === userId);
    if(user != null) {
    this.users.splice(this.users.indexOf(user), 1);
    return of(true);
    }
   return of(false);
   }
  resetUserPassword(userId : number) : Observable<boolean> {
    return of(true);
   }

   getBookings(date : string) : Observable<Array<Booking>> {
    return of(this.bookings.filter(booking => booking.date === date));
   }

   getAllBookings() : Observable<Array<Booking>> {
    return of(this.bookings);
   }

   addBooking(booking : Booking) : Observable<Boolean>{
    this.bookings.push(booking);
    return of(true);
   }

   editBooking(editedBooking : Booking) : Observable<Booking> {
    this.bookings.map(booking => editedBooking.id === booking.id ?  editedBooking : booking);
    return of(editedBooking);
   }

   deleteBooking(id : number) {
    const bookingToDelete = this.bookings.find(booking => booking.id === id);
    if(bookingToDelete != null) {
      this.bookings.splice(this.bookings.indexOf(bookingToDelete), 1);
      return of(true);
   }
   return false;
 }

 validateUser(name: string, password: string) : Observable<{result : string}> {
    return of({result : 'ok'});
}

getRole() : Observable<{role : string}> {
  return of({role : 'admin'});
}
}
