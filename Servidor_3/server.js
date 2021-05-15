"use strict;"

const express = require('express');
const Functions = require('./data_handler.js');

let jwt = require('jsonwebtoken');
const ClavePrivada = "$ELMUNDOESNUESTRO#*$";

const app = express();
const port = 3000;
app.use(express.json());
app.get('/', (req, res) => res.send('Servidor proyecto'));

const cors = require('cors');
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
})

// POST REGISTRAR
// ADMIN
app.post('/api/admins', async (req, res) => {
  let admin = req.body;
  let n = true,
    a = true,
    c = true,
    p = true,
    s = true,
    f = true;
  if (admin.nombre == undefined) n = false;
  if (admin.usuario == undefined) a = false;
  if (admin.email == undefined) c = false;
  if (admin.password == undefined) p = false;
  if (admin.fecha == undefined) f = false;
  if ((admin.sexo != 'H') && (admin.sexo != 'M')) s = false;
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
    return
  }
  admin.email = admin.email.toLowerCase();
  if (await Functions.getAdminByEmail(admin.email) != undefined) {
    res.status(400).send("Solicitud Incorrecta. Email ya existente");
    return;
  } else if (await Functions.getAdminByUsuario(admin.usuario) != undefined) {
    res.status(400).send("Solicitud Incorrecta. Usuario ya existente");
    return;
  }
  await Functions.createAdmin(admin);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).send(await Functions.getAdminByEmail(admin.email));
});
//PLAYER
app.post('/api/players', async (req, res) => {
  let player = req.body;
  let n = true,
    a = true,
    c = true,
    p = true,
    s = true,
    f = true;
  if (player.nombre == undefined) n = false;
  if (player.usuario == undefined) a = false;
  if (player.email == undefined) c = false;
  if (player.password == undefined) p = false;
  if (player.fecha == undefined) f = false;
  if ((player.sexo != 'H') && (player.sexo != 'M')) s = false;
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
    return;
  }
  player.datos = null;
  player.atributos = null;
  player.inventario = null;
  player.spellbook = null;
  player.biography = null;
  player.journal = null;
  player.email = player.email.toLowerCase();

  if (await Functions.getPlayerByEmail(player.email) != undefined) {
    res.status(400).send("Solicitud Incorrecta. Email existente");
    return;
  } else if (await Functions.getPlayerByUsuario(player.usuario) != undefined) {
    res.status(400).send("Solicitud Incorrecta. Usuario existente");
    return;
  }

  await Functions.createPlayer(player);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).send(player);
});


//LOGIN
app.post('/api/login', async (req, res) => {
  let email = req.body.email;
  email = email.toLowerCase();
  let password = req.body.password
  let player, admin;
  let validP = true,
    validA = true;

  if (email == undefined || password == undefined) {
    res.status(400).send('Solicitud Incorrecta. Email y/o password vacio(s)');
    return;
  } else {
    email = email.toLowerCase();
    admin = await Functions.getAdminByEmail(email);
    player = await Functions.getPlayerByEmail(email);

    if (player == undefined || player.password != password) validP = false;
    if (admin == undefined || admin.password != password) validA = false;
    if (validP == false && validA == false) {
      res.status(400).send('Solicitud Incorrecta. Email y/o password invalido(s)');
      return;
    } else {
      let token = null;
      if (validP == false && validA == true) {
        token = jwt.sign({
          email: admin.email
        }, ClavePrivada);
        if (token != null) await Functions.updateToken(email, token, validA);
      }
      if (validP == true && validA == false) {
        token = jwt.sign({
          email: player.email
        }, ClavePrivada);
        if (token != null) await Functions.updateToken(email, token, validA);
      }
      if (token != null)
        res.status(200).json({
          'token': token
        });
    }
  }
});

//AUTENTICACIÓN
//Middleware de autenticación
async function authenticateA(req, res, next) {
  let token = req.get('token-auth');
  if (token == undefined) {
    res.status(400).send("Solicitud Incorrecta. No se provió token, asegurate de iniciar sesión primero (login)");
    return;
  } else {
    let payload = null;
    jwt.verify(token, ClavePrivada, function (err, decoded) {
      if (err) {
        console.log("Error: " + err);
      } else {
        payload = decoded;
      }
    })

    if (payload != null) {
      let admin = await Functions.getAdminByEmail(payload.email);
      if (admin == undefined || admin.token != token) {
        res.status(400).send("Solicitud Incorrecta. Token incorrecto, iniciar sesión como administrador (login)");
        return;
      } else next();
    } else {
      res.status(400).send("Solicitud Incorrecta. Token incorrecto, iniciar sesión como administrador (login)");
      return;
    }
  }
}

async function authenticateP(req, res, next) {
  let token = req.get('token-auth');
  if (token == undefined) {
    res.status(400).send("Solicitud Incorrecta. No se provió token, asegurate de iniciar sesión primero (login)");
    return;
  } else {
    let payload = null;
    jwt.verify(token, ClavePrivada, function (err, decoded) {
      if (err) {
        console.log("Error: " + err);
      } else {
        payload = decoded;
      }
    })
    if (payload != null) {
      let player = await Functions.getPlayerByEmail(payload.email);
      if (player == undefined || player.token != token) {
        res.status(400).send("Solicitud Incorrecta. Token incorrecto, iniciar sesión como Jugador  (login)");
        return;
      } else next();
    } else {
      res.status(400).send("Solicitud Incorrecta. Token incorrecto, iniciar sesión como Jugador (login)");
      return;
    }
  }
}

//OBTENER LISTA LIMITADA DE INFORMACIÓN
// /api/soy /quiero la lista limitada de información
//ADMINS BY ADMIN
app.get('/api/admins/admins', authenticateA, async (req, res) => {
  let query = req.query;
  let admins = await Functions.getAdmins();
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
//ADMINS BY PLAYER
app.get('/api/admins/admins', authenticateP, async (req, res) => {
  let query = req.query;
  let admins = await Functions.getAdmins();
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
//PLAYERS BY ADMIN
app.get('/api/admins/players', authenticateA, async (req, res) => {
  let query = req.query;
  let players = await Functions.getPlayers();
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
//PLAYERS BY PLAYER
app.get('/api/players/players', authenticateP, async (req, res) => {
  let query = req.query;
  let players = await Functions.getPlayers();
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

// GET Informacion completa
// ADMIN BY THE SAME ADMIN
app.route('/api/admins/admins/:email').get(authenticateA, async (req, res) => {
  let email = req.params.email
  email = email.toLowerCase();
  let admin = await Functions.getAdminByEmail(email);
  if (admin == undefined) {
    res.status(400).send(`Solicitud Incorrecta. El email ${email} no pertenece a ningun Administrador registrado`);
    return;
  }
  let payload = null;
  jwt.verify(req.get('token-auth'), ClavePrivada, function (err, decoded) {
    if (err) {
      console.log("Error: " + err);
    } else {
      payload = decoded;
    }
  })
  if (payload == null) {
    res.status(400).send("Solicitud Incorrecta. Token incorrecto, iniciar sesión (login)");
    return;
  }
  if (admin.email != payload.email) {
    res.status(400).send("Solicitud Incorrecta. El token proveido no pertenece al registro del Administrador que intenta obtener");
    return;
  } else {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.status(200).send(admin);
  }
});
//PLAYER BY ADMIN
app.route('/api/admins/players/:email').get(authenticateA, async (req, res) => {
  let email = req.params.email
  email = email.toLowerCase();
  let player = await Functions.getPlayerByEmail(email);
  if (player == undefined) {
    res.status(400).send(`Solicitud Incorrecta. El email ${req.params.email} no pertenece a ningun Jugador registrado`);
    return;
  } else {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.send(player);
  }
});
// PLAYER BY THE SAME PLAYER
app.route('/api/players/players/:email').get(authenticateP, async (req, res) => {
  let email = req.params.email
  email = email.toLowerCase();
  let player = await Functions.getPlayerByEmail(email);
  if (player == undefined) {
    res.status(400).send(`Solicitud Incorrecta. El email ${email} no pertenece a ningun Jugador registrado`);
    return;
  }
  let payload = null;
  jwt.verify(req.get('token-auth'), ClavePrivada, function (err, decoded) {
    if (err) {
      console.log("Error: " + err);
    } else {
      payload = decoded;
    }
  })
  if (payload == null) {
    res.status(400).send("Solicitud Incorrecta. Token incorrecto, iniciar sesión (login)");
    return;
  }
  if (player.email != payload.email) {
    res.status(400).send("Solicitud Incorrecta. El token proveido no pertenece al registro del Jugador que intenta obtener");
    return;
  } else {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.send(player);
  }
});

//ACTUALIZAR REGISTROS
//PUT :email
//ADMIN BY THE SAME ADMIN
app.put('/api/admins/admins/:email', authenticateA, async (req, res) => {
  let data = req.body;
  let email = req.params.email;
  email = email.toLowerCase();
  let admin = await Functions.getAdminByEmail(email);
  if (admin == undefined) {
    res.status(400).send(`Solicitud Incorrecta. El email ${email} no pertenece a ningun Administrador registrado`);
    return;
  }
  let payload = null;
  jwt.verify(req.get('token-auth'), ClavePrivada, function (err, decoded) {
    if (err) {
      console.log("Error: " + err);
    } else {
      payload = decoded;
    }
  })
  if (payload == null) {
    res.status(400).send("Solicitud Incorrecta. Token incorrecto, iniciar sesión (login)");
    return;
  }
  if (admin.email != payload.email) {
    res.status(400).send("Solicitud Incorrecta. El token proveido no pertenece al registro del administrador que intenta actualizar");
    return;
  } else {
    if ((data.nombre == undefined && data.usuario == undefined && data.password == undefined && data.fecha == undefined && data.image == undefined) == true) {
      res.status(400).send("Solicitud Incorrecta. No se provió ningún atributo válido para actualizar");
      return;
    } else {
      let adminj = await Functions.updateAdmin(data, email);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.status(200).send(`El registro de ${adminj.nombre} ${adminj.usuario} se ha actualizado exitosamente!`)
    }
  }
});
//PLAYER BY THE ADMIN
app.put('/api/admins/players/:email', authenticateA, async (req, res) => {
  let data = req.body;
  let email = req.params.email;
  email = email.toLowerCase();
  if (await Functions.getPlayerByEmail(email) == undefined) {
    res.status(400).send(`Solicitud Incorrecta. El email ${email} no pertenece a ningun jugador registrado`);
    return;
  } else {
    if ((data.datos == undefined && data.atributos == undefined && data.inventario == undefined && data.spellbook == undefined && data.journal == undefined) == true) {
      res.status(400).send("Solicitud Incorrecta. No se provió ningún atributo válido para actualizar");
      return;
    } else {
      let playerj = await Functions.updatePlayerA(data, email);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.status(200).send(`El registro de ${playerj.nombre} ${playerj.usuario} se ha actualizado exitosamente!`)
    }
  }
});
//PLAYER BY THE SAME PLAYER
app.put('/api/players/players/:email', authenticateP, async (req, res) => {
  let data = req.body;
  let email = req.params.email;
  email = email.toLowerCase();
  let player = await Functions.getPlayerByEmail(email);
  if (player == undefined) {
    res.status(400).send(`Solicitud Incorrecta. El email ${email} no pertenece a ningun Jugador registrado`);
    return;
  }
  let payload = null;
  jwt.verify(req.get('token-auth'), ClavePrivada, function (err, decoded) {
    if (err) {
      console.log("Error: " + err);
    } else {
      payload = decoded;
    }
  })
  if (payload == null) {
    res.status(400).send("Solicitud Incorrecta. Token incorrecto, iniciar sesión (login)");
    return;
  }
  if (player.email != payload.email) {
    res.status(400).send("Solicitud Incorrecta. El token proveido no pertenece al registro del jugador que intenta actualizar");
    return;
  } else {
    if ((data.nombre == undefined && data.usuario == undefined && data.password == undefined && data.fecha == undefined && data.image == undefined && data.biography == undefined && data.journal == undefined) == true) {
      res.status(400).send("Solicitud Incorrecta. No se provió ningún atributo válido para actualizar");
      return;
    } else {
      let playerj = await Functions.updatePlayerP(data, email);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.status(200).send(`El registro de ${playerj.nombre} ${playerj.usuario} se ha actualizado exitosamente!`)
    }
  }
});


//---------------------------------------------------------------------------------------------------------------
//DELETE 
//ADMIN BY THE SAME ADMIN
app.delete('/api/admins/:email', authenticateA, async (req, res) => {
  let email = req.params.email;
  email = email.toLowerCase();
  let admin = await Functions.getAdminByEmail(email);
  if (admin == undefined) {
    res.status(400).send(`Solicitud Incorrecta. El email ${email} no pertenece a ningun Administrador registrado`);
    return;
  }
  let payload = null;
  jwt.verify(req.get('token-auth'), ClavePrivada, function (err, decoded) {
    if (err) {
      console.log("Error: " + err);
    } else {
      payload = decoded;
    }
  })
  if (payload == null) {
    res.status(400).send("Solicitud Incorrecta. Token incorrecto, iniciar sesión (login)");
    return;
  }
  if (admin.email != payload.email) {
    res.status(400).send("Solicitud Incorrecta. El token proveido no pertenece al registro del administrador que intenta eliminar");
    return;
  } else {
    await Functions.deleteAdmin(email);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.status(200).send(`El administrador ${admin.nombre} ${admin.usuario} se ha eliminado exitosamente!`)
  }
});
//PLAYER BY ADMIN
app.delete('/api/adimns/players/:email', authenticateA, async (req, res) => {
  let email = req.params.email
  email = email.toLowerCase();
  let player = await Functions.getPlayerByEmail(email);
  if (player == undefined) {
    res.status(400).send(`Solicitud Incorrecta. El email ${email} no pertenece a ningun jugador registrado`);
    return;
  } else {
    await Functions.deletePlayer(email);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.status(200).send(`El jugador ${player.nombre} ${player.usuario} se ha eliminado exitosamente!`)
  }
});
//PLAYER BY THE SAME PLAYER
app.delete('/api/players/:email', authenticateP, async (req, res) => {
  let email = req.params.email
  email = email.toLowerCase();
  let player = await Functions.getPlayerByEmail(email);
  if (player == undefined) {
    res.status(400).send(`Solicitud Incorrecta. El email ${email} no pertenece a ningun Jugador registrado`);
    return;
  }
  let payload = null;
  jwt.verify(req.get('token-auth'), ClavePrivada, function (err, decoded) {
    if (err) {
      console.log("Error: " + err);
    } else {
      payload = decoded;
    }
  })
  if (payload == null) {
    res.status(400).send("Solicitud Incorrecta. Token incorrecto, iniciar sesión (login)");
    return;
  }
  if (player.email != payload.email) {
    res.status(400).send("Solicitud Incorrecta. El token proveido no pertenece al registro del jugador que intenta eliminar");
    return;
  } else {
    await Functions.deletePlayer(email);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.status(200).send(`El jugador ${player.nombre} ${player.usuario} se ha eliminado exitosamente!`)
  }
});

