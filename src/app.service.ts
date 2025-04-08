import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { message: 'Hello World!' };
  }

  health() {
    return { message: 'This is an healthy endpoint' };
  }
}
