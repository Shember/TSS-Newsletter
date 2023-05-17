const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.urlencoded());
app.use("/public", express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/src/pages/signup.html")
});

app.post("/success", function (req, res) {
    res.redirect("/");
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});


app.post("/", function(req, res) {
    mailchimp.setConfig({
        apiKey: "dfb63640450b14dc25e282cbfca1aca9-us12",
        server: "us12",
    });
    const listId = "980cee8243";

    let fName = req.body.fName;
    let lName = req.body.lName;
    let mail = req.body.email;

    const subscribingUser = {
        firstName: fName,
        lastName: lName,
        email: mail
    };

    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                  FNAME: subscribingUser.firstName,
                  LNAME: subscribingUser.lastName
                }
            });

            console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
            res.sendFile(__dirname + "/src/pages/success.html");

        } catch (error) {
            console.error(error.status);
            res.sendFile(__dirname + "/src/pages/failure.html");
        }
    };
    run();
});

let port = process.env.PORT;
app.listen(port || 3000, function () {
    console.log("The server is running on port " + port)
});