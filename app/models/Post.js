const db = require('./../services/db.js'); 

class Post {
  constructor(id, title, description, created, gameID, userID){
    this.id = id;
    this.title = title;
    this.description = description;
    this.created = created;
    this.gameID = gameID;
    this.userID = userID;
  }

  static async getTipsByUser(userID) {
    const sql = `SELECT Tips_Table.*, GAME.name AS game FROM Tips_Table 
                 JOIN GAME ON Tips_Table.Game_ID = GAME.Game_ID
                 WHERE Tips_Table.User_ID = ?`;
    return await db.query(sql, [userID]);
  }

  static async getRandomTips(limit = 5) {
    const sql = `SELECT Tips_Table.*, GAME.name AS game FROM Tips_Table 
                 JOIN GAME ON Tips_Table.Game_ID = GAME.Game_ID
                 ORDER BY RAND() LIMIT ?`;
    return await db.query(sql, [limit]);
  }
}

module.exports = Post;








// create post: object of post
/*
const db = require('./../services/db.js'); 

class Post {

  title;
  description;

  constructor(id, _title, _des, created,gameID, userID){
    this.id = id;
    this.title = _title;
    this.des = _des;
    this.created = created;
    this.gameID = gameID;
    this.userID = userID;
  }

  async addUserPost(title, description)
  {
    var sql = "UPDATE POST SET title = ?, description = ? WHERE id = ?";
    const result = await db.query(sql, [title, description, this.id]);
    this.title = title;
    this.description = description;
    return result;
  }
}

module.exports = { post};
*/
