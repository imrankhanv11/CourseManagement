export interface UserDto {
  id: string;               
  name: string;             
  email: string;            
  dateOfBirth?: string | null; 
  phoneNumber?: string | null;
  password?: string | null;   
  isActive: boolean;         
  isAdmin: boolean;          
}