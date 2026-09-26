import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn } from '../api/api';
import { useNotification } from '../context/useNotification';
import LoadingSpinner from './LoadingSpinner.tsx';

function ProtectedRoute() {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await isLoggedIn();
                setIsAuth(response.isLoggedIn === true);
            } catch (error) {
                console.error('ログイン状態の確認に失敗:', error);
                setIsAuth(false);
            }
        };
        checkLoginStatus();
    }, []);

    if (isAuth === null) {
        return <LoadingSpinner />;
    }

    if (!isAuth) {
        showNotification('error', 'ログインしてください');
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;