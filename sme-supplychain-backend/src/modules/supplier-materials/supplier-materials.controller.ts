import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
  } from '@nestjs/common'
  import { SupplierMaterialsService } from './supplier-materials.service'
  
  @Controller('supplier-materials')
  export class SupplierMaterialsController {
    constructor(private readonly service: SupplierMaterialsService) {}
  
    @Get()
    findAll() {
      return this.service.findAll()
    }
  
    @Get('supplier/:id')
    findBySupplier(@Param('id') supplierId: string) {
      return this.service.findBySupplier(+supplierId)
    }
  
    @Post()
    create(@Body() data: {
      supplierId: number
      materialId: number
      unitPrice: number
    }) {
      return this.service.create(data)
    }
  
    @Put(':id')
    update(@Param('id') id: string, @Body() body: { unitPrice: number }) {
      return this.service.update(+id, body.unitPrice)
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.service.remove(+id)
    }
  }