const plainText = function(tasklists) {
     
    return tasklists.map(function(tasklist) {

        var title = tasklist.title;
        var tasks = tasklist.tasks.map(function(task) {
            return `\t${task.text}\n\t\t${task.details}`; 
        });

        return [ title ].concat(tasks).join('\n') + '\n';
    })
    .join('\n');

};

export default plainText;
