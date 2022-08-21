export class Room {

  id!: number;
  name!: String;
  location : String | undefined;
  capacities : Array<LayoutCapacity> = new Array<LayoutCapacity>();

  static fromHttp (room : Room) {
    const newRoom = new Room();
    newRoom.id = room.id;
    newRoom.location = room.location;
    newRoom.name = room.name;
    newRoom.capacities = room.capacities.map(capacity => LayoutCapacity.fromHttp(capacity));
    return newRoom;
  }
}

export class LayoutCapacity {
layout : Layout;
capacity : number;

static fromHttp (layoutCapacity : LayoutCapacity) {
const newLayoutCapacity = new LayoutCapacity();
newLayoutCapacity.capacity = layoutCapacity.capacity;
newLayoutCapacity.layout = layoutCapacity.layout;
return newLayoutCapacity;
}
}

export enum Layout {
  THEATER = 'Theater',
  USHAPE = 'U-Shape',
  BOARD = 'Board Meeting'
}
