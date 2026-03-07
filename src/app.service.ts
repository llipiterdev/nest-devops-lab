import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly version = '0.0.1';

  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): { status: string; version: string; timestamp: string } {
    return {
      status: 'ok',
      version: this.version,
      timestamp: new Date().toISOString(),
    };
  }
}
