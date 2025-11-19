import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { successResponse } from '../utils/apiResponse';

type RegisterOrganizationBody = {
  name: string;
  province: string;
  district: string;
  sector: string;
  email: string;
  phone: string;
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  password: string;
};

export class AuthController {
  registerOrganization = async (req: Request, res: Response) => {
    const payload = req.body as RegisterOrganizationBody;
    const organization = await authService.registerOrganization({
      name: payload.name,
      province: payload.province,
      district: payload.district,
      sector: payload.sector,
      email: payload.email,
      phone: payload.phone,
      contactPersonName: payload.contactPersonName,
      contactPersonPhone: payload.contactPersonPhone,
      contactPersonEmail: payload.contactPersonEmail,
      password: payload.password,
      proofDocument: req.file?.path || null
    });
    return successResponse(res, 201, 'Organization registered successfully', organization);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return successResponse(res, 200, 'Authenticated', result);
  };

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const token = await authService.refresh(refreshToken);
    return successResponse(res, 200, 'Token refreshed', token);
  };
}

export const authController = new AuthController();

