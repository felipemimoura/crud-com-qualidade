interface TodoRepositoryGetParams {
  page: number;
  limit: number;
}
interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  pages: number;
}
function get({
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
export const todoRepository = {
  get,
};
// Model/schema
interface Todo {
  id: string;
  content: string;
  date: Date;
  done: boolean;
}

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
          date: new Date(date),
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
