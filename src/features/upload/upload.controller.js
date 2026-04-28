
/*
 * 🛡️ --------------------------------------------------- 🛡️
 *              USER IMAGE UPLOAD LOGIC (  cloudinary  )
 * 🛡️ --------------------------------------------------- 🛡️
*/

export const uploadImage = async(req,res)=> {

  console.log('file data ', req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // req.file is populated by the multer middleware before reaching here
    const imageUrl = req.file.path;

    return res.status(200).json({
      success: true,
      url: imageUrl,
      public_id: req.file.filename // Optional: good for deleting later
    });
  } catch (error) {
    console.error('Controller Error:', error);
    return res.status(500).json({ error: 'Internal Server Error during upload' });
  }
}
