# Настройка Supabase для проекта PureMatch

## 1. Создание проекта в Supabase

1. Перейдите на [https://supabase.com/](https://supabase.com/) и войдите в свой аккаунт (или зарегистрируйтесь)
2. Нажмите кнопку "New Project"
3. Введите название проекта (например, "purematch")
4. Выберите регион, ближайший к вашим пользователям
5. Установите надежный пароль для базы данных
6. Нажмите "Create new project"

После создания проекта, вам понадобятся следующие данные:
- `NEXT_PUBLIC_SUPABASE_URL`: URL вашего проекта (можно найти в настройках проекта, раздел API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Анонимный ключ API (можно найти в настройках проекта, раздел API)

## 2. Настройка аутентификации

### Email аутентификация
1. В панели управления Supabase перейдите в раздел "Authentication" -> "Providers"
2. Убедитесь, что Email провайдер включен
3. Настройте шаблоны писем для подтверждения email и сброса пароля

### OAuth провайдеры (Google, GitHub и т.д.)
1. В панели управления Supabase перейдите в раздел "Authentication" -> "Providers"
2. Выберите нужные OAuth провайдеры (например, Google, GitHub)
3. Для каждого провайдера:
   - Создайте приложение в консоли разработчика соответствующего сервиса
   - Получите Client ID и Client Secret
   - Добавьте URL перенаправления из Supabase в настройки приложения
   - Введите полученные Client ID и Client Secret в настройки провайдера в Supabase

## 3. Создание таблиц

В Supabase перейдите в раздел "Table Editor" и создайте следующие таблицы:

### Таблица `profiles`
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  birth_date DATE,
  gender TEXT,
  looking_for TEXT,
  bio TEXT,
  location TEXT,
  interests TEXT[],
  PRIMARY KEY (id)
);

-- Включаем Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Создаем политики доступа
CREATE POLICY "Публичный доступ к профилям" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Пользователи могут редактировать свои профили" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);
```

### Таблица `photos`
```sql
CREATE TABLE photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_primary BOOLEAN DEFAULT false
);

-- Включаем Row Level Security (RLS)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Создаем политики доступа
CREATE POLICY "Публичный доступ к фото" 
  ON photos FOR SELECT 
  USING (true);

CREATE POLICY "Пользователи могут добавлять свои фото" 
  ON photos FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут обновлять свои фото" 
  ON photos FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут удалять свои фото" 
  ON photos FOR DELETE 
  USING (auth.uid() = user_id);
```

### Таблица `matches`
```sql
CREATE TABLE matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user1_likes BOOLEAN DEFAULT false,
  user2_likes BOOLEAN DEFAULT false,
  UNIQUE(user1_id, user2_id)
);

-- Включаем Row Level Security (RLS)
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Создаем политики доступа
CREATE POLICY "Пользователи могут видеть свои совпадения" 
  ON matches FOR SELECT 
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Пользователи могут создавать совпадения" 
  ON matches FOR INSERT 
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Пользователи могут обновлять свои совпадения" 
  ON matches FOR UPDATE 
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);
```

### Таблица `messages`
```sql
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  is_read BOOLEAN DEFAULT false
);

-- Включаем Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Создаем политики доступа
CREATE POLICY "Пользователи могут видеть сообщения в своих совпадениях" 
  ON messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE 
        id = messages.match_id AND 
        (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

CREATE POLICY "Пользователи могут отправлять сообщения в своих совпадениях" 
  ON messages FOR INSERT 
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM matches 
      WHERE 
        id = match_id AND 
        (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );
```

## 4. Настройка триггеров и функций

### Функция для обновления поля updated_at
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Применяем триггер к таблицам
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_photos_updated_at
BEFORE UPDATE ON photos
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_matches_updated_at
BEFORE UPDATE ON matches
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

### Функция для создания профиля при регистрации пользователя
```sql
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Применяем триггер к таблице пользователей
CREATE TRIGGER create_profile_after_auth
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_for_user();
```
