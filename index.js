
function isLogger(path, loggers) {
    return loggers.some((logger) => {
        return path.get("callee").matchesPattern(logger.pattern, true)
    });
}

function getVisitor(t) {
    return {
        CallExpression(path, options) {
            const loggers = options.opts.loggers || [{ pattern: 'console' }];
            if (isLogger(path, loggers)) {
                const description = [];
                for (let expression of path.node.arguments) {
                    if (description.length === 0) {
                        let relativePath;
                        const filePath = this.file.log.filename;
                        if (filePath.charAt(0) !== '/') {
                            relativePath = filePath;
                        } else {
                            let cwd = process.cwd();
                            relativePath = filePath.substring(cwd.length + 1);
                        }

                        const { line, column } = expression.loc.start;
                        description.push(`${relativePath}:${line}:${column}:`);
                    } else {
                        description.push(this.file.code.substring(expression.start, expression.end));
                    }

                }
                path.node.arguments.unshift(t.stringLiteral(description.join(',')));
            }
        }
    };
}

module.exports = function ({ types: t }) {
    return {
        visitor: getVisitor(t)
    }
}

