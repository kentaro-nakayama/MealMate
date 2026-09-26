"""主要な食材のマスタデータ(カテゴリー・材料)を登録するシードスクリプト。

既に登録済みの名前はスキップするため、何度実行しても安全。

カテゴリーは登録順(辞書の並び順)がそのまま cat_id になり、
frontend/src/index.css の .cat-1 〜 .cat-6 の色に対応する。
    cat_id 1 (緑)     野菜類
    cat_id 2 (赤)     肉類
    cat_id 3 (水色)   魚介類
    cat_id 4 (オレンジ) 卵・乳製品
    cat_id 5 (ピンク)  果物
    cat_id 6 (ブラウン) その他
色の枠は6色分(cat-1〜cat-6)しか用意されていないため、
カテゴリーは必ずこの6つ・この順番を維持すること。

使い方:
    cd backend
    source ../.venv/bin/activate
    python seed_ingredients.py
"""

from main import app, db, Category, Ingredient

CATEGORIES_AND_INGREDIENTS = {
    "野菜類": [
        "トマト", "にんじん", "じゃがいも", "たまねぎ", "キャベツ", "レタス",
        "きゅうり", "ピーマン", "ブロッコリー", "ほうれん草", "大根", "長ねぎ",
        "にら", "もやし", "なす", "かぼちゃ", "ごぼう", "れんこん",
    ],
    "肉類": [
        "豚バラ肉", "合い挽き肉", "牛ひき肉", "鶏もも肉", "鶏むね肉",
        "豚こま肉", "牛こま肉", "ベーコン", "ハム", "ソーセージ",
    ],
    "魚介類": [
        "鮭", "サバ", "まぐろ", "えび", "いか", "あさり", "ぶり", "ツナ缶",
    ],
    "卵・乳製品": [
        "卵", "牛乳", "チーズ", "バター", "ヨーグルト", "生クリーム",
    ],
    "果物": [
        "りんご", "バナナ", "みかん", "いちご", "ぶどう", "もも", "キウイ",
        "レモン", "なし", "すいか",
    ],
    "その他": [
        "豆腐", "納豆", "油揚げ",
        "醤油", "味噌", "塩", "砂糖", "酢", "みりん", "料理酒", "サラダ油",
        "ごま油", "マヨネーズ", "ケチャップ", "コンソメ", "カレールー",
        "米", "食パン", "うどん", "パスタ", "そば", "中華麺",
    ],
}


def run():
    with app.app_context():
        added_categories = 0
        added_ingredients = 0

        for cat_name, ing_names in CATEGORIES_AND_INGREDIENTS.items():
            category = Category.query.filter_by(cat_name=cat_name).first()
            if not category:
                category = Category(cat_name=cat_name)
                db.session.add(category)
                db.session.flush()
                added_categories += 1

            for ing_name in ing_names:
                if not Ingredient.query.filter_by(ing_name=ing_name).first():
                    db.session.add(Ingredient(ing_name=ing_name, cat_id=category.cat_id))
                    added_ingredients += 1

        db.session.commit()
        print(f"カテゴリーを{added_categories}件、材料を{added_ingredients}件登録しました。")


if __name__ == "__main__":
    run()
