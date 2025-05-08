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
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { GetUsersDto } from './dtos/get-users.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get users with filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully',
  })
  getUsers(@Query() getUsersDto: GetUsersDto) {
    return this.userService.findAll(getUsersDto);
  }

  @ApiOperation({
    summary: 'Get user by id',
  })
  @Get('/:id')
  getUser(@Param() getUserDto: GetUserDto) {
    return this.userService.findOne(getUserDto);
  }

  @ApiOperation({
    summary: 'Create a user',
  })
  @Post()
  createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Edit a user',
  })
  @Patch(':id')
  patchUser(@Param('id') id: string, @Body() patchUserDto: PatchUserDto) {
    return this.userService.update(id, patchUserDto);
  }

  @ApiOperation({
    summary: 'Edit a user',
  })
  @Put(':id')
  updateUser(@Param('id') id: string) {
    return `You put a user with ID ${id}`;
  }

  @ApiOperation({
    summary: 'Delete a user',
  })
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return `You deleted a user with ID ${id}`;
  }
}
