import { PersonDto, ReferenceDtoPagedResultDto, ReferenceServiceProxy, PersonServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';

@Component({
  selector: 'app-edit-person-dialog',
  templateUrl: './edit-person-dialog.component.html',
  styleUrls: ['./edit-person-dialog.component.css']
})
export class EditPersonDialogComponent extends AppComponentBase implements OnInit {

  saving = false;
  person: PersonDto;
  ranks: string[] = [];
  units: string[] = [];
  offices: string[] = [];

  @Output() onSave = new EventEmitter<any>();

  constructor(injector: Injector,
    private service: ReferenceServiceProxy,
    public bsModalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
    this.service.getAll('', '', 0, 9999)
      .subscribe((result: ReferenceDtoPagedResultDto) => {
        const records = result.items;
        this.ranks = _.map(_.filter(records, { 'type': 'RANK' }), 'name');
        this.units = _.map(_.filter(records, { 'type': 'UNIT' }), 'name');
        this.offices = _.map(_.filter(records, { 'type': 'OFFICE' }), 'name');
      });
  }

  save(): void {
    this.bsModalRef.hide();
    this.onSave.emit();
  }
}
