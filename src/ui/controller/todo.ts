import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

interface TodoControllerGetParams {
  page: number;
}
async function get({ page }: TodoControllerGetParams) {
  return await todoRepository.get({ page: page || 1, limit: 2 });
}

function filterTodosByContent<T>(
  search: string,
  todos: Array<T & { content: string }>
): T[] {
  const homeTodos = todos.filter((todo) => {
    const searchNormalized = search.toLowerCase();
    const contentNormalized = todo.content.toLowerCase();
    return contentNormalized.includes(searchNormalized);
  });

  return homeTodos;
}

interface TodoControllerCreateParams {
  content?: string;
  onError: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: (todo: Todo) => void;
}
async function create({
  content,
  onError,
  onSuccess,
}: TodoControllerCreateParams) {
  // Fail fast validation
  // if no has content
  const parsedParams = schema.string().min(1).safeParse(content);
  if (!parsedParams.success) {
    onError();
    return;
  }

  await todoRepository
    .createByContent(parsedParams.data)
    .then((newTodo) => {
      onSuccess(newTodo);
    })
    .catch(() => {
      onError();
    });
}

interface TodoControllerToggleDoneParams {
  id: string;
  updatedTodoOnScreen: () => void;
}
async function toggleDone({
  id,
  updatedTodoOnScreen,
}: TodoControllerToggleDoneParams) {
  todoRepository.toggleDone(id).then(() => {
    updatedTodoOnScreen();
  });
}
export const todoController = {
  get,
  filterTodosByContent,
  create,
  toggleDone,
};
