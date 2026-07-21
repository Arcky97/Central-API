import { Request, Response } from "express";
import { BotRepliesService } from "../services/bot-replies.service";
import { getBotRepliesSchema } from "../schema/bot-replies.schema";

export class BotRepliesController {
  static async getReply(req: Request, res: Response) {
    const { uuid } = getBotRepliesSchema.parse(req.params);

    const data = await BotRepliesService.getReply(
      uuid
    );

    res.json(data);
  }

  static async listReplies(req: Request, res: Response) {
    const { limit } = getBotRepliesSchema.parse(req.query);

    const data = await BotRepliesService.listReplies(limit);

    res.json(data);
  }

  static async createReply(req: Request, res: Response) {

  }

  static async updateReply(req: Request, res: Response) {

  }

  static async removeReply(req: Request, res: Response) {
    
  }
}