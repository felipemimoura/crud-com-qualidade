import { Todo, TodoSchema } from "@ui/schema/todo";
import { z as schema } from "zod";
interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}
interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}
async function get({
  page,
  limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
  return fetch(`api/todos?page=${page}&limit=${limit}`).then(
    async (responseFromServer) => {
      const stringTodos = await responseFromServer.text();
      const responseParsed = parseTodosFromServer(JSON.parse(stringTodos));

      return {
        todos: responseParsed.todos,
        total: responseParsed.total,
        pages: responseParsed.pages,
      };
    }
  );
}

export async function createByContent(content: string): Promise<Todo> {
  const response = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      content,
    }),
  });

  if (response.ok) {
    const serverResponse = await response.json();

    const ServerResponseSchema = schema.object({
      todo: TodoSchema,
    });

    const serverResponseParsed = ServerResponseSchema.safeParse(serverResponse);
    if (!serverResponseParsed.success) {
      throw new Error("Failed to create todo");
    }
    const todo = serverResponseParsed.data.todo;
    return todo;
  }

  throw new Error("Failed to crete todo :(");
}

async function toggleDone(id: string): Promise<Todo> {
  const response = await fetch(`/api/todos/${id}/toggle-done`, {
    method: "PUT",
  });
  if (response.ok) {
    const serverResponse = await response.json();
    const ServerResponseSchema = schema.object({
      todo: TodoSchema,
    });

    const serverResponseParsed = ServerResponseSchema.safeParse(serverResponse);
    if (!serverResponseParsed.success) {
      throw new Error(`Failed to update todo with id ${id}`);
    }
    const updatedTodo = serverResponseParsed.data.todo;
    return updatedTodo;
  }

  throw new Error("Server Error");
}

async function deleteById(id: string) {
  const response = await fetch(`api/todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete");
  }
}
export const todoRepository = {
  get,
  createByContent,
  toggleDone,
  deleteById,
};

function parseTodosFromServer(responseBody: unknown): {
  total: number;
  pages: number;
  todos: Array<Todo>;
} {
  if (
    responseBody !== null &&
    typeof responseBody === "object" &&
    "todos" in responseBody && //check if has key todos
    "total" in responseBody && //check if has key todos
    "page" in responseBody && //check if has key todos
    Array.isArray(responseBody.todos)
  ) {
    return {
      total: Number(responseBody.total),
      pages: Number(responseBody.page),
      todos: responseBody.todos.map((todo: unknown) => {
        if (todo === null && typeof todo !== "object") {
          throw new Error("Invalid todo from API");
        }
        const { id, content, date, done } = todo as {
          id: string;
          content: string;
          date: string;
          done: string;
        };

        return {
          id,
          content,
          done: String(done).toLowerCase() === "true",
          date: date,
        };
      }),
    };
  }

  return {
    pages: 1,
    total: 0,
    todos: [],
  };
}
