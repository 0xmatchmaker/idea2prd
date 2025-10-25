-- ============================================
-- Supabase 数据库设置脚本
-- 用于 idea2prd n8n 工作流项目
-- ============================================

-- 1. 创建 projects 表（用户的 PRD 项目）
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null default 'My Workflow Project',
  description text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. 创建 workflow_versions 表（n8n 工作流版本历史）
create table if not exists workflow_versions (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  version_number int not null,
  workflow_json jsonb not null,  -- 完整的 n8n JSON 格式
  description text,
  node_count int default 0,      -- 节点数量（用于统计）
  connection_count int default 0, -- 连接数量
  images jsonb default '[]'::jsonb, -- 场景图片 URLs
  created_at timestamp with time zone default now()
);

-- 3. 创建索引（提升查询性能）
create index if not exists idx_projects_user_id on projects(user_id);
create index if not exists idx_workflow_versions_project_id on workflow_versions(project_id);
create index if not exists idx_workflow_versions_created_at on workflow_versions(created_at desc);

-- 4. 启用行级安全（Row Level Security）
alter table projects enable row level security;
alter table workflow_versions enable row level security;

-- 5. 创建 RLS 策略 - projects 表
-- 用户只能查看自己的项目
drop policy if exists "Users can view their own projects" on projects;
create policy "Users can view their own projects"
  on projects for select
  using (auth.uid() = user_id);

-- 用户只能插入自己的项目
drop policy if exists "Users can insert their own projects" on projects;
create policy "Users can insert their own projects"
  on projects for insert
  with check (auth.uid() = user_id);

-- 用户只能更新自己的项目
drop policy if exists "Users can update their own projects" on projects;
create policy "Users can update their own projects"
  on projects for update
  using (auth.uid() = user_id);

-- 用户只能删除自己的项目
drop policy if exists "Users can delete their own projects" on projects;
create policy "Users can delete their own projects"
  on projects for delete
  using (auth.uid() = user_id);

-- 6. 创建 RLS 策略 - workflow_versions 表
-- 用户只能查看自己项目的版本
drop policy if exists "Users can view their own workflow versions" on workflow_versions;
create policy "Users can view their own workflow versions"
  on workflow_versions for select
  using (
    exists (
      select 1 from projects
      where projects.id = workflow_versions.project_id
      and projects.user_id = auth.uid()
    )
  );

-- 用户只能插入自己项目的版本
drop policy if exists "Users can insert their own workflow versions" on workflow_versions;
create policy "Users can insert their own workflow versions"
  on workflow_versions for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = workflow_versions.project_id
      and projects.user_id = auth.uid()
    )
  );

-- 用户只能删除自己项目的版本
drop policy if exists "Users can delete their own workflow versions" on workflow_versions;
create policy "Users can delete their own workflow versions"
  on workflow_versions for delete
  using (
    exists (
      select 1 from projects
      where projects.id = workflow_versions.project_id
      and projects.user_id = auth.uid()
    )
  );

-- 7. 创建自动更新 updated_at 的触发器
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_projects_updated_at on projects;
create trigger update_projects_updated_at
  before update on projects
  for each row
  execute function update_updated_at_column();

-- ============================================
-- 设置完成！
-- 下一步：
-- 1. 在 Supabase Dashboard 启用 Email Auth
-- 2. 获取 API keys：Settings > API
--    - NEXT_PUBLIC_SUPABASE_URL
--    - NEXT_PUBLIC_SUPABASE_ANON_KEY
-- ============================================
