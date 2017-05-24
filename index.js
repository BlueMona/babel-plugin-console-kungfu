
function isLogger(path, loggers) {
    return loggers.some((logger) => {
        return path.get("callee").matchesPattern(logger.pattern, true)
    });
}
visited = {}
function getVisitor(t) {
    return {
        CallExpression(path, options) {
            const loggers = options.opts.loggers || [{ pattern: 'console' }];
            if (!isLogger(path, loggers)) return;

            const filePath = this.file.log.filename;

            if (visited[filePath] && visited[filePath][path.node.start] === path.node.end) {
                return;
            }
            visited[filePath] = visited[filePath] || {};
            visited[filePath][path.node.start] = path.node.end;

            const { line, column } = path.node.start;
            const description = `${filePath}:${line}:${column}:${path.node.callee.property.name.toUpperCase()}`;

            path.node.arguments.unshift(t.stringLiteral(description));

        }
    };
}

module.exports = function ({ types: t }) {
    return {
        visitor: getVisitor(t)
    }
}

