export type Profile = {
  id: string;
  created_at: string;
  updated_at: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  birth_date: string | null;
  gender: string | null;
  looking_for: string | null;
  bio: string | null;
  location: string | null;
  interests: string[] | null;
};

export type Photo = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  url: string;
  is_verified: boolean;
  is_primary: boolean;
};

export type Match = {
  id: string;
  created_at: string;
  user1_id: string;
  user2_id: string;
  user1_likes: boolean;
  user2_likes: boolean;
};

export type Message = {
  id: string;
  created_at: string;
  match_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      photos: {
        Row: Photo;
        Insert: Omit<Photo, "id" | "created_at" | "updated_at" | "is_verified">;
        Update: Partial<Omit<Photo, "id" | "user_id" | "created_at" | "updated_at">>;
      };
      matches: {
        Row: Match;
        Insert: Omit<Match, "id" | "created_at">;
        Update: Partial<Omit<Match, "id" | "created_at" | "user1_id" | "user2_id">>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "created_at" | "is_read">;
        Update: Partial<Omit<Message, "id" | "created_at" | "match_id" | "sender_id">>;
      };
    };
  };
};
