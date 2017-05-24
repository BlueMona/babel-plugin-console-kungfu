
function isLogger(path, loggers) {
    return loggers.some((logger) => {
        return path.get("callee").matchesPattern(logger.pattern, true)
    });
}
visited = {}

const skipString = 'node_modules/peerio-icebear/';

function getVisitor(t) {
    return {
        CallExpression(path, options) {
            const loggers = options.opts.loggers || [{ pattern: 'console' }];
            if (!isLogger(path, loggers)) return;

            let filePath = this.file.log.filename;

            if (visited[filePath] && visited[filePath][path.node.start] === path.node.end) {
                return;
            }
            visited[filePath] = visited[filePath] || {};
            visited[filePath][path.node.start] = path.node.end;

            if (filePath.startsWith(skipString)) {
                filePath = 'icebear/' + filePath.substring(skipString.length);
            }
            const line = path.node.loc.start.line;
            const description = `${filePath}:${line}:${path.node.callee.property.name.toUpperCase()}`;

            path.node.arguments.unshift(t.stringLiteral(description));

        }
    };
}

module.exports = function ({ types: t }) {
    return {
        visitor: getVisitor(t)
    }
}

