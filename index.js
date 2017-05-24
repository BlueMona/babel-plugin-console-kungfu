
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

            const description = [];
            for (let expression of path.node.arguments) {
                if (description.length === 0) {
                    // if (!expression.loc) {
                    //     continue;
                    // }
                    const { line, column } = expression.loc.start;
                    description.push(`${filePath}:${line}:${column}:${path.node.callee.property.name.toUpperCase()}`);
                } else {
                    description.push(this.file.code.substring(expression.start, expression.end));
                }

            }
            path.node.arguments.unshift(t.stringLiteral(description.join(',')));

        }
    };
}

module.exports = function ({ types: t }) {
    return {
        visitor: getVisitor(t)
    }
}

