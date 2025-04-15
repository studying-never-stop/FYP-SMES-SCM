import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from '../../entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { unlink } from 'fs/promises'


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //  获取当前公司所有用户（只返回本租户）
  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req) {
    const companyId = req.user.companyId // 从请求中获取当前公司ID（来自 JWT）
    return this.usersService.findAllByCompany(companyId)
  }

  //获取所有用户信息
  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  findAllUser(@Req() req) {
    const companyId = req.user.companyId // 从请求中获取当前公司ID（来自 JWT）
    return this.usersService.findAll()
  }

  //  获取当前公司某个指定用户（权限隔离）
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @Req() req) {
    const companyId = req.user.companyId
    return this.usersService.findOneByCompany(+id, companyId)
  }

  //  创建新用户（将用户绑定到当前公司）
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: Partial<User>, @Req() req) {
    const companyId = req.user.companyId
    return this.usersService.create(body, companyId)
  }

  //  更新用户（仅限本公司成员）
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() body: Partial<User>, @Req() req) {
    const companyId = req.user.companyId
    return this.usersService.update(+id, body, companyId)
  }

  //  删除用户（仅限本公司成员）
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req) {
    const companyId = req.user.companyId
    return this.usersService.remove(+id, companyId)
  }

  @Post('upload-avatar')
      @UseGuards(AuthGuard('jwt'))
      @UseInterceptors(
        FileInterceptor('file', {
          storage: diskStorage({
            destination: join(process.cwd(), 'upload/users'), 
            filename: (req, file, cb) => {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
              const ext = extname(file.originalname)
              cb(null, `${uniqueSuffix}${ext}`)
            },
          }),
        }),
      )
      async uploadavatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
        const filename = file.filename
        const avatarUrl = `${req.protocol}://${req.get('host')}/upload/users/${filename}`
    
        const companyId = req.user.companyId
        const userId = req.user.userId

        // 获取旧头像路径（从数据库中取）
        const user = await this.usersService.findOneByCompany(userId, companyId)
        const oldAvatarUrl = user.avatarUrl

        // 删除旧头像（仅删除 /upload/users/xxx.png 类型的本地文件）
        if (oldAvatarUrl &&
          oldAvatarUrl.startsWith(`${req.protocol}://${req.get('host')}/upload/users/`) &&
          !oldAvatarUrl.includes('default_avatar.png')) {
          const oldFile = oldAvatarUrl.replace(`${req.protocol}://${req.get('host')}`, '') // /upload/users/xxx.png
          const fullPath = join(process.cwd(), oldFile)
          try {
            await unlink(fullPath)
            console.log('Deleted old avatar:', fullPath)
          } catch (err) {
            console.warn('Failed to delete old avatar:', err.message)
          }
        }
        // 更新图片路径到数据库
        await this.usersService.update(userId, { avatarUrl },companyId)
    
        //  返回前端可预览的 logoUrl
        return { url: avatarUrl }
      }
}
