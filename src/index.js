import { install } from './install'
export default class SecurityManager {
	static install () {}
	static get installed () {
		return !!this.install.done
	}
	static set installed (val) {
		this.install.done = val
	}
	constructor (options = {}) {
		this.options = options
		this.verify = options.verify
		this.loginTime = options.loginTime
		this.interval = options.interval
		this.initStore()
	}
	initStore (store) {
		if (typeof store === 'object') {
			this.store = store
		} else {
			this.store = this.options.store || {}
		}
		this.state = this.store.state || {}
		this.roles = this.state.roles = this.state.roles || []
		this.filter = this.options.filter || []
		this.permissions = this.state.permissions = this.state.permissions || []
		this.user = this.state.user = this.state.user || {}
	}
	addRole (role) {
		let isArray = (role instanceof Array)
		if (!isArray) {
			this.state.roles.push(role)
		} else if (isArray) {
			this.state.roles = this.roles = this.state.roles.concat(role)
		}
	}
	addPermission (permission) {
		let isArray = (permission instanceof Array)
		if (!this.state.permissions) {
			this.state.permissions = []
		}
		if (!isArray) {
			this.state.permissions.push(permission)
		} else if (isArray) {
			this.state.permissions = this.permissions = this.state.permissions.concat(permission)
		}
	}
	addUser (user) {
		if (typeof user === 'object' && user !== undefined) {
			this.state.user = this.user = user
		}
	}
	reseter () {
		if (typeof this.store.commit === 'function') {
			this.store.commit('logout')
		} else {
			this.permissions.splice(0, this.permissions.length)
			this.roles.splice(0, this.roles.length)
			this.user = Object.create(null)
		}
		sessionStorage.removeItem('permissions')
		sessionStorage.removeItem('roles')
		sessionStorage.removeItem('user')
	}
	rememberIdentity () {
		if (this.options.isRememberMe) {
			sessionStorage.setItem('permissions', JSON.stringify(this.state.permissions))
			sessionStorage.setItem('roles', JSON.stringify(this.state.roles))
			sessionStorage.setItem('user', JSON.stringify(this.state.user))
		}
	}
	isLogin () {
		let verify = this.verify
		let clear
		let interval = this.interval
		let logout = this.logout
		let _this = this
		if (typeof verify !== 'function') {
			return
		}
		clear = setInterval(function () {
			let flag = verify()
			if (flag) {
				clearInterval(clear)
				logout.call(_this)
			}
		}, interval)
	}
	login (user) {
		if (user === undefined) {
			return false
		} else {
			this.addUser(user)
			this.isLogin()
		}
		if (user.permissions) {
			this.addPermission(user.permissions)
		}
		if (user.roles) {
			this.addRole(user.roles)
		}
		this.rememberIdentity()
	}
	logout () {
		this.reseter()
	}
}
SecurityManager.install = install
