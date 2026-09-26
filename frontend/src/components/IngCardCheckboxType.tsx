import type { ingType, catType } from '../types/type.ts';
import { getCategoryColorClass } from '../utils/categoryColor.ts';

function IngCardCheckboxType({ ing, catData, selectedIngIds, handleCheckboxChange }:
    { ing: ingType, catData: catType[], selectedIngIds: number[], handleCheckboxChange: (id: number) => void }) {
    const catName = catData.find((cat) => cat.cat_id === ing.cat_id)?.cat_name || "";
    return (
        <div key={ing.ing_id} className="card">
            <div className='card-row'>
                <p className='name'>
                    {ing.ing_name}
                </p>
                <div className='card-right'>
                    <span className={`cat-name ${getCategoryColorClass(catName)}`}>
                        {catName}
                    </span>
                    <input
                        type="checkbox"
                        checked={selectedIngIds.includes(ing.ing_id)}
                        onChange={() => handleCheckboxChange(ing.ing_id)}
                    />
                </div>

            </div>

        </div>
    );
};

export default IngCardCheckboxType;
