import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ComplainantDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PersonDto } from '@shared/service-proxies/PersonDto';

@Component({
  selector: 'app-create-person-dialog',
  templateUrl: './create-person-dialog.component.html',
  styleUrls: ['./create-person-dialog.component.css']
})
export class CreatePersonDialogComponent extends AppComponentBase implements OnInit {

  saving = false;
  person = new PersonDto();

  @Output() onSave = new EventEmitter<any>();

  constructor(injector: Injector,
    public bsModalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.bsModalRef.hide();
    this.onSave.emit();
    // this._userService
    //   .create(this.user)
    //   .pipe(
    //     finalize(() => {
    //       this.saving = false;
    //     })
    //   )
    //   .subscribe(() => {
    //     this.notify.info(this.l('SavedSuccessfully'));
    //     this.bsModalRef.hide();
    //     this.onSave.emit();
    //   });
  }

}
