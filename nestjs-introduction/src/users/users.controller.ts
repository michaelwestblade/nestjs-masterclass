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
import { GetUsersDto } from './dtos/get-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers(@Query() getUsersDto: GetUsersDto) {
    return this.userService.findAll(getUsersDto);
  }

  @Get('/:id')
  getUser(@Param() getUserDto: GetUserDto) {
    return this.userService.findOne(getUserDto);
  }

  @Post()
  createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  patchUser(@Param('id') id: string, @Body() patchUserDto: PatchUserDto) {
    return this.userService.update(id, patchUserDto);
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
