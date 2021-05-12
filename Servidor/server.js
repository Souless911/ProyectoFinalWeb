"use strict;"

const express = require('express');
const dataHandler = require('./data_handler.js');

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

// app.use(cors({
//     origin: ['http://127.0.0.1:5500']
// }));


app.use(express.static(__dirname + '/Front-End', { index: 'Atributos.html' }));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

//app.get('/', (req, res) => res.send('Servidor proyecto'));


// Post registrar
// /api/admins
app.post('/api/admins', (req, res) => {
  let admin = req.body;
  let n = true, a = true, c = true, p = true, s = true, f = true;
  if (admin.nombre == undefined) n = false;
  if (admin.usuario == undefined) a = false;
  if (admin.email == undefined) c = false;
  if (admin.password == undefined) p = false;
  if (admin.fecha == undefined) f = false;
  if ((admin.sexo.toUpperCase() != 'H') && (admin.sexo.toUpperCase() != 'M')) s = false;

  let e = "";
  if ((n && a && c && p && s && f) == false) {
    if (s) {
      e = "No se provió:"
      if (n == false) e += " nombre";
      if (a == false) e += " usuario";
      if (c == false) e += " email";
      if (p == false) e += " password";
      if (f == false) e += " fecha";
    } else if (player.sexo == undefined) {
      e = "No se provió:"
      if (n == false) e += " nombre";
      if (a == false) e += " usuario";
      if (c == false) e += " email";
      if (p == false) e += " password";
      if (f == false) e += " fecha";
      if (s == false) e += " sexo";
    } else {
      e = "El atributo sexo debe de ser H (Hombre) o M (Mujer)"
      if ((n && a && c && p && f) == false) {
        e += " y no se provió:"
        if (n == false) e += " nombre";
        if (a == false) e += " usuario";
        if (c == false) e += " email";
        if (p == false) e += " password";
        if (f == false) e += " fecha";
      }
    }
    res.status(400).send("Solicitud Incorrecta. " + e);
  }
  if (dataHandler.getAdminByEmail(admin.email) != undefined) res.status(400).send("Solicitud Incorrecta. Email ya existente");
  if (dataHandler.getAdminByNombreUsuario(admin.nombre, admin.usuario) != undefined) res.status(400).send("Solicitud Incorrecta. Nombre y usuario ya existentes");

  dataHandler.createAdmin(admin);
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.status(200).send(dataHandler.getAdminByEmail(admin.email))
});
// /api/players
app.post('/api/players', (req, res) => {
  let player = req.body;
  let n = true, a = true, c = true, p = true, s = true, f = true;
  if (player.nombre == undefined) n = false;
  if (player.usuario == undefined) a = false;
  if (player.email == undefined) c = false;
  if (player.password == undefined) p = false;
  if (player.fecha == undefined) f = false;
  if ((player.sexo.toUpperCase() != 'H') && (player.sexo.toUpperCase() != 'M')) s = false;

  let e = "";
  if ((n && a && c && p && s && f) == false) {
    if (s) {
      e = "No se provió:";
      if (n == false) e += " nombre";
      if (a == false) e += " usuario";
      if (c == false) e += " email";
      if (p == false) e += " password";
      if (f == false) e += " fecha";
    } else if (player.sexo == undefined) {
      e = "No se provió:"
      if (n == false) e += " nombre";
      if (a == false) e += " usuario";
      if (c == false) e += " email";
      if (p == false) e += " password";
      if (f == false) e += " fecha";
      if (s == false) e += " sexo";
    } else {
      e = "El atributo sexo debe de ser H (Hombre) o M (Mujer)"
      if ((n && a && c && p && f) == false) {
        e += " y no se provió:"
        if (n == false) e += " nombre";
        if (a == false) e += " usuario";
        if (c == false) e += " email";
        if (p == false) e += " password";
        if (f == false) e += " fecha";
      }
    }
    res.status(400).send("Solicitud Incorrecta. " + e);
  }
  if (dataHandler.getPlayerByEmail(player.email) != undefined) res.status(400).send("Solicitud Incorrecta. Email ya existente");
  if (dataHandler.getPlayerByNombreUsuario(player.nombre, player.usuario) != undefined) res.status(400).send("Solicitud Incorrecta. Nombre y usuario ya existentes");//falta hacer que no se permita repetir el ususario

  player.datos = null;
  player.atributos = null;
  player.inventario = null;
  player.spellbook = null;
  player.biography = null;
  player.journal = null;
  dataHandler.createPlayer(player);
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.status(200).send(dataHandler.getPlayerByEmail(player.email))
});


//login
app.post('/api/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password
  let player, admin;
  let validP = true, validA = true;
  console.log(email, password);
  if (email == undefined || password == undefined) {
    res.status(400).send('Solicitud Incorrecta. Email y/o password vacio(s)');
  } else {
    admin = dataHandler.getAdminByEmail(email);
    player = dataHandler.getPlayerByEmail(email);

    if (player == undefined || player.password != password) validP = false;
    if (admin == undefined || admin.password != password) validA = false;
    if (validP == false && validA == false) res.status(400).send('Solicitud Incorrecta. Email y/o password invalido(s)');
    else {
      let token = dataHandler.generateToken(email, password, validA);
      res.status(400).send(token);
      if (token != null) res.status(200).json({
        'token': token
      });
    }
  }
});

//Middleware de autenticación
function authenticateA(req, res, next) {
  let token = req.get('token-auth');
  if (token == undefined) res.status(400).send("Solicitud Incorrecta. No se provió token, asegurate de iniciar sesión primero (login)");
  else {
    let uid = token.split('').slice(10, 19).join('');
    let admin = dataHandler.getAdminByUid(uid);
    if (admin == undefined || admin.token != token) res.status(400).send("Solicitud Incorrecta. Token incorrecto, iniciar sesión como administrador (login)");
    else {
      req.id = uid;
      next();
    }
  }
}
function authenticateP(req, res, next) {
  let token = req.get('token-auth');
  if (token == undefined) res.status(400).send("Solicitud Incorrecta. No se provió token, asegurate de iniciar sesión primero (login)");
  else {
    let uid = token.split('').slice(10, 19).join('');
    let player = dataHandler.getPlayerByUid(uid);
    if (player == undefined || player.token != token) res.status(400).send("Solicitud Incorrecta. Token incorrecto, iniciar sesión como jugador (login)");
    else {
      req.id = uid;
      next();
    }
  }
}

// /api/soy /quiero la lista limitada de información
// get players by player
app.get('/api/players/players', authenticateP, (req, res) => {
  let query = req.query;
  let players = dataHandler.getPlayers();
  let limit;
  if (query.nombre != undefined) {
    let players_ = new Array();
    for (let value of players)
      if ((value.nombre.toUpperCase().includes(query.nombre.toUpperCase()) || value.usuario.toUpperCase().includes(query.nombre.toUpperCase()))) players_.push(value);
    players = players_;
  }
  if (query.page != undefined) {
    limit = (query.limit != undefined) ? query.limit : 4;
    players = players.slice((Number(query.page - 1)) * Number(limit), (Number(query.page - 1)) * Number(limit) + Number(limit));
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.send(JSON.stringify(players));
});

//   // get admin by player
// app.get('/api/players/admins', authenticateP, (req, res) => {
//     let query = req.query;
//     let admins = dataHandler.getAdmins();
//     let limit;
//     if(query.nombre != undefined){
//       let admins_ = new Array();
//       for (let value of admins)
//         if ((value.nombre.toUpperCase().includes(query.nombre.toUpperCase()) || value.usuario.toUpperCase().includes(query.nombre.toUpperCase()))) admins_.push(value);
//         admins = admins_;
//     }
//     if(query.page != undefined){
//       limit = (query.limit != undefined)?query.limit:4;
//       admins = admins.slice((Number(query.page-1))*Number(limit),(Number(query.page-1))*Number(limit)+Number(limit));
//     }

//     res.setHeader('Content-Type', 'application/json; charset=utf-8')
//     res.send(JSON.stringify(admins));
//   });

// get players by admin
app.get('/api/admins/players', authenticateA, (req, res) => {
  let query = req.query;
  let players = dataHandler.getPlayers();
  let limit;
  if (query.nombre != undefined) {
    let players_ = new Array();
    for (let value of players)
      if ((value.nombre.toUpperCase().includes(query.nombre.toUpperCase()) || value.usuario.toUpperCase().includes(query.nombre.toUpperCase()))) players_.push(value);
    players = players_;
  }
  if (query.page != undefined) {
    limit = (query.limit != undefined) ? query.limit : 4;
    players = players.slice((Number(query.page - 1)) * Number(limit), (Number(query.page - 1)) * Number(limit) + Number(limit));
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.send(JSON.stringify(players));
});

// get admin by admin
app.get('/api/admins/admins', authenticateA, (req, res) => {
  let query = req.query;
  let admins = dataHandler.getAdmins();
  let limit;
  if (query.nombre != undefined) {
    let admins_ = new Array();
    for (let value of admins)
      if ((value.nombre.toUpperCase().includes(query.nombre.toUpperCase()) || value.usuario.toUpperCase().includes(query.nombre.toUpperCase()))) admins_.push(value);
    admins = admins_;
  }
  if (query.page != undefined) {
    limit = (query.limit != undefined) ? query.limit : 4;
    admins = admins.slice((Number(query.page - 1)) * Number(limit), (Number(query.page - 1)) * Number(limit) + Number(limit));
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.send(JSON.stringify(admins));
});
////
// GET Informacion completa
// /api/players/players/:email
app.route('/api/players/players/:email').get(authenticateP, (req, res) => {
  let email = req.params.email

  if (dataHandler.getPlayerByEmail(email) == undefined)
    res.status(400).send(`Solicitud Incorrecta. El email ${req.params.email} no pertenece a ningun Jugador registrado`);
  else if (dataHandler.getPlayerByEmail(email).uid != req.get('token-auth').split('').slice(10, 19).join(''))
    res.status(400).send("Solicitud Incorrecta. El token proveido no pertenece al registro del Jugador que intenta obtener");
  else {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.send(dataHandler.getPlayerByEmail(email));
  }
});
// /api/admins/players/:email
app.route('/api/admins/players/:email').get(authenticateA, (req, res) => {
  let email = req.params.email

  if (dataHandler.getPlayerByEmail(email) == undefined)
    res.status(400).send(`Solicitud Incorrecta. El email ${req.params.email} no pertenece a ningun Jugador registrado`);
  else {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.send(dataHandler.getPlayerByEmail(email));
  }
});
// // /api/players/admins/:email
// app.route('/api/players/admins/:email').get(authenticateP, (req, res) => {
//     let email = req.params.email

//     if(dataHandler.getAdminByEmail(email)==undefined)
//      res.status(400).send(`Solicitud Incorrecta. El email ${req.params.email} no pertenece a ningun Administrador registrado`);
//     else if(dataHandler.getAdminByEmail(email).uid != req.get('token-auth').split('').slice(10,19).join(''))
//       res.status(400).send("Solicitud Incorrecta. El token proveido no pertenece al registro del Administrador que intenta obtener");
//     else {
//       res.setHeader('Content-Type', 'application/json; charset=utf-8')
//       res.send(dataHandler.getAdminByEmail(email));
//     }
//   });
// /api/admins/admins/:email
app.route('/api/admins/admins/:email').get(authenticateA, (req, res) => {
  let email = req.params.email

  if (dataHandler.getAdminByEmail(email) == undefined)
    res.status(400).send(`Solicitud Incorrecta. El email ${req.params.email} no pertenece a ningun Administrador registrado`);
  else if (dataHandler.getAdminByEmail(email).uid != req.get('token-auth').split('').slice(10, 19).join(''))
    res.status(400).send("Solicitud Incorrecta. El token proveido no pertenece al registro del Administrador que intenta obtener");
  else {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.status(200).send(dataHandler.getAdminByEmail(email));
  }
});


//---------------------------------------------------------------------------------------------------------------
//PUT :email
// /api/players/players/:email
app.put('/api/players/players/:email', authenticateP, (req, res) => {
  let data = req.body;
  if (dataHandler.getPlayerByEmail(req.params.email) == undefined)
    res.status(400).send(`Solicitud Incorrecta. El email ${req.params.email} no pertenece a ningun jugador registrado`);
  else if (dataHandler.getPlayerByEmail(req.params.email).uid != req.get('token-auth').split('').slice(10, 19).join(''))
    res.status(400).send("Solicitud Incorrecta. El token proveido no pertenece al registro del jugador que intenta actualizar");
  else {
    // ----------------------
    if ((data.nombre == undefined && data.usuario == undefined && data.password == undefined && data.fecha == undefined && data.image == undefined && data.biography == undefined && data.journal == undefined) == true)
      res.status(400).send("Solicitud Incorrecta. No se provió ningún atributo válido para actualizar");
    else {
      let playerj = dataHandler.updatePlayerP(data, req.params.email);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.status(200).send(`El registro de ${playerj.nombre} ${playerj.usuario} se ha actualizado exitosamente!`)
    }
  }
});
// /api/admins/players/:email
app.put('/api/admins/players/:email', authenticateA, (req, res) => {
  let data = req.body;

  if (dataHandler.getPlayerByEmail(req.params.email) == undefined)
    res.status(400).send(`Solicitud Incorrecta. El email ${req.params.email} no pertenece a ningun jugador registrado`);
  else {
    // ----------------------
    if ((data.datos == undefined && data.atributos == undefined && data.inventario == undefined && data.spellbook == undefined && data.journal == undefined) == true)
      res.status(400).send("Solicitud Incorrecta. No se provió ningún atributo válido para actualizar");
    else {
      let playerj = dataHandler.updatePlayerA(data, req.params.email);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.status(200).send(`El registro de ${playerj.nombre} ${playerj.usuario} se ha actualizado exitosamente!`)
    }
  }
});
// /api/admins/admins/:email
app.put('/api/admins/admins/:email', authenticateA, (req, res) => {
  let data = req.body;

  if (dataHandler.getAdminByEmail(req.params.email) == undefined)
    res.status(400).send(`Solicitud Incorrecta. El email ${req.params.email} no pertenece a ningun usuario registrado`);
  else if (dataHandler.getAdminByEmail(req.params.email).uid != req.get('token-auth').split('').slice(10, 19).join(''))
    res.status(400).send("Solicitud Incorrecta. El token proveido no pertenece al registro del administrador que intenta actualizar");
  else {
    if ((data.nombre == undefined && data.usuario == undefined && data.password == undefined && data.fecha == undefined && data.image == undefined) == true)
      res.status(400).send("Solicitud Incorrecta. No se provió ningún atributo válido para actualizar");
    else {
      let adminj = dataHandler.updateAdmin(data, req.params.email);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.status(200).send(`El registro de ${adminj.nombre} ${adminj.usuario} se ha actualizado exitosamente!`)
    }
  }
});


//---------------------------------------------------------------------------------------------------------------
//9. DELETE 
// /api/admins/:email
app.delete('/api/admins/:email', authenticateA, (req, res) => {

  if (dataHandler.getAdminByEmail(req.params.email) == undefined)
    res.status(400).send(`Solicitud Incorrecta. El email ${req.params.email} no pertenece a ningun administrador registrado`);
  else if (dataHandler.getAdminByEmail(req.params.email).uid != req.get('token-auth').split('').slice(10, 19).join(''))
    res.status(400).send("Solicitud Incorrecta. El token proveido no pertenece al registro del administrador que intenta eliminar");
  else {
    let adminj = dataHandler.getAdminByEmail(req.params.email);
    dataHandler.deleteAdmin(req.params.email);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.status(200).send(`El administrador ${adminj.nombre} ${adminj.usuario} se ha eliminado exitosamente!`)
  }
});
// /api/adimns/players/:email
app.delete('/api/adimns/players/:email', authenticateA, (req, res) => {

  if (dataHandler.getPlayerByEmail(req.params.email) == undefined)
    res.status(400).send(`Solicitud Incorrecta. El email ${req.params.email} no pertenece a ningun jugador registrado`);
  else {
    let playerj = dataHandler.getPlayerByEmail(req.params.email);
    dataHandler.deletePlayer(req.params.email);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.status(200).send(`El jugador ${playerj.nombre} ${playerj.usuario} se ha eliminado exitosamente!`)
  }
});
// /api/players/:email
app.delete('/api/players/:email', authenticateP, (req, res) => {

  if (dataHandler.getPlayerByEmail(req.params.email) == undefined)
    res.status(400).send(`Solicitud Incorrecta. El email ${req.params.email} no pertenece a ningun jugador registrado`);
  else if (dataHandler.getPlayerByEmail(req.params.email).uid != req.get('token-auth').split('').slice(10, 19).join(''))
    res.status(400).send("Solicitud Incorrecta. El token proveido no pertenece al registro del jugador que intenta eliminar");
  else {
    let playerj = dataHandler.getPlayerByEmail(req.params.email);
    dataHandler.deletePlayer(req.params.email);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.status(200).send(`El jugador ${playerj.nombre} ${playerj.usuario} se ha eliminado exitosamente!`)
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
})