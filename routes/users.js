
const userRoutes = (app, fs) => {

    // variables
    const dataPath = './data/users.json';

    // helper methods
    const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }

            callback();
        });
    };

    // READ
    app.get('/users', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // CREATE
    app.post('/users', (req, res) => {

        readFile(data => {
            // Note: this isn't ideal for production use. 
            // ideally, use something like a UUID or other GUID for a unique ID value
            // const newUserId = Date.now().toString();

            // add the new user
            // data[newUserId.toString()] = req.body;
            var id = data.length;
            id = id + 1;
            req.body["id"] = id;
            // var input=req.body;
            // JSON.stringify(input,"id:"+id);
            data.push(req.body);
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send({ message: 'new user added' });
            });
        },
            true);
    });


    // UPDATE
    app.put('/users/:id', (req, res) => {

        readFile(data => {

            // add the new user
            const userId = req.params["id"];
            for (var i = 0; i < data.length; i++) {
                if (data[i] !== null) {
                    if (data[i].id == userId) {
                        req.body["id"] = parseInt(userId);
                        data[i] = req.body;
                    }
                }

            }


            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} updated`);
            });
        },
            true);
    });


    // DELETE
    app.delete('/users/:id', (req, res) => {

        readFile(data => {

            // add the new user
            const userId = req.params["id"];
            for (var i = 0; i < data.length; i++) {
                if (data[i] !== null) {
                    if (data[i].id == userId) {
                        delete data[i];
                    }
                }
            }

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`users id:${userId} removed`);
            });
        },
            true);
    });
};

module.exports = userRoutes;
