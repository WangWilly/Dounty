import { IsString, IsEmail, IsBoolean, IsObject, IsOptional } from 'class-validator';

////////////////////////////////////////////////////////////////////////////////

export class SessionV1CreateResp {
  @IsBoolean()
  status!: boolean;

  @IsString()
  message!: string;

  @IsString()
  token!: string;
}

export class SessionV1CreateReq {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsObject()
  @IsOptional()
  user?: SessionV1CreateResp;
}
