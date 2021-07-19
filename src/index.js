import React, {useRef, useEffect} from "react"

const isFunction = value => value && (Object.prototype.toString.call(value) === "[object Function]" || "function" === typeof value || value instanceof Function);

function toSafeKey(key) {
    return (key.toLowerCase() !== key)
        ? key.replace(/[A-Z]/g, '-$&').toLowerCase()
        : key
}

function toProps(props) {
    return Object
        .entries(props)
        .filter(p => p[0] !== "tag" && !isFunction(p[1]))
        .reduce((result, [key, value]) => {
            result[toSafeKey(key)] = value;
            return result;
        }, {})
}

function toFunctions(props) {
    return Object
        .entries(props)
        .filter(p => p[0] !== "tag" && isFunction(p[1]))
        .reduce((result, [key, value]) => {
            result[key] = (e) => value(e.detail);
            return result;
        }, {})
}

export function CustomElement(props) {
    if (!props.tag) {
        console.error("[CustomElement] Missing tag property")
        return null
    }

    const ref = useRef();
    useEffect(() => {
        const { current } = ref
        if (!current) return;
        const events = toFunctions(props)
        Object.entries(events).forEach(([eventName, eventListener]) =>
            current.addEventListener(eventName, eventListener)
        )

        return () => {
            Object.entries(events).forEach(([eventName, eventListener]) =>
                current.removeEventListener(eventName, eventListener)
            )
        }
    }, [])

    return React.createElement(props.tag, {ref,...toProps(props)}, null)
}