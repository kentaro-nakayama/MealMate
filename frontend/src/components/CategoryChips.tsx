import type { catType } from '../types/type.ts';
import { getCategoryColorClass } from '../utils/categoryColor.ts';

type CategoryChipsProps = {
    showCatId: string;
    setShowCatId: (value: string) => void;
    catData: catType[];
};

function CategoryChips({ showCatId, setShowCatId, catData }: CategoryChipsProps) {
    return (
        <div className="category-chips">
            <button
                type="button"
                className={`chip${showCatId === "" ? " active" : ""}`}
                onClick={() => setShowCatId("")}
            >
                すべて
            </button>
            {catData.map((cat) => (
                <button
                    key={cat.cat_id}
                    type="button"
                    className={`chip ${getCategoryColorClass(cat.cat_name)}${showCatId === String(cat.cat_id) ? " active" : ""}`}
                    onClick={() => setShowCatId(String(cat.cat_id))}
                >
                    {cat.cat_name}
                </button>
            ))}
        </div>
    );
}

export default CategoryChips;
