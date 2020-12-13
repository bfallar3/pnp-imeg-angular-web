import { PersonServiceProxy, PersonDtoPagedResultDto, PersonDto } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

class PagedPersonsRequestDto extends PagedRequestDto {
  keyword: string;
  type: string;
}

@Component({
  selector: 'app-victims',
  templateUrl: './victims.component.html',
  styleUrls: ['./victims.component.css'],
  animations: [appModuleAnimation()]
})
export class VictimsComponent extends PagedListingComponentBase<PersonDto> {

  victims: PersonDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;

  constructor(
    injector: Injector,
    private _service: PersonServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }

  fullName(item: PersonDto): string {
    const names = {
      title: item.title,
      firstName: item.firstName,
      middleName: item.middleName,
      lastName: item.lastName,
      qualifier: item.qualifier,
    };
    return Object.values(names).filter(val => val).join(' ');
  }

  protected list(
    request: PagedPersonsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.type = 'VICTIM';
    this._service
      .getAll(
        request.keyword,
        request.type,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: PersonDtoPagedResultDto) => {
        this.victims = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(victim: PersonDto): void {
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
