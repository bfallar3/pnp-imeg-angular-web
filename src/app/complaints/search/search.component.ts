import { SearchResultDto, ComplaintServiceProxy, QueryDto, ReferenceServiceProxy, ReferenceDtoPagedResultDto } from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { ComplaintDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [appModuleAnimation()]
})
export class SearchComponent extends PagedListingComponentBase<ComplaintDto> implements OnInit {

  isTableLoading: boolean;
  complaints: SearchResultDto[] = [];
  suspectName: string;
  victimName: string;
  nature: string;
  unit: string;
  rank: string;
  dateIncident: Date;
  startDateIncident: Date;
  endDateIncident: Date;
  dateReported: Date;
  startDateReported: Date;
  endDateReported: Date;
  reportOtherAgency = 'NO';
  reportedThru = 'IN PERSON';
  ranks: string[] = [];
  units: string[] = [];

  constructor(
    injector: Injector,
    private router: Router,
    private service: ComplaintServiceProxy,
    private referenceService: ReferenceServiceProxy,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.referenceService.getAll('', '', 0, 9999)
      .subscribe((result: ReferenceDtoPagedResultDto) => {
        const records = result.items;
        this.ranks = _.sortBy(_.map(_.filter(records, { 'type': 'RANK' }), 'name'), [function (data) { return data; }]);
        this.units = _.sortBy(_.map(_.filter(records, { 'type': 'UNIT' }), 'name'), [function (data) { return data; }]);
      });
  }

  dateIncidentValueChanged($event): void {
    //this.dateIncident = value;
    this.startDateIncident = $event[0].toJSON().split('T')[0];
    this.endDateIncident = $event[1].toJSON().split('T')[0];
  }

  dateReportedValueChanged($event): void {
    //this.dateReported = value;
    this.startDateReported = $event[0].toJSON().split('T')[0];
    this.endDateReported = $event[1].toJSON().split('T')[0];
  }

  protected list(request: QueryDto, pageNumber: number, finishedCallback: Function): void {
    this.isTableLoading = true;
    const query: QueryDto = new QueryDto();
    if (this.startDateIncident) {
      //query.incidentDate = moment(this.dateIncident);
      query.startIncidentDate = moment(this.startDateIncident);
      query.endIncidentDate = moment(this.endDateIncident);
    }
    if (this.startDateReported) {
      //query.incidentReported = moment(this.dateReported);
      query.startReportedDate = moment(this.startDateReported);
      query.endReportedDate = moment(this.endDateReported);
    }
    query.nature = this.nature;
    query.unit = this.unit;
    query.rank = this.rank;
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
