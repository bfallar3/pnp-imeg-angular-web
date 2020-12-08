import { AddMaintenanceComponent } from './add-maintenance/add-maintenance.component';
import { ReferenceServiceProxy, ReferenceDto, ReferenceDtoPagedResultDto, CreateVictimDto } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css'],
  animations: [appModuleAnimation()]
})
export class MaintenanceComponent implements OnInit {

  keyword: string;
  type: string;
  isTableLoading: boolean;
  records: ReferenceDto[] = [];
  filtered: ReferenceDto[] = [];

  constructor(
    private router: Router,
    private service: ReferenceServiceProxy,
    private modalService: BsModalService
  ) {
  }

  ngOnInit(): void {
    this.isTableLoading = true;
    this.type = 'RANK';
    this.refresh();
  }

  refresh(): void {
    this.service.getAll('', '', 0, 99999)
      .pipe(
        finalize(() => {
          this.isTableLoading = false;
        })
      )
      .subscribe((result: ReferenceDtoPagedResultDto) => {
        this.records = result.items;
        this.filterTypes(this.type);
      });
  }

  filterTypes(type: string): void {
    this.filtered = _.filter(this.records, { 'type': this.type });
  }

  search(): void {
    const keyword = this.keyword;
    const type = this.type;
    if (keyword === '' || keyword === null) {
      this.filterTypes(type);
    } else {
      this.filtered = _.filter(this.records, function (o) {
        return o.name.includes(keyword) && o.type === type;
      });
    }
  }

  changeType() {
    this.filterTypes(this.type);
  }

  create(): void {
    let dialog: BsModalRef;
    dialog = this.modalService.show(
      AddMaintenanceComponent,
      {
        class: 'modal-lg'
      }
    );
    dialog.content.onSave.subscribe(() => {
      const data = dialog.content;
      const dto: ReferenceDto = new ReferenceDto();
      dto.name = data.typeValue;
      dto.type = data.typeName;

      this.service.isTypeNameExists(dto.type, dto.name)
        .subscribe(exists => {
          if (exists) {
            abp.message.warn(`${dto.type} (${dto.name}) already exists!`, 'Maintenance');
          } else {
            this.service.create(dto).subscribe(resp => {
              abp.message.success(`New ${dto.type} (${dto.name}) has been added successfully`, 'Maintenance');
              this.refresh();
            }, (err) => console.error(err));
          }
        });
    });
  }

  remove(dto: ReferenceDto): void {
    abp.message.confirm(`Are you sure to delete the type ${dto.type} (${dto.name})?`, 'Confirm',
      (result) => {
        if (result) {
          this.service.delete(dto.id).subscribe(() => {
            abp.message.success(`Record ${dto.type} (${dto.name}) has been deleted successfully`, 'Maintenance');
            this.refresh();
          });
        }
    });
  }
}
