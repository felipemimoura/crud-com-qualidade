import { todoController } from "@server/controller/todo";

export async function GET(request: Request) {
  return await todoController.get(request, response);
}

// import { NextApiRequest, NextApiResponse } from "next";

// export default function handler(
//   request: NextApiRequest,
//   response: NextApiResponse
// ) {
//   response.status(200).json({ message: "Olá mundo" });
// }
