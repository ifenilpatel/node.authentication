import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Sequelize from "sequelize";
import configFile from "../../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";
const config = configFile[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
const db = {};

const files = fs
  .readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".js"));

for (const file of files) {
  const modelModule = await import(`file://${path.join(__dirname, file)}`);
  const model = modelModule.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
