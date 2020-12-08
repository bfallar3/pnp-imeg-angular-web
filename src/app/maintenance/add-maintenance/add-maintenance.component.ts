import { ReferenceServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.css']
})
export class AddMaintenanceComponent extends AppComponentBase implements OnInit {

  typeName: string;
  typeValue: string;
  saving: boolean;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    service: ReferenceServiceProxy,
    public bsModalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.bsModalRef.hide();
    this.onSave.emit();
  }

}
