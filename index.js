import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

//middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//Blog Data
var allBlogs = [];

//post constructor
function Post(title, author, content){
    this.title = title;
    this.author = author;
    this.content = content;
}

//add post to allBlogs array
function addPost(title, author, content){
    let post = new Post(title, author, content);
    allBlogs.push(post);
}

//delete blog
function deleteBlog(index){
    allBlogs.splice(index, 1);
}

//edit blog 
function editBlog(index, title, author, content){
    allBlogs[index] = new Post(title, author, content);
}





//home page
app.get("/", (req, res)=>{
    res.render("index.ejs",{ allBlogs: allBlogs });
});

//create page
app.get("/create", (req, res)=>{
    res.render("create.ejs");
});

//publish new blog 
app.post("/publish", (req, res)=>{
    let title = req.body["heading"];
    let author = req.body["author"];
    let content = req.body["blog-content"];

    addPost(title, author, content);
    res.redirect("/");
});

//view blog
app.get("/blog/:id", (req, res)=>{
    let index = req.params.id;
    let currentBlog = allBlogs[index];
    res.render("blog.ejs", 
        {
            postId: index, 
            blogTitle: currentBlog.title, 
            blogAuthor: currentBlog.author, 
            blogContent: currentBlog.content
        } 
    );
});

//delete blog
app.post("/delete", (req, res)=>{
    let index = req.body["postId"];
    deleteBlog(index);
    res.redirect("/");
});

//edit blog page
app.get("/edit/:id", (req, res)=>{
    let index = req.params.id;
    let currentBlog = allBlogs[index];
    res.render("create.ejs",
        {
            postId: index,
            blogTitle: currentBlog.title, 
            blogAuthor: currentBlog.author, 
            blogContent: currentBlog.content
        }
    );
});


//update blog(save changes)
app.post("/update", (req, res)=>{
    let title = req.body["heading"];
    let author = req.body["author"];
    let content = req.body["blog-content"];
    let index = req.body["index"];
    editBlog(index, title, author, content);
    res.redirect("/");

});

// server 
app.listen(port, ()=>{
   console.log(`Server running on port ${port}`); 
});