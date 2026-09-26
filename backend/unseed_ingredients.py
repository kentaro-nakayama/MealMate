"""seed_ingredients.py で登録した材料・カテゴリーを削除するスクリプト。

seed_ingredients.py の CATEGORIES_AND_INGREDIENTS と同じ名前のデータのみを
対象とする。関連する冷蔵庫・買い物リスト・料理との紐付けも先に削除する。

使い方:
    cd backend
    source ../.venv/bin/activate
    python unseed_ingredients.py
"""

from main import app, db, Category, Ingredient, Ing_Dish_Set, Refrigerator, ShoppingList
from seed_ingredients import CATEGORIES_AND_INGREDIENTS


def run():
    with app.app_context():
        all_ing_names = [
            name for names in CATEGORIES_AND_INGREDIENTS.values() for name in names
        ]
        ingredients = Ingredient.query.filter(Ingredient.ing_name.in_(all_ing_names)).all()
        ing_ids = [ing.ing_id for ing in ingredients]

        if ing_ids:
            Ing_Dish_Set.query.filter(Ing_Dish_Set.ing_id.in_(ing_ids)).delete(synchronize_session=False)
            Refrigerator.query.filter(Refrigerator.ing_id.in_(ing_ids)).delete(synchronize_session=False)
            ShoppingList.query.filter(ShoppingList.ing_id.in_(ing_ids)).delete(synchronize_session=False)

        deleted_ingredients = len(ingredients)
        for ing in ingredients:
            db.session.delete(ing)

        deleted_categories = 0
        for cat_name in CATEGORIES_AND_INGREDIENTS:
            category = Category.query.filter_by(cat_name=cat_name).first()
            if category and Ingredient.query.filter_by(cat_id=category.cat_id).count() == 0:
                db.session.delete(category)
                deleted_categories += 1

        db.session.commit()
        print(f"材料を{deleted_ingredients}件、カテゴリーを{deleted_categories}件削除しました。")


if __name__ == "__main__":
    run()
