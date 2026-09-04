import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { UserRole } from '@merchantpilot/database';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TenantId } from '../auth/decorators/tenant-id.decorator';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@ApiTags('Dashboard')
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
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get comprehensive merchant executive dashboard metrics',
    description:
      "Aggregates today's and all-time revenue, order breakdowns, product catalog health, inventory units/alerts, top-selling SKUs, and recent orders."
  })
  @ApiResponse({
    status: 200,
    description: 'Executive dashboard analytics retrieved successfully',
    type: DashboardResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getMetrics(@TenantId() tenantId: string): Promise<DashboardResponseDto> {
    return this.dashboardService.getMetrics(tenantId);
  }
}
