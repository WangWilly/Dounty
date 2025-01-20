import { IsString, IsBoolean } from "class-validator";

////////////////////////////////////////////////////////////////////////////////

export class LocalValidateV1Resp {
  @IsBoolean()
  status!: boolean;

  @IsString()
  message!: string;

  @IsString()
  token!: string;
}
