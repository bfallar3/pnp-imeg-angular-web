import { DosierDtoPagedResultDto, ReferenceDtoPagedResultDto, ReferenceServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { DosierDto, DosierItemDto, DosierItemServiceProxy, DosierServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateDosierItemDialogComponent } from '../create-dosier-item-dialog/create-dosier-item-dialog.component';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';

@Component({
  selector: 'app-create-dosier',
  templateUrl: './create-dosier.component.html',
  styleUrls: ['./create-dosier.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateDosierComponent extends AppComponentBase implements OnInit {

  saving = false;
  dosier = new DosierDto();
  dosierItem: DosierItemDto;
  dosierItems: DosierItemDto[] = [];
  ranks: string[] = [];
  units: string[] = [];

  constructor(injector: Injector,
    private router: Router,
    private service: ReferenceServiceProxy,
    private _modalService: BsModalService,
    public dosierService: DosierServiceProxy,
    public dosierItemService: DosierItemServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.service.getAll('', '', 0, 9999)
      .subscribe((result: ReferenceDtoPagedResultDto) => {
        const records = result.items;
        this.ranks = _.sortBy(_.map(_.filter(records, { 'type': 'RANK' }), 'name'), [function (data) { return data; }]);
        this.units = _.sortBy(_.map(_.filter(records, { 'type': 'UNIT' }), 'name'), [function (data) { return data; }]);
      });
  }

  save(): void {
    this.saving = true;
    this.dosier.items = this.dosierItems;
    this.dosierService.create(this.dosier)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        abp.message.success(this.l('SavedSuccessfully'));
        this.router.navigate(['/app/dosiers']);
      });
  }

  addDosierItem(): void {
    let dialog: BsModalRef;
    dialog = this._modalService.show(
      CreateDosierItemDialogComponent,
      {
        class: 'modal-lg'
      }
    );
    dialog.content.onSave.subscribe(() => {
      const guid = UUID.UUID();
      this.dosierItem = dialog.content.item;
      const filename = this.dosierItem.attachment;
      if (filename) {
        const extension = filename.split('.').pop();
        if (dialog.content.base64content) {
          const content = dialog.content.base64content;
          const contentType = content.split(',')[0];
          const base64content = content.split(',')[1];
          this.dosierItem.attachment = guid + '.' + extension;
          this.dosierItem.content = base64content;
          this.dosierItem.contentType = contentType;
          this.dosierItem.extension = extension;
        }
      }
      this.dosierItems.push(this.dosierItem);
    });
  }

  remove(index) {
    abp.message.confirm(
      'Are you sure to delete the selected attachment?',
      'Confirmation',
      (result: boolean) => {
        if (result) {
          this.dosierItems.splice(index, 1);
        }
      }
    );
  }
}
