import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ComplaintServiceProxy, CreateComplaintDto, CreateSuspectDto, CreateVictimDto, CreateWitnessDto } from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Router } from '@angular/router';
import { CreatePersonDialogComponent } from '@app/persons/create-person-dialog/create-person-dialog.component';
import { PersonDto } from '@shared/service-proxies/PersonDto';
import * as moment from 'moment';
import * as _ from 'lodash';
declare var parseFullName: any;
@Component({
  selector: 'app-create-complaint',
  templateUrl: './create-complaint.component.html',
  styleUrls: ['./create-complaint.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateComplaintComponent extends AppComponentBase implements OnInit {

  saving = false;
  currentDate: string;
  dateIncident = new Date();
  receivedOn = new Date();
  previouslyReportedOn = new Date();
  complaint = new CreateComplaintDto();
  person: PersonDto;

  victims: CreateVictimDto[] = [];
  suspects: CreateSuspectDto[] = [];
  witnesses: CreateWitnessDto[] = [];

  informerIsVictim: boolean;

  DATE_FORMAT = 'MM/DD/YYYY hh:mm A';

  constructor(
    injector: Injector,
    private router: Router,
    private _modalService: BsModalService,
    public complaintService: ComplaintServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.complaint.status = 'NEW';
    this.complaint.reportedThru = 'IN PERSON';
    this.complaint.previouslyReported = false;
    this.currentDate = moment(abp.clock.now()).format(this.DATE_FORMAT);
  }

  save(): void {
    if (this.victims.length === 0) {
      abp.message.warn('No victim added in the complaint.');
      return;
    }

    if (this.suspects.length === 0) {
      abp.message.warn('No suspect added in the complaint.');
      return;
    }

    this.saving = true;
    this.complaint.timeIncident = this.complaint.timeIncident || moment(abp.clock.now());
    this.complaint.dateIncident = moment(this.dateIncident);
    this.complaint.receivedOn = moment(this.receivedOn);
    this.complaint.previouslyReportedWhen = moment(this.previouslyReportedOn);
    this.complaint.victims = this.victims;
    this.complaint.suspects = this.suspects;
    this.complaint.witnesses = this.witnesses;
    this.complaintService.create(this.complaint)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        abp.message.success(this.l('SavedSuccessfully'));
        this.router.navigate(['/app/complaints']);
      });
  }

  dateIncidentValueChanged(value: Date): void {
    this.dateIncident = value;
  }

  receivedOnValueChanged(value: Date): void {
    this.receivedOn = value;
  }

  previouslyReportedOnValueChanged(value: Date): void {
    this.previouslyReportedOn = value;
  }

  addVictim(): void {
    let dialog: BsModalRef;
    dialog = this._modalService.show(
      CreatePersonDialogComponent,
      {
        class: 'modal-lg'
      }
    );
    dialog.content.onSave.subscribe(() => {
      const person = dialog.content.person;
      const victim: CreateVictimDto = new CreateVictimDto();
      victim.address = person.address;
      victim.age = person.age;
      victim.title = person.title;
      victim.qualifier = person.qualifier;
      victim.firstName = person.firstName;
      victim.middleName = person.middleName;
      victim.lastName = person.lastName;
      victim.gender = person.gender;
      victim.mobileNumber = person.mobileNumber;
      this.victims.push(victim);
    });
  }

  removeVictim(person: CreateVictimDto): void {
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
      const suspect: CreateSuspectDto = new CreateSuspectDto();
      suspect.address = person.address;
      suspect.age = person.age;
      suspect.title = person.title;
      suspect.qualifier = person.qualifier;
      suspect.firstName = person.firstName;
      suspect.middleName = person.middleName;
      suspect.lastName = person.lastName;
      suspect.gender = person.gender;
      suspect.mobileNumber = person.mobileNumber;
      suspect.alias = person.alias;
      this.suspects.push(suspect);
    });
  }

  removeSuspect(person: CreateSuspectDto): void {
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
      const witness: CreateWitnessDto = new CreateWitnessDto();
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

  removeWitness(person: CreateWitnessDto): void {
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

  informerAddressBlur(): void {
    if (this.victims.length === 0) {
      abp.message.confirm('Is the informer also a victim?', 'Confirm', (confirm) => {
        if (confirm) {
          const name = this.complaint.informerName;
          const names = parseFullName(name);
          const victim: CreateVictimDto = new CreateVictimDto();
          victim.address = this.complaint.informerAddress.toUpperCase();
          victim.qualifier = names.suffix.toUpperCase();
          victim.firstName = names.first.toUpperCase();
          victim.middleName = names.middle.toUpperCase();
          victim.lastName = names.last.toUpperCase();
          victim.mobileNumber = this.complaint.informerContactNumber.toUpperCase();
          this.victims.push(victim);
        }
      });
    }
  }

}
