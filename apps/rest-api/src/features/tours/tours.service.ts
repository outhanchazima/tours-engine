import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../shared/pagination/pagination.dto';
import {
  PaginatedResponseDto,
  PaginationHelper,
} from '../../shared/pagination/pagination.helper';
import { AppError } from '../../shared/utils/error.util';
import { Tour } from '../database/entities/tour.entity';
import { User } from '../database/entities/user.entity';
import { CreateTourDto } from './dto/create-tour.dto';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>
  ) {}

  /**
   * Creates a new tour
   * @param {CreateTourDto} createTourDto - The tour data
   * @param {Tour} creator - The user creating the tour
   * @returns {Promise<Tour>} The created tour
   */
  async create(createTourDto: CreateTourDto, creator: User): Promise<Tour> {
    const tour = this.tourRepository.create({
      ...createTourDto,
      createdBy: creator,
    });
    return this.tourRepository.save(tour);
  }

  /**
   * Find users with advanced pagination and filtering
   *
   * @param {PaginationDto} paginationDto - Pagination parameters
   * @param {Record<string, any>} filters - Additional filters
   * @returns {Promise<PaginatedResponseDto<Tour>>} Paginated users
   */
  async findAllWithPagination(
    paginationDto: PaginationDto,
    filters: Record<string, any> = {}
  ): Promise<PaginatedResponseDto<Tour>> {
    // Create query builder
    const queryBuilder = this.tourRepository.createQueryBuilder('tours');

    // Apply filters with partial and exact match options
    const filteredQuery = PaginationHelper.applyFilters(queryBuilder, filters, {
      partialMatch: ['location', 'title', 'duration', 'price'],
      exactMatch: ['isActive', 'capacity'],
    });

    // Execute paginated query
    const [tours, total] = await filteredQuery
      .take(paginationDto.limit)
      .skip((paginationDto.page - 1) * paginationDto.limit)
      .getManyAndCount();

    // Create paginated response
    return PaginationHelper.createPaginatedResponse(
      tours,
      total,
      paginationDto
    );
  }

  /**
   * Retrieves all active tours
   * @returns {Promise<Tour[]>} Array of tours
   */
  async findAll(): Promise<Tour[]> {
    return this.tourRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Finds a tour by its ID
   * @param {string} id - The tour ID
   * @returns {Promise<Tour>} The found tour
   * @throws {AppError} When tour is not found
   */
  async findById(id: string): Promise<Tour> {
    const tour = await this.tourRepository.findOne({
      where: { id, isActive: true },
    });

    if (!tour) {
      throw AppError.notFound('Tour not found', 'ERR_TOUR_404');
    }

    return tour;
  }

  /**
   * Updates a tour
   * @param {string} id - Tour ID
   * @param {CreateTourDto} updateTourDto - Updated tour data
   * @returns {Promise<Tour>} Updated tour
   */
  async update(id: string, updateTourDto: CreateTourDto): Promise<Tour> {
    const tour = await this.findById(id);
    Object.assign(tour, updateTourDto);
    return this.tourRepository.save(tour);
  }

  /**
   * Soft deletes a tour
   * @param {string} id - Tour ID
   * @returns {Promise<void>}
   */
  async remove(id: string): Promise<void> {
    const tour = await this.findById(id);
    tour.isActive = false;
    await this.tourRepository.save(tour);
  }
}
