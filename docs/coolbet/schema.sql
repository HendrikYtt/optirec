alter table apps_1.users
    add column language text,
    add column country text;

alter table apps_1.items add column attributes jsonb default '{}'::jsonb;

