import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { 
        type : String, 
        required : true
    },
    description : {
        type : String, 
        required : true
    },
    image: { 
        url: String, 
        public_id: String, // Required to delete from Cloudinary
    },
},{timestamps : true})

const Blog = mongoose.model('blog', blogSchema)

export default Blog;
