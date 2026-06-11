import { User } from "@/interfaces/auth";
import { RolProps, PermisoProps } from "@/interfaces/generics";

export function getUsuariosDummy() {
return  `select 
u.id 
, u.username as nombre
, u.email 
, u.createdat as fecharegistro
, case when (u.fechafin is null) then true else false end as activo
from usuarios u;`;
}

export function getUsuarios() {
  return `select * from usuarios;`;
}

export function creaUsuario(user: User) {
  return `insert into usuarios (userName, password, email, comentario) values ('${user.userName}', '${user.password}', '${user.email}', '${user.comentario}') RETURNING *;`;
}

export function getUsuarioByName(userName: string) {
  return `select * from usuarios where userName = '${userName}';`;
}

export function getUsuarioById(id: string) {
  return `select * from usuarios where id = ${id};`;
}

export function inactivateUsuario(id: string) {
  return `update usuarios set fechafin = now() where id = ${id} returning *;`;
}

export function activateUsuario(id: string) {
  return `update usuarios set fechafin = null where id = ${id} returning *;`;
}

export function updateUsuario(id: string, user: User) {
  const activo = user.activo ? "null" : "now()";
  return `update usuarios set username = '${user.userName}', email = '${user.email}', comentario = '${user.comentario}',updatedat = now() , fechafin = ${activo} where id = ${id} returning *;`;
}

export function creaRol(rol: RolProps) {
  return `insert into roles (rol, comentario) values ('${rol.rol}', '${rol.comentario}') RETURNING *;`;
}

export function getRolById(id: string) {
  return `select * from roles where id = ${id};`;
}

export function inactivateRol(id: string) {
  return `update roles set fechafin = now() where id = ${id} returning *;`;
}

export function activateRol(id: string) {
  return `update roles set fechafin = null where id = ${id} returning *;`;
}

export function updateRol(id: string, rol: RolProps) {
  const activo = rol.activo ? "null" : "now()";
  return `update roles set rol = '${rol.rol}', comentario = '${rol.comentario}',updatedat = now() , fechafin = ${activo} where id = ${id} returning *;`;
}

export function getRolesCustom() {
  return `select id, rol, comentario, createdat as fecharegistro, case when (fechafin is null) then true else false end as activo from roles;`;
}

export function getUsuariosRoles() {
  return `select ur.idusuario, ur.idrol, r.rol from usuario_rol ur inner join roles r on ur.idrol = r.id;`;
}

export function getRolesPorUsuario(idUser: string) {
  return `select ur.idrol, r.rol from usuario_rol ur inner join roles r on ur.idrol = r.id where ur.idusuario = ${idUser};`;
}

export function creaPermiso(permiso: PermisoProps) {
  return `insert into permisos (permiso, comentario) values ('${permiso.permiso}', '${permiso.comentario}') RETURNING *;`;
}

export function getPermisoById(id: string) {
  return `select * from permisos where id = ${id};`;
}

export function inactivatePermiso(id: string) {
  return `update permisos set fechafin = now() where id = ${id} returning *;`;
}

export function activatePermiso(id: string) {
  return `update permisos set fechafin = null where id = ${id} returning *;`;
}

export function updatePermiso(id: string, permiso: PermisoProps) {
  const activo = permiso.activo ? "null" : "now()";
  return `update permisos set rol = '${permiso.permiso}', comentario = '${permiso.comentario}',updatedat = now() , fechafin = ${activo} where id = ${id} returning *;`;
}

export function getPermisosCustom() {
  return `select id, permiso, comentario, createdat as fecharegistro, case when (fechafin is null) then true else false end as activo from permisos;`;
}


