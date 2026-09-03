import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    empId: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Super Admin", "Admin", "Staff"),
      allowNull: false,
    },
    accountStatus: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isTermsAndConditions: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default User;
