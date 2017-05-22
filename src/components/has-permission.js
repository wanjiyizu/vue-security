export default {
    functional: true,
    props: {
        name: {
            type: String,
            required: true
        }
    },
    render: function (h, {parent, props, children}) {
        let permissions = parent.$security.permissions
        if (permissions === undefined) {
            return h('')
        } else if (permissions.indexOf(props.name) >= 0) {
            return children
        } else {
            return h('')
        }
    }
}