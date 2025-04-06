// create post: object of post
 class post{
    id;

    title;

    description;

    constructor(id){
        this.id = id;

    }


    async addPostTitle(title){
        var sql = "UPDATE posts SET title = ? WHERE posts = ?"
        const result = await db.query(sql, [title, this.id]);

        this.title = title;
        return result;

    }

}
