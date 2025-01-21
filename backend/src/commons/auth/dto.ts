import { IsString, IsBoolean, IsEmail } from 'class-validator';

////////////////////////////////////////////////////////////////////////////////

export class LocalValidateV1Resp {
  @IsBoolean()
  status!: boolean;

  @IsString()
  message!: string;

  @IsString()
  token!: string;
}

////////////////////////////////////////////////////////////////////////////////

export class JwtPayload {
  @IsEmail()
  email!: string;

  @IsString()
  sub!: string;
}

export class JwtValidateV1Resp {
  @IsString()
  userId!: string;

  @IsString()
  email!: string;
}
