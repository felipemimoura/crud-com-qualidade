import { HttpNotFoundError } from "@server/infra/errors";
import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";

async function get(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = {
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  };
  const page = Number(query.page);
  const limit = Number(query.limit);

  if (query.page && isNaN(page)) {
    return new Response(
      JSON.stringify({
        error: {
          message: "Page must be a number",
        },
      }),
      {
        status: 400,
      }
    );
  }
  if (query.limit && isNaN(limit)) {
    return new Response(
      JSON.stringify({
        error: {
          message: "limit must be a number",
        },
      }),
      { status: 400 }
    );
  }

  try {
    const output = await todoRepository.get({
      page: page,
      limit: limit,
    });

    return new Response(
      JSON.stringify({
        total: output.total,
        page: output.page,
        todos: output.todos,
      }),
      {
        status: 200,
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        error: {
          message: "Fail to fetch TODOs",
        },
      }),
      { status: 400 }
    );
  }
}

const TodoCreateBodySchema = schema.object({
  content: schema.string(),
});
async function create(req: Request) {
  // fail fast validation
  const body = TodoCreateBodySchema.safeParse(await req.json());
  if (!body.success) {
    return new Response(
      JSON.stringify({
        error: {
          message: "You need to provide a content to create a todo",
          description: body.error.issues,
        },
      }),
      {
        status: 400,
      }
    );
  }

  try {
    const createdTodo = await todoRepository.createByContent(body.data.content);

    return new Response(
      JSON.stringify({
        todo: createdTodo,
      }),
      {
        status: 201,
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        error: {
          message: "Failed to create todo",
        },
      }),
      {
        status: 400,
      }
    );
  }
}

async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
  const todoId = req.query.id;

  if (!todoId || typeof todoId !== "string") {
    res.status(400).json({
      error: {
        message: "You must to provide a string Id",
      },
    });
    return;
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(todoId);
    // Get repository

    res.status(200).json({
      todo: updatedTodo,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(404).json({
        error: {
          message: err.message,
        },
      });
    }
  }
}

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
  //TODO Validate query schema
  const QuerySchema = schema.object({
    id: schema.string().uuid().min(1),
  });
  // Fail fast
  const parsedQuery = QuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    res.status(400).json({
      error: {
        message: `You most provide a valid id`,
      },
    });
    return;
  }

  try {
    const todoId = parsedQuery.data.id;
    await todoRepository.deleteById(todoId);
    res.status(204).end();
  } catch (err) {
    if (err instanceof HttpNotFoundError) {
      return res.status(err.status).json({
        error: {
          message: err.message,
        },
      });
    }
    res.status(500).json({
      error: {
        message: `Internal server error`,
      },
    });
  }
}
export const todoController = {
  get,
  create,
  toggleDone,
  deleteById,
};
