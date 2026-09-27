import User from '../models/user.js'


export const addProfile = async (req,res) => {
   try{
    const {userId} = req.auth()

     if(!userId){
        return res.status(401).json({success:false,message:'Unauthorized'})
    }

    const { aboutme, headline, skills, experience,name,location,avatar } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile information
    user.bio = aboutme;
    user.headline = headline;
    user.skills = skills;
    user.experience = experience;
    user.name = name;
    user.location = location;
    user.avatar = avatar;

    await user.save();

    res.status(200).json({success:true , message: 'Profile updated successfully', user });
   } catch (error) {
       return res.status(500).json({ message: error.message });
   }
}






export const getAllUser = async(req,res) => {
    try{
           const { currentUserId } = req.query;

    // If currentUserId exists, exclude it; otherwise find all users
    const query = currentUserId 
      ? { _id: { $ne: currentUserId } } 
      : {};

    const users = await User.find(query);

    
    res.status(200).json({
        success:true,
        data:users
    })

    }catch(error){
         res.status(500).json({
            success:false,
            message:'Server Error: Unable to fetch users',
            error:error.message
         })
    }
    
}





export const getUserById = async(req,res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        res.status(200).json({ success: true, data: user })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to fetch user',
            error: error.message
        })
    }
}