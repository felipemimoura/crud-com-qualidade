import fs from "fs";
import { v4 as uuid } from "uuid";
const DB_FILE_PATH = "./core/db";

interface Todo {
  id: string;
  date: string;
  content: string;
  done: boolean;
}

export function create(content: string): Todo {
  const todo: Todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content: content,
    done: false,
  };

  const todos: Array<Todo> = [...read(), todo];

  //Salvar o content no sistema
  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2
    )
  );
  return todo;
}

export function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf8"); // Leitura dos arquivos

  const db = JSON.parse(dbString || "{}");

  if (!db.todos) {
    // Fail fast validation
    return [];
  }
  return db.todos;
}

export function update(id: string, partialTodo: Partial<Todo>): Todo {
  let updatedTodo;
  // Buscar todas as todos
  const todos = read();

  todos.forEach((currentTodo) => {
    const isToUpdate = currentTodo.id === id;

    if (isToUpdate) {
      updatedTodo = Object.assign(currentTodo, partialTodo);
    }
  });

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ todos }, null, 2));

  if (!updatedTodo) {
    throw new Error("Please, provide another Id");
  }

  return updatedTodo;
}

export function deleteById(id: string) {
  // get all todos
  const todos = read();

  const todosWithoutOne = todos.filter((todo) => {
    return todo.id !== id;
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos: todosWithoutOne,
      },
      null,
      2
    )
  );
}

export function CLEAR_DB() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

// [Simulation]
// CLEAR_DB();
// create("Primeira tudo");
// const secondTodo = create("Segunda tudo");

// deleteById(secondTodo.id);
// update(secondTodo.id, {
//   content: "Segunda TODO com novo content",
//   done: true,
// });
