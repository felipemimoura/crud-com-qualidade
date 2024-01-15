import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";

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
  if (!content) {
    onError();
    return;
  }

  await todoRepository
    .createByContent(content)
    .then((newTodo) => {
      onSuccess(newTodo);
    })
    .catch(() => {
      onError();
    });
}
export const todoController = {
  get,
  filterTodosByContent,
  create,
};
