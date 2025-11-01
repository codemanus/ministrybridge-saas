import { Controller, Get, UseGuards } from '@nestjs/common';
import { RbacGuard } from '../guards/rbac.guard.js';
import { RequirePermission } from '../decorators/require-permission.decorator.js';

@Controller('test-protected')
@UseGuards(RbacGuard)
export class TestProtectedController {
  
  @Get('campus')
  @RequirePermission('ui_campus')
  async getCampusData() {
    return {
      message: 'Campus data - protected by ui-campus feature flag',
      data: {
        campuses: ['Main Campus', 'Lexington Campus', 'West Campus'],
        features: ['location-tracking', 'attendance-monitoring'],
      },
    };
  }

  @Get('groups')
  @RequirePermission('ui_groups')
  async getGroupsData() {
    return {
      message: 'Groups data - protected by ui-groups feature flag',
      data: {
        groups: ['Community Group', 'Bible Study', 'Prayer Team'],
        features: ['member-management', 'event-scheduling'],
      },
    };
  }

  @Get('students')
  @RequirePermission('ui_students')
  async getStudentsData() {
    return {
      message: 'Students data - protected by ui-students feature flag',
      data: {
        features: ['registration', 'attendance-tracking', 'progress-tracking'],
      },
    };
  }

  @Get('tech-prod')
  @RequirePermission('ui_tech_prod')
  async getTechProdData() {
    return {
      message: 'Tech & Production data - protected by ui-tech-prod feature flag',
      data: {
        services: ['Audio', 'Video', 'Lighting'],
        features: ['equipment-management', 'service-scheduling'],
      },
    };
  }

  @Get('public')
  async getPublicData() {
    return {
      message: 'Public data - no feature flag required',
      data: {
        info: 'This endpoint is accessible to everyone',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
