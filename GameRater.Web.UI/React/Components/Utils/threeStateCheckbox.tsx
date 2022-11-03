import * as React from "react";

export interface IThreeStateCheckboxProps {
    id: string,
    className?: string,
    style?: object,
    checked?: boolean,
    indeterminate?: boolean,
    disabled?: boolean,
    onChange?: (e) => void,
}

export default class ThreeStateCheckbox extends React.Component<IThreeStateCheckboxProps, {}> {

    static defaultProps = {
        className: "",
        style: {},
        checked: false,
        indeterminate: false,
        disabled: false,
        onChange: (e) => { }
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { id, className, style, checked, indeterminate, onChange, disabled } = this.props;

        return (React.createElement("input", {
            type: "checkbox", id: id, className: className, style: style, ref: (input: any) => {
                if (input) {
                    input.checked = checked;
                    input.indeterminate = indeterminate;
                    input.disabled = disabled;
                }
            }, onChange: onChange
        }));
    }
}