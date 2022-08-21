import { Layout, Room } from "./Room";
import { User } from "./User";

type NewType = Layout;

export class Booking {
  id: number;
  room: Room;
  user: User;
  layout: NewType;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: number;

  getDateAsDate() {
    return new Date(this.date);
  }

  static fromHttp(booking : Booking) {
    const newBooking = new Booking();
    newBooking.id = booking.id;
    newBooking.title = booking.title;
    newBooking.room = Room.fromHttp(booking.room);
    newBooking.user= User.fromHttp(booking.user);
    newBooking.layout = booking.layout;
    newBooking.endTime = booking.endTime;
    newBooking.startTime = booking.startTime;
    newBooking.participants = booking.participants;
    newBooking.date = booking.date;
    return newBooking;
  }
}
