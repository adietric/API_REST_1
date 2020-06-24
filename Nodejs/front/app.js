const express 				= require('express');
const morgan 				= require('morgan')('dev')
const twig 					= require('twig')
const axios 				= require('axios')

const fetch = axios.create({
	baseURL: 'http://localhost:8080/api/v1/'
  });

const app 					= express();
const port 					= 8081

app.use(morgan)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	res.redirect('/members')
})

app.get('/members', (req, res) => {
	apiCall(req.query.max ? '/members?max=' + req.query.max : '/members/', 'get', {}, res, (result) => {
		res.render('members.twig', {
			members: result
		}) 
	})
})

app.get('/members/:id', (req, res) => {
	apiCall('/members/' + req.params.id, 'get', {}, res, (result) => {
		res.render('member.twig', {
			member: result
		})
	})
})

app.get('/edit/:id', (req, res) => {
	apiCall('/members/' + req.params.id, 'get', {}, res, (result) => {
		res.render('edit.twig', {
			member: result
		})
	})
})

app.post('/edit/:id', (req, res) => {
	apiCall('/members/' + req.params.id, 'put', {
		name: req.body.name,
	}, res, () => {
		res.redirect('/members')
	})
})

app.post('/delete', (req, res) => {
	apiCall('/members/' + req.body.id, 'delete', {}, res, () => {
		res.redirect('/members')
	})
})

app.get('/insert', (req, res) => {
	res.render('insert.twig')
})

app.post('/insert', (req, res) => {
	apiCall('/members', 'post', {name: req.body.name}, res, () => {
		res.redirect('/members')
	})
})

app.listen(port, () => console.log('Started en port 8081'))



//Functions
function renderError(res, errMsg) {
	console.log("err msg = " + errMsg)
	res.render('error.twig', {
		errorMsg: errMsg
	})
}

function apiCall(url, method, data, res, next) {
	fetch({
		method: method,
		url: url,
		data: data
	}).then(response => {
			if (response.data.status === 'success')
				next(response.data.result)
			else
				renderError(res, response.data.result)
		})
		.catch(err => renderError(res, err.message))
}