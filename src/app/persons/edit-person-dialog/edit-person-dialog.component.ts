import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PersonDto } from '@shared/service-proxies/PersonDto';

@Component({
  selector: 'app-edit-person-dialog',
  templateUrl: './edit-person-dialog.component.html',
  styleUrls: ['./edit-person-dialog.component.css']
})
export class EditPersonDialogComponent extends AppComponentBase implements OnInit {

  saving = false;
  data: PersonDto;

  @Output() onSave = new EventEmitter<any>();

  constructor(injector: Injector,
    public bsModalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  save(): void {
    this.bsModalRef.hide();
    this.onSave.emit();
  }

}
