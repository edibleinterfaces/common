export default {
    cssToThemesObj: (styles) => {
        return Object.keys(styles).reduce((obj, item) => { 
            let theme = item.split('-')[0];
            if (theme in obj)
                obj[theme].push(styles[item]);
            else
                obj[theme] = [styles[item]];
            return obj;
        },{});
    },
    sortComparator: (fn) => (a,b) => fn(a,b)
}
