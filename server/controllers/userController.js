import User from '../models/user.js'


export const addProfile = async (req,res) => {
   try{
    const { userId, aboutme, headline, skills, experience,name,location,avatar } = req.body;

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

    res.status(200).json({ message: 'Profile updated successfully', user });
   } catch (error) {
       return res.status(500).json({ message: error.message });
   }
}