import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { AppError } from '../utils/appError';

export const userController = {
  // List all users (admin only)
  listUsers: async (req: Request, res: Response) => {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  },

  // Get user by ID
  getUserById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['passwordHash'] },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  },

  // Update user status (admin only)
  updateUserStatus: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status value
    if (!['active', 'disabled'].includes(status)) {
      throw new AppError('Invalid status value. Must be "active" or "disabled"', 400);
    }

    const user = await User.findByPk(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Prevent admin from disabling themselves
    if (user.id === req.user?.id && status === 'disabled') {
      throw new AppError('You cannot disable your own account', 400);
    }

    await user.update({ status });

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      data: user,
    });
  },
};

