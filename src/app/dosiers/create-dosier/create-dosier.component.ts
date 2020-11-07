import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { DosierDto, DosierItemDto, DosierItemServiceProxy, DosierServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateDosierItemDialogComponent } from '../create-dosier-item-dialog/create-dosier-item-dialog.component';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-create-dosier',
  templateUrl: './create-dosier.component.html',
  styleUrls: ['./create-dosier.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateDosierComponent extends AppComponentBase implements OnInit {

  saving = false;
  dosier = new DosierDto();
  createDosierItemDto: DosierItemDto;
  dosierItems: DosierItemDto[] = [];

  constructor(injector: Injector,
    private router: Router,
    private _modalService: BsModalService,
    public dosierService: DosierServiceProxy,
    public dosierItemService: DosierItemServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;
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
      this.createDosierItemDto = dialog.content.item;
      const filename = this.createDosierItemDto.attachment;
      const extension = filename.split('.').pop();
      this.createDosierItemDto.attachment = guid + '.' + extension;
      this.saving = true;
      this.dosierItemService.create(this.createDosierItemDto)
        .pipe(
          finalize(() => {
            this.saving = false;
          })
        )
        .subscribe(() => {
          this.dosierItems.push(this.createDosierItemDto);
        });
    });
  }

}
