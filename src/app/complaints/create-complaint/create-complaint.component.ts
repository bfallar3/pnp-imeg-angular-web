import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ComplaintDto, ComplaintServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-create-complaint',
  templateUrl: './create-complaint.component.html',
  styleUrls: ['./create-complaint.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateComplaintComponent extends AppComponentBase implements OnInit {

  saving = false;
  complaint = new ComplaintDto();
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public complaintService: ComplaintServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;
    this.complaintService.create(this.complaint)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.onSave.emit();
      });
  }

}
