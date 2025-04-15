import {
    Controller,
    Get,
    Put,
    Param,
    Body,
    Delete,
    Req,
    UseGuards,
    Query,
    Post,
  } from '@nestjs/common'
  import { InventoryService } from './inventory.service'
  import { AuthGuard } from '@nestjs/passport'
  
  @Controller('inventories')
  @UseGuards(AuthGuard('jwt')) // 启用 JWT 鉴权保护接口
  export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) {}
  
    /** 获取公司所有库存（全部类型） */
    @Get()
    findAll(@Req() req) {
      return this.inventoryService.findAllByCompany(req.user.companyId)
    }
  
    /** 获取公司产品库存，支持搜索和状态筛选 */
    @Get('products')
    findProducts(
      @Req() req,
      @Query('search') search: string,
      @Query('status') status: string
    ) {
      return this.inventoryService.findProductsByCompany(req.user.companyId, search, status)
    }
  
    /** 获取公司原料库存，支持搜索和状态筛选 */
    @Get('raws')
    findRaws(
      @Req() req,
      @Query('search') search: string,
      @Query('status') status: string
    ) {
      return this.inventoryService.findRawMaterialsByCompany(req.user.companyId, search, status)
    }

        /**  获取出入库记录（供前端显示） */
        @Get('records')
        async getRecords(@Req() req) {
          const companyId = req.user.companyId
          return this.inventoryService.getCompanyRecords(companyId)
        }
  
    /** 获取单条库存记录 */
    @Get(':id')
    findOne(@Param('id') id: string, @Req() req) {
      return this.inventoryService.findOne(+id, req.user.companyId)
    }
  
    /** 更新库存记录（如警戒线或是否启用） */
    @Put(':id')
    update(@Param('id') id: string, @Body() body, @Req() req) {
      return this.inventoryService.update(+id, body, req.user.companyId)
    }
  
    /** 删除库存记录 */
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
      return this.inventoryService.remove(+id, req.user.companyId)
    }
  
    /** 手动入库接口（仓库人员使用） */
    @Post('manual-in')
    manualIn(
      @Body() body: { productId: number; quantity: number; note?: string },
      @Req() req
    ) {
      const { productId, quantity, note } = body
      const operatorId = req.user.userId || undefined
      return this.inventoryService.increaseQuantity(
        productId,
        req.user.companyId,
        quantity,
        undefined, // 无关联订单
        operatorId,
        note || 'manual stock in'
      )
    }
  
    /** 手动出库接口（仓库人员使用） */
    @Post('manual-out')
    manualOut(
      @Body() body: { productId: number; quantity: number; note?: string },
      @Req() req
    ) {
      const { productId, quantity, note } = body
      const operatorId = req.user.userId || undefined
      return this.inventoryService.decreaseQuantity(
        productId,
        req.user.companyId,
        quantity,
        undefined, // 无关联订单
        operatorId,
        note || 'manual stock out'
      )
    }
  

  }
  