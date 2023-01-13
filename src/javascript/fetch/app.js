const express = require('express');
const app = express();
const path = require('path');

let users = [
    {
        userID: "user1", prename: "Jan", name: "Mühlnikel", email: "jan.muehlnikel@gmx.de", password: "jan2001",
        items: [{ itemID: "1", item: "Apfel", quantity: "4", unit: "Stück", responsible: "jan" }]
    },
]

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    next();
});

// POST REGISTER
app.post("/api/register", (req, res) => {
    users.push({
        userID: "user:" + (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2) ,
        prename: req.query.prename,
        name: req.query.name,
        email: req.query.email,
        password: req.query.password,
        items: []
    })
    res.send(200)
})

// POST ITEMS
app.post("/api/users/items", (req, res) => {

    const item_array = users.find(u => u.userID == req.query.userID)["items"]

    item_array.push(
        {
            itemID: "item:" + (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2), //unique itemID with time + random number
            item: req.query.item,
            quantity: req.query.quantity,
            unit: req.query.unit,
            responsible: req.query.responsible
        }
    )
    res.send(200)
})

// DELETE ITEM
app.delete('/api/users/items/:UserIDItemID', (req, res) => {
    const { UserIDItemID } = req.params

    userID = UserIDItemID.split("@")[0]
    itemID = UserIDItemID.split("@")[1]

    // check if item is in array
    const item_array = users.find(u => u.userID == userID)["items"]
    const deleted = item_array.find(i => i.itemID == itemID)
    
    if (deleted) {
        // filter out the deleted id and create new array without the id
        delete item_array[userID]
        users[0]['items'] = item_array.filter(i => i.itemID != itemID)
        res.status(200).json(deleted)
    } else {
        res.status(404).json({ message: + " ID" + itemID + " was not found!" })
    }
})

// GET
app.get('/api/users', (req, res) => res.json(users));
app.get('/api/user/items/:userID', (req, res) => {
    const item_array = users.find(u => u.userID == req.params.userID)["items"]

    res.json(item_array)
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

module.exports = app;