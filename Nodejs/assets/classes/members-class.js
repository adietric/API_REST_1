let db, config

module.exports = (_db, _config) => {
	db 		= _db
	config 	= _config
	return Members
}

let Members = class {

	static getById(id) {
		return new Promise((next) => {
			db.query('SELECT * FROM members WHERE id = ?', [id])
				.then(result => {
					if (result[0] === undefined)
						next(new Error(config.errors.wrongId))
					else
						next(result[0])
				})
				.catch(err => next(err))
		})
	}

	static getAll(max) {
		return new Promise((next) => {
			if (max !== undefined && max > 0) {
				db.query(`SELECT * FROM members LIMIT ?`, [parseInt(max)])
					.then(result => next(result))
					.catch(err => next(err.message))
			} else if (max !== undefined) { 
				next(new Error(config.errors.wrongMaxValue))
			} else {
				db.query('SELECT * FROM members')
					.then(result => next(result))
					.catch(err => next(new Error(err.message)))
			}
		})
	}

	static add(name) {
		return new Promise((next) => {
			if (name && name.trim() !== '') {
				name = name.trim()
				db.query('SELECT * FROM members WHERE name = ?', [name])
					.then(result => {
						if(result[0] !== undefined)
							next(new Error(config.errors.nameAlreadyTaken))
						else {
							return db.query('INSERT INTO members(name) VALUES(?)', [name])
						}
					})
					.then(() => {
						return db.query('SELECT * FROM members WHERE name = ?', [name])
					})
					.then((result) => {
						next({
							id: result[0].id,
							name: result[0].name
						})
					})
					.catch(err => next(err.message))
			} else
				next(new Error(config.errors.noNameValue))
		})
	}

	static update(id, name) {
		return new Promise((next) => {
			if (name.trim() === '' || name === undefined)
				next(new Error(config.errors.noNameValue))
			else {
				name = name.trim()
				db.query('SELECT * FROM members WHERE id = ?', [id])
					.then(result => {
						if (result[0] === undefined)
							next(new Error(config.errors.wrongId))
						else
							return db.query('SELECT * FROM members WHERE name = ? AND id != ?', [name, id])
					})
					.then(result => {
						if (result[0] !== undefined)
							next(new Error(config.errors.nameAlreadyTaken))
						else
							return db.query('UPDATE members SET name = ? WHERE id = ?', [name, id])
					})
					.then(() => {
						next({
							id: id,
							name: name
						})
					})
					.catch(err => next(err.message))
			}
		})
	}

	static delete(id) {
		let name
		return new Promise((next) => {
			db.query('SELECT * FROM members WHERE id = ?', [id])
				.then(result => {
					if (result[0] === undefined)
						next(new Error(config.errors.wrongId))
					else
					{
						name = result[0].name
						return db.query('DELETE FROM members WHERE id = ?', [id])
					}
				})
				.then(() => next(`Member ${name} with id ${id} has been deleted`))
				.catch(err => next(err.message))
		})
	}
}