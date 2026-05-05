import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { RegistryPrismaService } from 'src/infra/prisma/registry-prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: RegistryPrismaService) {}

  async create(data: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { user: data.user },
    });

    if (existing) {
      throw new ConflictException('Usuário já existe');
    }

    const { password, ...userData } = data;
    const passwordHash = await argon2.hash(password);

    return this.prisma.user.create({
      data: {
        ...userData,
        passwordHash,
      },
      select: {
        id: true,
        user: true,
        status: true,
        roleId: true,
        dbCredentialsId: true,
        storeId: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        user: true,
        status: true,
        roleId: true,
        role: { select: { name: true } },
        dbCredentialsId: true,
        storeId: true,
        createdAt: true,
      },
      orderBy: { user: 'asc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        user: true,
        status: true,
        roleId: true,
        role: { select: { name: true } },
        dbCredentialsId: true,
        storeId: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const { password, ...userData } = data;
    
    const updateData: any = { ...userData };

    if (password) {
      updateData.passwordHash = await argon2.hash(password);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        user: true,
        status: true,
        roleId: true,
        createdAt: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
