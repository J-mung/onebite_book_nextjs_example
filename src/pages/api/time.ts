import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentTime = new Date().toLocaleDateString();
  res.status(200).json({ currentTime });
}
