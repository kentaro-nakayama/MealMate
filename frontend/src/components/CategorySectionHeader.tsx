import { getCategoryColorClass } from '../utils/categoryColor.ts';

type CategorySectionHeaderProps = {
    catName: string;
    count: number;
};

function CategorySectionHeader({ catName, count }: CategorySectionHeaderProps) {
    return (
        <div className="category-section-header">
            <span className={`cat-dot ${getCategoryColorClass(catName)}`}></span>
            {catName}
            <span className="category-section-count">（{count}）</span>
        </div>
    );
}

export default CategorySectionHeader;
