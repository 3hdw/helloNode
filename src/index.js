import express from 'express';
import Joi from '@hapi/joi'

const port =  process.env.PORT || 8080;
const customers = [
    {id: 1, name: 'Jan'},
    {id: 2, name: 'Foo'},
    {id: 3, name: 'Bar'},
    {id: 4, name: 'Ko'},
]
const app = express();

app.listen(port, ()=>{
    console.log(`Listening on ${port}...`);
});

app.use(express.json());

app.get('/', (req, res)=>{
    res.send('Hello World');
});

app.post('/api/customers', (req,res)=>{

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        id: Joi.number().required()
    });

    const body = req.body;

    const result = schema.validate(body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
    }else{
        const newCustomer = {id: body.id, name: body.name} 
        customers.push(newCustomer);
        res.send(newCustomer);
    }
});

app.get('/api/customers/:id', (req, res)=>{
    // res.send(req.query);
    const customer = customers.find(c => c.id === +req.params.id);
    if(!customer) res.status(404).send(`Customer id: ${req.params.id} not found`);
    else res.status(200).send(customer);
});