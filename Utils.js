class Utils {

    /**
     * Converts an object to an array of key and values, so that it can be used in statements:
     * UNWIND { props } as props SET n +=  props
     * @param object
     */
    toProps(object) {
        const props = [];
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                const prop = {};
                prop[key] = object[key];
                props.push(prop);
            }
        }
        return props;
    }

}
module.exports = Utils;