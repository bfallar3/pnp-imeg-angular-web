import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  selector: 'app-edit-complaint',
  templateUrl: './edit-complaint.component.html',
  styleUrls: ['./edit-complaint.component.css'],
  animations: [appModuleAnimation()]
})
export class EditComplaintComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
