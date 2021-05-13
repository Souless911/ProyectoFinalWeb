"use strict;"

const fs = require('fs');
const shortid = require('shortid');

let content = fs.readFileSync('players.json');
let players = JSON.parse(content);
let contenta = fs.readFileSync('admins.json');
let admins = JSON.parse(contenta);

function getAdminByEmail(email) {
    contenta = fs.readFileSync('admins.json');
    admins = JSON.parse(contenta);
    return admins.find(admin => admin.email.toUpperCase() == email.toUpperCase())
}

function getAdminByNombreUsuario(nombre, usuario) {
    contenta = fs.readFileSync('admins.json');
    admins = JSON.parse(contenta);
    return admins.find(admin => (admin.nombre.toUpperCase() == nombre.toUpperCase()) && (admin.usuario.toUpperCase() == usuario.toUpperCase()))
}

function getAdminByUid(uid) {
    contenta = fs.readFileSync('admins.json');
    admins = JSON.parse(contenta);
    return admins.find(admin => admin.uid == uid);
}

function createAdmin(admin) {
    if (admin.image == undefined)
        if (admin.sexo.toUpperCase() == "H") admin.image = "https://randomuser.me/api/portraits/men/" + Math.floor(Math.random() * 100) + ".jpg";
        else admin.image = "https://randomuser.me/api/portraits/women/" + Math.floor(Math.random() * 100) + ".jpg";
    admin.uid = shortid.generate();
    admins.push(admin);
    fs.writeFileSync('admins.json', JSON.stringify(admins));
    contenta = fs.readFileSync('admins.json');
    admins = JSON.parse(contenta);
}

function getPlayerByEmail(email) {
    content = fs.readFileSync('players.json');
    players = JSON.parse(content);
    return players.find(player => player.email.toUpperCase() == email.toUpperCase())
}

function getPlayerByNombreUsuario(nombre, usuario) {
    content = fs.readFileSync('players.json');
    players = JSON.parse(content);
    return players.find(player => (player.nombre.toUpperCase() == nombre.toUpperCase()) && (player.usuario.toUpperCase() == usuario.toUpperCase()))
}

function getPlayerByUid(uid) {
    content = fs.readFileSync('players.json');
    players = JSON.parse(content);
    return players.find(player => player.uid == uid);
}

function createPlayer(player) {
    if (player.image == undefined)
        if (player.sexo.toUpperCase() == "H") player.image = "https://randomuser.me/api/portraits/men/" + Math.floor(Math.random() * 100) + ".jpg";
        else player.image = "https://randomuser.me/api/portraits/women/" + Math.floor(Math.random() * 100) + ".jpg";
    player.uid = shortid.generate();
    players.push(player);
    fs.writeFileSync('players.json', JSON.stringify(players));
    content = fs.readFileSync('players.json');
    players = JSON.parse(content);
}

function updateToken(email, token, a) {
    if (a) {
        let admin = getAdminByEmail(email);
        admin.token = token;
        fs.writeFileSync('admins.json', JSON.stringify(admins));
        contenta = fs.readFileSync('admins.json');
        admins = JSON.parse(contenta);
        return admin.token;
    } else {
        let player = getPlayerByEmail(email);
        player.token = token;
        fs.writeFileSync('players.json', JSON.stringify(players));
        content = fs.readFileSync('players.json');
        players = JSON.parse(content);
        return player.token;
    }
}

function getAdmins() {
    contenta = fs.readFileSync('admins.json');
    admins = JSON.parse(contenta);
    return admins.map(admin => {
        let u = {};
        u.nombre = admin.nombre;
        u.usuario = admin.usuario;
        u.image = admin.image;
        return u;
    });
}
function getPlayers() {
    content = fs.readFileSync('players.json');
    players = JSON.parse(content);
    return players.map(player => {
        let u = {};
        u.nombre = player.nombre;
        u.usuario = player.usuario;
        u.biography = player.biography;
        u.image = player.image;
         //----------------------------------------------------------------------------------
        return u;
    });
}


// -----------------------
function updatePlayerP(data, email) {
    content = fs.readFileSync('players.json');
    players = JSON.parse(content);
    let index = players.findIndex(player => player.email.toUpperCase() == email.toUpperCase());

    if (data.nombre != undefined) players[index].nombre = data.nombre;
    if (data.usuario != undefined) players[index].usuario = data.usuario;
    if (data.password != undefined) players[index].password = data.password;
    if (data.fecha != undefined) players[index].fecha = data.fecha;
    if (data.image != undefined) players[index].image = data.image;

    if (data.biography != undefined) players[index].biography = data.biography;
    if (data.journal != undefined) players[index].journal = data.journal;

    fs.writeFileSync('players.json', JSON.stringify(players));
    content = fs.readFileSync('players.json');
    players = JSON.parse(content);
    return players[index];
}
// -----------------------
function updatePlayerA(data, email) {
    content = fs.readFileSync('players.json');
    players = JSON.parse(content);
    let index = players.findIndex(player => player.email.toUpperCase() == email.toUpperCase());

    if (data.nombre != undefined) players[index].nombre = data.nombre;
    if (data.usuario != undefined) players[index].usuario = data.usuario;
    if (data.password != undefined) players[index].password = data.password;
    if (data.fecha != undefined) players[index].fecha = data.fecha;
    if (data.image != undefined) players[index].image = data.image;

    if (data.datos != undefined) players[index].datos = data.datos;
    if (data.atributos != undefined) players[index].atributos = data.atributos;
    if (data.inventario != undefined) players[index].inventario = data.inventario;
    if (data.spellbook != undefined) players[index].spellbook = data.spellbook;
    if (data.journal != undefined) players[index].journal = data.journal;

    fs.writeFileSync('players.json', JSON.stringify(players));
    content = fs.readFileSync('players.json');
    players = JSON.parse(content);
    return players[index];
}
// -----------------------
function updateAdmin(data, email) {
    contenta = fs.readFileSync('admins.json');
    admins = JSON.parse(contenta);
    let index = admins.findIndex(admin => admin.email.toUpperCase() == email.toUpperCase());

    if (data.nombre != undefined) admins[index].nombre = data.nombre;
    if (data.usuario != undefined) admins[index].usuario = data.usuario;
    if (data.password != undefined) admins[index].password = data.password;
    if (data.fecha != undefined) admins[index].fecha = data.fecha;
    if (data.image != undefined) admins[index].image = data.image;

    fs.writeFileSync('admins.json', JSON.stringify(admins));
    contenta = fs.readFileSync('admins.json');
    admins = JSON.parse(contenta);
    return admins[index];
}





function deleteAdmin(email) {
    let index = admins.findIndex(admin => admin.email.toUpperCase() == email.toUpperCase());
    admins.splice(index, 1);
    fs.writeFileSync('admins.json', JSON.stringify(admins));
    contenta = fs.readFileSync('admins.json');
    admins = JSON.parse(contenta);
}

function deletePlayer(email) {
    let index = players.findIndex(player => player.email.toUpperCase() == email.toUpperCase());
    players.splice(index, 1);
    fs.writeFileSync('players.json', JSON.stringify(players));
    content = fs.readFileSync('players.json');
    players = JSON.parse(content);
}

exports.getAdminByEmail = getAdminByEmail;
exports.getAdminByNombreUsuario = getAdminByNombreUsuario;
exports.getAdminByUid = getAdminByUid;
exports.createAdmin = createAdmin;
exports.getPlayerByEmail = getPlayerByEmail;
exports.getPlayerByNombreUsuario = getPlayerByNombreUsuario;
exports.getPlayerByUid = getPlayerByUid;
exports.createPlayer = createPlayer;
exports.updateToken = updateToken;
exports.getAdmins = getAdmins;
exports.getPlayers = getPlayers;
exports.updatePlayerP = updatePlayerP;
exports.updatePlayerA = updatePlayerA;
exports.updateAdmin = updateAdmin;
exports.deleteAdmin = deleteAdmin;
exports.deletePlayer = deletePlayer;