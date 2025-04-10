import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
  } from '@nestjs/common'
  import { PurchaseOrdersService } from './purchase-orders.service'
  
  @Controller('orders')
  export class PurchaseOrdersController {
    constructor(private readonly service: PurchaseOrdersService) {}
  
    @Get()
    findAll() {
      return this.service.findAll()
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.service.findOne(+id)
    }
  
    @Post()
    create(@Body() data: {
      supplierId: number
      materialId: number
      quantity: number
      unitPrice: number
    }) {
      return this.service.create(data)
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.service.remove(+id)
    }
  }
  