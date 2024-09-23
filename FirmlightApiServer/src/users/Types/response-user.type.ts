import {User} from "../Schemas/User.schema";

// Define ResponseUserType with only the desired fields
export type ResponseUserType = Pick<User, 'id' | 'username' | 'email'>;