import { History, Share, Star, TrackChanges, TrendingUp } from '@mui/icons-material';
import { BetslipButton } from '../components/BetslipButton';
import { RecommendationsList } from '../components/RecommendationsList';
import { Sidebar } from '../components/Sidebar';
import { TopicRecommendations } from '../components/TopicRecommendations';
import { useAuth } from '../contexts/Auth';
import { BetslipProvider } from '../contexts/Betslip';
import { SidebarLayout } from '../layouts/SidebarLayout';
import {
    recommendHighestRatingMatches,
    recommendMatchesBasedOnCollaborativeFiltering,
    recommendMatchesBasedOnContent,
    recommendPopularMatchesByCountry,
    recommendRecentMatches,
} from '../services/optirec';

export const CoolbetPage = () => {
    const { userId } = useAuth();
    return (
        <BetslipProvider>
            <SidebarLayout sidebar={<Sidebar />}>
                <RecommendationsList
                    MatchListHeaderProps={{
                        title: (
                            <>
                                Events popular in <b>Estonia</b>
                            </>
                        ),
                        description: 'Count-based recommendations',
                        Icon: Star,
                    }}
                    func={(page) => recommendPopularMatchesByCountry('EE', page)}
                />
                <RecommendationsList
                    MatchListHeaderProps={{
                        title: (
                            <>
                                Events producing <b>the highest turnover</b>
                            </>
                        ),
                        description: 'Rating-based recommendations',
                        Icon: TrendingUp,
                    }}
                    func={(page) => recommendHighestRatingMatches(page)}
                />
                {!!userId && (
                    <>
                        <RecommendationsList
                            MatchListHeaderProps={{
                                title: (
                                    <>
                                        Events you <b>recently interacted with</b>
                                    </>
                                ),
                                description: 'Recent interactions',
                                Icon: History,
                            }}
                            func={(page) => recommendRecentMatches(userId, page)}
                        />
                        <RecommendationsList
                            MatchListHeaderProps={{
                                title: (
                                    <>
                                        Events we think <b>you will like</b>
                                    </>
                                ),
                                description: 'Content-based recommendations',
                                Icon: TrackChanges,
                            }}
                            func={(page) => recommendMatchesBasedOnContent(userId, page)}
                        />
                        <RecommendationsList
                            MatchListHeaderProps={{
                                title: (
                                    <>
                                        Events popular <b>among similar users</b>
                                    </>
                                ),
                                description: 'Collaborative filtering',
                                Icon: Share,
                            }}
                            func={(page) => recommendMatchesBasedOnCollaborativeFiltering(userId, page)}
                        />
                        <TopicRecommendations />
                    </>
                )}
                <BetslipButton />
            </SidebarLayout>
        </BetslipProvider>
    );
};
