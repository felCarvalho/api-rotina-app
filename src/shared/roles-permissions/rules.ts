export const RULES = {
  guest: 'GUEST',
  user: 'USER',
  admin: 'ADMIN',
} as const;

export const PERMISSIONS = {
  create: 'CREATE',
  delete: 'DELETE',
  update: 'UPDATE',
  read: 'READ',
} as const;
