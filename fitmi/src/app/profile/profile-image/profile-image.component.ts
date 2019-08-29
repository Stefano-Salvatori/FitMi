import { Component, OnInit } from '@angular/core';
import { serverAddress } from 'src/server-data';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss'],
})
export class ProfileImageComponent implements OnInit {


  serverAddress = serverAddress;
  availableProfileImages: string[] = [
    'boy-1.svg',
    'boy.svg',
    'girl-1.svg',
    'girl.svg',
    'man-1.svg',
    'man-2.svg',
    'man-3.svg',
    'man-4.svg',
    'man.svg'
  ];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  dismiss(chosenImage: string) {
    this.modalCtrl.dismiss({
      dismissed: true,
      image: chosenImage
    });
  }

}
