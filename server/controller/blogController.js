import cloudinary from "../config/cloudinary.js";
import Blog from "../models/blogModel.js"

// add blogs
export const addBlog = async (req,res)=>{
    try {
        const { title, description,image } = req.body
        if (!title || !description || !image) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false,
                error: true 
            })
        }
    const uploadImg = await cloudinary.uploader.upload(image, 
        { folder: 'blogs', // optional: set your Cloudinary folder
 });
    const payload = {
            title,
            description,
            image : {
                url : uploadImg.secure_url,
                public_id : uploadImg.public_id // required to delete from cloudinary
            }
 }
        const blog = await Blog(payload)
        await blog.save()
        return res.status(201).json({
            message: "Blog added successfully",
            success: true,
            error: false,
            data: blog
        })
    } catch (error) {
        return res.status(500).json({ message : error.message})
        
    }
}

// git all blogs
export const getAllBlogs = async (req,res)=>{
    try {
        const allBlogs = await Blog.find().sort({ createdAt : -1})
          return res.status(200).json({
            message: "Blog fetched successfully",
            success: true,
            error: false,
            data: allBlogs
        })
    } catch (error) {
        return res.status(500).json({ message : error.message})
        
    }
}

// update blog 
export const updateBlog = async (req,res)=>{
     try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

 

    // If image has changed (i.e., is a new base64 or different string), replace it
    if (image && image !== blog.image.url) {
      // Delete the old image from Cloudinary using stored public_id
      if (blog.image.public_id) {
        await cloudinary.uploader.destroy(blog.image.public_id);
      }

      // Upload new image
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: "blogs",
      });

      blog.image = {
        url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      };
    }

    // Update other fields
    blog.title = title || blog.title;
    blog.description = description || blog.description;

    await blog.save();
    return res.status(200).json({
      message: "Blog updated successfully",
      success: true,
      error: false,
      data: blog,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// delete blog
export const deleteBlog = async (req,res)=>{
    try {
        const { id } = req.params
         const blog = await Blog.findById(id)
         if (!blog){ 
            return res.status(404).json({ 
                message: 'Blog not found',
                success: false,
                error : true 
            })};

            // Delete image from Cloudinary
    if (blog.image && blog.image.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
    }
        await Blog.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Blog deleted successfully",
            success: true,
            error: false
        })
    } catch (error) {
        return res.status(500).json({ message : error.message})
        
    }
}

// get single blog details
export const getblogDetails = async (req,res)=>{
    try {
        const {id} = req.params
        const blog = await Blog.findById(id)
        if(!blog){
            return res.status(4004).json({
                message : "Blog not found",
                success : false,
                error : true
            })
        }
        return res.status(200).json({
            message: "Blog details fetched successfully",
            success: true,
            error: false,
            data: blog
        })
    } catch (error) {
        return res.status(500).json({ message : error.message})
        
    }
}