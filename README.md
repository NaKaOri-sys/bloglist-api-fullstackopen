# bloglist-api-fullstackopen

Proyecto backend desarrollado como parte del curso Full Stack Open (Universidad de Helsinki). La aplicación permite almacenar blogs con detalles como autor, título, URL y cantidad de votos.

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- ESLint
- dotenv
- nodemon

## 📦 Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tuUsuario/bloglist-api-fullstackopen.git

2. Instala las dependencias:

   ```bash
    npm install
   
3. Crea un archivo .env basado en .env.example:

   ```bash
    MONGO_URI=tu_uri_de_mongodb_atlas
    PORT=3001

4. Inicia el servidor en desarrollo:

   ```bash
    npm run dev

## 🧪 Endpoints principales (proximamente)
- GET /api/blogs → obtener todos los blogs
- POST /api/blogs → agregar un nuevo blog
- PUT /api/blogs/:id → actualizar votos o contenido
- DELETE /api/blogs/:id → eliminar un blog
  
## 📝 Licencia
Este proyecto se desarrolla con fines educativos como parte del curso Full Stack Open.

---

### ⚙️ Script para `nodemon`

Agregá en tu `package.json`:

```json
"scripts": {
  "dev": "nodemon index.js"
}


O si tu archivo principal no es index.js, cambiá el nombre por el que uses (por ejemplo, app.js).
