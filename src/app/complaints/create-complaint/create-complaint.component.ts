import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ComplainantDto, ComplaintDto, ComplaintServiceProxy, CreateComplaintDto } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Router } from '@angular/router';
import { CreatePersonDialogComponent } from '@app/persons/create-person-dialog/create-person-dialog.component';
import { EditPersonDialogComponent } from '@app/persons/edit-person-dialog/edit-person-dialog.component';
import { PersonDto } from '@shared/service-proxies/PersonDto';

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
  person: PersonDto;

  constructor(
    injector: Injector,
    private router: Router,
    private _modalService: BsModalService,
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

  createInformer(): void {
    let createInformerDlg: BsModalRef;
    createInformerDlg = this._modalService.show(
      CreatePersonDialogComponent,
      {
        class: 'modal-lg'
      }
    );

    createInformerDlg.content.onSave.subscribe(() => {
      this.person = new PersonDto();
      this.person = createInformerDlg.content.person;
      this.complaint.complainant = new ComplainantDto();
      this.complaint.complainant.firstName = this.person.firstName;
      this.complaint.complainant.middleName = this.person.middleName;
      this.complaint.complainant.lastName = this.person.lastName;
      this.complaint.complainant.qualifier = this.person.qualifier;
      this.complaint.complainant.address = this.person.address;
      this.complaint.complainant.mobileNumber = this.person.mobileNumber;
    });
  }

  updateInformer(): void {
    if (this.person) {
      let editInformerDlg: BsModalRef;
      editInformerDlg = this._modalService.show(
        EditPersonDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            data: this.person,
          },
        }
      );

      editInformerDlg.content.onSave.subscribe(() => {
        this.person = new PersonDto();
        this.person = editInformerDlg.content.data;
        this.complaint.complainant.firstName = this.person.firstName;
        this.complaint.complainant.middleName = this.person.middleName;
        this.complaint.complainant.lastName = this.person.lastName;
        this.complaint.complainant.qualifier = this.person.qualifier;
        this.complaint.complainant.address = this.person.address;
        this.complaint.complainant.mobileNumber = this.person.mobileNumber;
      });
    }
  }

}
