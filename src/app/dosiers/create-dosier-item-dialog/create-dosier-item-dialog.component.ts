import { DosierItemDto } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-dosier-item-dialog',
  templateUrl: './create-dosier-item-dialog.component.html',
  styleUrls: ['./create-dosier-item-dialog.component.css']
})
export class CreateDosierItemDialogComponent extends AppComponentBase implements OnInit {

  saving = false;
  item = new DosierItemDto();
  base64content: string;
  @Output() onSave = new EventEmitter<any>();

  constructor(injector: Injector,
    public bsModalRef: BsModalRef) {
    super(injector);
  }

  ngOnInit(): void {
  }

  save(): void {
    this.saving = true;
    this.bsModalRef.hide();
    this.onSave.
      emit();
  }

  handleAttachment(event) {
    const validExtensions = ['pdf', 'jpg', 'gif', 'bmp', 'tiff', 'png', 'jpeg', 'txt', 'avi', 'mp4', '3gp', 'mov'];
    const file = <File>event.target.files[0];
    const extension = file.name.split('.').pop();
    if (!validExtensions.includes(extension)) {
      this.item.attachment = null;
      abp.message.warn(`File extension (${extension}) is not supported as attachment`, 'Upload');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.base64content = reader.result.toString();
    };
  }

}
