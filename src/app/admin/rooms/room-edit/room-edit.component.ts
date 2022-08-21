import { Component, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  FormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { Layout, LayoutCapacity, Room } from 'src/app/model/Room';
import { EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.css'],
})
export class RoomEditComponent implements OnInit {
  @Input()
  room: Room;
  @Output()
  dataChangedEvent = new EventEmitter();
  layoutEntries = Object.entries(Layout);
  message: string;

  roomForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.roomForm = this.formBuilder.group({
      roomName: [this.room.name, Validators.required],
      location: [
        this.room.location,
        [Validators.required, Validators.minLength(3)],
      ],
    });

    for (const layoutEntry of this.layoutEntries) {
      const layoutCapacity = this.room.capacities.find(
        (lc) => lc.layout == layoutEntry[1]
      );
      const initialValue = layoutCapacity == null ? 0 : layoutCapacity.capacity;
      this.roomForm.addControl(
        `layout${layoutEntry[0]}`,
        this.formBuilder.control(initialValue)
      );
    }
  }

  onSubmit() {
    this.message = 'saving ...';
    this.room.name = this.roomForm.controls['roomName'].value;
    this.room.location = this.roomForm.controls['location'].value;

    this.room.capacities = new Array<LayoutCapacity>();
    for (const layoutEntry of this.layoutEntries) {
      const layoutCapacity = new LayoutCapacity();
      layoutCapacity.layout = layoutEntry[1];
      layoutCapacity.capacity =
        this.roomForm.controls[`layout${layoutEntry[0]}`].value;
      this.room.capacities.push(layoutCapacity);
    }
    if (this.room.id == null) {
      this.dataService.addRoom(this.room).subscribe(
        (room) => {
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'rooms'], {
            queryParams: { action: 'view', id: room.id },
          });
        },
        (error) => (this.message = 'Something went wrong')
      );
    } else {
      this.dataService.updateRoom(this.room).subscribe(
        (room) => {
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'rooms'], {
            queryParams: { action: 'view', id: room.id },
          });
        },
        (error) => (this.message = 'Something went wrong')
      );
    }
  }
}
