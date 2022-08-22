import { Component } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  log(firstName) {
    console.log(firstName);
  }

}
