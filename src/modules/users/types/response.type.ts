import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({
    description: 'Message describing the result of the operation',
    example: 'User operation successful',
  })
  message: string;

  @ApiProperty({
    description: 'Data returned by the operation',
  })
  data: T;

  constructor(response: { message: string; data: T }) {
    this.message = response.message;
    this.data = response.data;
  }
}
