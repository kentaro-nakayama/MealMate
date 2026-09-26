// カテゴリー名と表示色(index.cssのcat-1〜cat-6)の対応。
// DBのcat_idは削除・再登録で1〜6からズレることがあるため、
// 色分けは名前ベースで固定する。
const CATEGORY_COLOR_INDEX: Record<string, number> = {
    "野菜類": 1,
    "肉類": 2,
    "魚介類": 3,
    "卵・乳製品": 4,
    "果物": 5,
    "その他": 6,
};

export const getCategoryColorClass = (catName: string): string => {
    const index = CATEGORY_COLOR_INDEX[catName];
    return index ? `cat-${index}` : "cat-0";
};
