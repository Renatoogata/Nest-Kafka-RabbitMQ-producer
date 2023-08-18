import { Controller, Get } from '@nestjs/common';
import { Client, ClientRMQ, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Client({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'storage-ec',
      queueOptions: {
        durable: false,
      },
    },
  })
  client: ClientRMQ;

  //Método em que não precisa esperar o outro serviço estar disponível
  // sendToStorage() {
  //   return this.client.emit('storage-ec', {
  //     message: 'remove ice cream from storage',
  //   });
  // }

  //Método em que precisamos esperar o outro serviço estar disponível
  @Get()
  sendToStorage() {
    return this.client.send('storage-ec', {
      message: 'remove chicken from storage',
    });
  }
}
