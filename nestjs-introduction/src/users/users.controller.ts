import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  getUsers() {
    return 'Hello from users';
  }

  @Get('/:id')
  getUser(@Param('id') id: string) {
    return `User with ID ${id}`;
  }

  @Post()
  createUsers() {
    return 'you created a user';
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
