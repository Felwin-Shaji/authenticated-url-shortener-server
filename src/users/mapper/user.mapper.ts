import { UserResponseDto } from '../dto/user-response.dto';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
    static toDto(user: UserEntity): UserResponseDto {
        return {
            id: user.id.toString(),
            username: user.username,
            email: user.email,
        };
    }
}