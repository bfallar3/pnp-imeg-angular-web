import { EditPersonDialogComponent } from './../../persons/edit-person-dialog/edit-person-dialog.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  ComplaintDto, ComplaintServiceProxy, CreatePersonDto, PersonDto, PersonServiceProxy, UpdateComplaintDto,
} from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
import { CreatePersonDialogComponent } from '@app/persons/create-person-dialog/create-person-dialog.component';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-edit-complaint',
  templateUrl: './edit-complaint.component.html',
  styleUrls: ['./edit-complaint.component.css'],
  animations: [appModuleAnimation()]
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
  persons: PersonDto[] = [];
  victims: PersonDto[] = [];
  suspects: PersonDto[] = [];
  witnesses: PersonDto[] = [];

  DATE_FORMAT = 'MM/DD/YYYY hh:MM A';

  constructor(
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private _modalService: BsModalService,
    public complaintService: ComplaintServiceProxy,
    public personService: PersonServiceProxy) {
    super(injector);
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.complaint = data.dto;
      this.victims = this.filterPersons('VICTIM');
      this.suspects = this.filterPersons('SUSPECT');
      this.witnesses = this.filterPersons('WITNESS');
      this.dateCreated = this.complaint.creationTime.format(this.DATE_FORMAT);
      this.receivedOn = this.complaint.receivedOn.toDate();
      this.dateOfIncident = this.complaint.dateIncident.toDate();
      this.timeIncident = this.complaint.timeIncident.toDate();
      this.previouslyReportedOn = this.complaint.previouslyReportedWhen.toDate();
    });
  }

  filterPersons(type: string) {
    return _.filter(this.complaint.persons, { 'type': type });
  }

  save(): void {
    this.saving = true;
    this.complaint.dateIncident = moment(this.dateOfIncident);
    this.complaint.receivedOn = moment(this.receivedOn);
    this.complaint.previouslyReportedWhen = moment(this.previouslyReportedOn);
    this.complaint.timeIncident = moment(this.timeIncident);
    this.updateComplaintDto.complaint = this.complaint;
    this.persons = _.concat(this.victims, this.suspects, this.witnesses);
    this.updateComplaintDto.persons = this.persons;
    console.log(this.updateComplaintDto);

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
      const person: CreatePersonDto = createVictimDlg.content.person;
      person.type = 'VICTIM';
      person.complaintId = this.complaint.id;
      this.personService.create(person).subscribe((result: PersonDto) => {
        this.victims.push(result);
      });
    });
  }

  removeVictim(person: PersonDto): void {
    abp.message.confirm('Are you sure to delete the victim?', 'Confirm', (confirm) => {
      if (confirm) {
        this.personService.delete(person.id).subscribe(() => {
          _.remove(this.victims, (item) => {
            return item === person;
          });
        });
      }
    });
  }

  editVictim(person: PersonDto): void {
    let editVictimDialog: BsModalRef;
    editVictimDialog = this._modalService.show(
      EditPersonDialogComponent,
      {
        class: 'modal-lg',
        initialState: {
          person: person
        }
      }
    );
    editVictimDialog.content.onSave.subscribe(() => {
      person = editVictimDialog.content.person;
      person.complaint = this.complaint;
      this.personService.delete(person.id).subscribe(() => {
        let dto: CreatePersonDto = new CreatePersonDto();
        dto = this.convertToCreatePersonDto(person, 'VICTIM');
        this.personService.create(dto).subscribe((result: PersonDto) => {
          person.id = result.id;
        }, (error) => {
            console.error(error);
        });
      });
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
      const person: CreatePersonDto = createSuspect.content.person;
      person.type = 'SUSPECT';
      person.complaintId = this.complaint.id;
      this.personService.create(person).subscribe((result: PersonDto) => {
        this.suspects.push(result);
      });
    });
  }

  removeSuspect(person: PersonDto): void {
    abp.message.confirm('Are you sure to delete the suspect?', 'Confirm', (confirm) => {
      if (confirm) {
        _.remove(this.suspects, (item) => {
          return item === person;
        });
      }
    });
  }

  editSuspect(person: PersonDto): void {
    let editDialog: BsModalRef;
    editDialog = this._modalService.show(
      EditPersonDialogComponent,
      {
        class: 'modal-lg',
        initialState: {
          person: person
        }
      }
    );
    editDialog.content.onSave.subscribe(() => {
      person = editDialog.content.person;
      person.complaint = this.complaint;
      this.personService.delete(person.id).subscribe(() => {
        let dto: CreatePersonDto = new CreatePersonDto();
        dto = this.convertToCreatePersonDto(person, 'SUSPECT');
        this.personService.create(dto).subscribe((result: PersonDto) => {
          person.id = result.id;
        }, (error) => {
          console.error(error);
        });
      });
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
      const person: CreatePersonDto = createWitnessDlg.content.person;
      person.type = 'WITNESS';
      person.complaintId = this.complaint.id;
      this.personService.create(person).subscribe((result: PersonDto) => {
        this.witnesses.push(result);
      });
    });
  }

  removeWitness(person: PersonDto): void {
    abp.message.confirm('Are you sure to delete the witness?', 'Confirm', (confirm) => {
      if (confirm) {
        _.remove(this.witnesses, (item) => {
          return item === person;
        });
      }
    });
  }

  editWitness(person: PersonDto): void {
    let editDialog: BsModalRef;
    editDialog = this._modalService.show(
      EditPersonDialogComponent,
      {
        class: 'modal-lg',
        initialState: {
          person: person
        }
      }
    );
    editDialog.content.onSave.subscribe(() => {
      person = editDialog.content.person;
      person.complaint = this.complaint;
      this.personService.delete(person.id).subscribe(() => {
        let dto: CreatePersonDto = new CreatePersonDto();
        dto = this.convertToCreatePersonDto(person, 'WITNESS');
        this.personService.create(dto).subscribe((result: PersonDto) => {
          person.id = result.id;
        }, (error) => {
          console.error(error);
        });
      });
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

  delete(): void {
    abp.message.confirm(
      this.l('ComplaintDeleteWarningMessage', this.complaint.sheetNumber), undefined,
      (result: boolean) => {
        if (result) {
          this.complaintService.delete(this.complaint.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            window.setTimeout(() => { this.router.navigate(['/app/complaints']); }, 2000);
          });
        }
      }
    );
  }

  convertToCreatePersonDto(person: PersonDto, type: string): CreatePersonDto {
    const dto: CreatePersonDto = new CreatePersonDto();
    dto.address = person.address;
    dto.age = person.age;
    dto.alias = person.alias;
    dto.complaintId = person.complaintId;
    dto.firstName = person.firstName;
    dto.gender = person.gender;
    dto.lastName = person.lastName;
    dto.middleName = person.middleName;
    dto.mobileNumber = person.mobileNumber;
    dto.office = person.office;
    dto.qualifier = person.qualifier;
    dto.title = person.title;
    dto.type = type;
    dto.unit = person.unit;
    return dto;
  }

}
