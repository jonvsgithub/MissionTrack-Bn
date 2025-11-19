import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { successResponse } from '../utils/apiResponse';

export class UserController {
  create = async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body, req.user!.id);
    return successResponse(res, 201, 'User created', user);
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await userService.updateUser(id, req.body, req.user!.id);
    return successResponse(res, 200, 'User updated', user);
  };

  assignRole = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await userService.assignRole(id, req.body.role, req.user!.id);
    return successResponse(res, 200, 'Role updated', user);
  };

  disable = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await userService.disableUser(id, req.user!.id);
    return successResponse(res, 200, 'User disabled', user);
  };

  list = async (_req: Request, res: Response) => {
    const users = await userService.listUsers();
    return successResponse(res, 200, 'Users retrieved', users);
  };
}

export const userController = new UserController();

