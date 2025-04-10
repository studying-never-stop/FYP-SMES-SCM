import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
  } from '@nestjs/common'
  import { SuppliersService } from './suppliers.service'
  import { Supplier } from '@/entities/supplier.entity'
  
  @Controller('suppliers')
  export class SuppliersController {
    constructor(private readonly supplierService: SuppliersService) {}
  
    @Get()
    findAll() {
      return this.supplierService.findAll()
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.supplierService.findOne(+id)
    }
  
    @Post()
    create(@Body() data: Partial<Supplier>) {
      return this.supplierService.create(data)
    }
  
    @Put(':id')
    update(@Param('id') id: string, @Body() data: Partial<Supplier>) {
      return this.supplierService.update(+id, data)
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.supplierService.remove(+id)
    }
  
    // 获取该供应商所提供的所有原材料及价格
    @Get(':id/materials')
    findSupplierMaterials(@Param('id') id: string) {
      return this.supplierService.findMaterialsBySupplier(+id)
    }
  }
  