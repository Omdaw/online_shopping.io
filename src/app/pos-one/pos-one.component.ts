import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-pos-one',
  templateUrl: './pos-one.component.html',
  styleUrls: ['./pos-one.component.css']
})
export class PosOneComponent implements OnInit {

  constructor(private configService : ConfigService,) { }

  ngOnInit() {
    
  }

}
