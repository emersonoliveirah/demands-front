// types/user-dto.type.ts
export interface UserDto {
    id: string;
    name: string;
    email: string;
    role: string;
    // Adicione outros campos que seu UserDto backend envia, mas NÃO inclua manager/subordinates
  }