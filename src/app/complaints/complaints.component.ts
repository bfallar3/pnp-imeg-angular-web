import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from 'shared/paged-listing-component-base';
import {
  ComplaintServiceProxy,
  ComplaintDto,
  ComplaintDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';

class PagedComplaintsRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  animations: [appModuleAnimation()]
})
export class ComplaintsComponent extends PagedListingComponentBase<ComplaintDto> {
  complaints: ComplaintDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;

  constructor(
    injector: Injector,
    private router: Router,
    private _complaintService: ComplaintServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  create(): void {
    this.router.navigate(['/app/create-complaint']);
  }

  edit(complaint: ComplaintDto): void {
    this.router.navigate(['/app/edit-complaint', complaint.id]);
  }

  clearFilters(): void {
    this.keyword = '';
    this.isActive = true;
    this.getDataPage(1);
  }

  protected list(
    request: PagedComplaintsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isActive = true;

    this._complaintService
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
      .subscribe((result: ComplaintDtoPagedResultDto) => {
        this.complaints = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(complaint: ComplaintDto): void {
    abp.message.confirm(
      this.l('ComplaintDeleteWarningMessage', complaint.nature), undefined,
      (result: boolean) => {
        if (result) {
          this._complaintService.delete(complaint.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }
}
