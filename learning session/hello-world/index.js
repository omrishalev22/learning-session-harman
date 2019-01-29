const express = require('express');
const app = express();

app.get('/',(req,res)=>{
	res.send('hello Avengers');
});

app.listen('3000',()=>{
	console.log('serve is running on port 3000...');
});
