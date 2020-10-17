import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import {
  ComplaintDto, ComplaintServiceProxy, ComplaintUpdateServiceProxy,
  CreateComplaintDto,
  UpdateComplaintDto,
  VictimDto,
  VictimServiceProxy
} from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { CreatePersonDialogComponent } from '@app/persons/create-person-dialog/create-person-dialog.component';
import { EditPersonDialogComponent } from '@app/persons/edit-person-dialog/edit-person-dialog.component';
import { PersonDto } from '@shared/service-proxies/PersonDto';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-edit-complaint',
  templateUrl: './edit-complaint.component.html',
  styleUrls: ['./edit-complaint.component.css'],
  animations: [appModuleAnimation()],
  providers: [VictimServiceProxy]
})
export class EditComplaintComponent extends AppComponentBase implements OnInit {

  saving = false;
  complaint = new ComplaintDto();
  updateComplaintDto = new UpdateComplaintDto();
  person: PersonDto;
  dateOfIncident: Date;
  receivedOn: Date;
  dateCreated: string;
  previouslyReportedOn: Date;
  lastModifiedDate: string;
  victims: VictimDto[] = [];

  DATE_FORMAT = 'MM/DD/YYYY hh:MM A';

  constructor(
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private _modalService: BsModalService,
    public complaintService: ComplaintServiceProxy,
    public victimService: VictimServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.complaintService.get(id).subscribe((complaint: ComplaintDto) => {
        console.log(complaint);
        this.complaint = complaint;
        this.dateCreated = complaint.creationTime.format(this.DATE_FORMAT);
        this.receivedOn = complaint.receivedOn.toDate();
        this.dateOfIncident = complaint.dateIncident.toDate();
        this.previouslyReportedOn = complaint.previouslyReportedWhen.toDate();
        this.lastModifiedDate = moment(complaint.lastModificationTime).format(this.DATE_FORMAT);
        this.victims = complaint.victims;
      });
    });
  }

  save(): void {
    this.saving = true;

    this.complaint.dateIncident = moment(this.dateOfIncident);
    this.complaint.receivedOn = moment(this.receivedOn);
    this.complaint.previouslyReportedWhen = moment(this.previouslyReportedOn);

    this.updateComplaintDto.complaint = this.complaint;
    this.updateComplaintDto.victims = this.victims;

    this.complaintService.updateComplaint(this.updateComplaintDto)
      .pipe(finalize(() => { this.saving = false; }))
      .subscribe(() => {
        abp.message.success(this.l('UpdatedSuccessfully'));
      });
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

  addVictim(): void {
    let createVictimDlg: BsModalRef;
    createVictimDlg = this._modalService.show(
      CreatePersonDialogComponent,
      {
        class: 'modal-lg'
      }
    );
    createVictimDlg.content.onSave.subscribe(() => {
      const person = createVictimDlg.content.person;
      const victim: VictimDto = new VictimDto();
      victim.address = person.address;
      victim.age = person.age;
      victim.firstName = person.firstName;
      victim.middleName = person.middleName;
      victim.lastName = person.lastName;
      victim.gender = person.gender;
      victim.mobileNumber = person.mobileNumber;
      this.victims.push(victim);
    });
  }

  removeVictim(person: VictimDto): void {
    abp.message.confirm('Are you sure to delete the victim?', 'Confirm', (confirm) => {
      if (confirm) {
        _.remove(this.victims, (item) => {
          return item === person;
        });
      }
    });
  }

  public fullName(item: PersonDto): string {
    const names = {
      firstName: item.firstName,
      middleName: item.middleName,
      lastName: item.lastName,
      qualifier: item.qualifier,
    };
    return Object.values(names).filter(val => val).join(' ');
  }

}
