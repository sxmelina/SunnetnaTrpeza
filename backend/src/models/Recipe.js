import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

// Model recepta
export const Recipe = sequelize.define(
  "Recipe",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(140), allowNull: false },
    shortDescription: { type: DataTypes.STRING(300), allowNull: true },
    instructions: { type: DataTypes.TEXT, allowNull: false },
    sourceType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "ZDRAVO"
    },
    sourceReference: { type: DataTypes.STRING(120), allowNull: true },
    imageUrl: { type: DataTypes.STRING(300), allowNull: true }
  },
  { tableName: "recipes", timestamps: true }
);
