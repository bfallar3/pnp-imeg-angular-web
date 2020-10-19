import { VictimDto, VictimDtoPagedResultDto, VictimServiceProxy } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

class PagedUsersRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  selector: 'app-victims',
  templateUrl: './victims.component.html',
  styleUrls: ['./victims.component.css'],
  animations: [appModuleAnimation()]
})
export class VictimsComponent extends PagedListingComponentBase<VictimDto> {

  victims: VictimDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;

  constructor(
    injector: Injector,
    private _service: VictimServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }

  fullName(item: VictimDto): string {
    const names = {
      firstName: item.firstName,
      middleName: item.middleName,
      lastName: item.lastName,
      qualifier: item.qualifier,
    };
    return Object.values(names).filter(val => val).join(' ');
  }

  protected list(
    request: PagedUsersRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;
    this._service
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
      .subscribe((result: VictimDtoPagedResultDto) => {
        this.victims = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(victim: VictimDto): void {
    abp.message.confirm(
      'Victim ' + this.fullName(victim) + ' will be deleted',
      undefined,
      (result: boolean) => {
        if (result) {
          this._service.delete(victim.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }



}
