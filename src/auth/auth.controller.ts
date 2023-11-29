import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata, ParseUUIDPipe, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { ResendUserDto } from './dto/resend-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Get('/check')
  @Auth()
  checkAuthStatus(@GetUser() user: User,) {
    return this.authService.checkAuthStatus(user);
  }
  @Get('/users')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.authService.findAll(paginationDto);
  }
  @Get('/users/psicologos')
  @Auth(ValidRoles.psicologo, ValidRoles.admin)
  findAllPsicologos(@Query() paginationDto: PaginationDto) {
    return this.authService.findAllPsicologos(paginationDto);
  }
  @Get('/users/pacientes')
  @Auth(ValidRoles.psicologo, ValidRoles.admin)
  findAllPacientes(@Query() paginationDto: PaginationDto) {
    return this.authService.findAllPacientes(paginationDto);
  }


  @Get('/users/:term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.authService.findOne(term);
  }

  @Post('/verify')
  verify(@Body() verifyUserDto:VerifyUserDto) {
    return this.authService.verify(verifyUserDto);
  }
  @Post('/resend')
  resend(@Body() resendUserDto:ResendUserDto) {
    return this.authService.resend(resendUserDto);
  }
  @Patch(':id')
  @Auth()
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }

  @Patch('/password/:id')
  @Auth()
  updatePass(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updatePass(id, updateUserDto);
  }
  @Patch('/privilegy/:id')
  @Auth(ValidRoles.admin, ValidRoles.superUser)
  UpdatePrivilegy(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.UpdatePrivilegy(id);
  }
  @Delete(':id')
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.remove(id);
  }
}
