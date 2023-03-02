const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');


const app = express();
app.use(express.json());
app.use(bodyParser.json());
const FILE_PATH = './data/hospitals.json';

//GET
app.get('/hospitals', (req, res) => {
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading file');
    } else {
      const hospitals = JSON.parse(data).hospitals;
      res.send(hospitals);
    }
  });
});

//id

app.get('/hospitals/:id', (req, res) => {
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading file');
    } else {
      const hospitals = JSON.parse(data).hospitals;
      const id = req.params.id;
      if (id >= 0 && id < hospitals.length) {
        res.send(hospitals[id]);
      } else {
        res.status(404).send('Hospital not found');
      }
    }
  });
});

//post
app.post('/hospitals', (req, res) => {
  const addHospital = req.body;
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading file');
    } else {
      const hospitals = JSON.parse(data).hospitals;
      hospitals.push(addHospital);
      const addData = JSON.stringify({ hospitals });
      fs.writeFile(FILE_PATH, addData, 'utf8', (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error writing file');
        } else {
          res.send('Hospital added successfully');
        }
      });
    }
  });
});

//put



app.put('/hospitals/:id', (req, res) => {
  const newData = req.body;
  const id = req.params.id;

  //reading
  fs.readFile(FILE_PATH, 'utf-8', (err, data) => {
    if (err) throw err;

    // Parsing
    const hospital = JSON.parse(data);

    //to update
    const addHos = hospital.find((item) => item.id === id);

    if (!addHos) {
      return res.status(404).send('Data not found');
    }

    // Update
    addHos.name = newData.name;
    addHos.patient_num = newData.patient_num;

    // write update
    fs.writeFile(FILE_PATH, JSON.stringify(hospital), 'utf-8', (err) => {
      if (err) throw err;
      res.send('Data updated successfully!');
    });
  });
});


//delete
app.delete('/hospitals/:id', (req, res) => {
  const id = req.params.id;

  //reading
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) throw err;

    // Parsing
    const hospital = JSON.parse(data);

    //selecting
    const toDelete = hospital.find((item) => item.id === id);

    if (!toDelete) {
      return res.status(404).send('Data not found');
    }

    // deleting
    delete hospital[toDelete];

    // Write update
    fs.writeFile(FILE_PATH, JSON.stringify(hospital), 'utf8', (err) => {
      if (err) throw err;
      res.send('Data deleted successfully!');
      console.log("deleted")
    });
  });
});




// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

