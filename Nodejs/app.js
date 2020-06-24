const { checkAndChange } 	= require('./assets/functions')
const config 				= require('./assets/config')
const express 				= require('express');
const mysql 				= require('promise-mysql');
const swaggerUi 			= require('swagger-ui-express');
const swaggerDocument 		= require('./assets/swagger.json');

mysql.createConnection({
	host:			config.db.host,
	user:			config.db.user,
	password:		config.db.password,
	database:	 	config.db.database,
	socketPath:		config.db.socketPath
	
}).then((db) => {
	console.log('Connected!!')
	
	const morgan 				= require('morgan');
	const app 					= express();
	let MembersRouter 			= express.Router();
	let Members 				= require('./assets/classes/members-class')(db, config)

	app.use(morgan('dev'))
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	app.use(`${config.rootAPI}/members`, MembersRouter)
	app.use(config.rootAPI + '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

	MembersRouter.route('/:id')

		/* Recuperation d'un membre grâce à son id */
		.get(async (req, res) => {
			let member = await Members.getById(req.params.id)
			res.json(checkAndChange(member))
		})

		/* Change le nom d'un membre grâce à son id */
		.put(async (req, res) => {
			let updateMember = await Members.update(req.params.id, req.body.name)
			res.json(checkAndChange(updateMember))
		})

		/* Suppression d'un membre grâce à son id */
		.delete(async (req, res) => {
			let deleteMember = await Members.delete(req.params.id)
			res.json(checkAndChange(deleteMember))

	})
			

	MembersRouter.route('/')

		/* Récupération de la liste totale des membres */
		.get(async (req, res) => {
			let allMembers = await Members.getAll(req.query.max)
			res.json(checkAndChange(allMembers))
		})

		/* Création d'un membre à l'aide d'un nom */
		.post(async (req, res) => {
			let addMember = await Members.add(req.body.name)
			res.json(checkAndChange(addMember))
		})

	app.listen(config.port, () => console.log(`Started on port ${config.port}`))

}).catch((err) => {
	console.log('Error during database connection')
	console.log(err.message)
})