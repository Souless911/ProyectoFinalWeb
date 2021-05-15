"use strict;"

const mongoose = require('mongoose');
const mongodbAtlas = 'mongodb+srv://MASTER_USER:MASTER_MH_ELDUEÑODELMUNDO@clusterproyecto.sliuu.mongodb.net/myDatabase?retryWrites=true&w=majority';
mongoose.connect(mongodbAtlas, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => console.log('Mongo DB Connected!')).catch(err => {
    console.log(`DB Connection Error: ${err.message}`)
});
//mongoose.connect(mongodbAtlas, {useNewUrlParser: true}, {useUnifiedTopology: true} );
//let db = mongoose.connection;

//ESQUEMA
let playerSchema = mongoose.Schema({
    nombre: String,
    usuario: String,
    email: String,
    password: String,
    token: String,
    fecha: String,
    image: String,
    sexo: {
        type: String,
        enum: ['H', 'M'],
        required: true
    },
    datos: {
        type: Object,
        required: false
    },
    atributos: {
        type: Object,
        required: false
    },
    inventario: {
        type: Object,
        required: false
    },
    spellbook: {
        type: Object,
        required: false
    },
    biography: {
        type: Object,
        required: false
    },
    journal: {
        type: Object,
        required: false
    }
});
let adminSchema = mongoose.Schema({
    nombre: String,
    usuario: String,
    email: String,
    password: String,
    token: String,
    fecha: String,
    image: String,
    sexo: {
        type: String,
        enum: ['H', 'M'],
        required: true
    }
});
//MODELO
let Player = mongoose.model('playerModel', playerSchema);
let Admin = mongoose.model('adminModel', adminSchema);


//BUSCAR EN LAS COLECCIONES DE MONGODB
//BUSCAR ADMINS
async function getAdminByEmail(email) {
    // let admin;
    // await Admin.findOne({'email': email}, await (err, docs) => admin = docs);
    // return admin;
    return await Admin.findOne({
        'email': email
    }).exec();
}
async function getAdminByUsuario(usuario) {
    // let admin;
    // await Admin.findOne({'usuario': usuario}, await (err, docs) => admin = docs);
    // return admin;
    return await Admin.findOne({
        'usuario': usuario
    }).exec();
}
//BUSCAR PLAYER
async function getPlayerByEmail(email) {
    let player;
    // await Player.findOne({'email': email}, await (err, docs) => player = docs);
    // return player;
    return await Player.findOne({
        'email': email
    }).exec();
}
//------------------------------------------------------------------------
// async function get (email){
//     console.log("a ver");
//     console.log(await getPlayerByEmail(email));
//     console.log("comparando con undefined");
//     console.log(await getPlayerByEmail(email)== undefined);
// }

// async function s (){
//     await get("oberto_lopez@gmail.com");
//     await get("roberto_lopez@gmail.com");
// }
// s();
//------------------------------------------------------------------------
async function getPlayerByUsuario(usuario) {
    // let player;
    // await Player.findOne({'usuario': usuario}, await (err, docs) => player = docs);
    // return player;
    return await Player.findOne({
        'usuario': usuario
    }).exec();
}
//getPlayerByUsuario("usuario");

//CREAR REGISTRO
//ADMIN
async function createAdmin(admin) {
    if (admin.image == undefined)
        if (admin.sexo.toUpperCase() == "H") admin.image = "https://randomuser.me/api/portraits/men/" + Math.floor(Math.random() * 100) + ".jpg";
        else admin.image = "https://randomuser.me/api/portraits/women/" + Math.floor(Math.random() * 100) + ".jpg";
    let a = await Admin(admin);
    await a.save();
}
//PLAYER
async function createPlayer(player) {
    if (player.image == undefined)
        if (player.sexo.toUpperCase() == "H") player.image = "https://randomuser.me/api/portraits/men/" + Math.floor(Math.random() * 100) + ".jpg";
        else player.image = "https://randomuser.me/api/portraits/women/" + Math.floor(Math.random() * 100) + ".jpg";
    let p = Player(player);
    p.save();
}

//ACTUALIZAR TOKEN
async function updateToken(email, token, a) {
    if (a) return await Admin.findOneAndUpdate({
        'email': email
    }, {
        'token': token
    }, {
        new: true
    })
    else return await Player.findOneAndUpdate({
        'email': email
    }, {
        'token': token
    }, {
        new: true
    })
}

//OBTENER LISTAS LIMITADAS
//ADMINS
async function getAdmins() {
    // let admins;
    // await Admin.find({}, await (err, docs) => admins = docs);
    // return admins.map(admin => {
    //     let u = {};
    //     u.nombre = admin.nombre;
    //     u.usuario = admin.usuario;
    //     u.image = admin.image;
    //     return u;
    // });
    let admins = await Admin.find({}).exec();
    return admins.map(admin => {
        let u = {};
        u.nombre = admin.nombre;
        u.usuario = admin.usuario;
        u.image = admin.image;
        return u;
    });
}
//PLAYERS
async function getPlayers() {
    // let players;
    // await Player.find({}, (err, docs) => players = docs);
    // return players.map(player => {
    //     let u = {};
    //     u.nombre = player.nombre;
    //     u.usuario = player.usuario;
    //     u.biography = player.biography;
    //     u.image = player.image;
    //     return u;
    // });
    let players = await Player.find().exec();
    return players.map(player => {
            let u = {};
            u.nombre = player.nombre;
            u.usuario = player.usuario;
            u.biography = player.biography;
            u.image = player.image;
            return u;
        })
    };

//ACTUALIZAR
//ADMIN BY THE SAME ADMIN
async function updateAdmin(data, email) {
    let m = {};
    if (data.nombre != undefined) m.nombre = data.nombre;
    if (data.usuario != undefined) m.usuario = data.usuario;
    if (data.password != undefined) m.password = data.password;
    if (data.fecha != undefined) m.fecha = data.fecha;
    if (data.image != undefined) m.image = data.image
    return await Admin.findOneAndUpdate({
        'email': email
    }, m, {
        new: true
    })
}
//PLAYER BY ADMIN
async function updatePlayerA(data, email) {
    let m = {};
    if (data.nombre != undefined) m.nombre = data.nombre;
    if (data.usuario != undefined) m.usuario = data.usuario;
    if (data.password != undefined) m.password = data.password;
    if (data.fecha != undefined) m.fecha = data.fecha;
    if (data.image != undefined) m.image = data.image;
    if (data.datos != undefined) m.datos = data.datos;
    if (data.atributos != undefined) m.atributos = data.atributos;
    if (data.inventario != undefined) m.inventario = data.inventario;
    if (data.spellbook != undefined) m.spellbook = data.spellbook;
    if (data.journal != undefined) m.journal = data.journal;
    return await Player.findOneAndUpdate({
        'email': email
    }, m, {
        new: true
    })
}
//PLAYER BY THE SAME PLAYER
async function updatePlayerP(data, email) {
    let m = {};
    if (data.nombre != undefined) m.nombre = data.nombre;
    if (data.usuario != undefined) m.usuario = data.usuario;
    if (data.password != undefined) m.password = data.password;
    if (data.fecha != undefined) m.fecha = data.fecha;
    if (data.image != undefined) m.image = data.image;
    if (data.biography != undefined) m.biography = data.biography;
    if (data.journal != undefined) m.journal = data.journal;
    return await Player.findOneAndUpdate({
        'email': email
    }, m, {
        new: true
    })
}

//DELETE
//ADMIN
async function deleteAdmin(email) {
    await Admin.findOneAndDelete({
        'email': email
    }, (err, doc) => {
        //console.log(doc);
    });
}
//PLAYER
async function deletePlayer(email) {
    await Player.findOneAndDelete({
        'email': email
    }, (err, doc) => {
        //console.log(doc);
    });
}

exports.getAdminByEmail = getAdminByEmail;
exports.getAdminByUsuario = getAdminByUsuario;
exports.createAdmin = createAdmin;
exports.getPlayerByEmail = getPlayerByEmail;
exports.getPlayerByUsuario = getPlayerByUsuario;
exports.createPlayer = createPlayer;
exports.updateToken = updateToken;
exports.getAdmins = getAdmins;
exports.getPlayers = getPlayers;
exports.updatePlayerP = updatePlayerP;
exports.updatePlayerA = updatePlayerA;
exports.updateAdmin = updateAdmin;
exports.deleteAdmin = deleteAdmin;
exports.deletePlayer = deletePlayer;


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://MASTER_USER:<password>@clusterproyecto.sliuu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



//mongodb+srv://MASTER_USER:<password>@clusterproyecto.sliuu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority