const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Customer = require('./models/lab.js')
const prompt = require('prompt-sync')();

const username = prompt('What is your name? ');

console.log(`Your name is ${username}`);



const connect = async () => {

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const displayMenu = async() => {
    console.log('\nWelcome to the CRM\n');
    console.log('What would you like to do?\n');
    console.log('1. Create a customer');
    console.log('2. View all customers');
    console.log('3. Update a customer');
    console.log('4. Delete a customer');
    console.log('5.quit');
  }

  await displayMenu();

  const action = prompt('Number of action to run:');

  switch(action) {
    case'1':
        await createCustomer();
        break;
    case'2':
        await viewCustomer();
        break;
    case'3':
        await updateCustomer();
        break;
    case'4':
        await deleteCustomer();
        break;
    case'5':
        console.log('Exiting...');
        mongoose.connection.close(); //to close connection to moongoose
        process.exit(); // to terminate node.js

    default:
        console.log('Invalid option. Please try again');
        break;
  }

};

const createCustomer = async() => {
    const name = prompt('What is the customer\'s name?');
    const age = Number(prompt('What is the customer\'s age?')); 

    if(isNaN(age)) {
        console.log('Invalid age. Please enter a valid number');
        return;
    }

    const customer = new Customer({name, age});
    await customer.save();
    console.log('Customer details saved succesfully!');
  
};

const viewCustomer = async() => {
    const customer = await Customer.find({});
    customer.forEach((customer) => {
        console.log(`Id: ${customer._id} Name: ${customer.name} Age:${customer.age}`)
    })
};

const updateCustomer = async() => {
    const customers = await Customer.find({});
    customers.forEach((customer) => {
        console.log(`Id: ${customer._id} Name: ${customer.name} Age:${customer.age}`);
    });

    const id = prompt('What is the id of the customer you wish to update?');
    const newName = prompt('What is the customer\'s new name?');
    const newAge = prompt('What is the customer\'s new age?');

    if (isNaN(newAge)) {
        console.log('Invalid age. Please enter a valid number');
        return;
    }

    await Customer.findByIdAndUpdate(id, { name: newName, age: newAge });
    console.log('Customer updated successfully!');
}

const deleteCustomer = async() => {
    const customers = await Customer.find({});
    customers.forEach((customer) => {
        console.log(`Id: ${customer._id} Name: ${customer.name} Age:${customer.age}`);
    });

    const id = prompt('What is the id of the customer you wish to delete?');
    await Customer.findByIdAndDelete();
    console.log('Customer information deleted successfully!');

}



connect();