import { ReferenceDtoPagedResultDto, ReferenceServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { UUID } from 'angular2-uuid';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, Inject, Injectable, InjectionToken, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DosierItemDto, DosierDto, DosierServiceProxy, DosierItemServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateDosierItemDialogComponent } from '../create-dosier-item-dialog/create-dosier-item-dialog.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-edit-dosier',
  templateUrl: './edit-dosier.component.html',
  styleUrls: ['./edit-dosier.component.css'],
  animations: [appModuleAnimation()]
})
export class EditDosierComponent extends AppComponentBase implements OnInit {

  dosier: DosierDto;
  dosierItems: DosierItemDto[] = [];
  filterDosierItems: DosierItemDto[] = [];
  dosierItem: DosierItemDto;
  saving = false;
  keyword = '';

  ranks: string[] = [];
  units: string[] = [];

  constructor(injector: Injector,
    private service: ReferenceServiceProxy,
    private router: Router,
    private route: ActivatedRoute,
    private _modalService: BsModalService,
    public dosierService: DosierServiceProxy,
    public dosierItemService: DosierItemServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      abp.log.info(data.dto);
      this.dosier = data.dto;
      this.dosierItems = this.dosier.items;
      this.filterDosierItems = this.dosierItems;
    });

    this.service.getAll('', '', 0, 9999)
      .subscribe((result: ReferenceDtoPagedResultDto) => {
        const records = result.items;
        this.ranks = _.map(_.filter(records, { 'type': 'RANK' }), 'name');
        this.units = _.map(_.filter(records, { 'type': 'UNIT' }), 'name');
      });
  }

  save(): void {
    this.saving = true;
    this.dosier.items = this.dosierItems;
    this.dosierService.update(this.dosier)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        abp.message.success(this.l('SavedSuccessfully'));
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

  view(index): void {
    const item = this.dosierItems[index];
    this.router.navigate(['/app/dosier-item-viewer', item.id]);
  }

  remove(index): void {
    abp.message.confirm(
      'Are you sure to delete the selected attachment?',
      'Confirmation',
      (result: boolean) => {
        if (result) {
          const item = this.dosierItems[index];
          this.dosierItemService.delete(item.id).subscribe(() => {
            this.dosierItems.splice(index, 1);
          });
        }
      }
    );
  }

  search(): void {
    if (this.keyword === '') {
      this.filterDosierItems = this.dosierItems;
    } else {
      this.filterDosierItems = this.dosierItems.filter(s => s.item.includes(this.keyword)
        || s.particular.includes(this.keyword)
        || s.information.includes(this.keyword));
    }
  }

  delete(): void {
    abp.message.confirm(
      'Are you sure to delete the selected dosier and its related items?',
      'Confirmation',
      (result: boolean) => {
        if (result) {
          this.dosierService.delete(this.dosier.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            window.setTimeout(() => { this.router.navigate(['/app/dosiers']); }, 2000);
          });
        }
      }
    );
  }

}
