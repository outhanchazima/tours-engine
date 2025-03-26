import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActiveUser } from '../../shared/decorators/active-user.decorator';
import { Public } from '../../shared/decorators/public.decorator';
import { Roles } from '../../shared/decorators/roles.decorator';
import {
  Filterable,
  Paginate,
} from '../../shared/pagination/pagination.decorator';
import { PaginationDto } from '../../shared/pagination/pagination.dto';
import { Tour } from '../database/entities/tour.entity';
import { User } from '../database/entities/user.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { ToursService } from './tours.service';

@ApiTags('tours')
@Controller('tours')
@ApiBearerAuth()
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  @Roles('admin', 'guide')
  @ApiOperation({ summary: 'Create a new tour' })
  @ApiResponse({
    status: 201,
    description: 'The tour has been successfully created.',
    type: Tour,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(
    @Body() createTourDto: CreateTourDto,
    @ActiveUser() user: User
  ): Promise<Tour> {
    return this.toursService.create(createTourDto, user);
  }

  /**
   * Get paginated and filtered list of users
   *
   * @param {PaginationDto} query - Pagination and filter parameters
   * @returns {Promise<PaginatedResponseDto<User>>} Paginated users
   */
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all tours' })
  @Paginate()
  @Filterable(['name', 'email', 'status'])
  async findAll(@Query() query: PaginationDto) {
    // Extract filters from query
    const { page, limit, sortBy, sortOrder, ...filters } = query;
    return this.toursService.findAllWithPagination(
      { page, limit, sortBy, sortOrder },
      filters
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tour by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the tour.',
    type: Tour,
  })
  @ApiResponse({ status: 404, description: 'Tour not found.' })
  async findOne(@Param('id') id: string): Promise<Tour> {
    return this.toursService.findById(id);
  }

  @Put(':id')
  @Roles('admin', 'guide')
  @ApiOperation({ summary: 'Update a tour' })
  @ApiResponse({
    status: 200,
    description: 'The tour has been successfully updated.',
    type: Tour,
  })
  async update(
    @Param('id') id: string,
    @Body() updateTourDto: CreateTourDto
  ): Promise<Tour> {
    return this.toursService.update(id, updateTourDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a tour' })
  @ApiResponse({
    status: 200,
    description: 'The tour has been successfully deleted.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.toursService.remove(id);
  }
}
