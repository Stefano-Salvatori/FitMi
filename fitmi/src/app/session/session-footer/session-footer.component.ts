import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionDataService } from '../session-data.service';
import { PopoverController } from '@ionic/angular';
import { SessionRecapComponent } from '../session-recap/session-recap.component';

@Component({
  selector: 'app-session-footer',
  templateUrl: './session-footer.component.html',
  styleUrls: ['./session-footer.component.scss'],
})
export class SessionFooterComponent implements OnInit {
  currentPopover: HTMLIonPopoverElement;

  constructor(private router: Router,
              private session: SessionDataService,
              public popoverController: PopoverController) { }

  ngOnInit() { }

  endSession() {
    this.session.stopSession();
    this.router.navigateByUrl('tabs/home').then(r => {
      this.presentSessionPopover();
    });
  }
  async presentSessionPopover() {
    await this.popoverController.create({
      translucent: true,
      component: SessionRecapComponent,
      componentProps: {
        session: this.session.getFitnessSession(),
        controller: this
      },
      showBackdrop: true,
      cssClass: 'session-popover-style',
    }).then(popover => {
      popover.present();
      this.currentPopover = popover;
    });
  }

  dismissPopover() {
    this.currentPopover.dismiss();
  }

}
