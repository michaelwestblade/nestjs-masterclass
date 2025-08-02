import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { GoogleUser } from '../interfaces/google-user.interface';

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  /**
   * Creates a new user in the system using the provided Google user information.
   *
   * @param {GoogleUser} googleUser - The Google user object containing the user's information.
   * @return {Promise<object>} A promise that resolves to the saved user object.
   * @throws {ConflictException} If an error occurs while saving the user.
   */
  public async createGoogleUser(googleUser: GoogleUser) {
    try {
      const user = this.usersRepository.create(googleUser);
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'error saving user',
      });
    }
  }
}
