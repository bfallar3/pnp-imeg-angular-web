import { DosierDto, DosierServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class DosierDtoResolver implements Resolve<DosierDto> {
    constructor(private service: DosierServiceProxy) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.service.get(route.params['id']);
    }
}
