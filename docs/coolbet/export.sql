-- interactions

select
    s.id::text          AS id,
    t.user_id::text     AS user_id,
    m.id::text          AS item_id,
    round(
        (b.stake * s.odds / (
            select mul(s2.odds)
            from source.fixtures_selection s2 
            where s2.bet_id = b.id
        ))::numeric,
		2
    )                   AS rating,
    jsonb_build_object(
        'market_type', mt.name,
        'team', (
            case
                when o.name = '[Home]' then ht.name
                when o.name = '[Away]' then at.name
                when o.name = '[Player 1]' then ht.name
                when o.name = '[Player 2]' then at.name
                else null
            end
        ),
        'outcome', o.name
    )                   AS attributes,
	s.created_at
from source.fixtures_selection s
join source.fixtures_bet b on b.id = s.bet_id
join source.fixtures_ticket t on t.id = b.ticket_id
join source.fixtures_outcome o on o.id = s.outcome_id
join source.fixtures_market mr on mr.id = o.market_id
join source.fixtures_match m on m.id = mr.match_id
join source.fixtures_market_type mt on mt.id = mr.market_type_id
left join source.fixtures_team ht on ht.id = m.home_team_id
left join source.fixtures_team at on at.id = m.away_team_id
where s.created_at between '2023-03-07' and '2023-03-08'

-- users

select 
    u.id            AS id,
    jsonb_build_object(
        'country', u.country
    )               AS attributes,
    u.created       AS created_at
from source.users_cb_users u
where u.id = any('{}');

-- items

select
    m.id            AS id,
    jsonb_build_object(
        'sport', sc.name,
        'region', rc.name,
        'league', lc.name,
        'team', (case when ht.name is null and at.name is null then '{}' else ARRAY[ht.name, at.name] end)
    )               AS attributes,
    m.created       AS created_at
from source.fixtures_match m
join source.fixtures_category lc on lc.id = m.category_id
join source.fixtures_category rc on rc.id = lc.parent_category_id
join source.fixtures_category sc on sc.id = rc.parent_category_id
left join source.fixtures_team ht on ht.id = m.home_team_id
left join source.fixtures_team at on at.id = m.away_team_id
where m.id = any('{}');
