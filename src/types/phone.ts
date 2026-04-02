export interface Phone {
  id: number;
  name: string;
  phone: string;
}

export type PhoneInput = Omit<Phone, 'id'>;
