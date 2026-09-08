import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const MetalRate = sequelize.define(
  "MetalRate",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },

    metalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    metalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // ALL METALS
    ratePerOunceINR: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    ratePerGramINR: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    // GOLD ONLY
    rate24K: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    rate22K: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    rate18K: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },

    rateDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    source: {
      type: DataTypes.STRING,
      defaultValue: "MetalPriceAPI",
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    history: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    tableName: "metal_rates",
    timestamps: true,
  }
);

export default MetalRate;
