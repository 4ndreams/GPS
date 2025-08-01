"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";






export async function getUserService(query) {
  try {
    const { rut, id, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id_usuario: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { password, ...userData } = userFound;

    return [userData, null];
  } catch (error) {
    console.error("Error obtener el usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getUsersService() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find();

    if (!users || users.length === 0) return [null, "No hay usuarios"];

    const usersData = users.map(({ password, ...user }) => user);

    return [usersData, null];
  } catch (error) {
    console.error("Error al obtener a los usuarios:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function createUserService(userData) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    // Verificar si ya existe un usuario con el mismo rut o email
    const existingUser = await userRepository.findOne({
      where: [
        { rut: userData.rut },
        { email: userData.email }
      ],
    });

    if (existingUser) {
      return [null, "Ya existe un usuario con el mismo rut o email"];
    }

    // Encriptar la contraseña si se proporciona
    let encryptedPassword = null;
    if (userData.password && userData.password.trim() !== "") {
      encryptedPassword = await encryptPassword(userData.password);
    }

    // Preparar los datos del usuario
    const newUserData = {
      nombre: userData.nombre,
      apellidos: userData.apellidos,
      rut: userData.rut,
      email: userData.email,
      rol: userData.rol || 'cliente', // rol por defecto
      flag_blacklist: userData.flag_blacklist || false,
      password: encryptedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Crear el usuario
    const newUser = userRepository.create(newUserData);
    const savedUser = await userRepository.save(newUser);

    // Retornar sin la contraseña
    const { password, ...userCreated } = savedUser;
    return [userCreated, null];
  } catch (error) {
    console.error("Error al crear un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateUserService(query, body) {
  try {
    const { id, rut, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    // Buscar usuario usando id_usuario en lugar de id
    const userFound = await userRepository.findOne({
      where: [{ id_usuario: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const existingUser = await userRepository.findOne({
      where: [{ rut: body.rut }, { email: body.email }],
    });

    if (existingUser && existingUser.id_usuario !== userFound.id_usuario) {
      return [null, "Ya existe un usuario con el mismo rut o email"];
    }

    if (body.password) {
      const matchPassword = await comparePassword(
        body.password,
        userFound.password,
      );

      if (!matchPassword) return [null, "La contraseña no coincide"];
    }

    // Actualizar campos con los nombres correctos según el frontend
    const dataUserUpdate = {
      nombre: body.nombre,
      apellidos: body.apellidos,
      rut: body.rut,
      email: body.email,
      rol: body.rol,
      flag_blacklist: body.flag_blacklist,
      updatedAt: new Date(),
    };

    if (body.newPassword && body.newPassword.trim() !== "") {
      dataUserUpdate.password = await encryptPassword(body.newPassword);
    }

    // Actualizar usando id_usuario
    await userRepository.update({ id_usuario: userFound.id_usuario }, dataUserUpdate);

    const userData = await userRepository.findOne({
      where: { id_usuario: userFound.id_usuario },
    });

    if (!userData) {
      return [null, "Usuario no encontrado después de actualizar"];
    }

    const { password, ...userUpdated } = userData;

    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteUserService(query) {
  try {
    const { id, rut, email } = query;

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: [{ id_usuario: id }, { rut: rut }, { email: email }],
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    if (userFound.rol === "Administrador") {
      return [null, "No se puede eliminar un usuario con rol de administrador"];
    }

    const userDeleted = await userRepository.remove(userFound);

    const { password, ...dataUser } = userDeleted;

    return [dataUser, null];
  } catch (error) {
    console.error("Error al eliminar un usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getProfileService(userId) {
  try {
    if (!userId) return [null, "ID de usuario no proporcionado"];

    const userRepository = AppDataSource.getRepository(User);

    const userFound = await userRepository.findOne({
      where: { id_usuario: userId },
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    const { password, ...userData } = userFound;

    return [userData, null];
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function updateProfileService(userId, body) {
  try {
    console.log('=== UPDATE PROFILE SERVICE DEBUG ===');
    console.log('User ID:', userId);
    console.log('Body received:', body);
    console.log('Body keys:', Object.keys(body));
    
    const userRepository = AppDataSource.getRepository(User);

    // Busca el usuario por su ID
    const userFound = await userRepository.findOne({
      where: { id_usuario: userId },
    });

    if (!userFound) return [null, "Usuario no encontrado"];

    // Verifica si ya existe otro usuario con el mismo rut o email (solo si se están enviando estos campos)
    if (body.rut || body.email) {
      console.log('Checking for duplicates...');
      console.log('Body rut:', body.rut);
      console.log('Body email:', body.email);
      
      const whereConditions = [];
      
      if (body.rut) {
        whereConditions.push({ rut: body.rut });
      }
      
      if (body.email) {
        whereConditions.push({ email: body.email });
      }
      
      console.log('Where conditions:', whereConditions);
      
      if (whereConditions.length > 0) {
        const existingUser = await userRepository.findOne({
          where: whereConditions,
        });

        console.log('Existing user found:', existingUser ? existingUser.id_usuario : 'None');
        console.log('Current user ID:', userFound.id_usuario);

        if (existingUser && existingUser.id_usuario !== userFound.id_usuario) {
          console.log('Duplicate found!');
          return [null, "Ya existe un usuario con el mismo rut o email"];
        }
      }
    }

    if (body.password) {
      const matchPassword = await comparePassword(
        body.password,
        userFound.password,
      );
      if (!matchPassword) return [null, "La contraseña no coincide"];
    }

    const dataUserUpdate = {
      updatedAt: new Date(),
    };

    // Solo actualizar los campos que se están enviando
    if (body.nombre !== undefined) dataUserUpdate.nombre = body.nombre;
    if (body.apellidos !== undefined) dataUserUpdate.apellidos = body.apellidos;
    if (body.email !== undefined) dataUserUpdate.email = body.email;
    if (body.rut !== undefined) dataUserUpdate.rut = body.rut;

    if (body.newPassword && body.newPassword.trim() !== "") {
      dataUserUpdate.password = await encryptPassword(body.newPassword);
    }

    await userRepository.update({ id_usuario: userFound.id_usuario }, dataUserUpdate);

    const userData = await userRepository.findOne({
      where: { id_usuario: userFound.id_usuario },
    });

    if (!userData) {
      return [null, "Usuario no encontrado después de actualizar"];
    }

    const { password, ...userUpdated } = userData;
    return [userUpdated, null];
  } catch (error) {
    console.error("Error al modificar el perfil del usuario:", error);
    return [null, "Error interno del servidor"];
  }
}