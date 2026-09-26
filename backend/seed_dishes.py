"""代表的な料理をdishテーブルに登録するシードスクリプト。

seed_ingredients.py で登録した材料名を参照するため、
先にそちらを実行しておくこと。既に登録済みの料理名はスキップするため、
何度実行しても安全。

使い方:
    cd backend
    source ../.venv/bin/activate
    python seed_dishes.py
"""

from main import app, db, Dish, Ingredient, Ing_Dish_Set

DISHES = {
    "肉じゃが": (["じゃがいも", "にんじん", "たまねぎ", "牛こま肉", "醤油", "砂糖"], ""),
    "カレーライス": (["じゃがいも", "にんじん", "たまねぎ", "豚こま肉", "カレールー", "米"], ""),
    "豚汁": (["豚バラ肉", "大根", "にんじん", "長ねぎ", "味噌"], ""),
    "野菜炒め": (["キャベツ", "にんじん", "ピーマン", "もやし", "豚バラ肉"], ""),
    "もやし炒め": (["もやし", "豚こま肉", "ごま油"], ""),
    "ピーマンの肉詰め": (["ピーマン", "合い挽き肉", "たまねぎ"], ""),
    "麻婆豆腐": (["豆腐", "合い挽き肉", "長ねぎ", "味噌"], ""),
    "酢豚": (["豚バラ肉", "たまねぎ", "ピーマン", "酢", "砂糖"], ""),
    "サバの味噌煮": (["サバ", "味噌", "砂糖", "みりん"], ""),
    "鮭の塩焼き": (["鮭", "塩"], ""),
    "親子丼": (["鶏もも肉", "たまねぎ", "卵", "米"], ""),
    "カルボナーラ": (["パスタ", "ベーコン", "卵", "チーズ", "生クリーム"], ""),
    "ナポリタン": (["パスタ", "ピーマン", "たまねぎ", "ケチャップ", "ベーコン"], ""),
    "トマトサラダ": (["トマト", "レタス"], ""),
    "コールスローサラダ": (["キャベツ", "にんじん", "マヨネーズ"], ""),
    "ポテトサラダ": (["じゃがいも", "きゅうり", "ハム", "マヨネーズ"], ""),
    "きんぴらごぼう": (["ごぼう", "にんじん", "ごま油", "醤油", "砂糖"], ""),
    "あさりの酒蒸し": (["あさり", "料理酒"], ""),
    "ツナサラダ": (["ツナ缶", "レタス", "マヨネーズ"], ""),
    "フルーツヨーグルト": (["ヨーグルト", "バナナ", "いちご"], ""),
}


def run():
    with app.app_context():
        added_dishes = 0
        skipped_missing_ing = []

        for dish_name, (ing_names, memo) in DISHES.items():
            if Dish.query.filter_by(dish_name=dish_name).first():
                continue

            ing_ids = []
            missing = []
            for ing_name in ing_names:
                ing = Ingredient.query.filter_by(ing_name=ing_name).first()
                if ing:
                    ing_ids.append(ing.ing_id)
                else:
                    missing.append(ing_name)

            if missing:
                skipped_missing_ing.append((dish_name, missing))
                continue

            new_dish = Dish(dish_name=dish_name, memo=memo)
            db.session.add(new_dish)
            db.session.flush()

            for ing_id in ing_ids:
                db.session.add(Ing_Dish_Set(dish_id=new_dish.dish_id, ing_id=ing_id))

            added_dishes += 1

        db.session.commit()
        print(f"料理を{added_dishes}件登録しました。")
        if skipped_missing_ing:
            print("材料が見つからず登録をスキップした料理:")
            for dish_name, missing in skipped_missing_ing:
                print(f"  - {dish_name}: 不足材料 {missing}")


if __name__ == "__main__":
    run()
