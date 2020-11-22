import { ComplaintDashboardDto, ComplaintServiceProxy } from './../../shared/service-proxies/service-proxies';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class ComplaintDashboardDtoResolver implements Resolve<ComplaintDashboardDto> {
    constructor(private service: ComplaintServiceProxy) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.service.getComplaintDashboard();
    }
}
