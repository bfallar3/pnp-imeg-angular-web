import { ActivatedRoute } from '@angular/router';
import { ComplaintDtoPagedResultDto, ComplaintServiceProxy, ComplaintDashboardDto } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { finalize } from 'rxjs/operators';
import { AfterViewInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  templateUrl: './home.component.html',
  animations: [appModuleAnimation()]
})
export class HomeComponent implements OnInit {

  totalActiveComplaints = 0;
  totalCloseComplaints = 0;
  topNature = '';
  mostAssigned = '';

  interval = interval(3600000);

  constructor(
    private service: ComplaintServiceProxy) {
  }

  ngOnInit(): void {
    this.updateDashboard();
    this.interval.subscribe(n => {
      this.updateDashboard();
    });
  }

  updateDashboard(): void {
    this.service.getComplaintDashboard().subscribe(data => {
      const result = data;
      console.log(result);
      this.totalActiveComplaints = result.totalActiveComplaints;
      this.totalCloseComplaints = result.totalCloseComplaints;
      this.topNature = result.topNatureComplaint;
      this.mostAssigned = result.mostAssigned;
    });
  }
}
