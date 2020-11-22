import { ActivatedRoute } from '@angular/router';
import { ComplaintDtoPagedResultDto, ComplaintServiceProxy, ComplaintDashboardDto } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { finalize } from 'rxjs/operators';

@Component({
  templateUrl: './home.component.html',
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends AppComponentBase implements OnInit {

  totalActiveComplaints = 0;
  totalCloseComplaints = 0;
  topNature = '';
  mostAssigned = '';

  constructor(
    private complaintService: ComplaintServiceProxy,
    private route: ActivatedRoute,
    injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const result = data.dto;
      this.totalActiveComplaints = result.totalActiveComplaints;
      this.totalCloseComplaints = result.totalCloseComplaints;
      this.topNature = result.topNatureComplaint;
      this.mostAssigned = result.mostAssigned;
    });
  }
}
