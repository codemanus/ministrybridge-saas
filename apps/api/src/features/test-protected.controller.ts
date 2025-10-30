import { Controller, Get, UseGuards } from '@nestjs/common';
import { SimpleFeatureFlagGuard } from '../guards/simple-feature-flag.guard.js';

@Controller('test-protected')
@UseGuards(SimpleFeatureFlagGuard)
export class TestProtectedController {
  
  @Get('campus')
  async getCampusData() {
    return {
      message: 'Campus data - protected by ui-campus feature flag',
      data: {
        campuses: ['Main Campus', 'North Campus', 'South Campus'],
        features: ['location-tracking', 'attendance-monitoring'],
      },
    };
  }

  @Get('groups')
  async getGroupsData() {
    return {
      message: 'Groups data - protected by ui-groups feature flag',
      data: {
        groups: ['Youth Group', 'Bible Study', 'Prayer Team'],
        features: ['member-management', 'event-scheduling'],
      },
    };
  }

  @Get('students')
  async getStudentsData() {
    return {
      message: 'Students data - protected by ui-students feature flag',
      data: {
        students: ['John Doe', 'Jane Smith', 'Bob Johnson'],
        features: ['registration', 'attendance-tracking'],
      },
    };
  }

  @Get('tech-prod')
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
