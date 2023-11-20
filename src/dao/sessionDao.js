const UserDto = require('../dto/userDTO.JS');
const User = require('./models/user.model');
const config = require('../config/config');

const  getUserByEmail = async (email) => {
  console.log("el correo es", email)
  if (email === config.admin.adminEmail ) {
    return {
      first_name: 'Administrador',
      email: config.admin.adminEmail,
      role: 'admin'
    };
  } else {
    try {
      const result = await User.findOne({ email })
      if (result) {
        const user = new UserDto(result);
        console.log(user);
        return user;
      } else {

        return null;
      }
    } catch (error) {
      console.error('Error al obtener el usuario por correo electrónico:', error);
      throw error; 
    }
  }
};

module.exports = {
  getUserByEmail,
};

