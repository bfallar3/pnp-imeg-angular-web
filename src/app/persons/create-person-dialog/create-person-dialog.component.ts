import { PersonDto, ReferenceDtoPagedResultDto, ReferenceServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as _ from 'lodash';

@Component({
  selector: 'app-create-person-dialog',
  templateUrl: './create-person-dialog.component.html',
  styleUrls: ['./create-person-dialog.component.css']
})
export class CreatePersonDialogComponent extends AppComponentBase implements OnInit {

  saving = false;
  person = new PersonDto();

  ranks: string[] = [];
  units: string[] = [];
  offices: string[] = [];

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private service: ReferenceServiceProxy,
    public bsModalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
    this.service.getAll('', '', 0, 9999)
      .subscribe((result: ReferenceDtoPagedResultDto) => {
        const records = result.items;
        this.ranks = _.sortBy(_.map(_.filter(records, { 'type': 'RANK' }), 'name'), [function (data) { return data; }]);
        this.units = _.sortBy(_.map(_.filter(records, { 'type': 'UNIT' }), 'name'), [function (data) { return data; }]);
        this.offices = _.map(_.filter(records, { 'type': 'OFFICE' }), 'name');
      });
  }

  save(): void {
    this.bsModalRef.hide();
    this.onSave.emit();
  }

}
