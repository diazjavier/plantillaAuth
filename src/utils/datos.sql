insert into usuarios (userName, password, email, comentario) values ('jdiaz', '$2b$10$nfhwDg/RC/64jUO4tnz6MeBGesVGEfVqeWo8YRXEKi1hGay2ziiv2', 'diazjavier@hotmail.com', 'L ala l ala ');

insert into usuarios (userName, password, email, comentario) values ('jdiaz', '$2b$10$nfhwDg/RC/64jUO4tnz6MeBGesVGEfVqeWo8YRXEKi1hGay2ziiv2', 'diazjavier@hotmail.com', 'L ala l ala ');

insert into roles (rol, comentario) values ('dataentry', 'No puede gestionar usuarios ni clientes');
insert into roles (rol, comentario) values ('administrador', 'Puede gestionar usuarios y clientes');

insert into permisos (permiso, comentario) values ('cliente.consulta', 'sólo ve los datos de los clientes');
insert into permisos (permiso, comentario) values ('cliente.crea', 'Puede cargar nuevos clientes');
insert into permisos (permiso, comentario) values ('cliente.modifica', 'Puede modificar los datos de los clientes');
insert into permisos (permiso, comentario) values ('cliente.elimina', 'Puede eliminar clientes');
