const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});
const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
    const url =
    `mongodb+srv://dennisvillavicencioq:${process.argv[2]}@cluster0.okvuepp.mongodb.net/?retryWrites=true&w=majority`;

    mongoose.connect(url);

    Person.find({}).then(result => {
        console.log("phonebook:");
        result.forEach(element => {
            console.log(`${element.name} ${element.number}`);
        });
        mongoose.connection.close();
    });
}
else if (process.argv.length === 5) {
    const url =
    `mongodb+srv://dennisvillavicencioq:${process.argv[2]}@cluster0.okvuepp.mongodb.net/?retryWrites=true&w=majority`;

    mongoose.connect(url);

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    person.save().then(() => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close();
    });
}
else {
    process.exit(1);
}

