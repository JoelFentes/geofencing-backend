import { UserRepository } from "../../repositories/UserRepository";

interface UpdateUserRequest {
  userId: string;
  name?: string;
  photo?: string;
}

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(data: UpdateUserRequest) {
    const { userId, name, photo } = data;

    const userExists = await this.userRepository.findById(userId);

    if (!userExists) {
      throw new Error("Usuário não encontrado");
    }

    const updatedUser = await this.userRepository.update(userId, {
      name,
      photo,
    });

    return updatedUser;
  }
}
