const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
        res.render('index', { json: data });
    }
  });
});

app.post('/save', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const nodes = JSON.parse(data);
      const newNodes = req.body.newNodes;
      nodes.push(newNodes);
      req.body.updatedNodes.forEach(node => {
        const index = nodes.findIndex((n) => n.id === node.id);
        nodes[index] = node;
      });
      console.log(nodes);
      fs.writeFile('./db.json', JSON.stringify(nodes), {flag:'w'}, (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send(nodes);
        }
      });
    }
  });
});

app.put('/:id', (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const users = JSON.parse(data);
      const index = users.findIndex((user) => user.id === id);
      users[index] = updatedUser;
      fs.writeFile('./db.json', JSON.stringify(users), (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send('User updated successfully');
        }
      });
    }
  });
});

app.delete('/:id', (req, res) => {
  const id = req.params.id;
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let users = JSON.parse(data);
      users = users.filter((user) => user.id !== id);
      fs.writeFile('./db.json', JSON.stringify(users), (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send('User deleted successfully');
        }
      });
    }
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));