//css
import '../reset.css';
//react
import { useEffect, useState } from 'react';
//api
import { getRefIng, getShoppingList, searchDish } from '../api/api.js';
//types
import type { refIngType, ResultItemType } from '../types/type.ts';
//components
import LoadingSpinner from '../components/LoadingSpinner.tsx';
//context
import { useNotification } from '../context/useNotification';
import { getErrorMessage } from '../utils/error.ts';
//icons
import { House, TriangleAlert, Refrigerator, ShoppingCart, ArrowRight, ChartColumn, Star } from 'lucide-react';


function Home() {

    const [refIngData, setRefIngData] = useState<refIngType[]>([]);
    const [possibleDishList, setPossibleDishList] = useState<ResultItemType[]>([]);
    const [shoppingList, setShoppingList] = useState<refIngType[]>([]);
    const [firstLoading, setFirstLoading] = useState<boolean>(false);
    const { showNotification } = useNotification();

    //ローディング表示
    useEffect(() => {
        const firstFetch = async () => {
            try {
                setFirstLoading(true);
                fetchGetShoppingList();
                const refData = await getRefIng();
                const refIngs = refData.ings_in_ref_list_json;
                setRefIngData(refIngs);
                await fetchPossibleDishes(refIngs);
            } catch (error) {
                showNotification("error", getErrorMessage(error));
            } finally {
                setFirstLoading(false);
            }
        };
        firstFetch();
    }, []);

    if (firstLoading) {
        return <LoadingSpinner />;
    }

    // 買い物リストの材料を取得
    const fetchGetShoppingList = async () => {
        const data = await getShoppingList();
        setShoppingList(data.shopping_list_json);
    };

    //冷蔵庫に追加してから1週間以上経過した材料数を表示
    const getDengerIngCount = () => {
        const dengerIngList = refIngData.filter(ing => {
            const addedAt = new Date(ing.added_at);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - addedAt.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 7;
        });
        return dengerIngList.length;
    }

    //一致率に応じた色分け
    const getMatchRateClass = (rate: number) => {
        if (rate >= 70) return "";
        if (rate >= 40) return "mid";
        return "low";
    };

    //冷蔵庫の材料で作れる料理を取得
    const fetchPossibleDishes = async (refIngs: refIngType[]) => {
        const refIngIds = refIngs.map(ing => ing.ing_id);
        if (refIngIds.length === 0) {
            setPossibleDishList([]);
            return;
        }
        try {
            const data = await searchDish(refIngIds);
            setPossibleDishList(data.result_list);
        } catch (error) {
            showNotification("error", getErrorMessage(error));
        }
    };


    return (
        <div className="main home-page">
            <h2><House className='h2-icon' />ホーム</h2>
            <hr />
            <div className="contents-area">
                <div className='section-container'>
                    <section className='recommend-section'>
                        <div className="card-header">
                            <Star className='h3-icon' />今すぐ作れる料理
                        </div>
                        <div className='recommend-dish-container'>
                            {possibleDishList.length === 0 ?
                                <p>作れる料理が見つかりませんでした</p> :
                                possibleDishList
                                    .sort((a, b) => a[2] - b[2]) //不足数で昇順ソート
                                    .map((possibleDish, index) => (

                                        <div key={index} className='flex recommend-dish-card'>
                                            <div className={`match-rate ${getMatchRateClass(possibleDish[5])}`}>
                                                一致率
                                                <p>{possibleDish[5]}</p>
                                            </div>
                                            <div>
                                                <div className='dish-info'>
                                                    <h4>{possibleDish[0]}</h4>
                                                    <p className='lack-ing_list'>
                                                        {possibleDish[2] === 0 ? "不足なし" : `不足材料: ${possibleDish[3].join(", ")}`}
                                                    </p>
                                                </div>
                                                <a
                                                    href={`https://www.google.com/search?q=${encodeURIComponent(possibleDish[0] + ' レシピ')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className='see-recipe-btn'
                                                >レシピを検索<ArrowRight className='see-recipe-btn-arrow' />
                                                </a>
                                            </div>
                                        </div>

                                    ))
                            }
                        </div>
                    </section>
                    <section className='summary-section'>
                        <div className='card-header blue'>
                            <ChartColumn className='h3-icon' />サマリー
                        </div>
                        <div className="summary-container">
                            <div className='ing-in-ref'>
                                <div className="flex">
                                    <Refrigerator className='summary-icon' />
                                    <h4>{refIngData.length}<span>個</span></h4>
                                </div>
                                <p>冷蔵庫の材料</p>
                            </div>
                            <div className='denger-ing'>
                                <div className="flex">
                                    <TriangleAlert className='summary-icon' />
                                    <h4>{getDengerIngCount()}<span>個</span></h4>
                                </div>
                                <p>賞味期限が近い材料</p>
                            </div>
                            <div className='ing-in-shopping-list'>
                                <div className="flex">
                                    <ShoppingCart className='summary-icon' />
                                    <h4>{shoppingList.length}<span>個</span></h4>
                                </div>
                                <p>買い物リストの材料</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
};

export default Home;