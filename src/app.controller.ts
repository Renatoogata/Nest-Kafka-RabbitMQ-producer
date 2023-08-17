import { Controller, Get } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9093'],
      },
      consumer: {
        groupId: 'ec-consumer',
      },
    },
  })
  client: ClientKafka;

  //Método em que não precisa esperar o outro serviço estar disponível
  // sendToStorage() {
  //   return this.client.emit('storage-ec', {
  //     message: 'remove ice cream from storage',
  //   });
  // }
  async onModuleInit() {
    this.client.subscribeToResponseOf('storage-ec');
    await this.client.connect();
  }

  //Método em que precisamos esperar o outro serviço estar disponível
  @Get()
  sendToStorage() {
    return this.client.send('storage-ec', {
      message: 'remove pizza from storage',
    });
  }
}
