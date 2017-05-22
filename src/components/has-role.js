export default {
    functional: true,
    props: {
        name: {
            type: String,
            required: true
        }
    },
    render: function (h, {parent, props, children}) {
        let roles = parent.$security.roles
        if (roles === undefined) {
            return h('')
        } else if (roles.indexOf(props.name) >= 0) {
            return children
        } else {
            return h('')
        }
    }
}