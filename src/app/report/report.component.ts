import { ComplaintServiceProxy } from './../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  animations: [appModuleAnimation()]
})
export class ReportComponent implements OnInit {

  startDate: Date;
  endDate: Date;
  reportedThru: string;

  constructor(private service: ComplaintServiceProxy) { }

  ngOnInit(): void {
  }

  startDateValueChanged(value: Date): void {
    this.startDate = value;
  }

  endDateValueChanged(value: Date): void {
    this.endDate = value;
  }

  generate(): void {
    let start: moment.Moment;
    let end: moment.Moment;
    if (this.startDate) {
      start = moment(this.startDate);
    }
    if (this.endDate) {
      end = moment(this.endDate);
    }
    this.service.generateReport(this.reportedThru, start, end).subscribe((result: any) => {
      abp.message.warn('THIS IS NOT YET IMPLEMENTED');
    });
  }

}
