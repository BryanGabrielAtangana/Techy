import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import https from "https";
import request from "request";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // In order to use static files such as (style, images etc.)

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
});

app.post("/", function (req, res) {
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    console.log(prenom);
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: nom,
                LNAME: prenom
            }
        }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us10.api.mailchimp.com/3.0/lists/ba0d3726d7";
    const options = {
        method: "POST",
        auth: "bryanmboa:9c6923848c955258a92f4b9b41677dcd-us10"
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});
app.post("/failure", function (req, res) {
    res.redirect("/");
})

app.listen(3000, function () {
    console.log("Server set an running on port 3000 ");
})

//audience id :  ba0d3726d7
//api key : 9c6923848c955258a92f4b9b41677dcd-us10