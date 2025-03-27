import { Injectable, signal, WritableSignal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_TODO = "tododb";

export interface Todo {
  id: number;
  description: string;
  done: number;
  isEditing: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private todos: WritableSignal<Todo[]> = signal<Todo[]>([])

  constructor() { }

  async initializePlugin() {
    this.db = await this.sqlite.createConnection(
      DB_TODO,
      false,
      'no-encryption',
      1,
      false
    );

    await this.db.open();

    const schema = `CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    done INTEGER DEFAULT 0,
    isEditing INTEGER DEFAULT 0);`;
   
    await this.db.execute(schema);
    this.loadTodos();
    return true;
  }

  public getTodos() {
    return this.todos;
  }

  async loadTodos() {
    const todos = await this.db.query('SELECT * FROM todos;');
    this.todos.set(todos.values || []);
  }

  async addTodo(description: string) {
    const query = `INSERT INTO todos (description) VALUES (?)`;
    const result = await this.db.query(query, [description]);

    this.loadTodos();

    return result;
  }

  async updateTodoById(id: string, description: string, done: number) {
    const query = `UPDATE todos SET description = ?, done = ? WHERE id = ?`;
    const result = await this.db.query(query, [description, done, id]);

    this.loadTodos();

    return result;
  }

  async deleteTodoById(id: string) {
    const query = `DELETE FROM todos WHERE id = ?`;
    const result = await this.db.query(query, [id]);

    this.loadTodos();

    return result;
  }

  async deleteActiveTodos() {
    const query  = `DELETE FROM todos WHERE done = ?`;
    const result = await this.db.query(query, [1]);

    this.loadTodos();

    return result;
  }
}
