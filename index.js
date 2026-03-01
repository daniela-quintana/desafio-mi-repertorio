
const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`¡Servidor encendido en el puerto ${port}!`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/canciones', (req, res) => {
    try {
        const canciones = fs.readFileSync('repertorio.json', 'utf8');
        const cancionesJson = JSON.parse(canciones);
        res.json(cancionesJson);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer el repertorio' });
    }
});

app.post('/canciones', (req, res) => {
    try {
        const nuevaCancion = req.body;
        const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
        canciones.push(nuevaCancion);
        fs.writeFileSync('repertorio.json', JSON.stringify(canciones));
        res.status(201).send('Canción agregada con éxito');
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar la canción' });
    }
});

app.put('/canciones/:id', (req, res) => {
    try {
        const { id } = req.params;
        const cancionActualizada = req.body;
        let canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
        const index = canciones.findIndex(c => c.id == id);
        if (index !== -1) {
            canciones[index] = cancionActualizada;
            fs.writeFileSync('repertorio.json', JSON.stringify(canciones));
            res.send('Canción modificada con éxito');
        } else {
            res.status(404).json({ error: 'Canción no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al modificar la canción' });
    }
});

app.delete('/canciones/:id', (req, res) => {
    try {
        const { id } = req.params;
        let canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
        const nuevasCanciones = canciones.filter(c => c.id != id);
        fs.writeFileSync('repertorio.json', JSON.stringify(nuevasCanciones));
        res.send('Canción eliminada con éxito');
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la canción' });
    }
});