var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from "react";
var ThreeStateCheckbox = /** @class */ (function (_super) {
    __extends(ThreeStateCheckbox, _super);
    function ThreeStateCheckbox(props) {
        return _super.call(this, props) || this;
    }
    ThreeStateCheckbox.prototype.render = function () {
        var _a = this.props, id = _a.id, className = _a.className, style = _a.style, checked = _a.checked, indeterminate = _a.indeterminate, onChange = _a.onChange, disabled = _a.disabled;
        return (React.createElement("input", {
            type: "checkbox", id: id, className: className, style: style, ref: function (input) {
                if (input) {
                    input.checked = checked;
                    input.indeterminate = indeterminate;
                    input.disabled = disabled;
                }
            }, onChange: onChange
        }));
    };
    ThreeStateCheckbox.defaultProps = {
        className: "",
        style: {},
        checked: false,
        indeterminate: false,
        disabled: false,
        onChange: function (e) { }
    };
    return ThreeStateCheckbox;
}(React.Component));
export default ThreeStateCheckbox;
//# sourceMappingURL=threeStateCheckbox.js.map