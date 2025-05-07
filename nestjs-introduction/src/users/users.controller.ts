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

@Controller('users')
export class UsersController {
  @Get()
  getUsers(@Query() params) {
    return `Hello from users with params ${Object.keys(params).join(', ')}`;
  }

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return `User with ID ${id}`;
  }

  @Post()
  createUsers(@Body() request) {
    return `you created a user with request body ${JSON.stringify(request)}`;
  }

  @Patch(':id')
  patchUser(@Param('id') id: string) {
    return `You patched a user with ID ${id}`;
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
