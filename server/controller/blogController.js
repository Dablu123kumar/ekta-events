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
        const blog = await Blog({title,description,image : uploadImg.secure_url})
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

    // Replace image if changed
    let imageUrl = blog.image;
    if (image && image !== blog.image) {
          // ✅ Extract old public_id from URL
      const segments = blog.image.split('/');
      const publicIdWithExt = segments[segments.length - 1];
      const publicId = `blogs/${publicIdWithExt.split('.')[0]}`;

      // ✅ Delete old image
      await cloudinary.uploader.destroy(publicId);

        // upload new image
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: 'blogs',
      });
      imageUrl = uploadedImage.secure_url;
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.image = imageUrl;

    await blog.save();
    res.json({ message: 'Blog updated', blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// delete blog
export const deleteBlog = async (req,res)=>{
    try {
        const { id } = req.params
        await Blog.findByIdAndDelete(id)
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