const userDao = require('../dao/userDao.Js');


const getUser = async (req, res) => {
    const cid = req.params.cid;
    try {
        const usuario = await userDao.getUserById(cid);
        if (usuario === null) {
            return res.status(404).json({ status: 'error', error: `Usuario con id = ${cid} no existe` });
        }
        return res.status(200).json({ status: 'success', data: usuario });
    } catch (error) {
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
}

const putUserRole = async (req, res) => {
    const cid = req.params.cid;
  try {
    
    const user = await userDao.getUserById(cid);

    if (!user) {
      return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });
    }
    if (user.role === 'user') {
      const updatedUser = await userDao.updateUserRole(cid, 'premium');

      if (updatedUser) {
        return res.status(200).json({ status: 'success', message: 'Rol de usuario actualizado a premium' });
      } else {
        return res.status(500).json({ status: 'error', error: 'Error al actualizar el rol del usuario' });
      }
    } else {
      return res.status(400).json({ status: 'error', error: 'El usuario ya tiene un rol distinto de "user"' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};

module.exports = {putUserRole , getUser};
;