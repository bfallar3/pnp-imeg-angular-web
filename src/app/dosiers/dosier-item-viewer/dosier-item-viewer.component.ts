import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { DosierItemServiceProxy } from '@shared/service-proxies/service-proxies';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dosier-item-viewer',
  templateUrl: './dosier-item-viewer.component.html',
  styleUrls: ['./dosier-item-viewer.component.css']
})
export class DosierItemViewerComponent implements OnInit, OnDestroy {

  sub: any;
  isPDF = false;
  isImage = false;
  pdfSrc: string;
  imageSrc: string;
  baseUrl: string;
  isDone = false;
  zoomConfig = '100%';

  constructor(
    private route: ActivatedRoute,
    private dosierItemService: DosierItemServiceProxy) {
  }

  ngOnInit(): void {
    this.baseUrl = AppConsts.remoteServiceBaseUrl + '/uploads/';
    this.sub = this.route.params.subscribe(params => {
      const id = params.id;
      const imagesExtensions = ['jpg', 'gif', 'bmp', 'png', 'jpeg'];
      this.dosierItemService.get(id)
        .pipe(
          finalize(() => {
            window.setTimeout(() => {
              this.isDone = true;
            }, 1000);
          })
        )
        .subscribe(item => {
        const filename = item.attachment;
        if (item.extension.toLowerCase() === 'pdf') {
          const path = this.baseUrl + filename;
          this.isPDF = true;
          this.pdfSrc = path;
        } else if (imagesExtensions.includes(item.extension.toLowerCase())) {
          this.imageSrc = this.baseUrl + filename;
          this.isImage = true;
        }
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
