// src\models\Material.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/database";
import MaterialDetail from "./MaterialDetail";
import Quiz from "./Quiz";

interface MaterialInterface {
  material_id: number;
  material_name?: string;
  material_description?: string;
  course_id: number;
  details?: MaterialDetail[];
  quizzes?: Quiz[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MaterialCreationAttributes
  extends Optional<MaterialInterface, "material_id"> {}

class Material
  extends Model<MaterialInterface, MaterialCreationAttributes>
  implements MaterialInterface
{
  declare material_id: number;
  declare material_name?: string;
  declare material_description?: string;
  declare course_id: number;
  declare readonly details?: MaterialDetail[];
  declare readonly quizzes?: Quiz[];
}

Material.init(
  {
    material_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    material_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    material_description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Material",
    tableName: "material",
    timestamps: false,
  }
);

export default Material;
