import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Query
} from '@nestjs/common'
import { ProductService } from './products.service'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { Request } from 'express'
import * as fs from 'fs'
import * as path from 'path'

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAllByCompany(@Req() req) {
    return this.productService.findAllByCompany(req.user.companyId)
  }

  //固定字符的如all要在可变字符：id的上面
  @Get('all')
  findAll(@Req() req) {
    return this.productService.findAll()
  }

  @Get('categories')
  @UseGuards(AuthGuard('jwt'))
  async getCompanyCategories(@Req() req) {
    return this.productService.findAllCategoriesByCompany(req.user.companyId)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.productService.findOne(+id, req.user.companyId)
  }



  @Post()
  create(@Body() body, @Req() req) {
    return this.productService.create({
      ...body,
      companyId: req.user.companyId,
      imageUrl: req.user.imageUrl?.trim() || 'http://localhost:3000/upload/products/default.png',
    })
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body, @Req() req) {
    // 如果新图和旧图不同，且旧图不是默认图，就删除旧图
    const product = await this.productService.findOne(+id, req.user.companyId)
    if (product?.imageUrl && body.imageUrl && product.imageUrl !== body.imageUrl) {
      const oldPath = path.join(__dirname, '../../../', product.imageUrl.replace(`${req.protocol}://${req.get('host')}/`, ''))
      if (fs.existsSync(oldPath) && !oldPath.includes('default')) {
        fs.unlinkSync(oldPath)
      }
    }
    return this.productService.update(+id, body, req.user.companyId)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const product = await this.productService.findOne(+id, req.user.companyId)
    if (product?.imageUrl && !product.imageUrl.includes('default.png')) {
      const imagePath = path.join(__dirname, '../../../', product.imageUrl.replace(`${req.protocol}://${req.get('host')}/`, ''))
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }
    return this.productService.remove(+id, req.user.companyId)
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './upload/products',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = extname(file.originalname)
        cb(null, `${uniqueSuffix}${ext}`)
      },
    }),
  }))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const url = `${req.protocol}://${req.get('host')}/upload/products/${file.filename}`
    return { url }
  }

  @Get('categories/:category')
  async findByCompany(@Param('category') category: string, @Req() req) {
    return this.productService.findAllByCompanyAndCategory(req.user.companyId, category)
  }
}