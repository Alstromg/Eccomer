const UserModel = require('./models/user.model.js')


const getUserById = async (cid) => {
    return await UserModel.findById(cid);
  };

  const updateUserRole = async (userId, newRole) => {
    try {
  
      const user = await UserModel.findById(userId);
      if (!user) {
        return null;
      }
      user.role = newRole;
      const updatedUser = await user.save();
  
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar el rol del usuario:', error);
      throw error; 
    }
  };
  
module.exports = { updateUserRole, getUserById };
  