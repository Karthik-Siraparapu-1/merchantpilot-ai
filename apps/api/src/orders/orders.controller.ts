import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  Inject
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiParam
} from '@nestjs/swagger';
import { UserRole } from '@merchantpilot/database';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantId } from '../auth/decorators/tenant-id.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { OrderResponseDto, OrderListResponseDto } from './dto/order-response.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@ApiHeader({
  name: 'x-tenant-id',
  required: true,
  description: 'Merchant Tenant UUID for multi-tenant isolation'
})
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
@Roles(
  UserRole.MERCHANT_OWNER,
  UserRole.MERCHANDISER,
  UserRole.SUPPORT_AGENT,
  UserRole.PLATFORM_OPERATOR
)
@Controller('orders')
export class OrdersController {
  constructor(@Inject(OrdersService) private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new order',
    description:
      'Creates an order with items, atomically decrements inventory in a transaction, synchronizes out-of-stock statuses, and records audit trail.'
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: () => OrderResponseDto
  })
  @ApiResponse({ status: 400, description: 'Insufficient stock or invalid product' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @TenantId() tenantId: string,
    @Body() dto: CreateOrderDto,
    @CurrentUser('id') userId: string
  ): Promise<OrderResponseDto> {
    return this.ordersService.create(tenantId, dto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List orders with search and filtering',
    description:
      'Retrieves paginated orders for the authenticated merchant tenant with status and store filters.'
  })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    type: () => OrderListResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @TenantId() tenantId: string,
    @Query() query: QueryOrderDto
  ): Promise<OrderListResponseDto> {
    return this.ordersService.findAll(tenantId, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get order details by ID',
    description:
      'Fetches details of a specific order including line items, customer details, and store.'
  })
  @ApiParam({ name: 'id', description: 'Order UUID', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Order details retrieved successfully',
    type: () => OrderResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<OrderResponseDto> {
    return this.ordersService.findOne(tenantId, id);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update order status lifecycle',
    description:
      'Transitions order status (e.g. PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED). If cancelled or refunded, inventory is automatically replenished.'
  })
  @ApiParam({ name: 'id', description: 'Order UUID', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    type: () => OrderResponseDto
  })
  @ApiResponse({ status: 400, description: 'Validation failure' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser('id') userId: string
  ): Promise<OrderResponseDto> {
    return this.ordersService.updateStatus(tenantId, id, dto, userId);
  }
}
