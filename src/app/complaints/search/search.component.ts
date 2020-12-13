import { SearchResultDto, ComplaintServiceProxy, QueryDto } from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { ComplaintDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [appModuleAnimation()]
})
export class SearchComponent extends PagedListingComponentBase<ComplaintDto> {

  isTableLoading: boolean;
  complaints: SearchResultDto[] = [];
  suspectName: string;
  victimName: string;
  nature: string;
  placeIncident: string;
  dateIncident: Date;
  dateReported: Date;
  reportOtherAgency = 'NO';
  reportedThru = 'IN PERSON';

  constructor(
    injector: Injector,
    private router: Router,
    private service: ComplaintServiceProxy
  ) {
    super(injector);
  }

  dateIncidentValueChanged(value: Date): void {
    this.dateIncident = value;
  }

  dateReportedValueChanged(value: Date): void {
    this.dateReported = value;
  }

  protected list(request: QueryDto, pageNumber: number, finishedCallback: Function): void {
    this.isTableLoading = true;
    const query: QueryDto = new QueryDto();
    if (this.dateIncident) {
      query.incidentDate = moment(this.dateIncident);
    }
    if (this.dateReported) {
      query.incidentReported = moment(this.dateReported);
    }
    query.nature = this.nature;
    query.place = this.placeIncident;
    query.previouslyReported = this.reportOtherAgency === 'YES' ? true : false;
    query.reportedThru = this.reportedThru;
    query.suspectName = this.suspectName;
    query.victimName = this.victimName;
    request = query;
    this.service.advanceSearch(request)
      .pipe(
        finalize(() => {
          this.isTableLoading = false;
        })
    )
    .subscribe((results: SearchResultDto[]) => {
      this.complaints = results;
    });
  }

  protected delete(entity: ComplaintDto): void {
  }
}
