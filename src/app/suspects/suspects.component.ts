import { PersonDtoPagedResultDto, PersonServiceProxy } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { PersonDto } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

class PagedPersonsRequestDto extends PagedRequestDto {
  keyword: string;
  type: string;
}

@Component({
  selector: 'app-suspects',
  templateUrl: './suspects.component.html',
  styleUrls: ['./suspects.component.css'],
  animations: [appModuleAnimation()]
})
export class SuspectsComponent extends PagedListingComponentBase<PersonDto> {

  suspects: PersonDto[] = [];
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
    request.type = 'SUSPECT';
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
        this.suspects = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(suspect: PersonDto): void {
    abp.message.confirm(
      'Suspect ' + this.fullName(suspect) + ' will be deleted',
      undefined,
      (result: boolean) => {
        if (result) {
          this._service.delete(suspect.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }



}
