import type { catType } from '../types/type.ts';

export type CategoryGroup<T> = {
    catId: number;
    catName: string;
    items: T[];
};

// 材料をカテゴリーごとにまとめ、cat_idの昇順に並べる
export function groupByCategory<T extends { cat_id: number }>(
    items: T[],
    catData: catType[]
): CategoryGroup<T>[] {
    const groups = new Map<number, CategoryGroup<T>>();

    for (const item of items) {
        let group = groups.get(item.cat_id);
        if (!group) {
            const catName = catData.find((cat) => cat.cat_id === item.cat_id)?.cat_name || "";
            group = { catId: item.cat_id, catName, items: [] };
            groups.set(item.cat_id, group);
        }
        group.items.push(item);
    }

    return Array.from(groups.values()).sort((a, b) => a.catId - b.catId);
}
