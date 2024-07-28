import { ApiProperty } from "@nestjs/swagger";

export class UserProfileDataDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "John Doe" })
  name: string;

  @ApiProperty({ example: "johndoe@example.com" })
  email: string;

  @ApiProperty({ example: null })
  avatar: string | null;

  @ApiProperty({ example: "admin" })
  role: string;
}

export class UserProfileResponseDto {
  @ApiProperty({ example: "User profile fetch successful" })
  message: string;

  @ApiProperty({ example: "success" })
  status: string;

  @ApiProperty()
  data: UserProfileDataDto;
}
