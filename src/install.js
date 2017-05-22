import hasPermission from './components/has-permission'
import hasRole from './components/has-role'
export function install (Vue, options) {
	Vue.mixin({
		beforeCreate: function () {
			const options = this.$options
			if (options.security) {
				this.$security = options.security
			} else if (options.parent && options.parent.$security) {
				this.$security = options.parent.$security
			}
			if (options.store) {
				this.$security.initStore(options.store)
			}
		}
	})
	Vue.component('has-role', hasRole)
	Vue.component('has-permission', hasPermission)
}
