import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [AuthModule],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
  exports: [ProductService]
})
export class ProductModule {}
