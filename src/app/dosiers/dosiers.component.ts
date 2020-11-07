import { DosierDto, DosierDtoPagedResultDto, DosierServiceProxy } from './../../shared/service-proxies/service-proxies';
import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from 'shared/paged-listing-component-base';
import {
  UserServiceProxy,
  UserDto,
  UserDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';

class PagedDosierRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  templateUrl: './dosiers.component.html',
  animations: [appModuleAnimation()]
})
export class DosiersComponent extends PagedListingComponentBase<DosierDto> {
  dosiers: DosierDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;

  constructor(
    injector: Injector,
    private router: Router,
    private _dosierService: DosierServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  create(): void {
    this.router.navigate(['/app/create-dosier']);
  }

  edit(dosier: DosierDto): void {
    this.router.navigate(['/app/edit-dosier', dosier.id]);
  }

  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }

  protected list(
    request: PagedDosierRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;

    this._dosierService
      .getAll(
        request.keyword,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: DosierDtoPagedResultDto) => {
        this.dosiers = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(dosier: DosierDto): void {
    abp.message.confirm(
      'Are you sure to delete the selected dosier and its related items?',
      'Confirmation',
      (result: boolean) => {
        if (result) {
          this._dosierService.delete(dosier.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }
}
