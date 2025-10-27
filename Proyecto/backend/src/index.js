import app from './app.js';

async function main() {
    try {
        // Establece relaciones después de importar modelos
        //setupAssociations();
        //await sequelize.sync({ force: false });
        //console.log("Base de datos sincronizada correctamente..");
        app.listen(4000);
        console.log("Server is listening on port", 4000);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

main();