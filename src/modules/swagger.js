
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
            	url:"http://localhost:5000",
            },
       ],
	},
    apis:['./src/api/*.ts', './swagger/*', './src/models/*.ts']
};

export default swaggerOptions;