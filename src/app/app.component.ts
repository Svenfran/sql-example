import { Component } from '@angular/core';
import { DatabaseService } from './services/database.service';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  constructor(
    private database: DatabaseService,
    private platform: Platform
  ) {
    this.initApp();
  }

  async initApp() {
    this.initBackButton();
    if (this.platform.is('mobile')) {
      await this.database.initializePlugin()
    }
  };

  initBackButton() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      App.exitApp();
    })
  }
}
