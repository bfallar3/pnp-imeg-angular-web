import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ComplaintDto, ComplaintServiceProxy, CreateComplaintDto } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-complaint',
  templateUrl: './create-complaint.component.html',
  styleUrls: ['./create-complaint.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateComplaintComponent extends AppComponentBase implements OnInit {

  saving = false;
  currentDate = new Date();
  complaint = new CreateComplaintDto();

  constructor(
    injector: Injector,
    private router: Router,
    public complaintService: ComplaintServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.complaint.status = 'New';
    this.complaint.reportedThru = 'In Person';
    this.complaint.previouslyReported = false;
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
        abp.notify.success(this.l('SavedSuccessfully'));
        this.router.navigate(['/app/complaints']);
      });
  }

}
