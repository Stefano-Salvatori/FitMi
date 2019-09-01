import { Component, OnInit, Input } from '@angular/core';
import { Badge } from 'src/model/badge';
import { serverAddress } from 'src/server-data';

@Component({
  selector: 'app-badge-popover',
  templateUrl: './badge-popover.component.html',
  styleUrls: ['./badge-popover.component.scss'],
})
export class BadgePopoverComponent implements OnInit {

  @Input() badge: Badge<any>;
  public server = serverAddress;
  constructor() {

  }

  ngOnInit() {}

}
