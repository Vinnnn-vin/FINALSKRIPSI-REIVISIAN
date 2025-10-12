// src\models\MaterialDetail.ts
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/database";
import { Assignment } from "./Assignment"; 

interface MaterialDetailInterface {
  material_detail_id: number;
  material_detail_name: string;
  material_detail_description: string;
  material_detail_type: number;
  materi_detail_url: string;
  material_id?: number;
  is_free?: boolean;
}

// tambahkan properti assignment di interface untuk typing
export interface MaterialDetailWithRelations extends MaterialDetailInterface {
  assignment?: Assignment; // ✅ properti relasi
}

interface MaterialDetailCreationAttributes
  extends Optional<MaterialDetailInterface, "material_detail_id" | "material_id"> {}

class MaterialDetail
  extends Model<MaterialDetailInterface, MaterialDetailCreationAttributes>
  implements MaterialDetailInterface
{
  declare material_detail_id: number;
  declare material_detail_name: string;
  declare material_detail_description: string;
  declare material_detail_type: number;
  declare materi_detail_url: string;
  declare material_id?: number;
  declare is_free?: boolean;

  // ✅ tambahkan deklarasi relasi
  declare readonly assignment?: Assignment;
}

MaterialDetail.init(
  {
    material_detail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    material_detail_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    material_detail_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    material_detail_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1: Video, 2: Document, 3: URL, 4: Assignment",
    },
    materi_detail_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    material_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "material",
        key: "material_id",
      },
    },
    is_free: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "MaterialDetail",
    tableName: "material_detail",
    timestamps: false,
  }
);

export default MaterialDetail;
