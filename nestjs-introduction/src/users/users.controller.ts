import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return `Hello from users with params limit: ${limit} and page: ${page}\n`;
  }

  @Get('/:id')
  getUser(@Param() getUserDto: GetUserDto) {
    return `User with ID ${getUserDto.id}`;
  }

  @Post()
  createUsers(@Body() createUserDto: CreateUserDto) {
    return `You made a user with ${createUserDto.firstName} ${createUserDto.lastName} ${createUserDto.email} ${createUserDto.password}`;
  }

  @Patch(':id')
  patchUser(@Param('id') id: string, @Body() patchUserDto: PatchUserDto) {
    return `You patched a user with ID ${id} with values ${JSON.stringify(patchUserDto)}`;
  }

  @Put(':id')
  updateUser(@Param('id') id: string) {
    return `You put a user with ID ${id}`;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return `You deleted a user with ID ${id}`;
  }
}
