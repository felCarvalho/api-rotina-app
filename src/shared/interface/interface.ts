export interface RefreshTokenPayload {
  identifier: string;
  sub: string;
  role: string;
  exp: number;
  iat: number;
  tokenId: string;
}

export type AccessTokenPayload = Omit<RefreshTokenPayload, 'tokenId'>;
