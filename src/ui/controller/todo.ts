import { todoRepository } from "@ui/repository/todo";

interface TodoControllerGetParams {
  page: number;
}
async function get({ page }: TodoControllerGetParams) {
  return todoRepository.get({ page: page || 1, limit: 2 });
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
export const todoController = {
  get,
  filterTodosByContent,
};
