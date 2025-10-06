create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  message text not null,
  sender text check (sender in ('user', 'bot')) not null,
  created_at timestamp with time zone default now()
);
