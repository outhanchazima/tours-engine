import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTourDto {
  @ApiProperty({ example: 'Paris City Tour', description: 'Title of the tour' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Paris, France',
    description: 'Location where tour takes place',
  })
  @IsString()
  location: string;

  @ApiProperty({
    example: 'Explore the beautiful city of Paris...',
    description: 'Detailed tour description',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 7, description: 'Duration of tour in days' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 999.99, description: 'Price of the tour' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'EUR', description: 'Currency code for the price' })
  @IsString()
  currency: string;

  @ApiProperty({
    example: ['http://example.com/image1.jpg'],
    description: 'Array of tour image URLs',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  @ApiProperty({ example: 20, description: 'Maximum number of participants' })
  @IsNumber()
  @Min(0)
  capacity: number;
}
