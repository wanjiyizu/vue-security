(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.VueSecurity = factory());
}(this, (function () { 'use strict';

var hasPermission = {
    functional: true,
    props: {
        name: {
            type: String,
            required: true
        }
    },
    render: function render(h, _ref) {
        var parent = _ref.parent,
            props = _ref.props,
            children = _ref.children;

        var permissions = parent.$security.permissions;
        if (permissions === undefined) {
            return h('');
        } else if (roles.indexOf(props.name) >= 0) {
            return context.children;
        } else {
            return h('');
        }
    }
};

var hasRole = {
    functional: true,
    props: {
        name: {
            type: String,
            required: true
        }
    },
    render: function render(h, _ref) {
        var parent = _ref.parent,
            props = _ref.props,
            children = _ref.children;

        var roles = parent.$security.roles;
        if (roles === undefined) {
            return h('');
        } else if (roles.indexOf(props.name) >= 0) {
            return context.children;
        } else {
            return h('');
        }
    }
};

function install(Vue, options) {
	Vue.mixin({
		beforeCreate: function beforeCreate() {
			var options = this.$options;
			if (options.security) {
				this.$security = options.security;
			} else if (options.parent && options.parent.$security) {
				this.$security = options.parent.$security;
			}
			if (options.store) {
				this.$security.initStore(options.store);
			}
		}
	});
	Vue.component('has-role', hasRole);
	Vue.component('has-permission', hasPermission);
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var SecurityManager = function () {
	createClass(SecurityManager, null, [{
		key: 'install',
		value: function install$$1() {}
	}, {
		key: 'installed',
		get: function get$$1() {
			return !!this.install.done;
		},
		set: function set$$1(val) {
			this.install.done = val;
		}
	}]);

	function SecurityManager() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		classCallCheck(this, SecurityManager);

		this.options = options;
		this.verify = options.verify;
		this.loginTime = options.loginTime;
		this.interval = options.interval;
		this.initStore();
	}

	createClass(SecurityManager, [{
		key: 'initStore',
		value: function initStore(store) {
			if ((typeof store === 'undefined' ? 'undefined' : _typeof(store)) === 'object') {
				this.store = store;
			} else {
				this.store = this.options.store || {};
			}
			this.state = this.store.state || {};
			this.roles = this.state.roles = this.state.roles || [];
			this.filter = this.options.filter || [];
			this.permissions = this.state.permissions = this.state.permissions || [];
			this.user = this.state.user = this.state.user || {};
		}
	}, {
		key: 'addRole',
		value: function addRole(role) {
			var isArray = role instanceof Array;
			if (!isArray) {
				this.state.roles.push(role);
			} else if (isArray) {
				this.state.roles = this.roles = this.state.roles.concat(role);
			}
		}
	}, {
		key: 'addPermission',
		value: function addPermission(permission) {
			var isArray = permission instanceof Array;
			if (!this.state.permissions) {
				this.state.permissions = [];
			}
			if (!isArray) {
				this.state.permissions.push(permission);
			} else if (isArray) {
				this.state.permissions = this.permissions = this.state.permissions.concat(permission);
			}
		}
	}, {
		key: 'addUser',
		value: function addUser(user) {
			if ((typeof user === 'undefined' ? 'undefined' : _typeof(user)) === 'object' && user !== undefined) {
				this.state.user = this.user = user;
			}
		}
	}, {
		key: 'reseter',
		value: function reseter() {
			if (typeof this.store.commit === 'function') {
				this.store.commit('logout');
			} else {
				this.permissions.splice(0, this.permissions.length);
				this.roles.splice(0, this.roles.length);
				this.user = Object.create(null);
			}
			sessionStorage.removeItem('permissions');
			sessionStorage.removeItem('roles');
			sessionStorage.removeItem('user');
		}
	}, {
		key: 'rememberIdentity',
		value: function rememberIdentity() {
			if (this.options.isRememberMe) {
				sessionStorage.setItem('permissions', JSON.stringify(this.state.permissions));
				sessionStorage.setItem('roles', JSON.stringify(this.state.roles));
				sessionStorage.setItem('user', JSON.stringify(this.state.user));
			}
		}
	}, {
		key: 'isLogin',
		value: function isLogin() {
			var verify = this.verify;
			var clear = void 0;
			var interval = this.interval;
			var logout = this.logout;
			var _this = this;
			if (typeof verify !== 'function') {
				return;
			}
			clear = setInterval(function () {
				var flag = verify();
				if (flag) {
					clearInterval(clear);
					logout.call(_this);
				}
			}, interval);
		}
	}, {
		key: 'login',
		value: function login(user) {
			if (user === undefined) {
				return false;
			} else {
				this.addUser(user);
				this.isLogin();
			}
			if (user.permissions) {
				this.addPermission(user.permissions);
			}
			if (user.roles) {
				this.addRole(user.roles);
			}
			this.rememberIdentity();
		}
	}, {
		key: 'logout',
		value: function logout() {
			this.reseter();
		}
	}]);
	return SecurityManager;
}();

SecurityManager.install = install;

return SecurityManager;

})));
