import { User } from "@/interfaces/auth";

export function getUsuarios() {
  return `select * from usuarios;`;
}

export function creaUsuario(user: User) {
  return `insert into usuarios (userName, password, email, comentario) values ('${user.userName}', '${user.password}', '${user.email}', '${user.comentario}') RETURNING *;`;
}

export function getUsuarioByName(userName: string) {
  return `select * from usuarios where userName = '${userName}';`;
}
