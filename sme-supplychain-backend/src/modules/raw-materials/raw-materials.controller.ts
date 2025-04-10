import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
  } from '@nestjs/common'
  import { RawMaterialsService } from './raw-materials.service'
  import { RawMaterial } from '@/entities/raw-material.entity'
  
  @Controller('materials')
  export class RawMaterialsController {
    constructor(private readonly service: RawMaterialsService) {}
  
    @Get()
    findAll() {
      return this.service.findAll()
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.service.findOne(+id)
    }
  
    @Post()
    create(@Body() data: Partial<RawMaterial>) {
      return this.service.create(data)
    }
  
    @Put(':id')
    update(@Param('id') id: string, @Body() data: Partial<RawMaterial>) {
      return this.service.update(+id, data)
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.service.remove(+id)
    }
  }