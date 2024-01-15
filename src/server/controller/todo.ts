import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);

  if (query.page && isNaN(page)) {
    return res.status(400).json({
      error: {
        message: "Page must be a number",
      },
    });
  }
  if (query.limit && isNaN(limit)) {
    return res.status(400).json({
      error: {
        message: "limit must be a number",
      },
    });
  }

  const output = todoRepository.get({
    page: page,
    limit: limit,
  });

  res.status(200).json(output);
}

const TodoCreateBodySchema = schema.object({
  content: schema.string(),
});
async function create(req: NextApiRequest, res: NextApiResponse) {
  // fail fast validation
  const body = TodoCreateBodySchema.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({
      error: {
        message: "You need to provide a content to create a todo",
        description: body.error.issues,
      },
    });
    return;
  }

  // Here we have the data
  const createdTodo = await todoRepository.createByContent(body.data.content);
  res.status(201).json({
    todo: createdTodo,
  });
}
export const todoController = {
  get,
  create,
};
