import { Component, effect, ViewChild } from '@angular/core';
import { DatabaseService, Todo } from '../services/database.service';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  @ViewChild('inputRef', { static: false }) inputElement!: IonInput;
  todos = this.database.getTodos();
  newTodoDescription = '';

  constructor(private database: DatabaseService) {
    effect(() => {
      console.log('TODO CHANGED', this.todos());
    });
  }

  enableEditing(todo: Todo) {
    this.todos().forEach(t => {
      t.isEditing = 0;
    });
    todo.isEditing = 1;

    setTimeout(() => {
      this.inputElement.setFocus();
    }, 0);
  }

  disableEditing(todo: Todo) {
    todo.isEditing = 0;
    this.database.loadTodos();
  }

  async createTodo() {
    await this.database.addTodo(this.newTodoDescription.trim());
    this.newTodoDescription = '';
  }

  updateTodo(todo: Todo) {
    const done = todo.done ? 1 : 0;
    this.database.updateTodoById(todo.id.toString(), todo.description.trim(), done);
    todo.isEditing = 0;
  }

  deleteTodo(todo: Todo) {
    this.database.deleteTodoById(todo.id.toString());
  }

  deleteActiveTodos() {
    this.database.deleteActiveTodos();
  }
}
