import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import {
  ComplainantDto, ComplainantServiceProxy, ComplaintDto, ComplaintServiceProxy, ComplaintUpdateServiceProxy, CreateComplainantDto,
  CreateComplaintDto,
  UpdateComplaintDto
} from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { CreatePersonDialogComponent } from '@app/persons/create-person-dialog/create-person-dialog.component';
import { EditPersonDialogComponent } from '@app/persons/edit-person-dialog/edit-person-dialog.component';
import { PersonDto } from '@shared/service-proxies/PersonDto';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-complaint',
  templateUrl: './edit-complaint.component.html',
  styleUrls: ['./edit-complaint.component.css'],
  animations: [appModuleAnimation()],
  providers: [ComplainantServiceProxy, ComplaintUpdateServiceProxy]
})
export class EditComplaintComponent extends AppComponentBase implements OnInit {

  saving = false;
  complaint = new ComplaintDto();
  complainant = new ComplainantDto();
  updateComplaintDto = new UpdateComplaintDto();
  person: PersonDto;
  dateOfIncident: Date;
  receivedOn: Date;
  dateCreated: Date;
  previouslyReportedOn: Date;

  constructor(
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private _modalService: BsModalService,
    public _service: ComplaintUpdateServiceProxy,
    public complaintService: ComplaintServiceProxy,
    public complainantService: ComplainantServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.complaintService.get(id).subscribe((complaint: ComplaintDto) => {
        this.complaint = complaint;
        this.complainantService.get(complaint.complainantId).subscribe((complainant: ComplainantDto) => {
          this.dateCreated = complaint.creationTime.toDate();
          this.receivedOn = complaint.receivedOn.toDate();
          this.dateOfIncident = complaint.dateIncident.toDate();
          this.previouslyReportedOn = complaint.previouslyReportedWhen.toDate();
          this.complainant = complainant;
        });
      });
    });
  }

  save(): void {
    this.saving = true;

    this.complaint.dateIncident = moment(this.dateOfIncident);
    this.complaint.receivedOn = moment(this.receivedOn);
    this.complaint.previouslyReportedWhen = moment(this.previouslyReportedOn);

    this.updateComplaintDto.complaint = this.complaint;
    this.updateComplaintDto.complainant = this.complainant;

    this._service.updateComplaint(this.updateComplaintDto)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe(() => {
        abp.notify.success('Record updated successfully');
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
        //this.complaint.complainant.firstName = this.person.firstName;
        //this.complaint.complainant.middleName = this.person.middleName;
        //this.complaint.complainant.lastName = this.person.lastName;
        //this.complaint.complainant.qualifier = this.person.qualifier;
        //this.complaint.complainant.address = this.person.address;
        //this.complaint.complainant.mobileNumber = this.person.mobileNumber;
      });
    }
  }

  dateIncidentValueChanged(value: Date): void {
    this.dateOfIncident = value;
  }

  receivedOnValueChanged(value: Date): void {
    this.receivedOn = value;
  }

  previouslyReportedOnValueChanged(value: Date): void {
    this.previouslyReportedOn = value;
  }

}
