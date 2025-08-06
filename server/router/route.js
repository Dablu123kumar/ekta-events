import express from "express";
import { createUser, loginUser } from "../controller/userController.js";
import { addBlog, deleteBlog, getAllBlogs, getblogDetails, updateBlog } from "../controller/blogController.js";

const router = express.Router()

// user routes
router.post('/create-user',createUser)
router.post('/login-user',loginUser)


/// blog routes
router.post('/add-blog', addBlog)
router.get('/get-all-blogs', getAllBlogs)
router.put('/update-blog/:id', updateBlog)
router.delete('/delete-blog/:id', deleteBlog)
router.get('/get-blog-details/:id', getblogDetails)




export default router