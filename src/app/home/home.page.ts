import { Component, effect, ViewChild } from '@angular/core';
import { DatabaseService, User } from '../services/database.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  @ViewChild('inputRef', { static: false }) inputElement!: IonInput;
  users = this.database.getUsers();
  newUserName = '';

  constructor(private database: DatabaseService) {
    effect(() => {
      console.log('USER CHANGED', this.users());
    });
  }

  enableEditing(user: User) {
    this.users().forEach(u => {
      u.isEditing = 0;
    });
    user.isEditing = 1;

    setTimeout(() => {
      this.inputElement.setFocus();
    }, 0);
  }

  disableEditing(user: User) {
    user.isEditing = 0;
    this.database.loadUsers();
  }

  async createUser() {
    await this.database.addUser(this.newUserName);
    this.newUserName = '';
  }

  updateUser(user: User) {
    const active = user.active ? 1 : 0;
    this.database.updateUserById(user.id.toString(), user.name.trim(), active);
    user.isEditing = 0;
  }

  deleteUser(user: User) {
    this.database.deleteUserById(user.id.toString());
  }
}
