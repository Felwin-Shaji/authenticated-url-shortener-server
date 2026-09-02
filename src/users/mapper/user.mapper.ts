import { UserResponseDto } from '../dto/user-response.dto';
import { UserDocument } from '../schemas/user.schema';

export class UserMapper {
    static toDto(user: UserDocument): UserResponseDto {
        return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
        };
    }
}