const Sequelize = require("sequelize");
const sql = require("../util/sql");

const Posts = sql.define("post", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    title: {
        type: Sequelize.STRING(100),
        notNull: false,
    },

    comment: {
        type: Sequelize.STRING(1000),
        notNull: false,
    },

    image: {
        type: Sequelize.STRING,
        notNull: false,
    },

});


module.exports = Posts;