"use strict";

const crypto = require("crypto"),
  authentication = require("../../modules/authentication");

module.exports = (app, db) => {
  app.get("/api/users", authentication.isAuthorized, (req, res) => {
    db.mainDb.user
      .findAll({
        include: [db.mainDb.role, db.mainDb.company]
      })
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  app.get("/api/users/:id", authentication.isAuthorized, (req, res) => {
    db.mainDb.user
      .find({
        include: [{ model: db.mainDb.role }, { model: db.mainDb.company }],
        where: { id: req.params.id }
      })
      .then(users => {
        res.json(users);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  app.post("/api/users", authentication.isAuthorized, (req, res) => {
    db.mainDb.user
      .create({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        role_id: req.body.role_id,
        company_id: req.body.company_id,
        phone: req.body.phone,
        // this key will be include in hashing with password
        password: authentication.hash_sha1(req.body.password, "key")
      })
      .then(newUser => {
        res.json(newUser);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });

  app.put("/api/users/:id", authentication.isAuthorized, (req, res) => {
    db.mainDb.user
      .update(
        {
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          role_id: req.body.role_id,
          company_id: req.body.company_id,
          phone: req.body.phone,
          // this key will be include in hashing with password
          password: authentication.hash_sha1(req.body.password, "key")
        },
        { where: { id: req.params.id } }
      )
      .then(updatedUser => {
        if (updatedUser) {
          res.json("Updated Successfully");
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });

  app.delete("/api/users/:id", authentication.isAuthorized, (req, res) => {
    db.mainDb.user
      .destroy({
        where: { id: req.params.id }
      })
      .then(deletedUser => {
        if (deletedUser === 0) {
          res.sendStatus(404);
        } else if (deletedUser === 1) {
          res.json("Deleted Successfully");
        } else {
          res.sendStatus(400);
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
};
