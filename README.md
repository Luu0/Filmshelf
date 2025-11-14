Backend de Filmshelf

Backend que contine todos los endpoints para que el fronted de filmshelf ande correctamete 

Rutas:
api/filmshelf/register

Permite registrarse y guarda a la base de datos

api/filmshelf/login
Permite loguearse a la api con un usario ya creado

api/filmshelf/me
Trae al usuario actualmente logueado

api/filmshelf/logout 
Permite desloguear con la cuenta en uso

Las siguientes rutas solo las puede usar alguien con el rol de "admin"

put
api/filmshelf/user{id}
Permite actualizar el usuario con el id que se le proporciona

delete
api/filmshelf/user{id}
Permite borrar el usuario con el id que se le proporciona

api/filmshelf/users
Trea a todos los usuarios en la base de datos
