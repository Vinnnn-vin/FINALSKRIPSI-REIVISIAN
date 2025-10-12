// src\models\Category.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/database";
import { Category as CategoryInterface } from "../types";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CategoryCreationAttributes
  extends Optional<CategoryInterface, "category_id" | "created_at"> {}

class Category
  extends Model<CategoryInterface, CategoryCreationAttributes>
  implements CategoryInterface
{
  category_id!: number;
  category_name?: string;
  created_at?: Date;
  category_description?: string;
  image_url?: string;
  course_count?: number;
}

Category.init(
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    category_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: false,
  }
);

export default Category;
