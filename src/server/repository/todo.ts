import { read } from "@db-crud-todo";
interface TodoRepositoryGetParams {
  page?: number;
  limit?: number;
}

interface TodoRepositoryGetOutput {
  todos: Todo[];
  total: number;
  page: number;
}
function get({
  limit,
  page,
}: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput {
  const currentPage = page || 1;
  const currentLimit = limit || 10;

  const ALL_TODOS = read();

  const startIndex = (currentPage - 1) * currentLimit;
  const endIndex = currentPage * currentLimit;
  const paginatedTodos = ALL_TODOS.slice(startIndex, endIndex);

  const totalPage = Math.ceil(ALL_TODOS.length / currentLimit);

  return { todos: paginatedTodos, total: ALL_TODOS.length, page: totalPage };
}

export const todoRepository = {
  get,
};

// Model/schema
interface Todo {
  id: string;
  content: string;
  date: string;
  done: boolean;
}
