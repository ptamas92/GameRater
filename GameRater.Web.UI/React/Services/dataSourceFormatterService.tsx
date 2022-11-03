
//getValueOfTemplateAliases
export function getValueOfTemplateAliases (obj: object) {
    var res = [];
    var props = Object.keys(obj);

    props.forEach(function (prop) {
        res.push({
            key: "[##Obj.__" + prop + "##]",
            value: obj[prop]?.toString()
        });

        res.push({
            key: "[##Obj." + prop + "##]",
            value: obj[prop]?.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&#34;')
        })
    });

    return res;
}

//replaceAliases
export function replaceAliases(template: string, aliases: Array<any> = null) {
    var res = template ? template : "";

    if (aliases !== null) {
        aliases.forEach(function (item) {
            res = res.split(item.key).join(item.value);
        });
    }

    return res;
}

//groupBy
export function groupBy(array: Array<any>, key: string) {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
        );

        return result;
    }, {});
}

//sorting
export function sorting(key, order = 'asc') {
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
export function getDataSourceForTheCurrentPage (formattedDataSource: Array<any>, activePage: number, isPaging: boolean) {
    var res = [];
    var isForcedBreak = false;
    var counter = 0;
    var counterStart = (activePage * 25) - 24;
    var counterEnd = activePage * 25;

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