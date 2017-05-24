# babel-plugin-console-kungfu
Babel plugin to enhance console logging statements

## transformation

```
console.log('abc') -> console.log('dir/file.js:line:column:LOG','abc')
```
## usage

install plguin
```
npm i -D https://github.com/PeerioTechnologies/babel-plugin-console-kungfu.git
```

add plugin to `.babelrc`
```
{
    plugins: ["console-kungfu"]
}
```