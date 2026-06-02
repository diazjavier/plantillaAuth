1- Crear una clave publica/privada en el servidor con:

ssh-keygen -t ed25519 -C "diazjavier@hotmail.com"

(Se guarda en una carpeta .ssh oculta en el home del usuario que la generó)

Si no funciona por un tema de permisos en el droplet ejecutar:
chattr -R -i /root/.ssh
chattr -a /root/.ssh

lsattr -d /root/.ssh
chmod 700 /root/.ssh


2- Agrega la llave a GitHub

Ve a tu repositorio en GitHub.
Entra en Settings > Deploy keys.
Haz clic en Add deploy key.
Ponle un nombre (ej. "Droplet Produccion"), 
pega la llave (con el nombre de correo y todo) y dale a Add key.

3- Correr esto en el servidor:

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
 
4- Clonar el repositorio en la carpeta que desee en el servidor:

git clone git@github.com:diazjavier/comparativo_medicamentos2.git

5- Para actualizar cada vez:
 
cd tu-repositorio
git pull origin main
docker compose up -d --build



 