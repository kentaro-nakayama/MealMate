//css
import '../reset.css';
//react
import { useState, useEffect } from 'react';
//api
import { getUser, editUser, deleteUser } from '../api/api.js';
//context
import { useNotification } from '../context/useNotification';
import { getErrorMessage } from '../utils/error.ts';
import { useNavigate } from 'react-router-dom';
//icons
import { UserCog, Trash2 } from 'lucide-react';

function Account() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getUser();
            setUsername(data.username);
        };
        fetchUser();
    }, []);

    // ユーザー情報の更新
    const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const trimmedUsername = username.trim();
        if (!trimmedUsername) {
            showNotification("error", "ユーザー名を入力してください");
            setLoading(false);
            return;
        }
        try {
            await editUser(trimmedUsername, password.trim());
            showNotification("success", "ユーザー情報が更新されました");
            setPassword('');
        } catch (error) {
            showNotification("error", getErrorMessage(error));
            return;
        } finally {
            setLoading(false);
        }
    };

    // アカウントの削除
    const handleDeleteUser = async () => {
        const confirmed = window.confirm(
            "アカウントを削除すると、冷蔵庫・買い物リストのデータも全て削除されます。元に戻せませんがよろしいですか？"
        );
        if (!confirmed) {
            return;
        }
        setDeleting(true);
        try {
            await deleteUser();
            showNotification("success", "アカウントを削除しました");
            navigate('/');
        } catch (error) {
            showNotification("error", getErrorMessage(error));
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="main account-page">
            <h2><UserCog className='h2-icon' />アカウント設定</h2>
            <hr />
            <div className="contents-area">
                <p>ユーザー名やパスワードを変更できます</p>
                <form className="form-card" onSubmit={handleEditUser}>
                    <h3>ユーザー情報の編集</h3>
                    <div>
                        <label>ユーザー名<br />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="ユーザー名を入力"
                            />
                        </label>
                    </div>
                    <div>
                        <label>新しいパスワード<br />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="変更する場合のみ入力"
                            />
                        </label>
                    </div>
                    <button type="submit" disabled={loading} className='btn'>
                        {loading ? "更新中..." : <><UserCog className='icon-in-btn' />更新</>}
                    </button>
                </form>

                <div className="form-card danger-zone">
                    <h3>アカウントの削除</h3>
                    <p>アカウントを削除すると、冷蔵庫・買い物リストのデータも全て削除され、元に戻せません。</p>
                    <button
                        type="button"
                        disabled={deleting}
                        className='btn btn-danger'
                        onClick={handleDeleteUser}
                    >
                        {deleting ? "削除中..." : <><Trash2 className='icon-in-btn' />アカウントを削除</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Account;
