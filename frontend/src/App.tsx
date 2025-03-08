import { useTheme } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppHeader } from './components/AppHeader';
import { useAuth } from './contexts/Auth';
import { Account } from './pages/Account';
import { Application } from './pages/Application';
import { Dashboard } from './pages/Dashboard';
import { DatabaseInteractionsPage } from './pages/DatabaseInteractionsPage';
import { DatabaseItemsPage } from './pages/DatabaseItemsPage';
import { DatabaseUsersPage } from './pages/DatabaseUsersPage';
import { LandingPage } from './pages/LandingPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { SessionExpired } from './pages/SessionExpired';
import { SignUp } from './pages/SignUp';

export const App = () => {
    const theme = useTheme();
    const { isLoggedIn, isBootstrapped } = useAuth();

    if (!isBootstrapped) {
        return null;
    }

    return (
        <BrowserRouter>
            <AppHeader />
            <main
                style={{
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.background.default,
                }}
            >
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <SignUp />} />

                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <LandingPage />} />
                    <Route
                        path="/dashboard/applications/:id"
                        element={isLoggedIn ? <Application /> : <LandingPage />}
                    />

                    <Route path="/databases/:databaseId/items" element={<DatabaseItemsPage />} />
                    <Route path="/databases/:databaseId/users" element={<DatabaseUsersPage />} />
                    <Route path="/databases/:databaseId/interactions" element={<DatabaseInteractionsPage />} />

                    <Route path="/account" element={isLoggedIn ? <Account /> : <Navigate to="/" />} />

                    <Route path="/playground" element={<PlaygroundPage />} />
                    <Route path="/expired" element={<SessionExpired />} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
};
