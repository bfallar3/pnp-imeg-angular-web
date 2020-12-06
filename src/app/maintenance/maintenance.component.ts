import { ReferenceServiceProxy, ReferenceDto, ReferenceDtoPagedResultDto } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css'],
  animations: [appModuleAnimation()]
})
export class MaintenanceComponent implements OnInit {

  keyword: string;
  type: string;
  isTableLoading: boolean;
  records: ReferenceDto[] = [];
  filtered: ReferenceDto[] = [];

  constructor(
    private router: Router,
    private service: ReferenceServiceProxy,
    private modalService: BsModalService
  ) {
  }

  ngOnInit(): void {
    this.isTableLoading = true;
    this.type = 'RANK';

    this.service.getAll('', '', 0, 99999)
      .pipe(
        finalize(() => {
          this.isTableLoading = false;
        })
      )
      .subscribe((result: ReferenceDtoPagedResultDto) => {
        this.records = result.items;
        this.filterTypes(this.type);
      });
  }

  filterTypes(type: string): void {
    this.filtered = _.filter(this.records, { 'type': this.type });
    console.log(this.filtered);
  }

  changeType() {
    this.filterTypes(this.type);
  }

  create(): void {

  }
}
