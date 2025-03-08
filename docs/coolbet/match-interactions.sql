create table _tmp_match_interactions as (
    select
		s.id,
        t.user_id,
        m.id as match_id,
        b.id as bet_id,
	    b.stake_bc AS bet_stake_eur,
        s.created_at
    from selection s
    join outcome o on o.id = s.outcome_id
    join market mr on mr.id = o.market_id
    join match m on m.id = mr.match_id
    join bet b on b.id = s.bet_id
    join ticket t on t.id = b.ticket_id
    limit 1
) with no data;
alter table _tmp_match_interactions add primary key (id);

create table _tmp_users as (
    select 
        us.user_id AS id,
        us.language,
        urs.country_code AS country
    from user_settings us
    join user_risk_settings urs on urs.user_id = us.user_id
    limit 1
) with no data;
alter table _tmp_users add primary key (id);

create table _tmp_matches as (
    select
        m.id,
        m.name,
        m.match_start,
        m.expected_result_time,
        m.inplay,
        ht.name AS home_team_name,
        at.name AS away_team_name,
        lc.name AS league,
        rc.name AS region,
        sc.name AS sport
    from match m
    join team ht on ht.id = m.home_team_id
    join team at on at.id = m.away_team_id
    join category lc on lc.id = m.category_id
    join category rc on rc.id = lc.parent_category_id
    join category sc on sc.id = rc.parent_category_id
    limit 1
) with no data;
alter table _tmp_matches add primary key (id);

insert into _tmp_match_interactions(id, user_id, match_id, bet_id, bet_stake_eur, created_at)
select
    s.id,
    t.user_id,
    m.id as match_id,
    b.id as bet_id,
    b.stake_bc AS bet_stake_eur,
    s.created_at
from selection s
join outcome o on o.id = s.outcome_id
join market mr on mr.id = o.market_id
join match m on m.id = mr.match_id
join bet b on b.id = s.bet_id
join ticket t on t.id = b.ticket_id
where s.created_at between '2022-11-01' and '2022-11-02'
on conflict (id)
do nothing;
-- safely insert day-by-day

select count(1), min(created_at), max(created_at) from _tmp_match_interactions;
-- 4671406	"2022-10-24 00:00:00.6254+00"	"2022-11-01 15:48:47.341625+00"

insert into _tmp_users(id, language, country)
select 
    us.user_id AS id,
    us.language,
    urs.country_code AS country
from user_settings us
join user_risk_settings urs on urs.user_id = us.user_id
where us.user_id in (
    select user_id
    from _tmp_match_interactions
)
on conflict (id)
do nothing;

select count(distinct user_id) from _tmp_match_interactions;
select count(1) from _tmp_users;
-- 70013

insert into _tmp_matches(id, name, match_start, expected_result_time, inplay, home_team_name, away_team_name, league, region, sport)
select
    m.id,
    m.name,
    m.match_start,
    m.expected_result_time,
    m.inplay,
    ht.name AS home_team_name,
    at.name AS away_team_name,
    lc.name AS league,
    rc.name AS region,
    sc.name AS sport
from match m
left join team ht on ht.id = m.home_team_id
left join team at on at.id = m.away_team_id
join category lc on lc.id = m.category_id
join category rc on rc.id = lc.parent_category_id
join category sc on sc.id = rc.parent_category_id
where m.id in (
    select match_id
    from _tmp_match_interactions
)
on conflict (id)
do nothing;

select count(distinct match_id) from _tmp_match_interactions;
select count(1) from _tmp_matches;
-- 7687

-- remap user ids:
create table _tmp_user_id_map (
    id serial primary key,
    user_id text not null,
    unique (user_id)
);

insert into _tmp_user_id_map(user_id)
select distinct id
from _tmp_users;

-- query remapped rows:
create index on _tmp_match_interactions(created_at);

select i.id, m.id AS user_id, i.match_id, i.bet_id, i.bet_stake_eur, i.created_at
from _tmp_match_interactions i
join _tmp_user_id_map m on m.user_id = i.user_id
where i.created_at between '2022-10-30' and '2022-11-02';
-- safely query day-by-day

select m.* from _tmp_matches m;

select m.id, u.language, u.country
from _tmp_users u
join _tmp_user_id_map m on m.user_id = u.id;

-- cleanup
drop table _tmp_user_id_map;
drop table _tmp_users;
drop table _tmp_matches;
drop table _tmp_match_interactions;