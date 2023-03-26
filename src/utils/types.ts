export type UserType = {
  email: string;
  role: string;
  token: string;
  photo: string;
};

export type BookType = {
  id: number;
  title: string;
  author: string;
  publication_date: string;
  pages: number;
  isbn: string;
  price: number;
  about: string;
  thumbnail: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type FormRegister = {
  name: string;
  email: string;
  password: string;
};

export type BookFormType = {
  title: string;
  author: string;
  publication_date: string;
  pages: number;
  isbn: string;
  price: number;
  about: string;
  thumbnail: string;
  content: string;
};

export type CartType = {
  cart: number[];
  total_price: number;
};

export type ProfileType = {
  address: string;
  gender: string;
  phone: string;
  photo: string;
};

export type UserProfileType = {
  email: string;
  id: number;
  name: string;
  profile: ProfileType;
  role: string;
};

export type TransactionType = {
  id: number;
  user: {
    name: string;
    email: string;
  };
  total_price: number;
  status: string;
  books: BookType[];
  created_at: string;
  updated_at: string;
};
