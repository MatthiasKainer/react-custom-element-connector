import React from "react";

type CustomElementProps = {
    tag: string,
    children?: JSX.Element | JSX.Element[],
    [key: string]: any
}

declare function CustomElement(props: CustomElementProps): React.FunctionComponentElement<CustomElementProps>