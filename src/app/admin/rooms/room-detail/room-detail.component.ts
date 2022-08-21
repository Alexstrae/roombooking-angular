import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { DataService } from 'src/app/data.service';
import { Room } from 'src/app/model/Room';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css'],
})
export class RoomDetailComponent implements OnInit {
  @Input()
  room!: Room;
  @Output()
  datachangedEvent = new EventEmitter();
  message: string;
  isAdminUser = false;

  constructor(private router: Router, private dataService: DataService, private authService : AuthService) {}

  ngOnInit(): void {
    if(this.authService.role === 'ADMIN') {
      this.isAdminUser = true;
    }
  }

  editRoom() {
    this.router.navigate(['admin', 'rooms'], {
      queryParams: { id: this.room.id, action: 'edit' },
    });
  }

  deleteRoom(id: number) {
    const result = confirm('Are you sure you want to delete this room?');
    if (result) {
      this.message = 'deleting...';
      this.dataService.deleteRoom(id).subscribe(
        (next) => {
          this.datachangedEvent.emit();
          this.router.navigate(['admin', 'rooms']);
        },
        (error) =>
          (this.message = 'Sorry - this room cant be deleted at this time')
      );
    }
  }
}
