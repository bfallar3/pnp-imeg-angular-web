import { ComplaintDto, ComplaintServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class ComplaintDtoResolver implements Resolve<ComplaintDto> {
    constructor(private service: ComplaintServiceProxy) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.service.get(route.params['id']);
    }
}
