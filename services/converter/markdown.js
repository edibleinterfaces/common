const h1 =  function (s) {
    return '# ' + s + '\n';
};

const listItem = function(s) {
    return '+ ' + s + '\n';
};

const toMarkdown = function(tasklists) {

    return tasklists.map(function(tasklist) {

        var title = h1(tasklist.title);
        var tasks = tasklist.tasks.map(function(task) {
            return listItem(task.text); 
        });

        return [ title ].concat(tasks).join('');
    })
    .join('\n');

};

export default toMarkdown;
