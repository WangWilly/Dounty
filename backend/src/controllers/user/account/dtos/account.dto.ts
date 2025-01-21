import { IsString, IsEmail, IsBoolean } from 'class-validator';

////////////////////////////////////////////////////////////////////////////////

export class AccountV1CreateReq {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class AccountV1CreateResp {
  @IsBoolean()
  status!: boolean;

  @IsString()
  message!: string;
}

export class AccountV1GetResp {
  @IsEmail()
  email!: string;
}
