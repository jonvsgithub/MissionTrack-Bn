declare namespace Express {
  interface User {
    id: string;
    role: string;
    organizationId?: string;
    email: string;
  }

  interface Request {
    user?: User;
  }
}



