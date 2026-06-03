import { User } from "@/interfaces/auth";

export function getUsuariosDummy() {
return  `select 
u.id 
, u.username as nombre
, u.email 
, r.id as idrol
, r.rol 
, u.createdat as fecharegistro
, case when (u.fechafin is null) then true else false end as activo
from usuarios u left join usuario_rol ur on u.id = ur.idusuario 
left join roles r on r.id  = ur.idrol ;`;
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
