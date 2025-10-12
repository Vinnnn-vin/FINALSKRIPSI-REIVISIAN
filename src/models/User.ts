// src\models\User.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/lib/database";
import bcrypt from "bcrypt";
import { User as UserInterface, UserRole } from "../types";

interface UserCreationAttributes
  extends Optional<UserInterface, "user_id" | "created_at" | "deleted_at"> {
  password?: string;
}

class User
  extends Model<UserInterface, UserCreationAttributes>
  implements UserInterface
{
  declare user_id: number;
  declare first_name?: string;
  declare last_name?: string;
  declare full_name?: string;
  declare email?: string;
  declare password_hash?: string;
  declare role?: UserRole;
  declare created_at?: Date;
  declare deleted_at?: Date;
  declare course_count?: number;

  // Properti relasi (read-only)
  public readonly courses?: any[];
  public readonly enrollments?: any[];
  public readonly payments?: any[];
  public readonly notifications?: any[];
  public readonly reviews?: any[];
  public readonly certificates?: any[];
  public readonly progress?: any[];

  // Method to hash password
  public async setPassword(password: string): Promise<void> {
    const saltRounds = 12;
    this.password_hash = await bcrypt.hash(password, saltRounds);
  }

  // Method to verify password
  public async checkPassword(password: string): Promise<boolean> {
    if (!this.password_hash) return false;
    return await bcrypt.compare(password, this.password_hash);
  }

  // Method to get user without sensitive data
  public toSafeJSON() {
    const { ...safeUser } = this.toJSON();
    return safeUser;
  }
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    full_name: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.first_name || ""} ${this.last_name || ""}`.trim();
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        isIn: [["admin", "instructor", "student", "lecturer"]], // Added 'lecturer' based on database
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
    paranoid: false,
  }
);

export default User;
