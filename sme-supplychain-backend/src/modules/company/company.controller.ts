import { Controller, Get, Post, Put, Delete, Param, Body, UploadedFile, UseInterceptors, Req, Query } from '@nestjs/common'
import { CompanyService } from './company.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { unlink } from 'fs/promises'
import { Company } from '@/entities/company.entity'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('companies') // 所有接口路径前缀为 /companies
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  //  新增公司（POST /companies）
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() data: Partial<Company>) {
    return this.companyService.create(data)
  }

  //  获取全部公司列表（GET /companies）
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.companyService.findAll()
  }

  //根据名称查公司
  @Get('search')
  async searchCompany(@Query('keyword') keyword: string) {
    return this.companyService.findByNameKeyword(keyword)
}

  //  本公司（GET /companies/me）
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMyCompany(@Req() req) {
    const companyId = req.user.companyId
    return this.companyService.findOne(companyId)
  }

  //  根据 ID 获取公司（GET /companies/:id）
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id)
  }



  //  修改公司信息（PUT /companies/:id）
  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  update(@Req() req, @Body() data: Partial<Company>) {
    const companyId = req.user.companyId
    return this.companyService.update(companyId, data)
  }

  //  删除公司（DELETE /companies/:id）
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id)
  }

  // GET /companies/industry/:industry
    @Get('industry/:industry')
    @UseGuards(AuthGuard('jwt'))
    findByIndustry(@Param('industry') industry: string) {
    return this.companyService.findByIndustry(industry)
    }

    //上传图片
    @Post('upload-logo')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: join(process.cwd(), 'upload/companies'), //  保存到 upload/companies/
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
            const ext = extname(file.originalname)
            cb(null, `${uniqueSuffix}${ext}`)
          },
        }),
      }),
    )
    async uploadLogo(@UploadedFile() file: Express.Multer.File, @Req() req) {
      const filename = file.filename
      const logoUrl = `${req.protocol}://${req.get('host')}/upload/companies/${filename}`
  
      //  更新当前登录公司对应的 logoUrl 字段
      const companyId = req.user.companyId

      const company = await this.companyService.findOne(companyId)
      const oldLogoUrl = company.logoUrl
      
        if (oldLogoUrl &&
            oldLogoUrl.startsWith(`${req.protocol}://${req.get('host')}/upload/companies/`) &&
            !oldLogoUrl.includes('logo_example.png')) {
            const oldFile = oldLogoUrl.replace(`${req.protocol}://${req.get('host')}`, '') 
            const fullPath = join(process.cwd(), oldFile)
            try {
                await unlink(fullPath)
                console.log('Deleted old avatar:', fullPath)
            } catch (err) {
                console.warn('Failed to delete old avatar:', err.message)
            }
            }
      await this.companyService.update(companyId, { logoUrl })
  
      //  返回前端可预览的 logoUrl
      return { url: logoUrl }
    }
}
