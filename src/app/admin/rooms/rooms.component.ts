import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { DataService } from 'src/app/data.service';
import { Room } from 'src/app/model/Room';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { RoomEditComponent } from './room-edit/room-edit.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  rooms!: Array<Room>;
  selectedRoom!: Room;
  action: String;
  loadingData = true;
  message = 'Please wait. Getting the list of rooms';
  @ViewChild('roomEditComponent') private roomEditComponent: RoomEditComponent;
  @ViewChild(RoomDetailComponent) private roomdetailComponent: RoomDetailComponent;
  reloadAttempts = 0;
  isAdminUser = false;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private authService : AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
    if(this.authService.role === 'ADMIN') {
      this.isAdminUser = true;
    }
  }

  private processUrlParams() {
    this.route.queryParamMap.subscribe((params) => {
      this.action = '';
      const id = params.get('id');
      if (id) {
        const room: Room | undefined = this.rooms.find(
          (room) => room.id === +id
        );
        if (room) {
          this.selectedRoom = room;
        }
      }
      const action = params.get('action');
      if (action) {
        this.action = action;
        if (action === 'add') {
          this.selectedRoom = new Room();
          this.action = 'edit';
        }
      }
    });
  }

   loadData() {
    this.dataService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loadingData = false;
        this.processUrlParams();
      },
      error: (e) => {
        if (e.status === 402) {
          this.message = 'Sorry - you need to pay to use this application.';
        } else {
          this.message = 'Sorry - something went wrong, trying again...';
          this.reloadAttempts++;
          if (this.reloadAttempts <= 10) {
            this.loadData();
          } else {
            this.message =
              'Sorry - something went wrong, please contact support.';
          }
        }
      },
    });
  }

  setRoom(id: number) {
    if(this.roomdetailComponent) {
    this.roomdetailComponent.message = '';}
    this.router.navigate(['admin', 'rooms'], {
      queryParams: { id: id, action: 'view' },
    });
  }

  addRoom() {
    this.roomEditComponent.room = new Room();
    this.roomEditComponent.initializeForm();
    this.router.navigate(['admin', 'rooms'], {
      queryParams: { action: 'add' },
    });
  }
}
