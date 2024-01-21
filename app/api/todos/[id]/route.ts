import { todoController } from "@server/controller/todo";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  return new Response(`Eu sou o ID: ${id}`, {
    status: 200,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return todoController.deleteById(request, params.id);
}

// import { todoController } from "@server/controller/todo";
// import { NextApiRequest, NextApiResponse } from "next";
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "DELETE") {
//     await todoController.deleteById(req, res);
//     return;
//   }

//   res.status(405).json({ error: { message: "Method not allowed" } });
// }
