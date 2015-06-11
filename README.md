# bubble-arc
Arranges bubbles around a center element with CSS and JavaScript. Building requires `ruby`, `sass` and the `sass-json-vars` gem to be installed.

## Example

```javascript
var arc = new BubbleArc({
	degrees: 120,
	fillLast: true,
	radius: [radius, 'px']
});

arc.dom().appendTo('body');
```

Sorry for missing documentation. You can find some explaining demo here:

http://loilo.github.io/bubble-arc/