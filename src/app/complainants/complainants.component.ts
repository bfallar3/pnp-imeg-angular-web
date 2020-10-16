import { ComplainantDtoPagedResultDto } from './../../shared/service-proxies/service-proxies';
import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { ComplainantDto, ComplainantServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';

class PagedComplainantsRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  selector: 'app-complainants',
  templateUrl: './complainants.component.html',
  styleUrls: ['./complainants.component.css'],
  animations: [appModuleAnimation()],
  providers: [ComplainantServiceProxy]
})
export class ComplainantsComponent extends PagedListingComponentBase<ComplainantDto> {

  items: ComplainantDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;

  constructor(
    injector: Injector,
    private router: Router,
    private _service: ComplainantServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  create(): void {
    //this.router.navigate(['/app/create-complaint']);
  }

  edit(complaint: ComplainantDto): void {
    //this.router.navigate(['/app/edit-complaint']);
  }

  clearFilters(): void {
    this.keyword = '';
    this.isActive = true;
    this.getDataPage(1);
  }

  protected list(
    request: PagedComplainantsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isActive = true;

    this._service
      .getAll(request.keyword, request.skipCount, request.maxResultCount)
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: ComplainantDtoPagedResultDto) => {
        this.items = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(item: ComplainantDto): void {
    abp.message.confirm(
      this.l('ComplainantDeleteWarningMessage', this.fullName(item)),
      undefined,
      (result: boolean) => {
        if (result) {
          this._service.delete(item.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  private fullName(item): string {
    const names = {
      firstName: item.firstName,
      middleName: item.middleName,
      lastName: item.lastName,
      qualifier: item.qualifier,
    };
    return Object.values(names).filter(val => val).join(' ');
  }
}
