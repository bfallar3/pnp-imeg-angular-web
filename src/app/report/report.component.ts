import { HttpClient } from '@angular/common/http';
import { ComplaintServiceProxy } from './../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppConsts } from '@shared/AppConsts';
import { saveAs } from 'file-saver/dist/FileSaver';

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
  disabled = false;
  downloadLink: string;
  downloadReady = false;
  baseUrl = AppConsts.remoteServiceBaseUrl + '/uploads/';

  constructor(private service: ComplaintServiceProxy, private http: HttpClient) { }

  ngOnInit(): void {
  }

  startDateValueChanged(value: Date): void {
    this.startDate = value;
  }

  endDateValueChanged(value: Date): void {
    this.endDate = value;
  }

  generate(): void {
    this.disabled = true;
    let start: moment.Moment;
    let end: moment.Moment;
    if (this.startDate) {
      start = moment(this.startDate);
    }
    if (this.endDate) {
      end = moment(this.endDate);
    }
    this.service.generateReport(this.reportedThru, start, end).subscribe((result: any) => {
      abp.message.info('Report has been successfully generated');
      this.downloadReady = true;
      this.downloadLink = this.baseUrl + result;
      this.http.get(this.downloadLink, {
        responseType: 'blob', headers: { 'Accept': 'application/pdf' }
      }).subscribe(blob => {
        saveAs(blob, result);
      });
    }, (err) => console.error(err), () => { this.disabled = false; });
  }

}
