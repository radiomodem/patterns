<h1 class="u-text-center">Modem Pattern Library</h1>

<div class="u-text-center">
  <iframe src="https://ghbtns.com/github-btn.html?user=radio-modem&repo=patterns&type=star&count=true&size=large" frameborder="0" scrolling="0" width="130px" height="30px"></iframe>
  <iframe src="https://ghbtns.com/github-btn.html?user=radio-modem&repo=patterns&type=fork&count=true&size=large" frameborder="0" scrolling="0" width="130px" height="30px"></iframe>
</div>

<h3 class="u-text-center">Welcome to the Modem Pattern library! Here you'll find a comprehensive styleguide covering all of the HTML, CSS, and JS components used by Modem sites and apps.</h3>

<div class="row">
  <div class="column">
    <h3>Download</h3>

    <p>Hit the button below to download the latest build of the Modem Pattern Library.</p>

    <p><a class="button" href="https://github.com/radio-modem/patterns/archive/gh-pages.zip">Download Modem Patterns <i class="ion-code-download"></i></a></p>

    <h4>CDN</h4>

    <input type="text" value="http://patterns.radiomodem.dk/css/modem.css" onclick="this.select()" aria-label="Download CSS files from CDN" readonly>

    <input type="text" value="http://patterns.radiomodem.dk/js/modem.js" onclick="this.select()" aria-label="Download JS files from CDN" readonly>
  </div>

  <div class="column">
    <h3>Requirements</h3>

    <p>In addition to <code>modem.js</code> and <code>modem.css</code> you will also need the following libraries in order to use the Modem Pattern Library:</p>

    <ul>
      <li><a href="http://necolas.github.io/normalize.css/">Normalize.css v3.0.2+</a></li>
      <li><a href="http://ionicons.com/">Ionicons v2.0.1+</a></li>
      <li><a href="https://jquery.com/">jQuery v2.1.3+</a></li>
      <li><a href="http://requirejs.org/">Require.js v2.1.16+</a> (any AMD loader should do, really)</li>
    </ul>
  </div>
</div>

<h3>Quick start</h3>

```
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>...</title>

    <!-- NB: Remember to include required third-party CSS -->

    <link rel="stylesheet" href="css/modem.css">
  </head>
  <body>
    <p>Hello World from Modem Pattern Library!</p>

    <!-- NB: Remember to include required third-party JS -->

    <script src="js/modem.js"></script>
    <script>require(["modem"])</script>
  </body>
</html>
```
