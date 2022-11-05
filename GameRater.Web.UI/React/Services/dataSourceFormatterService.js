import ReactDOMServer from 'react-dom/server';
//getValueOfTemplateAliases
export function getValueOfTemplateAliases(obj) {
    var res = [];
    var props = Object.keys(obj);
    props.forEach(function (prop) {
        var _a, _b;
        res.push({
            key: "[##Obj.__" + prop + "##]",
            value: (_a = obj[prop]) === null || _a === void 0 ? void 0 : _a.toString()
        });
        res.push({
            key: "[##Obj." + prop + "##]",
            value: (_b = obj[prop]) === null || _b === void 0 ? void 0 : _b.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&#34;')
        });
    });
    return res;
}
//replaceAliases
export function replaceAliases(template, aliases) {
    if (aliases === void 0) { aliases = null; }
    var res = template ? template : "";
    if (aliases !== null) {
        aliases.forEach(function (item) {
            res = res.split(item.key).join(item.value);
        });
    }
    return res;
}
//groupBy
export function groupBy(array, key) {
    return array.reduce(function (result, currentValue) {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
    }, {});
}
//sorting
export function sorting(key, order) {
    if (order === void 0) { order = 'asc'; }
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key))
            return 0;
        var comparison = 0;
        var varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
        var varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];
        if (varA > varB)
            comparison = 1;
        else if (varA < varB)
            comparison = -1;
        return (order === 'desc') ? (comparison * -1) : comparison;
    };
}
//getDataSourceForTheCurrentPage
export function getDataSourceForTheCurrentPage(formattedDataSource, activePage, isPaging) {
    var res = [];
    var isForcedBreak = false;
    var counter = 0;
    var counterStart = (activePage * sizePerPage) - (sizePerPage - 1);
    var counterEnd = activePage * sizePerPage;
    for (var x = 0; x < formattedDataSource.length; x++) {
        var group = formattedDataSource[x];
        if (isPaging) {
            var newGroup = { objArray: [], template: group.template, groupFullLength: group.objArray.length, groupIndex: (x + 1) };
            for (var y = 0; y < group.objArray.length; y++) {
                var item = group.objArray[y];
                counter++;
                if (counter >= counterStart && counter <= counterEnd) {
                    newGroup.objArray.push(item);
                }
                else if (counter > counterEnd) {
                    isForcedBreak = true;
                    break;
                }
            }
            if (newGroup.objArray.length !== 0) {
                res.push(newGroup);
            }
            if (isForcedBreak) {
                break;
            }
        }
        else {
            res.push({ objArray: group.objArray, template: group.template, groupFullLength: group.objArray.length, groupIndex: (x + 1) });
        }
    }
    return res;
}
//convertJsxToHtml
export function convertJsxToHtml(el) {
    return ReactDOMServer.renderToStaticMarkup(el);
}
//# sourceMappingURL=dataSourceFormatterService.js.map