
const swaggerOptions = {
	swaggerDefinition:{
    	openapi: "3.0.3",
        info:{
        	title: 'HandyCandy',
            version: '1.0.0',
            description: 'HandyCandy API',
        },
        servers:[
            {
            	url:"https://handycandy.cf/api",
            },
        	{
            	url:"http://localhost:5000/api",
            },
       ],
	},
    apis:['./src/api/*.ts', './swagger/*', './src/models/*.ts']
};

export default swaggerOptions;