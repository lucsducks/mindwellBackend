import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt'

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { isUUID } from 'class-validator';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { VerificationCode } from './entities/verification_code.entity';
import transporter from './helpers/mailer.helpers';
import { VerifyUserDto } from './dto/verify-user.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ResendUserDto } from './dto/resend-user.dto';
import { PrivilegyUserDto } from './dto/privilegy-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRepository(VerificationCode)
    private readonly verificationcodeRepository: Repository<VerificationCode>,

  ) { }
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...data } = createUserDto;
      const user = this.userRepository.create({ ...data, password: bcrypt.hashSync(password, 10) });
      await this.userRepository.save(user);
      let verificationCodeNumber: number;
      do {
        verificationCodeNumber = Math.floor(100000 + Math.random() * 900000);
      } while (verificationCodeNumber < 100000);
      const verificationCode = verificationCodeNumber.toString();
      const codeEntity = this.verificationcodeRepository.create({
        email: createUserDto.email,
        code: verificationCode,
      });
      await this.verificationcodeRepository.save(codeEntity);
      let mailOptions = {
        from: 'mindwell@company.com',
        to: createUserDto.email,
        subject: 'Código de Verificación',
        text: `Tu código de verificación es: ${verificationCode}`
      };
      transporter.sendMail(mailOptions);
      delete user.password;
      const token = ':D';
      return { ...user, token };
    } catch (error) {
      this.handleDbException(error);
    }
    return 'This action adds a new auth';
  }
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email }, select: { email: true, password: true, id: true, name: true, lastname: true, roles: true, levelEducation: true, verify: true, isActive: true } });
    if (!user) throw new BadRequestException('Email no registrado');
    if (!user.isActive) throw new BadRequestException('Usuario desactivado, hablar con su docente o administrador');
    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credenciales no validos');
    if (!user.verify) throw new UnauthorizedException('Usuario no verificado');

    return { ...user, token: this.getJwtToken({ email: user.email, id: user.id }) };
  }
  async checkAuthStatus(user: User) {
    console.log(user);

    return { ...user, token: this.getJwtToken({ email: user.email, id: user.id }) };
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    const users = await this.userRepository.find({ skip: offset });
    return users;

  }
  async findAllPsicologos(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const users = await this.userRepository.createQueryBuilder("user")
      .where("user.roles @> :roles", { roles: ['psicologo'] })
      .getMany();
    return users;
  }


  async findAllPacientes(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;
    const users = await this.userRepository.createQueryBuilder("user")
      .where("user.roles = :roles", { roles: ['user'] })
      .getMany();

    return users;

  }

  async findOne(term: string) {
    let user: User;
    if (isUUID(term)) user = await this.userRepository.findOneBy({ id: term });
    else {
      const queryBuild = this.userRepository.createQueryBuilder();
      user = await queryBuild.where('UPPER(email) =:email or fullname=:fullname', { email: term.toUpperCase(), fullname: term.toLowerCase() }).getOne();
    }
    if (!user) throw new BadRequestException('Usuario no encontrado');

    return user;
  }
  async verify(verifyUserDto: VerifyUserDto) {
    const { email, code } = verifyUserDto;
    const codeStatus = await this.verificationcodeRepository.findOne({ where: { email } });
    if (!codeStatus) throw new BadRequestException('CODIGO EXPIRADO');
    if (!codeStatus.code || codeStatus.code !== code) throw new BadRequestException('CODIGO INVALIDO');
    const user = await this.userRepository.findOne({ where: { email } });
    user.verify = true;
    await this.userRepository.save(user);
    await this.verificationcodeRepository.delete(codeStatus.id);
    return { ...user, token: this.getJwtToken({ email: user.email, id: user.id }) };

  }
  async resend(resendUserDto: ResendUserDto) {
    const { email } = resendUserDto;
    const MAX_EMAIL_SEND_LIMIT = 3;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Usuario no encontrado');
    try {
      let userRecord = await this.verificationcodeRepository.findOne({ where: { email } });
      if (userRecord) {
        if (userRecord.emailSendCount >= MAX_EMAIL_SEND_LIMIT) {
          return { message: 'Se ha alcanzado el límite de reenvío de correo electrónico, espere 10 minutos' };
        }
        userRecord.emailSendCount += 1;
      } else {
        userRecord = this.verificationcodeRepository.create({
          email: email,
          emailSendCount: 1
        });
      }
      let verificationCodeNumber: number;
      do {
        verificationCodeNumber = Math.floor(100000 + Math.random() * 900000);
      } while (verificationCodeNumber < 100000);
      userRecord.code = verificationCodeNumber.toString();
      await this.verificationcodeRepository.save(userRecord);
      let mailOptions = {
        from: 'mindwell@company.com',
        to: email,
        subject: 'Código de Verificación',
        text: `Tu código de verificación es: ${userRecord.code}`
      };
      transporter.sendMail(mailOptions);
      return { message: 'Email reenviado' };
    } catch (error) {
      this.handleDbException(error);
    }
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const { email, password, ...resto } = updateUserDto
    try {
      const usuario = await this.findOne(id);
      if (!usuario) throw new BadRequestException('Usuario no encontrado');
      const user = await this.userRepository.save({ ...usuario, ...resto });
      return user;
    } catch (error) {
      this.handleDbException(error);
    }
  }
  async updatePass(id: string, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto
    try {
      const usuario = await this.findOne(id);
      if (!usuario) throw new BadRequestException('Usuario no encontrado');
      usuario.password = bcrypt.hashSync(password, 10);
      await this.userRepository.save(usuario);
      delete usuario.password;
      return { ...usuario, token: this.getJwtToken({ email: usuario.email, id: usuario.id }) };
    } catch (error) {
      this.handleDbException(error);
    }
  }
  async UpdatePrivilegy(id: string, privilegyUserDto: PrivilegyUserDto) {
    const { role } = privilegyUserDto;
    const usuario = await this.findOne(id);
    if (!usuario) throw new BadRequestException('Usuario no encontrado');
    if (usuario.roles.includes(role)) throw new BadRequestException('Usuario ya tiene este privilegio');
    if (role) {
      usuario.roles.push(role);
      await this.userRepository.save(usuario);
    }
    delete usuario.password;
    return usuario;
  }

  async remove(id: string) {
    try {
      const usuario = await this.findOne(id);
      if (!usuario) throw new BadRequestException('Usuario no encontrado');
      usuario.isActive = false;
      usuario.verify = false;
      await this.userRepository.save(usuario);
      return { message: 'User deleted' }
    } catch (error) {
      this.handleDbException(error);
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
  private handleDbException(error: any) {
    this.logger.error(`Database error occurred: ${error.code}: ${error.detail || error.message}`);

    switch (error.code) {
      case '23505':
        throw new ConflictException(`A record with the provided details already exists.`);
      case '23502':
        throw new BadRequestException('Missing required fields.');
      case '23503':
        throw new NotFoundException('Related record not found.');
      case '22P02':
        throw new BadRequestException('Invalid data format.');
      case '42P01':
        throw new InternalServerErrorException('A server error occurred.');

      default:
        throw new InternalServerErrorException('Unexpected error occurred.');
    }
  }
  @Cron(CronExpression.EVERY_MINUTE)
  async deactivateExpiredVerificationCodes() {
    const currentDate = new Date();
    const expiredDate = new Date(currentDate.getTime() - 5 * 60000); // 5 minutos atrás

    const deletedResult = await this.verificationcodeRepository
      .createQueryBuilder()
      .delete()
      .from(VerificationCode)
      .where('expiration <= :expiredDate', { expiredDate })
      .execute();

  }
  @Cron(CronExpression.EVERY_MINUTE)
  async deactivateUnverifiedUsers() {
    const verificationThreshold = new Date(new Date().getTime() - 5 * 60000);

    const result = await this.userRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt <= :verificationThreshold', { verificationThreshold })
      .andWhere('verify = :verify', { verify: false })
      .execute();

  }
}
