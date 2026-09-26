import '../reset.css';
import { Outlet, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Message from './Message.tsx';
import { getUser, logout } from '../api/api.js';
import TitleIcon from '../img/TitleIcon.svg';
import TitleIconForMb from '../img/TitleIcon_for_mb.svg';
import { useNotification } from '../context/useNotification';
import { getErrorMessage } from '../utils/error.ts';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function Layout() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const closeMenu = () => {
        setIsOpen(false);
    };

    const fetchGetUser = async () => {
        const data = await getUser();
        setUsername(data.username);
        return data;
    }

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

    useEffect(() => {
        const fetchUser = async () => {
            await fetchGetUser();
        };
        fetchUser();
    }, []);

    return (
        <div>
            <header>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={isOpen ? "menu-btn open-color" : "menu-btn"}
                >
                    ☰
                </button>
                <div className="header-row">
                    <h1>
                        <img src={TitleIcon} alt="Title Icon" className='title-icon' />
                        <img src={TitleIconForMb} alt="Title Icon for Mobile" className='title-icon-for-mb' />
                    </h1>
                    <nav className={isOpen ? "open" : ""}>
                        <p className='username for-mb'>ようこそ，<span>{username}</span>さん</p>

                        <NavLink to="/home" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            ホーム
                        </NavLink>
                        <NavLink to="/refrigerator" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            冷蔵庫
                        </NavLink>
                        <NavLink to="/search" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            検索
                        </NavLink>
                        <NavLink to="/list_ing" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            材料
                        </NavLink>
                        <NavLink to="/list_dish" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            料理
                        </NavLink>
                        <NavLink to="/shopping" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            買い物リスト
                        </NavLink>
                        <NavLink to="/account" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            アカウント
                        </NavLink>
                        <button onClick={fetchLogout} className='logout-btn for-mb'>
                            <LogOut />
                        </button>
                    </nav>
                    <div className="header-actions for-pc">
                        <p className='username'>ようこそ，<span>{username}</span>さん</p>
                        <button onClick={fetchLogout} className='logout-btn'>
                            <LogOut />
                        </button>
                    </div>
                </div>
                {isOpen && <div className="overlay" onClick={closeMenu}></div>}
            </header>
            <Outlet />
            <Message />
        </div>
    );
}

export default Layout;
