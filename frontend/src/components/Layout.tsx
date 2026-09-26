import '../reset.css';
import { Outlet, NavLink } from "react-router-dom";
import Message from './Message.tsx';
import { logout } from '../api/api.js';
import TitleIcon from '../img/TitleIcon.svg';
import { useNotification } from '../context/useNotification';
import { getErrorMessage } from '../utils/error.ts';
import { useNavigate } from 'react-router-dom';
import { LogOut, House, Refrigerator, Search, ClipboardList, CookingPot, ShoppingCart, User } from 'lucide-react';

function Layout() {
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    //ログアウト
    const fetchLogout = async () => {
        try {
            await logout();
            showNotification("success", "ログアウトしました");
            navigate("/");
        } catch (error) {
            showNotification("error", getErrorMessage(error));
        }
    };

    return (
        <div className="app-shell">
            <header>
                <div className="header-row">
                    <h1>
                        <img src={TitleIcon} alt="Title Icon" className='title-icon' />
                    </h1>
                    <nav>
                        <NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>
                            <House className='nav-icon' />
                            <span>ホーム</span>
                        </NavLink>
                        <NavLink to="/refrigerator" className={({ isActive }) => isActive ? "active" : ""}>
                            <Refrigerator className='nav-icon' />
                            <span>冷蔵庫</span>
                        </NavLink>
                        <NavLink to="/search" className={({ isActive }) => isActive ? "active" : ""}>
                            <Search className='nav-icon' />
                            <span>検索</span>
                        </NavLink>
                        <NavLink to="/list_ing" className={({ isActive }) => isActive ? "active" : ""}>
                            <ClipboardList className='nav-icon' />
                            <span>材料</span>
                        </NavLink>
                        <NavLink to="/list_dish" className={({ isActive }) => isActive ? "active" : ""}>
                            <CookingPot className='nav-icon' />
                            <span>料理</span>
                        </NavLink>
                        <NavLink to="/shopping" className={({ isActive }) => isActive ? "active" : ""}>
                            <ShoppingCart className='nav-icon' />
                            <span className='nav-label-pc'>買い物リスト</span>
                            <span className='nav-label-mb'>買い物</span>
                        </NavLink>
                        <NavLink to="/account" className={({ isActive }) => isActive ? "active" : ""}>
                            <User className='nav-icon' />
                            <span>アカウント</span>
                        </NavLink>
                    </nav>
                    <div className="header-actions">
                        <button onClick={fetchLogout} className='logout-btn'>
                            <LogOut />
                        </button>
                    </div>
                </div>
            </header>
            <Outlet />
            <Message />
        </div>
    );
}

export default Layout;
