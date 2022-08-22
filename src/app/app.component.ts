import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { CommonService } from './common.service';

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Ecommerce-noque';

  constructor(private configService: ConfigService,
    public commonService : CommonService,
    router: Router) {

    this.configService.getStoreData();

    const navEndEvents = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    );

    navEndEvents.subscribe((event: NavigationEnd) => {
      gtag('config', 'GTM-W2SD9SM', {
        'page_path': event.urlAfterRedirects
      });
    });
  }

  ngOnInit() {
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

}
