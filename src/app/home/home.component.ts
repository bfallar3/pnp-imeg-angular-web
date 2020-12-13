import { ComplaintServiceProxy, ComplaintDto } from './../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { interval } from 'rxjs';

@Component({
  templateUrl: './home.component.html',
  animations: [appModuleAnimation()]
})
export class HomeComponent implements OnInit {

  totalActiveComplaints = 0;
  totalCloseComplaints = 0;
  totalNewComplaints = 0;
  topNature = '';
  mostAssigned = '';
  topRank = '';
  topUnit = '';
  newComplaints: ComplaintDto[] = [];
  closedComplaints: ComplaintDto[] = [];

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
      this.totalActiveComplaints = result.totalActiveComplaints;
      this.totalCloseComplaints = result.totalCloseComplaints;
      this.topNature = result.topNatureComplaint;
      this.mostAssigned = result.mostAssigned;
      this.topRank = result.topSuspectRank;
      this.topUnit = result.topSuspectUnit;
      this.totalNewComplaints = result.totalNewComplaints;
    });

    this.service.getNewComplaints().subscribe(result => {
      this.newComplaints = result;
    });

    this.service.getClosedComplaints().subscribe(result => {
      this.closedComplaints = result;
    });
  }
}
