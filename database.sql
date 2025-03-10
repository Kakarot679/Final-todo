-- Create the tasks table
create table if not exists tasks (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    priority text check (priority in ('low', 'medium', 'high')),
    completed boolean default false,
    starred boolean default false,
    due_date timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Create an index for faster queries
create index if not exists idx_tasks_created_at on tasks(created_at desc);

-- Enable Row Level Security (RLS)
alter table tasks enable row level security;

-- Create a policy that allows all operations (for now)
create policy "Allow all operations" on tasks
    for all
    using (true)
    with check (true); 