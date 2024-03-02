import { Module } from '@nestjs/common';
import { GraphStoreController } from './graph-store.controller';
import { GraphStoreService } from './graph-store.service';
import {
  Queues,
  RmqModule,
  Services,
  neo4jConfig,
  rmqConfig,
  schemaConfig,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j';
import { NodeHelper } from './cyphers/helpers/node.helper';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: schemaConfig,
      load: [rmqConfig, neo4jConfig],
      isGlobal: true,
    }),
    RmqModule,
    RmqModule.register({
      name: Services.Bot,
      queue: Queues.Bot,
    }),
    Neo4jModule.forRootAsync({
      import: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('neo4j'),
      inject: [ConfigService],
    }),
  ],
  controllers: [GraphStoreController],
  providers: [GraphStoreService, NodeHelper],
})
export class GraphStoreModule {}
