import {useRef, useEffect, createElement} from "react"

const isFunction = value => value && (Object.prototype.toString.call(value) === "[object Function]" || "function" === typeof value || value instanceof Function);

const {entries} = Object;

function toSafeKey(key) {
    return (key.toLowerCase() !== key)
        ? key.replace(/[A-Z]/g, '-$&').toLowerCase()
        : key
}

function toAttributesAndEvents(props) {
    return entries(props)
        .filter(([key]) => !["tag", "children"].includes(key))
        .reduce((result, [key, value]) =>
            (isFunction(value)) 
                ? (result.events[key] = (e) => value(e.detail), result)
                : (result.attributes[toSafeKey(key)] = value, result)            
        , {attributes:{}, events:{}})
}

export function CustomElement(props) {
    if (!props.tag) {
        console.error("[CustomElement] Missing tag property")
        return null
    }

    const {attributes, events} = toAttributesAndEvents(props)

    const ref = useRef();
    useEffect(() => {
        const { current } = ref
        if (!current) return;
        entries(events).forEach(([eventName, eventListener]) =>
            current.addEventListener(eventName, eventListener)
        )

        return () => {
            entries(events).forEach(([eventName, eventListener]) =>
                current.removeEventListener(eventName, eventListener)
            )
        }
    }, [])

    return createElement(props.tag, {ref,...attributes}, props.children)
}