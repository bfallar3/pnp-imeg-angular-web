import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import {
  ComplaintDto, ComplaintServiceProxy, ComplaintUpdateServiceProxy,
  CreateComplaintDto,
  CreateWitnessDto,
  SuspectDto,
  UpdateComplaintDto,
  VictimDto,
  VictimServiceProxy,
  WitnessDto
} from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { CreatePersonDialogComponent } from '@app/persons/create-person-dialog/create-person-dialog.component';
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
  timeIncident = new Date();
  person: PersonDto;
  dateOfIncident: Date;
  receivedOn: Date;
  dateCreated: string;
  previouslyReportedOn: Date;
  victims: VictimDto[] = [];
  suspects: SuspectDto[] = [];
  witnesses: WitnessDto[] = [];

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
    this.route.data.subscribe(data => {
      abp.log.info(data);
      this.complaint = data.dto;
      this.victims = this.complaint.victims;
      this.suspects = this.complaint.suspects;
      this.witnesses = this.complaint.witnesses;
      this.dateCreated = this.complaint.creationTime.format(this.DATE_FORMAT);
      this.receivedOn = this.complaint.receivedOn.toDate();
      this.dateOfIncident = this.complaint.dateIncident.toDate();
      this.timeIncident = this.complaint.timeIncident.toDate();
      this.previouslyReportedOn = this.complaint.previouslyReportedWhen.toDate();
    });
  }

  save(): void {
    this.saving = true;

    this.complaint.dateIncident = moment(this.dateOfIncident);
    this.complaint.receivedOn = moment(this.receivedOn);
    this.complaint.previouslyReportedWhen = moment(this.previouslyReportedOn);
    this.complaint.timeIncident = moment(this.timeIncident);
    this.updateComplaintDto.complaint = this.complaint;
    this.updateComplaintDto.victims = this.victims;
    this.updateComplaintDto.suspects = this.suspects;
    this.updateComplaintDto.witnesses = this.witnesses;

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
      victim.title = person.title;
      victim.qualifier = person.qualifier;
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

  addSuspect(): void {
    let createSuspect: BsModalRef;
    createSuspect = this._modalService.show(
      CreatePersonDialogComponent,
      {
        class: 'modal-lg'
      }
    );
    createSuspect.content.onSave.subscribe(() => {
      const person = createSuspect.content.person;
      const suspect: SuspectDto = new SuspectDto();
      suspect.address = person.address;
      suspect.age = person.age;
      suspect.firstName = person.firstName;
      suspect.middleName = person.middleName;
      suspect.lastName = person.lastName;
      suspect.gender = person.gender;
      suspect.mobileNumber = person.mobileNumber;
      suspect.alias = person.alias;
      suspect.title = person.title;
      suspect.qualifier = person.qualifier;
      this.suspects.push(suspect);
    });
  }

  removeSuspect(person: SuspectDto): void {
    abp.message.confirm('Are you sure to delete the suspect?', 'Confirm', (confirm) => {
      if (confirm) {
        _.remove(this.suspects, (item) => {
          return item === person;
        });
      }
    });
  }

  addWitness(): void {
    let createWitnessDlg: BsModalRef;
    createWitnessDlg = this._modalService.show(
      CreatePersonDialogComponent,
      {
        class: 'modal-lg'
      }
    );
    createWitnessDlg.content.onSave.subscribe(() => {
      const person = createWitnessDlg.content.person;
      const witness: WitnessDto = new WitnessDto();
      witness.address = person.address;
      witness.firstName = person.firstName;
      witness.middleName = person.middleName;
      witness.lastName = person.lastName;
      witness.mobileNumber = person.mobileNumber;
      witness.title = person.title;
      witness.qualifier = person.qualifier;
      this.witnesses.push(witness);
    });
  }

  removeWitness(person: WitnessDto): void {
    abp.message.confirm('Are you sure to delete the witness?', 'Confirm', (confirm) => {
      if (confirm) {
        _.remove(this.witnesses, (item) => {
          return item === person;
        });
      }
    });
  }

  public fullName(item: PersonDto): string {
    const names = {
      title: item.title,
      firstName: item.firstName,
      middleName: item.middleName,
      lastName: item.lastName,
      qualifier: item.qualifier,
    };
    return Object.values(names).filter(val => val).join(' ');
  }

}
