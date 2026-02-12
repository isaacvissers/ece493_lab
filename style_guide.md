<html lang="en"><head>
<meta charset="utf-8">
<title>Google JavaScript Style Guide</title>
<link rel="stylesheet" href="javaguide.css">
<script src="include/styleguide.js"></script><style type="text/css" id="operaUserStyle"></style>
<link rel="shortcut icon" href="/styleguide/favicon.ico">
<script src="include/jsguide.js"></script>
<style type="text/css"></style><link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/prettify.css"></head>
<body onload="initStyleGuide();">
<div id="content">
<h1>Google JavaScript Style Guide</h1><div id="tocDiv" class="vertical_toc"><div class="toc_title"></div><h3 class="ignoreLink" id="toc">Table of Contents</h3><table class="columns"><tbody valign="top" class="toc"><tr><td class="two_columns"><dl><dt><a href="#introduction">1 Introduction</a></dt><dd><a href="#terminology-notes">1.1 Terminology notes</a></dd><dd><a href="#guide-notes">1.2 Guide notes</a></dd></dl><dl><dt><a href="#source-file-basics">2 Source file basics</a></dt><dd><a href="#file-name">2.1 File name</a></dd><dd><a href="#file-encoding">2.2 File encoding: UTF-8</a></dd><dd><a href="#special-characters">2.3 Special characters</a></dd></dl><dl><dt><a href="#source-file-structure">3 Source file structure</a></dt><dd><a href="#file-copyright">3.1 License or copyright information, if present</a></dd><dd><a href="#file-fileoverview">3.2 @fileoverview JSDoc, if present</a></dd><dd><a href="#file-goog-module">3.3 goog.module statement</a></dd><dd><a href="#file-es-modules">3.4 ES modules</a></dd><dd><a href="#file-set-test-only">3.5 goog.setTestOnly</a></dd><dd><a href="#file-goog-require">3.6 goog.require and goog.requireType statements</a></dd><dd><a href="#file-implementation">3.7 The file’s implementation</a></dd></dl><dl><dt><a href="#formatting">4 Formatting</a></dt><dd><a href="#formatting-braces">4.1 Braces</a></dd><dd><a href="#formatting-block-indentation">4.2 Block indentation: +2 spaces</a></dd><dd><a href="#formatting-statements">4.3 Statements</a></dd><dd><a href="#formatting-column-limit">4.4 Column limit: 80</a></dd><dd><a href="#formatting-line-wrapping">4.5 Line-wrapping</a></dd><dd><a href="#formatting-whitespace">4.6 Whitespace</a></dd><dd><a href="#formatting-grouping-parentheses">4.7 Grouping parentheses: recommended</a></dd><dd><a href="#formatting-comments">4.8 Comments</a></dd></dl><dl><dt><a href="#language-features">5 Language features</a></dt><dd><a href="#features-local-variable-declarations">5.1 Local variable declarations</a></dd><dd><a href="#features-array-literals">5.2 Array literals</a></dd><dd><a href="#features-object-literals">5.3 Object literals</a></dd><dd><a href="#features-classes">5.4 Classes</a></dd><dd><a href="#features-functions">5.5 Functions</a></dd><dd><a href="#features-string-literals">5.6 String literals</a></dd><dd><a href="#features-number-literals">5.7 Number literals</a></dd><dd><a href="#features-control-structures">5.8 Control structures</a></dd><dd><a href="#features-this">5.9 this</a></dd><dd><a href="#features-equality-checks">5.10 Equality Checks</a></dd><dd><a href="#disallowed-features">5.11 Disallowed features</a></dd></dl><dl><dt><a href="#naming">6 Naming</a></dt><dd><a href="#naming-rules-common-to-all-identifiers">6.1 Rules common to all identifiers</a></dd><dd><a href="#naming-rules-by-identifier-type">6.2 Rules by identifier type</a></dd><dd><a href="#naming-camel-case-defined">6.3 Camel case: defined</a></dd></dl><dl><dt><a href="#jsdoc">7 JSDoc</a></dt><dd><a href="#jsdoc-general-form">7.1 General form</a></dd><dd><a href="#jsdoc-markdown">7.2 Markdown</a></dd><dd><a href="#jsdoc-tags">7.3 JSDoc tags</a></dd><dd><a href="#jsdoc-line-wrapping">7.4 Line wrapping</a></dd><dd><a href="#jsdoc-top-file-level-comments">7.5 Top/file-level comments</a></dd><dd><a href="#jsdoc-class-comments">7.6 Class comments</a></dd><dd><a href="#jsdoc-enum-and-typedef-comments">7.7 Enum and typedef comments</a></dd><dd><a href="#jsdoc-method-and-function-comments">7.8 Method and function comments</a></dd><dd><a href="#jsdoc-property-comments">7.9 Property comments</a></dd><dd><a href="#jsdoc-type-annotations">7.10 Type annotations</a></dd><dd><a href="#jsdoc-visibility-annotations">7.11 Visibility annotations</a></dd></dl><dl><dt><a href="#policies">8 Policies</a></dt><dd><a href="#policies-be-consistent">8.1 Issues unspecified by Google Style: Be Consistent!</a></dd><dd><a href="#policies-compiler-warnings">8.2 Compiler warnings</a></dd><dd><a href="#policies-deprecation">8.3 Deprecation</a></dd><dd><a href="#policies-code-not-in-google-style">8.4 Code not in Google Style</a></dd><dd><a href="#policies-local-style-rules">8.5 Local style rules</a></dd><dd><a href="#policies-generated-code-mostly-exempt">8.6 Generated code: mostly exempt</a></dd></dl><dl><dt><a href="#appendices">9 Appendices</a></dt><dd><a href="#appendices-jsdoc-tag-reference">9.1 JSDoc tag reference</a></dd><dd><a href="#appendices-commonly-misunderstood-style-rules">9.2 Commonly misunderstood style rules</a></dd><dd><a href="#appendices-style-related-tools">9.3 Style-related tools</a></dd><dd><a href="#appendices-legacy-exceptions">9.4 Exceptions for legacy platforms</a></dd></dl></td></tr></tbody></table></div>

<p style="position: fixed; left: 0; top: 0; padding: 0.5em; margin: 0; background-color: #fef6e0; text-align: center; width: 100%; font-weight: bold; z-index: 1;">
Please note: This guide is no longer being updated. Google recommends migrating
to TypeScript, and following the <a href="tsguide.html">TypeScript guide</a>.
</p>

<h2 id="introduction" style="left: -46px; position: relative;">1 Introduction<a href="#introduction" alt="link to introduction"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h2>

<p>This document serves as the <strong>complete</strong> definition of Google’s coding standards
for source code in the JavaScript programming language. A JavaScript source file
is described as being <em>in Google Style</em> if and only if it adheres to the rules
herein.</p>

<p>Like other programming style guides, the issues covered span not only aesthetic
issues of formatting, but other types of conventions or coding standards as
well. However, this document focuses primarily on the hard-and-fast rules that
we follow universally, and avoids giving advice that isn't clearly enforceable
(whether by human or tool).</p>

<h3 id="terminology-notes" style="left: -46px; position: relative;">1.1 Terminology notes<a href="#terminology-notes" alt="link to terminology-notes"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>In this document, unless otherwise clarified:</p>

<ol>
<li><p>The term <em>comment</em> always refers to <em>implementation</em> comments. We do not use
the phrase <q>documentation comments</q>, instead using the common term “JSDoc”
for both human-readable text and machine-readable annotations within <code>/** …
*/</code>.</p></li>
<li><p>This Style Guide uses <a href="http://tools.ietf.org/html/rfc2119">RFC 2119</a> terminology when using the phrases <em>must</em>,
<em>must not</em>, <em>should</em>, <em>should not</em>, and <em>may</em>. The terms <em>prefer</em> and
<em>avoid</em> correspond to <em>should</em> and <em>should not</em>, respectively. Imperative
and declarative statements are prescriptive and correspond to <em>must</em>.</p></li>
</ol>

<p>Other <q>terminology notes</q> will appear occasionally throughout the document.</p>

<h3 id="guide-notes" style="left: -46px; position: relative;">1.2 Guide notes<a href="#guide-notes" alt="link to guide-notes"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Example code in this document is <strong>non-normative</strong>. That is, while the examples
are in Google Style, they may not illustrate the <em>only</em> stylish way to represent
the code. Optional formatting choices made in examples must not be enforced as
rules.</p>

<h2 id="source-file-basics" style="left: -46px; position: relative;">2 Source file basics<a href="#source-file-basics" alt="link to source-file-basics"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h2>

<h3 id="file-name" style="left: -46px; position: relative;">2.1 File name<a href="#file-name" alt="link to file-name"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>File names must be all lowercase and may include underscores (<code>_</code>) or dashes
(<code>-</code>), but no additional punctuation. Follow the convention that your project
uses. Filenames’ extension must be <code>.js</code>.</p>

<h3 id="file-encoding" style="left: -46px; position: relative;">2.2 File encoding: UTF-8<a href="#file-encoding" alt="link to file-encoding"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Source files are encoded in <strong>UTF-8</strong>.</p>

<h3 id="special-characters" style="left: -46px; position: relative;">2.3 Special characters<a href="#special-characters" alt="link to special-characters"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="whitespace-characters" style="left: -46px; position: relative;">2.3.1 Whitespace characters<a href="#whitespace-characters" alt="link to whitespace-characters"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Aside from the line terminator sequence, the ASCII horizontal space character
(0x20) is the only whitespace character that appears anywhere in a source file.
This implies that</p>

<ol>
<li><p>All other whitespace characters in string literals are escaped, and</p></li>
<li><p>Tab characters are <strong>not</strong> used for indentation.</p></li>
</ol>

<h4 id="special-escape-sequences" style="left: -46px; position: relative;">2.3.2 Special escape sequences<a href="#special-escape-sequences" alt="link to special-escape-sequences"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>For any character that has a special escape sequence (<code>\'</code>, <code>\"</code>, <code>\\</code>, <code>\b</code>,
<code>\f</code>, <code>\n</code>, <code>\r</code>, <code>\t</code>, <code>\v</code>), that sequence is used rather than the
corresponding numeric escape (e.g <code>\x0a</code>, <code>\u000a</code>, or <code>\u{a}</code>). Legacy octal
escapes are never used.</p>

<h4 id="non-ascii-characters" style="left: -46px; position: relative;">2.3.3 Non-ASCII characters<a href="#non-ascii-characters" alt="link to non-ascii-characters"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>For the remaining non-ASCII characters, either the actual Unicode character
(e.g. <code>∞</code>) or the equivalent hex or Unicode escape (e.g. <code>\u221e</code>) is used,
depending only on which makes the code <strong>easier to read and understand</strong>.</p>

<p class="tip">Tip: In the Unicode escape case, and occasionally even when actual Unicode
characters are used, an explanatory comment can be very helpful.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/* Best: perfectly clear even without a comment. */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> units </span><span class="pun">=</span><span class="pln"> </span><span class="str">'μs'</span><span class="pun">;</span><span class="pln">

</span><span class="com">/* Allowed: but unnecessary as μ is a printable character. */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> units </span><span class="pun">=</span><span class="pln"> </span><span class="str">'\u03bcs'</span><span class="pun">;</span><span class="pln"> </span><span class="com">// 'μs'</span><span class="pln">

</span><span class="com">/* Good: use escapes for non-printable characters with a comment for clarity. */</span><span class="pln">
</span><span class="kwd">return</span><span class="pln"> </span><span class="str">'\ufeff'</span><span class="pln"> </span><span class="pun">+</span><span class="pln"> content</span><span class="pun">;</span><span class="pln">  </span><span class="com">// Prepend a byte order mark.</span></pre>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">/* Poor: the reader has no idea what character this is. */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> units </span><span class="pun">=</span><span class="pln"> </span><span class="str">'\u03bcs'</span><span class="pun">;</span></pre>

<p class="tip">Tip: Never make your code less readable simply out of fear that some programs
might not handle non-ASCII characters properly. If that happens, those programs
are <strong>broken</strong> and they must be <strong>fixed</strong>.</p>

<h2 id="source-file-structure" style="left: -46px; position: relative;">3 Source file structure<a href="#source-file-structure" alt="link to source-file-structure"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h2>

<p>All new source files should either be a <code>goog.module</code>
file (a file containing a <code>goog.module</code> call) or an ECMAScript (ES) module (uses
<code>import</code> and <code>export</code> statements).</p>

<p>Files consist of the following, <strong>in order</strong>:</p>

<ol>
<li>License or copyright information, if present</li>
<li><code>@fileoverview</code> JSDoc, if present</li>
<li><code>goog.module</code> statement, if a <code>goog.module</code> file</li>
<li>ES <code>import</code> statements, if an ES module</li>
<li><code>goog.require</code> and <code>goog.requireType</code> statements</li>
<li>The file’s implementation</li>
</ol>

<p><strong>Exactly one blank line</strong> separates each section that is present, except the
file's implementation, which may be preceded by 1 or 2 blank lines.</p>

<h3 id="file-copyright" style="left: -46px; position: relative;">3.1 License or copyright information, if present<a href="#file-copyright" alt="link to file-copyright"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>If license or copyright information belongs in a file, it belongs here.</p>

<h3 id="file-fileoverview" style="left: -46px; position: relative;">3.2 <code>@fileoverview</code> JSDoc, if present<a href="#file-fileoverview" alt="link to file-fileoverview"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>See <a href="#jsdoc-top-file-level-comments">7.5 Top/file-level comments</a> for formatting rules.</p>

<h3 id="file-goog-module" style="left: -46px; position: relative;">3.3 <code>goog.module</code> statement<a href="#file-goog-module" alt="link to file-goog-module"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>All <code>goog.module</code> files must declare exactly one <code>goog.module</code> name on a single
line: lines containing a <code>goog.module</code> declaration must not be wrapped, and are
therefore an exception to the 80-column limit.</p>

<p>The entire argument to <code>goog.module</code> is what defines a namespace. It is the
package name (an identifier that reflects the fragment of the directory
structure where the code lives) plus, optionally, the main class/enum/interface
that it defines concatenated to the end in <code>lowerCamelCase</code>.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pln">goog</span><span class="pun">.</span><span class="pln">module</span><span class="pun">(</span><span class="str">'search.urlHistory.urlHistoryService'</span><span class="pun">);</span></pre>

<h4 id="naming-hierarchy" style="left: -46px; position: relative;">3.3.1 Hierarchy<a href="#naming-hierarchy" alt="link to naming-hierarchy"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Module namespaces may never be named as a <em>direct</em> child of another module's
namespace.</p>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="pln">goog</span><span class="pun">.</span><span class="pln">module</span><span class="pun">(</span><span class="str">'foo.bar'</span><span class="pun">);</span><span class="pln">   </span><span class="com">// 'foo.bar.qux' would be fine, though</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">module</span><span class="pun">(</span><span class="str">'foo.bar.baz'</span><span class="pun">);</span></pre>

<p>The directory hierarchy reflects the namespace hierarchy, so that deeper-nested
children are subdirectories of higher-level parent directories. Note that this
implies that owners of “parent” namespace groups are necessarily aware of all
child namespaces, since they exist in the same directory.</p>

<h4 id="file-declare-legacy-namespace" style="left: -46px; position: relative;">3.3.2 <code>goog.module.declareLegacyNamespace</code><a href="#file-declare-legacy-namespace" alt="link to file-declare-legacy-namespace"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>The single <code>goog.module</code> statement may optionally be followed by a call to
<code>goog.module.declareLegacyNamespace();</code>. Avoid
<code>goog.module.declareLegacyNamespace()</code> when possible.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pln">goog</span><span class="pun">.</span><span class="pln">module</span><span class="pun">(</span><span class="str">'my.test.helpers'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">module</span><span class="pun">.</span><span class="pln">declareLegacyNamespace</span><span class="pun">();</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">setTestOnly</span><span class="pun">();</span></pre>

<p><code>goog.module.declareLegacyNamespace</code> exists to ease the transition from
traditional object hierarchy-based namespaces but comes with some naming
restrictions. As the child module name must be created after the parent
namespace, this name <strong>must not</strong> be a child or parent of any other
<code>goog.module</code> (for example, <code>goog.module('parent');</code> and
<code>goog.module('parent.child');</code> cannot both exist safely, nor can
<code>goog.module('parent');</code> and <code>goog.module('parent.child.grandchild');</code>).</p>

<h4 id="file-goog-module-exports" style="left: -46px; position: relative;">3.3.3 <code>goog.module</code> Exports<a href="#file-goog-module-exports" alt="link to file-goog-module-exports"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Classes, enums, functions, constants, and other symbols are exported using the
<code>exports</code> object. Exported symbols may be defined directly on the <code>exports</code>
object, or else declared locally and exported separately. Symbols are only
exported if they are meant to be used outside the module. Non-exported
module-local symbols are not declared <code>@private</code>. There is no prescribed
ordering for exported and module-local symbols.</p>

<p class="examples">Examples:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !Array&lt;number&gt; */</span><span class="pln"> exportedArray </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[</span><span class="lit">1</span><span class="pun">,</span><span class="pln"> </span><span class="lit">2</span><span class="pun">,</span><span class="pln"> </span><span class="lit">3</span><span class="pun">];</span><span class="pln">

</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !Array&lt;number&gt; */</span><span class="pln"> moduleLocalArray </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[</span><span class="lit">4</span><span class="pun">,</span><span class="pln"> </span><span class="lit">5</span><span class="pun">,</span><span class="pln"> </span><span class="lit">6</span><span class="pun">];</span><span class="pln">

</span><span class="com">/** @return {number} */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> moduleLocalFunction</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">return</span><span class="pln"> moduleLocalArray</span><span class="pun">.</span><span class="pln">length</span><span class="pun">;</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">/** @return {number} */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> exportedFunction</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">return</span><span class="pln"> moduleLocalFunction</span><span class="pun">()</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> </span><span class="lit">2</span><span class="pun">;</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

exports </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">exportedArray</span><span class="pun">,</span><span class="pln"> exportedFunction</span><span class="pun">};</span></pre>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @const {number} */</span><span class="pln">
exports</span><span class="pun">.</span><span class="pln">CONSTANT_ONE </span><span class="pun">=</span><span class="pln"> </span><span class="lit">1</span><span class="pun">;</span><span class="pln">

</span><span class="com">/** @const {string} */</span><span class="pln">
exports</span><span class="pun">.</span><span class="pln">CONSTANT_TWO </span><span class="pun">=</span><span class="pln"> </span><span class="str">'Another constant'</span><span class="pun">;</span></pre>

<p>Do not annotate the <code>exports</code> object as <code>@const</code> as it is already treated as a
constant by the compiler.</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">/** @const */</span><span class="pln">
exports </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">exportedFunction</span><span class="pun">};</span></pre>

<p>Do not use default exports as they don't translate easily to ES module
semantics.</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="pln">exports </span><span class="pun">=</span><span class="pln"> </span><span class="typ">FancyClass</span><span class="pun">;</span></pre>

<p><span id="file-es6-modules"></span></p>

<h3 id="file-es-modules" style="left: -46px; position: relative;">3.4 ES modules<a href="#file-es-modules" alt="link to file-es-modules"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>ES modules are files that use the <code>import</code> and <code>export</code> keywords.</p>

<p><span id="es6-module-imports"></span></p>

<h4 id="es-module-imports" style="left: -46px; position: relative;">3.4.1 Imports<a href="#es-module-imports" alt="link to es-module-imports"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Import statements must not be line wrapped and are therefore an exception to the
80-column limit.</p>

<p><span id="es6-import-paths"></span></p>

<h5 id="esm-import-paths">3.4.1.1 Import paths</h5>

<p>ES module files must use the <code>import</code> statement to import other ES module
files. Do not <code>goog.require</code> another ES module.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">import</span><span class="pln"> </span><span class="str">'./sideeffects.js'</span><span class="pun">;</span><span class="pln">

</span><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as goog </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'../closure/goog/goog.js'</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as parent </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'../parent.js'</span><span class="pun">;</span><span class="pln">

</span><span class="kwd">import</span><span class="pln"> </span><span class="pun">{</span><span class="pln">name</span><span class="pun">}</span><span class="pln"> </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./sibling.js'</span><span class="pun">;</span></pre>

<p><span id="es6-import-paths-file-extension"></span></p>

<h6 id="esm-import-paths-file-extension">3.4.1.1.1 File extensions in import paths</h6>

<p>The <code>.js</code> file extension is not optional in import paths and must always be
included.</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">import</span><span class="pln"> </span><span class="str">'../directory/file'</span><span class="pun">;</span></pre>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">import</span><span class="pln"> </span><span class="str">'../directory/file.js'</span><span class="pun">;</span></pre>

<h5 id="importing-the-same-file-multiple-times">3.4.1.2 Importing the same file multiple times</h5>

<p>Do not import the same file multiple times. This can make it hard to determine
the aggregate imports of a file.</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// Imports have the same path, but since it doesn't align it can be hard to see.</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> </span><span class="pun">{</span><span class="kwd">short</span><span class="pun">}</span><span class="pln"> </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./long/path/to/a/file.js'</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> </span><span class="pun">{</span><span class="pln">aLongNameThatBreaksAlignment</span><span class="pun">}</span><span class="pln"> </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./long/path/to/a/file.js'</span><span class="pun">;</span></pre>

<p><span id="naming-es6-imports"></span></p>

<h5 id="naming-esm-imports">3.4.1.3 Naming imports</h5>

<h6 id="naming-module-imports">3.4.1.3.1 Naming module imports</h6>

<p>Module import names (<code>import * as name</code>) are <code>lowerCamelCase</code> names that are
derived from the imported file name.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as fileOne </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'../file-one.js'</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as fileTwo </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'../file_two.js'</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as fileThree </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'../filethree.js'</span><span class="pun">;</span></pre>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as libString </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./lib/string.js'</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as math </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./math/math.js'</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as vectorMath </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./vector/math.js'</span><span class="pun">;</span></pre>

<p>Some libraries might commonly use a namespace import prefix that violates this
naming scheme, but overbearingly common open source use makes the violating
style more readable. The only library that currently falls under this exception
is <a href="https://threejs.org/">threejs</a>, using the <code>THREE</code> prefix.</p>

<h6 id="naming-default-imports">3.4.1.3.2 Naming default imports</h6>

<p>Default import names are derived from the imported file name and follow the
rules in <a href="#naming-rules-by-identifier-type">6.2 Rules by identifier type</a>.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">import</span><span class="pln"> </span><span class="typ">MyClass</span><span class="pln"> </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'../my-class.js'</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> myFunction </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'../my_function.js'</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> SOME_CONSTANT </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'../someconstant.js'</span><span class="pun">;</span></pre>

<p class="note">Note: In general this should not happen as default exports are banned by this
style guide, see <a href="#named-vs-default-exports">3.4.2.1 Named vs default exports</a>. Default imports are only used
to import modules that do not conform to this style guide.</p>

<h6 id="naming-named-imports">3.4.1.3.3 Naming named imports</h6>

<p>In general symbols imported via the named import (<code>import {name}</code>) should keep
the same name. Avoid aliasing imports (<code>import {SomeThing as SomeOtherThing}</code>).
Prefer fixing name collisions by using a module import (<code>import *</code>) or renaming
the exports themselves.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as bigAnimals </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./biganimals.js'</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as domesticatedAnimals </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./domesticatedanimals.js'</span><span class="pun">;</span><span class="pln">

</span><span class="kwd">new</span><span class="pln"> bigAnimals</span><span class="pun">.</span><span class="typ">Cat</span><span class="pun">();</span><span class="pln">
</span><span class="kwd">new</span><span class="pln"> domesticatedAnimals</span><span class="pun">.</span><span class="typ">Cat</span><span class="pun">();</span></pre>

<p>If renaming a named import is needed then use components of the imported
module's file name or path in the resulting alias.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">import</span><span class="pln"> </span><span class="pun">{</span><span class="typ">Cat</span><span class="pln"> as </span><span class="typ">BigCat</span><span class="pun">}</span><span class="pln"> </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./biganimals.js'</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> </span><span class="pun">{</span><span class="typ">Cat</span><span class="pln"> as </span><span class="typ">DomesticatedCat</span><span class="pun">}</span><span class="pln"> </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./domesticatedanimals.js'</span><span class="pun">;</span><span class="pln">

</span><span class="kwd">new</span><span class="pln"> </span><span class="typ">BigCat</span><span class="pun">();</span><span class="pln">
</span><span class="kwd">new</span><span class="pln"> </span><span class="typ">DomesticatedCat</span><span class="pun">();</span></pre>

<p><span id="es6-module-exports"></span></p>

<h4 id="es-module-exports" style="left: -46px; position: relative;">3.4.2 Exports<a href="#es-module-exports" alt="link to es-module-exports"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Symbols are only exported if they are meant to be used outside the module.
Non-exported module-local symbols are not declared <code>@private</code>. There is no
prescribed ordering for exported and module-local symbols.</p>

<h5 id="named-vs-default-exports">3.4.2.1 Named vs default exports</h5>

<p>Use named exports in all code. You can apply the <code>export</code> keyword to a
declaration, or use the <code>export {name};</code> syntax.</p>

<p>Do not use default exports. Importing modules must give a name to these values,
which can lead to inconsistencies in naming across modules.</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// Do not use default exports:</span><span class="pln">
</span><span class="kwd">export</span><span class="pln"> </span><span class="kwd">default</span><span class="pln"> </span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Foo</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="pun">...</span><span class="pln"> </span><span class="pun">}</span><span class="pln"> </span><span class="com">// BAD!</span></pre>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">// Use named exports:</span><span class="pln">
</span><span class="kwd">export</span><span class="pln"> </span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Foo</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="pun">...</span><span class="pln"> </span><span class="pun">}</span></pre>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">// Alternate style named exports:</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Foo</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="pun">...</span><span class="pln"> </span><span class="pun">}</span><span class="pln">

</span><span class="kwd">export</span><span class="pln"> </span><span class="pun">{</span><span class="typ">Foo</span><span class="pun">};</span></pre>

<p><span id="es6-exports-mutability"></span></p>

<h5 id="esm-exports-mutability">3.4.2.2 Mutability of exports</h5>

<p>Exported variables must not be mutated outside of module initialization.</p>

<p>There are alternatives if mutation is needed, including exporting a constant
reference to an object that has mutable fields or exporting accessor functions for
mutable data.</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// Bad: both foo and mutateFoo are exported and mutated.</span><span class="pln">
</span><span class="kwd">export</span><span class="pln"> </span><span class="kwd">let</span><span class="pln"> </span><span class="com">/** number */</span><span class="pln"> foo </span><span class="pun">=</span><span class="pln"> </span><span class="lit">0</span><span class="pun">;</span><span class="pln">

</span><span class="com">/**
 * Mutates foo.
 */</span><span class="pln">
</span><span class="kwd">export</span><span class="pln"> </span><span class="kwd">function</span><span class="pln"> mutateFoo</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="pun">++</span><span class="pln">foo</span><span class="pun">;</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">/**
 * @param {function(number): number} newMutateFoo
 */</span><span class="pln">
</span><span class="kwd">export</span><span class="pln"> </span><span class="kwd">function</span><span class="pln"> setMutateFoo</span><span class="pun">(</span><span class="pln">newMutateFoo</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// Exported classes and functions can be mutated!</span><span class="pln">
  mutateFoo </span><span class="pun">=</span><span class="pln"> </span><span class="pun">()</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    foo </span><span class="pun">=</span><span class="pln"> newMutateFoo</span><span class="pun">(</span><span class="pln">foo</span><span class="pun">);</span><span class="pln">
  </span><span class="pun">};</span><span class="pln">
</span><span class="pun">}</span></pre>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">// Good: Rather than export the mutable variables foo and mutateFoo directly,</span><span class="pln">
</span><span class="com">// instead make them module scoped and export a getter for foo and a wrapper for</span><span class="pln">
</span><span class="com">// mutateFooFunc.</span><span class="pln">
</span><span class="kwd">let</span><span class="pln"> </span><span class="com">/** number */</span><span class="pln"> foo </span><span class="pun">=</span><span class="pln"> </span><span class="lit">0</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">let</span><span class="pln"> </span><span class="com">/** function(number): number */</span><span class="pln"> mutateFooFunc </span><span class="pun">=</span><span class="pln"> </span><span class="pun">(</span><span class="pln">foo</span><span class="pun">)</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> foo </span><span class="pun">+</span><span class="pln"> </span><span class="lit">1</span><span class="pun">;</span><span class="pln">

</span><span class="com">/** @return {number} */</span><span class="pln">
</span><span class="kwd">export</span><span class="pln"> </span><span class="kwd">function</span><span class="pln"> getFoo</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">return</span><span class="pln"> foo</span><span class="pun">;</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="kwd">export</span><span class="pln"> </span><span class="kwd">function</span><span class="pln"> mutateFoo</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  foo </span><span class="pun">=</span><span class="pln"> mutateFooFunc</span><span class="pun">(</span><span class="pln">foo</span><span class="pun">);</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">/** @param {function(number): number} mutateFoo */</span><span class="pln">
</span><span class="kwd">export</span><span class="pln"> </span><span class="kwd">function</span><span class="pln"> setMutateFoo</span><span class="pun">(</span><span class="pln">mutateFoo</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  mutateFooFunc </span><span class="pun">=</span><span class="pln"> mutateFoo</span><span class="pun">;</span><span class="pln">
</span><span class="pun">}</span></pre>

<p><span id="es6-module-circular-dependencies"></span></p>

<h5 id="es-module-export-from">3.4.2.3 export from</h5>

<p><code>export from</code> statements must not be line wrapped and are therefore an
exception to the 80-column limit. This applies to both <code>export from</code> flavors.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">export</span><span class="pln"> </span><span class="pun">{</span><span class="pln">specificName</span><span class="pun">}</span><span class="pln"> </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./other.js'</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">export</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./another.js'</span><span class="pun">;</span></pre>

<h4 id="es-module-circular-dependencies" style="left: -46px; position: relative;">3.4.3 Circular Dependencies in ES modules<a href="#es-module-circular-dependencies" alt="link to es-module-circular-dependencies"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Do not create cycles between ES modules, even though the ECMAScript
specification allows this. Note that it is possible to create cycles with both
the <code>import</code> and <code>export</code> statements.</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// a.js</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> </span><span class="str">'./b.js'</span><span class="pun">;</span></pre>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// b.js</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> </span><span class="str">'./a.js'</span><span class="pun">;</span><span class="pln">

</span><span class="com">// `export from` can cause circular dependencies too!</span><span class="pln">
</span><span class="kwd">export</span><span class="pln"> </span><span class="pun">{</span><span class="pln">x</span><span class="pun">}</span><span class="pln"> </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./c.js'</span><span class="pun">;</span></pre>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// c.js</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> </span><span class="str">'./b.js'</span><span class="pun">;</span><span class="pln">

</span><span class="kwd">export</span><span class="pln"> </span><span class="kwd">let</span><span class="pln"> x</span><span class="pun">;</span></pre>

<p><span id="es6-module-closure-interop"></span></p>

<h4 id="es-module-closure-interop" style="left: -46px; position: relative;">3.4.4 Interoperating with Closure<a href="#es-module-closure-interop" alt="link to es-module-closure-interop"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p><span id="es6-module-referencing-goog"></span></p>

<h5 id="es-module-referencing-goog">3.4.4.1 Referencing goog</h5>

<p>To reference the Closure <code>goog</code> namespace, import Closure's <code>goog.js</code>.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as goog </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'../closure/goog/goog.js'</span><span class="pun">;</span><span class="pln">

</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="pln">compute</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'a.name'</span><span class="pun">);</span><span class="pln">

</span><span class="kwd">export</span><span class="pln"> </span><span class="kwd">const</span><span class="pln"> CONSTANT </span><span class="pun">=</span><span class="pln"> compute</span><span class="pun">();</span></pre>

<p><code>goog.js</code> exports only a subset of properties from the global <code>goog</code> that can be
used in ES modules.</p>

<p><span id="goog-require-in-es6-module"></span></p>

<h5 id="goog-require-in-es-module">3.4.4.2 goog.require in ES modules</h5>

<p><code>goog.require</code> in ES modules works as it does in <code>goog.module</code> files. You can
require any Closure namespace symbol (i.e., symbols created by <code>goog.provide</code> or
<code>goog.module</code>) and <code>goog.require</code> will return the value.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as goog </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'../closure/goog/goog.js'</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as anEsModule </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'./anEsModule.js'</span><span class="pun">;</span><span class="pln">

</span><span class="kwd">const</span><span class="pln"> </span><span class="typ">GoogPromise</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'goog.Promise'</span><span class="pun">);</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> myNamespace </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'my.namespace'</span><span class="pun">);</span></pre>

<p><span id="closure-module-id-in-es6-module"></span></p>

<h5 id="closure-module-id-in-es-module">3.4.4.3 Declaring Closure Module IDs in ES modules</h5>

<p><code>goog.declareModuleId</code> can be used within ES modules to declare a
<code>goog.module</code>-like module ID. This means that this module ID can be
<code>goog.require</code>d, <code>goog.module.get</code>d etc. as if it were
a <code>goog.module</code> that did not call <code>goog.module.declareLegacyNamespace</code>. It does
not create the module ID as a globally available JavaScript symbol.</p>

<p>A <code>goog.require</code> (or <code>goog.module.get</code>) for a module ID from
<code>goog.declareModuleId</code> will always return the module object (as if it was
<code>import *</code>'d). As a result, the argument to <code>goog.declareModuleId</code> should always
end with a <code>lowerCamelCaseName</code>.</p>

<p class="note">Note: It is an error to call <code>goog.module.declareLegacyNamespace</code> in an ES
module, it can only be called from <code>goog.module</code> files. There is no direct way
to associate a <q>legacy</q> namespace with an ES module.</p>

<p><code>goog.declareModuleId</code> should only be used to upgrade Closure files to ES
modules in place, where named exports are used.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">import</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> as goog </span><span class="kwd">from</span><span class="pln"> </span><span class="str">'../closure/goog.js'</span><span class="pun">;</span><span class="pln">

goog</span><span class="pun">.</span><span class="pln">declareModuleId</span><span class="pun">(</span><span class="str">'my.esm'</span><span class="pun">);</span><span class="pln">

</span><span class="kwd">export</span><span class="pln"> </span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Class</span><span class="pln"> </span><span class="pun">{};</span></pre>

<h3 id="file-set-test-only" style="left: -46px; position: relative;">3.5 <code>goog.setTestOnly</code><a href="#file-set-test-only" alt="link to file-set-test-only"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>In a <code>goog.module</code> file the <code>goog.module</code> statement and, if present,
<code>goog.module.declareLegacyNamespace()</code> statement may optionally be followed by a
call to <code>goog.setTestOnly()</code>.</p>

<p>In an ES module the <code>import</code> statements may optionally be
followed by a call to <code>goog.setTestOnly()</code>.</p>

<h3 id="file-goog-require" style="left: -46px; position: relative;">3.6 <code>goog.require</code> and <code>goog.requireType</code> statements<a href="#file-goog-require" alt="link to file-goog-require"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Imports are done with <code>goog.require</code> and <code>goog.requireType</code> statements. The
names imported by a <code>goog.require</code> statement may be used both in code and in
type annotations, while those imported by a <code>goog.requireType</code> may be used in
type annotations only.</p>

<p>The <code>goog.require</code> and <code>goog.requireType</code> statements form a contiguous block
with no empty lines. This block follows the <code>goog.module</code> declaration separated
<a href="#source-file-structure">by a single empty line</a>. The entire argument to
<code>goog.require</code> or <code>goog.requireType</code> is a namespace defined by a <code>goog.module</code>
in a separate file. <code>goog.require</code> and <code>goog.requireType</code> statements may not
appear anywhere else in the file.</p>

<p>Each <code>goog.require</code> or <code>goog.requireType</code> is assigned to a single constant
alias, or else destructured into several constant aliases. These aliases are the
only acceptable way to refer to dependencies in type annotations or code. Fully
qualified namespaces must not be used anywhere, except as an argument to
<code>goog.require</code> or <code>goog.requireType</code>.</p>

<p class="exception"><strong>Exception</strong>: Types, variables, and functions declared in externs files have to
use their fully qualified name in type annotations and code.</p>

<p>When <code>goog.require</code> is assigned to a single constant alias, it must match the
final dot-separated component of the imported module's namespace.</p>

<p class="exception"><strong>Exception</strong>: In certain cases, additional components of the namespace can be
used to form a longer alias. The resulting alias must retain the original
identifier's casing such that it still correctly identifies its type. Longer
aliases may be used to disambiguate otherwise identical aliases, or if it
significantly improves readability. In addition, a longer alias must be used to
prevent masking native types such as <code>Element</code>, <code>Event</code>, <code>Error</code>, <code>Map</code>, and
<code>Promise</code> (for a more complete list, see <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects">Standard Built-in Objects</a> and
<a href="https://developer.mozilla.org/en-US/docs/Web/API">Web APIs</a> at MDN).</p>
When renaming destructured aliases, a space must follow the colon
as required in <a href="#formatting-horizontal-whitespace">4.6.2 Horizontal whitespace</a>.<p></p>

<p>A file should not contain both a <code>goog.require</code> and a <code>goog.requireType</code>
statement for the same namespace. If the imported name is used both in code and
in type annotations, it should be imported by a single <code>goog.require</code> statement.</p>

<p>If a module is imported only for its side effects, the call must be a
<code>goog.require</code> (not a <code>goog.requireType</code>) and assignment may be omitted. A
comment is required to explain why this is needed and suppress a compiler
warning.</p>



<p>The lines are sorted according to the following rules: All requires with a name
on the left hand side come first, sorted alphabetically by those names. Then
destructuring requires, again sorted by the names on the left hand side.
Finally, any require calls that are standalone (generally these are for modules
imported just for their side effects).</p>

<p class="tip">Tip: There’s no need to memorize this order and enforce it manually. You can
rely on your IDE to report requires
that are not sorted correctly.</p>

<p>If a long alias or module name would cause a line to exceed the 80-column limit,
it <strong>must not</strong> be wrapped: require lines are an exception to the 80-column
limit.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">// Standard alias style.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> asserts </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'goog.asserts'</span><span class="pun">);</span><span class="pln">
</span><span class="com">// Namespace-based alias used to disambiguate.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> testingAsserts </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'goog.testing.asserts'</span><span class="pun">);</span><span class="pln">
</span><span class="com">// Standard destructuring into aliases.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="typ">MyClass</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'some.package'</span><span class="pun">);</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="typ">MyType</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">requireType</span><span class="pun">(</span><span class="str">'other.package'</span><span class="pun">);</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="pln">clear</span><span class="pun">,</span><span class="pln"> clone</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'goog.array'</span><span class="pun">);</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="typ">Rgb</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'goog.color'</span><span class="pun">);</span><span class="pln">
</span><span class="com">// Namespace-based destructuring into aliases used to disambiguate.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="typ">MyClass</span><span class="pun">:</span><span class="pln"> </span><span class="typ">NsMyClass</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'other.ns'</span><span class="pun">);</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="typ">SomeType</span><span class="pun">:</span><span class="pln"> </span><span class="typ">FooSomeType</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">requireType</span><span class="pun">(</span><span class="str">'foo.types'</span><span class="pun">);</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="pln">clear</span><span class="pun">:</span><span class="pln"> objectClear</span><span class="pun">,</span><span class="pln"> clone</span><span class="pun">:</span><span class="pln"> objectClone</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'goog.object'</span><span class="pun">);</span><span class="pln">
</span><span class="com">// Namespace-based destructuring into aliases used to prevent masking native type.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="typ">Element</span><span class="pun">:</span><span class="pln"> </span><span class="typ">RendererElement</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'web.renderer'</span><span class="pun">);</span><span class="pln">
</span><span class="com">// Out of sequence namespace-based aliases used to improve readability.</span><span class="pln">
</span><span class="com">// Also, require lines longer than 80 columns must not be wrapped.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="typ">SomeDataStructure</span><span class="pun">:</span><span class="pln"> </span><span class="typ">SomeDataStructureModel</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">requireType</span><span class="pun">(</span><span class="str">'identical.package.identifiers.models'</span><span class="pun">);</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="typ">SomeDataStructure</span><span class="pun">:</span><span class="pln"> </span><span class="typ">SomeDataStructureProto</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'proto.identical.package.identifiers'</span><span class="pun">);</span><span class="pln">
</span><span class="com">// goog.require without an alias in order to trigger side effects.</span><span class="pln">
</span><span class="com">/** @suppress {extraRequire} Initializes MyFramework. */</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'my.framework.initialization'</span><span class="pun">);</span></pre>

<p class="discouraged">Discouraged:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// Some legacy code uses a "default export" style to export a single class, enum,</span><span class="pln">
</span><span class="com">// record type, etc. Do not use this pattern in new JS.</span><span class="pln">
</span><span class="com">// When using a "default export", prefer destructuring into aliases.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="typ">MyClass</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'some.package.MyClass'</span><span class="pun">);</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="typ">MyType</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">requireType</span><span class="pun">(</span><span class="str">'some.package.MyType'</span><span class="pun">);</span></pre>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// If necessary to disambiguate, prefer PackageClass over SomeClass as it is</span><span class="pln">
</span><span class="com">// closer to the format of the module name.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="typ">SomeClass</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'some.package.Class'</span><span class="pun">);</span></pre>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// Extra terms must come from the namespace.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="typ">MyClassForBizzing</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'some.package.MyClass'</span><span class="pun">);</span><span class="pln">
</span><span class="com">// Alias must include the entire final namespace component.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="typ">MyClass</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'some.package.MyClassForBizzing'</span><span class="pun">);</span><span class="pln">
</span><span class="com">// Alias must not mask native type (should be `const JspbMap` here).</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="typ">Map</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'jspb.Map'</span><span class="pun">);</span><span class="pln">
</span><span class="com">// Don't break goog.require lines over 80 columns.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="typ">SomeDataStructure</span><span class="pln"> </span><span class="pun">=</span><span class="pln">
    goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'proto.identical.package.identifiers.SomeDataStructure'</span><span class="pun">);</span><span class="pln">
</span><span class="com">// Alias must be based on the namespace.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> randomName </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'something.else'</span><span class="pun">);</span><span class="pln">
</span><span class="com">// Missing a space after the colon.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="typ">Foo</span><span class="pun">:</span><span class="typ">FooProto</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'some.package.proto.Foo'</span><span class="pun">);</span><span class="pln">
</span><span class="com">// goog.requireType without an alias.</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">requireType</span><span class="pun">(</span><span class="str">'some.package.with.a.Type'</span><span class="pun">);</span><span class="pln">


</span><span class="com">/**
 * @param {!some.unimported.Dependency} param All external types used in JSDoc
 *     annotations must be goog.require'd, unless declared in externs.
 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> someFunction</span><span class="pun">(</span><span class="pln">param</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// goog.require lines must be at the top level before any other code.</span><span class="pln">
  </span><span class="kwd">const</span><span class="pln"> alias </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'my.long.name.alias'</span><span class="pun">);</span><span class="pln">
  </span><span class="com">// ...</span><span class="pln">
</span><span class="pun">}</span></pre>

<h3 id="file-implementation" style="left: -46px; position: relative;">3.7 The file’s implementation<a href="#file-implementation" alt="link to file-implementation"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>The actual implementation follows after all dependency information is declared
(separated by at least one blank line).</p>

<p>This may consist of any module-local declarations (constants, variables,
classes, functions, etc), as well as any exported symbols.</p>

<h2 id="formatting" style="left: -46px; position: relative;">4 Formatting<a href="#formatting" alt="link to formatting"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h2>

<p><strong>Terminology Note</strong>: <em>block-like construct</em> refers to the body of a class,
function, method, or brace-delimited block of code. Note that, by
<a href="#features-array-literals">5.2 Array literals</a> and <a href="#features-object-literals">5.3 Object literals</a>, any array or
object literal may optionally be treated as if it were a block-like construct.</p>

<p class="tip">Tip: Use <code>clang-format</code>. The JavaScript community has invested effort to make
sure clang-format <q>does the right thing</q> on JavaScript files. <code>clang-format</code> has
integration with several popular editors.</p>

<h3 id="formatting-braces" style="left: -46px; position: relative;">4.1 Braces<a href="#formatting-braces" alt="link to formatting-braces"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="formatting-braces-all" style="left: -46px; position: relative;">4.1.1 Braces are used for all control structures<a href="#formatting-braces-all" alt="link to formatting-braces-all"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Braces are required for all control structures (i.e. <code>if</code>, <code>else</code>, <code>for</code>, <code>do</code>,
<code>while</code>, as well as any others), even if the body contains only a single
statement. The first statement of a non-empty block must begin on its own line.</p>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">if</span><span class="pln"> </span><span class="pun">(</span><span class="pln">someVeryLongCondition</span><span class="pun">())</span><span class="pln">
  doSomething</span><span class="pun">();</span><span class="pln">

</span><span class="kwd">for</span><span class="pln"> </span><span class="pun">(</span><span class="kwd">let</span><span class="pln"> i </span><span class="pun">=</span><span class="pln"> </span><span class="lit">0</span><span class="pun">;</span><span class="pln"> i </span><span class="pun">&lt;</span><span class="pln"> foo</span><span class="pun">.</span><span class="pln">length</span><span class="pun">;</span><span class="pln"> i</span><span class="pun">++)</span><span class="pln"> bar</span><span class="pun">(</span><span class="pln">foo</span><span class="pun">[</span><span class="pln">i</span><span class="pun">]);</span></pre>

<p class="exception"><strong>Exception</strong>: A simple if statement that can fit entirely on a single line with
no wrapping (and that doesn’t have an else) may be kept on a single line with no
braces when it improves readability. This is the only case in which a control
structure may omit braces and newlines.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">if</span><span class="pln"> </span><span class="pun">(</span><span class="pln">shortCondition</span><span class="pun">())</span><span class="pln"> foo</span><span class="pun">();</span></pre>

<h4 id="formatting-nonempty-blocks" style="left: -46px; position: relative;">4.1.2 Nonempty blocks: K&amp;R style<a href="#formatting-nonempty-blocks" alt="link to formatting-nonempty-blocks"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Braces follow the Kernighan and Ritchie style (<q><a href="https://blog.codinghorror.com/new-programming-jargon/#3">Egyptian brackets</a></q>) for
<em>nonempty</em> blocks and block-like constructs:</p>

<ul>
<li>No line break before the opening brace.</li>
<li>Line break after the opening brace.</li>
<li>Line break before the closing brace.</li>
<li>Line break after the closing brace <em>if</em> that brace terminates a statement or
the body of a function or class statement, or a class method. Specifically,
there is <em>no</em> line break after the brace if it is followed by <code>else</code>,
<code>catch</code>, <code>while</code>, or a comma, semicolon, or right-parenthesis.</li>
</ul>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">class</span><span class="pln"> </span><span class="typ">InnerClass</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">constructor</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{}</span><span class="pln">

  </span><span class="com">/** @param {number} foo */</span><span class="pln">
  method</span><span class="pun">(</span><span class="pln">foo</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="kwd">if</span><span class="pln"> </span><span class="pun">(</span><span class="pln">condition</span><span class="pun">(</span><span class="pln">foo</span><span class="pun">))</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
      </span><span class="kwd">try</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
        </span><span class="com">// Note: this might fail.</span><span class="pln">
        something</span><span class="pun">();</span><span class="pln">
      </span><span class="pun">}</span><span class="pln"> </span><span class="kwd">catch</span><span class="pln"> </span><span class="pun">(</span><span class="pln">err</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
        recover</span><span class="pun">();</span><span class="pln">
      </span><span class="pun">}</span><span class="pln">
    </span><span class="pun">}</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">}</span></pre>

<h4 id="formatting-empty-blocks" style="left: -46px; position: relative;">4.1.3 Empty blocks: may be concise<a href="#formatting-empty-blocks" alt="link to formatting-empty-blocks"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>An empty block or block-like construct <em>may</em> be closed immediately after it is
opened, with no characters, space, or line break in between (i.e. <code>{}</code>),
<strong>unless</strong> it is a part of a <em>multi-block statement</em> (one that directly contains
multiple blocks: <code>if</code>/<code>else</code> or <code>try</code>/<code>catch</code>/<code>finally</code>).</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">function</span><span class="pln"> doNothing</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{}</span></pre>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">if</span><span class="pln"> </span><span class="pun">(</span><span class="pln">condition</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// …</span><span class="pln">
</span><span class="pun">}</span><span class="pln"> </span><span class="kwd">else</span><span class="pln"> </span><span class="kwd">if</span><span class="pln"> </span><span class="pun">(</span><span class="pln">otherCondition</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{}</span><span class="pln"> </span><span class="kwd">else</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// …</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="kwd">try</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// …</span><span class="pln">
</span><span class="pun">}</span><span class="pln"> </span><span class="kwd">catch</span><span class="pln"> </span><span class="pun">(</span><span class="pln">e</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{}</span></pre>

<h3 id="formatting-block-indentation" style="left: -46px; position: relative;">4.2 Block indentation: +2 spaces<a href="#formatting-block-indentation" alt="link to formatting-block-indentation"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Each time a new block or block-like construct is opened, the indent increases by
two spaces. When the block ends, the indent returns to the previous indent
level. The indent level applies to both code and comments throughout the block.
(See the example in <a href="#formatting-nonempty-blocks">4.1.2 Nonempty blocks: K&amp;R style</a>).</p>

<h4 id="formatting-array-literals" style="left: -46px; position: relative;">4.2.1 Array literals: optionally <q>block-like</q><a href="#formatting-array-literals" alt="link to formatting-array-literals"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Any array literal may optionally be formatted as if it were a “block-like
construct.” For example, the following are all valid (<strong>not</strong> an exhaustive
list):</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> a </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[</span><span class="pln">
  </span><span class="lit">0</span><span class="pun">,</span><span class="pln">
  </span><span class="lit">1</span><span class="pun">,</span><span class="pln">
  </span><span class="lit">2</span><span class="pun">,</span><span class="pln">
</span><span class="pun">];</span><span class="pln">

</span><span class="kwd">const</span><span class="pln"> b </span><span class="pun">=</span><span class="pln">
    </span><span class="pun">[</span><span class="lit">0</span><span class="pun">,</span><span class="pln"> </span><span class="lit">1</span><span class="pun">,</span><span class="pln"> </span><span class="lit">2</span><span class="pun">];</span><span class="pln">
</span></pre>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> c </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[</span><span class="lit">0</span><span class="pun">,</span><span class="pln"> </span><span class="lit">1</span><span class="pun">,</span><span class="pln"> </span><span class="lit">2</span><span class="pun">];</span><span class="pln">

someMethod</span><span class="pun">(</span><span class="pln">foo</span><span class="pun">,</span><span class="pln"> </span><span class="pun">[</span><span class="pln">
  </span><span class="lit">0</span><span class="pun">,</span><span class="pln"> </span><span class="lit">1</span><span class="pun">,</span><span class="pln"> </span><span class="lit">2</span><span class="pun">,</span><span class="pln">
</span><span class="pun">],</span><span class="pln"> bar</span><span class="pun">);</span></pre>

<p>Other combinations are allowed, particularly when emphasizing semantic groupings
between elements, but should not be used only to reduce the vertical size of
larger arrays.</p>

<h4 id="formatting-object-literals" style="left: -46px; position: relative;">4.2.2 Object literals: optionally <q>block-like</q><a href="#formatting-object-literals" alt="link to formatting-object-literals"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Any object literal may optionally be formatted as if it were a “block-like
construct.” The same examples apply as <a href="#formatting-array-literals">4.2.1 Array literals: optionally block-like</a>. For
example, the following are all valid (<strong>not</strong> an exhaustive list):</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> a </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  a</span><span class="pun">:</span><span class="pln"> </span><span class="lit">0</span><span class="pun">,</span><span class="pln">
  b</span><span class="pun">:</span><span class="pln"> </span><span class="lit">1</span><span class="pun">,</span><span class="pln">
</span><span class="pun">};</span><span class="pln">

</span><span class="kwd">const</span><span class="pln"> b </span><span class="pun">=</span><span class="pln">
    </span><span class="pun">{</span><span class="pln">a</span><span class="pun">:</span><span class="pln"> </span><span class="lit">0</span><span class="pun">,</span><span class="pln"> b</span><span class="pun">:</span><span class="pln"> </span><span class="lit">1</span><span class="pun">};</span></pre>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> c </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">a</span><span class="pun">:</span><span class="pln"> </span><span class="lit">0</span><span class="pun">,</span><span class="pln"> b</span><span class="pun">:</span><span class="pln"> </span><span class="lit">1</span><span class="pun">};</span><span class="pln">

someMethod</span><span class="pun">(</span><span class="pln">foo</span><span class="pun">,</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  a</span><span class="pun">:</span><span class="pln"> </span><span class="lit">0</span><span class="pun">,</span><span class="pln"> b</span><span class="pun">:</span><span class="pln"> </span><span class="lit">1</span><span class="pun">,</span><span class="pln">
</span><span class="pun">},</span><span class="pln"> bar</span><span class="pun">);</span></pre>

<h4 id="formatting-class-literals" style="left: -46px; position: relative;">4.2.3 Class literals<a href="#formatting-class-literals" alt="link to formatting-class-literals"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Class literals (whether declarations or expressions) are indented as blocks. Do
not add semicolons after methods, or after the closing brace of a class
<em>declaration</em> (statements—such as assignments—that contain class <em>expressions</em>
are still terminated with a semicolon). For inheritance, the <code>extends</code> keyword
is sufficient unless the superclass is templatized. Subclasses of templatized
types must explicitly specify the template type in an <code>@extends</code> JSDoc
annotation, even if it is just passing along the same template name.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @template T */</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Foo</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/** @param {T} x */</span><span class="pln">
  </span><span class="kwd">constructor</span><span class="pun">(</span><span class="pln">x</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="com">/** @type {T} */</span><span class="pln">
    </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">x </span><span class="pun">=</span><span class="pln"> x</span><span class="pun">;</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">/** @extends {Foo&lt;number&gt;} */</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Bar</span><span class="pln"> extends </span><span class="typ">Foo</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">constructor</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    super</span><span class="pun">(</span><span class="lit">42</span><span class="pun">);</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

exports</span><span class="pun">.</span><span class="typ">Baz</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">class</span><span class="pln"> extends </span><span class="typ">Bar</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/** @return {number} */</span><span class="pln">
  method</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="kwd">return</span><span class="pln"> </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">x</span><span class="pun">;</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">};</span></pre>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">/** @extends {Bar} */</span><span class="pln"> </span><span class="com">// &lt;-- unnecessary @extends</span><span class="pln">
exports</span><span class="pun">.</span><span class="typ">Baz</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">class</span><span class="pln"> extends </span><span class="typ">Bar</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/** @return {number} */</span><span class="pln">
  method</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="kwd">return</span><span class="pln"> </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">x</span><span class="pun">;</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">};</span></pre>

<h4 id="formatting-function-expressions" style="left: -46px; position: relative;">4.2.4 Function expressions<a href="#formatting-function-expressions" alt="link to formatting-function-expressions"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>When declaring an anonymous function in the list of arguments for a function
call, the body of the function is indented two spaces more than the preceding
indentation depth.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pln">prefix</span><span class="pun">.</span><span class="pln">something</span><span class="pun">.</span><span class="pln">reallyLongFunctionName</span><span class="pun">(</span><span class="str">'whatever'</span><span class="pun">,</span><span class="pln"> </span><span class="pun">(</span><span class="pln">a1</span><span class="pun">,</span><span class="pln"> a2</span><span class="pun">)</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// Indent the function body +2 relative to indentation depth</span><span class="pln">
  </span><span class="com">// of the 'prefix' statement one line above.</span><span class="pln">
  </span><span class="kwd">if</span><span class="pln"> </span><span class="pun">(</span><span class="pln">a1</span><span class="pun">.</span><span class="pln">equals</span><span class="pun">(</span><span class="pln">a2</span><span class="pun">))</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    someOtherLongFunctionName</span><span class="pun">(</span><span class="pln">a1</span><span class="pun">);</span><span class="pln">
  </span><span class="pun">}</span><span class="pln"> </span><span class="kwd">else</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    andNowForSomethingCompletelyDifferent</span><span class="pun">(</span><span class="pln">a2</span><span class="pun">.</span><span class="pln">parrot</span><span class="pun">);</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">});</span><span class="pln">

some</span><span class="pun">.</span><span class="pln">reallyLongFunctionCall</span><span class="pun">(</span><span class="pln">arg1</span><span class="pun">,</span><span class="pln"> arg2</span><span class="pun">,</span><span class="pln"> arg3</span><span class="pun">)</span><span class="pln">
    </span><span class="pun">.</span><span class="pln">thatsWrapped</span><span class="pun">()</span><span class="pln">
    </span><span class="pun">.</span><span class="pln">then</span><span class="pun">((</span><span class="pln">result</span><span class="pun">)</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
      </span><span class="com">// Indent the function body +2 relative to the indentation depth</span><span class="pln">
      </span><span class="com">// of the '.then()' call.</span><span class="pln">
      </span><span class="kwd">if</span><span class="pln"> </span><span class="pun">(</span><span class="pln">result</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
        result</span><span class="pun">.</span><span class="pln">use</span><span class="pun">();</span><span class="pln">
      </span><span class="pun">}</span><span class="pln">
    </span><span class="pun">});</span></pre>

<h4 id="formatting-switch-statements" style="left: -46px; position: relative;">4.2.5 Switch statements<a href="#formatting-switch-statements" alt="link to formatting-switch-statements"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>As with any other block, the contents of a switch block are indented +2.</p>



<p>After a switch label, a newline appears, and the indentation level is increased
+2, exactly as if a block were being opened. An explicit block may be used if
required by lexical scoping. The following switch label returns to the previous
indentation level, as if a block had been closed.</p>

<p>A blank line is optional between a <code>break</code> and the following case.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">switch</span><span class="pln"> </span><span class="pun">(</span><span class="pln">animal</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">case</span><span class="pln"> </span><span class="typ">Animal</span><span class="pun">.</span><span class="pln">BANDERSNATCH</span><span class="pun">:</span><span class="pln">
    handleBandersnatch</span><span class="pun">();</span><span class="pln">
    </span><span class="kwd">break</span><span class="pun">;</span><span class="pln">

  </span><span class="kwd">case</span><span class="pln"> </span><span class="typ">Animal</span><span class="pun">.</span><span class="pln">JABBERWOCK</span><span class="pun">:</span><span class="pln">
    handleJabberwock</span><span class="pun">();</span><span class="pln">
    </span><span class="kwd">break</span><span class="pun">;</span><span class="pln">

  </span><span class="kwd">default</span><span class="pun">:</span><span class="pln">
    </span><span class="kwd">throw</span><span class="pln"> </span><span class="kwd">new</span><span class="pln"> </span><span class="typ">Error</span><span class="pun">(</span><span class="str">'Unknown animal'</span><span class="pun">);</span><span class="pln">
</span><span class="pun">}</span></pre>

<h3 id="formatting-statements" style="left: -46px; position: relative;">4.3 Statements<a href="#formatting-statements" alt="link to formatting-statements"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="formatting-one-statement-perline" style="left: -46px; position: relative;">4.3.1 One statement per line<a href="#formatting-one-statement-perline" alt="link to formatting-one-statement-perline"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Each statement is followed by a line-break.</p>

<h4 id="formatting-semicolons-are-required" style="left: -46px; position: relative;">4.3.2 Semicolons are required<a href="#formatting-semicolons-are-required" alt="link to formatting-semicolons-are-required"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Every statement must be terminated with a semicolon. Relying on automatic
semicolon insertion is forbidden.</p>

<h3 id="formatting-column-limit" style="left: -46px; position: relative;">4.4 Column limit: 80<a href="#formatting-column-limit" alt="link to formatting-column-limit"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>JavaScript code has a column limit of 80 characters. Except as noted below, any
line that would exceed this limit must be line-wrapped, as explained in
<a href="#formatting-line-wrapping">4.5 Line-wrapping</a>.</p>

<p class="exceptions"><strong>Exceptions:</strong></p>

<ol>
<li><code>goog.module</code>, <code>goog.require</code> and <code>goog.requireType</code> statements (see
<a href="#file-goog-module">3.3 goog.module statement</a> and <a href="#file-goog-require">3.6 goog.require and goog.requireType statements</a>).</li>
<li>ES module <code>import</code> and <code>export from</code> statements (see
<a href="#es-module-imports">3.4.1 Imports</a> and <a href="#es-module-export-from">3.4.2.3 export from</a>).</li>
<li>Lines where obeying the column limit is not possible or would hinder
discoverability. Examples include:
<ul>
<li>A long URL which should be clickable in source.</li>
<li>A shell command intended to be copied-and-pasted.</li>
<li>A long string literal which may need to be copied or searched for wholly
(e.g., a long file path).</li>
</ul></li>
</ol>

<h3 id="formatting-line-wrapping" style="left: -46px; position: relative;">4.5 Line-wrapping<a href="#formatting-line-wrapping" alt="link to formatting-line-wrapping"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p><strong>Terminology Note</strong>: <em>Line wrapping</em> is breaking a chunk of code into multiple
lines to obey column limit, where the chunk could otherwise legally fit in a
single line.</p>

<p>There is no comprehensive, deterministic formula showing <em>exactly</em> how to
line-wrap in every situation. Very often there are several valid ways to
line-wrap the same piece of code.</p>

<p class="note">Note: While the typical reason for line-wrapping is to avoid overflowing the
column limit, even code that would in fact fit within the column limit may be
line-wrapped at the author's discretion.</p>

<p class="tip">Tip: Extracting a method or local variable may solve the problem without the
need to line-wrap.</p>

<h4 id="formatting-where-to-break" style="left: -46px; position: relative;">4.5.1 Where to break<a href="#formatting-where-to-break" alt="link to formatting-where-to-break"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>The prime directive of line-wrapping is: prefer to break at a <strong>higher syntactic
level</strong>. </p>

<p class="preferred">Preferred:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pln">currentEstimate </span><span class="pun">=</span><span class="pln">
    calc</span><span class="pun">(</span><span class="pln">currentEstimate </span><span class="pun">+</span><span class="pln"> x </span><span class="pun">*</span><span class="pln"> currentEstimate</span><span class="pun">)</span><span class="pln"> </span><span class="pun">/</span><span class="pln">
        </span><span class="lit">2.0</span><span class="pun">;</span></pre>

<p class="discouraged">Discouraged:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="pln">currentEstimate </span><span class="pun">=</span><span class="pln"> calc</span><span class="pun">(</span><span class="pln">currentEstimate </span><span class="pun">+</span><span class="pln"> x </span><span class="pun">*</span><span class="pln">
    currentEstimate</span><span class="pun">)</span><span class="pln"> </span><span class="pun">/</span><span class="pln"> </span><span class="lit">2.0</span><span class="pun">;</span></pre>

<p>In the preceding example, the syntactic levels from highest to lowest are as
follows: assignment, division, function call, parameters, number constant.</p>

<p>Operators are wrapped as follows:</p>

<ol>
<li>When a line is broken at an operator the break comes after the symbol. (Note
that this is not the same practice used in Google style for Java.)
<ol>
<li>This does not apply to the <q>dot</q> (<code>.</code>), which is not actually an
operator.</li>
</ol></li>
<li>A method or constructor name stays attached to the open parenthesis (<code>(</code>)
that follows it.</li>
<li>A comma (<code>,</code>) stays attached to the token that precedes it.</li>
<li>A line break is never added between a return and the return value as this
would change the meaning of the code.</li>
<li>JSDoc annotations with type names break after <q>{</q>. This is necessary as
annotations with optional types (@const, @private, @param, etc) do not scan
the next line.</li>
</ol>

<blockquote>
<p class="note">Note: The primary goal for line wrapping is to have clear code, not
necessarily code that fits in the smallest number of lines.</p>
</blockquote>

<h4 id="formatting-indent" style="left: -46px; position: relative;">4.5.2 Indent continuation lines at least +4 spaces<a href="#formatting-indent" alt="link to formatting-indent"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>When line-wrapping, each line after the first (each <em>continuation line</em>) is
indented at least +4 from the original line, unless it falls under the rules of
block indentation.</p>

<p>When there are multiple continuation lines, indentation may be varied beyond +4
as appropriate. In general, continuation lines at a deeper syntactic level are
indented by larger multiples of 4, and two lines use the same indentation level
if and only if they begin with syntactically parallel elements.</p>

<p><a href="#formatting-horizontal-alignment">4.6.3 Horizontal alignment: discouraged</a> addresses the discouraged practice of
using a variable number of spaces to align certain tokens with previous lines.</p>

<h3 id="formatting-whitespace" style="left: -46px; position: relative;">4.6 Whitespace<a href="#formatting-whitespace" alt="link to formatting-whitespace"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="formatting-vertical-whitespace" style="left: -46px; position: relative;">4.6.1 Vertical whitespace<a href="#formatting-vertical-whitespace" alt="link to formatting-vertical-whitespace"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>A single blank line appears:</p>

<ol>
<li>Between consecutive methods in a class or object literal
<ol>
<li>Exception: A blank line between two consecutive properties definitions
in an object literal (with no other code between them) is optional. Such
blank lines are used as needed to create <em>logical groupings</em> of fields.</li>
</ol></li>
<li>Within method bodies, sparingly to create <em>logical groupings</em> of statements.
Blank lines at the start or end of a function body are not allowed.</li>
<li><em>Optionally</em> before the first or after the last method in a class or object
literal (neither encouraged nor discouraged).</li>
<li>As required by other sections of this document (e.g.
<a href="#file-goog-require">3.6 goog.require and goog.requireType statements</a>).</li>
</ol>

<p><em>Multiple</em> consecutive blank lines are permitted, but never required (nor
encouraged).</p>

<h4 id="formatting-horizontal-whitespace" style="left: -46px; position: relative;">4.6.2 Horizontal whitespace<a href="#formatting-horizontal-whitespace" alt="link to formatting-horizontal-whitespace"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Use of horizontal whitespace depends on location, and falls into three broad
categories: <em>leading</em> (at the start of a line), <em>trailing</em> (at the end of a
line), and <em>internal</em>. Leading whitespace (i.e., indentation) is addressed
elsewhere. Trailing whitespace is forbidden.</p>

<p>Beyond where required by the language or other style rules, and apart from
literals, comments, and JSDoc, a single internal ASCII space also appears in the
following places <strong>only</strong>.</p>

<ol>
<li>Separating any reserved word (such as <code>if</code>, <code>for</code>, or <code>catch</code>) except for
<code>function</code> and <code>super</code>, from an open parenthesis (<code>(</code>) that follows it on
that line.</li>
<li>Separating any reserved word (such as <code>else</code> or <code>catch</code>) from a closing
curly brace (<code>}</code>) that precedes it on that line.</li>
<li>Before any open curly brace (<code>{</code>), with two exceptions:
<ol>
<li>Before an object literal that is the first argument of a function or the
first element in an array literal (e.g. <code>foo({a: [{c: d}]})</code>).</li>
<li>In a template expansion, as it is forbidden by the language (e.g. valid:
<code>`ab${1 + 2}cd`</code>, invalid: <code class="badcode">`xy$ {3}z`</code>).</li>
</ol></li>
<li>On both sides of any binary or ternary operator.</li>
<li>After a comma (<code>,</code>) or semicolon (<code>;</code>). Note that spaces are <em>never</em> allowed
before these characters.</li>
<li>After the colon (<code>:</code>) in an object literal.</li>
<li>On both sides of the double slash (<code>//</code>) that begins an end-of-line comment.
Here, multiple spaces are allowed, but not required.</li>
<li>After an open-block comment character and on both sides of close characters
(e.g. for short-form type declarations, casts, and parameter name comments:
<code>this.foo = /** @type {number} */ (bar)</code>; or <code>function(/** string */ foo)
{</code>; or <code>baz(/* buzz= */ true)</code>).</li>
</ol>

<h4 id="formatting-horizontal-alignment" style="left: -46px; position: relative;">4.6.3 Horizontal alignment: discouraged<a href="#formatting-horizontal-alignment" alt="link to formatting-horizontal-alignment"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p><strong>Terminology Note</strong>: <em>Horizontal alignment</em> is the practice of adding a
variable number of additional spaces in your code with the goal of making
certain tokens appear directly below certain other tokens on previous lines.</p>

<p>This practice is permitted, but it is <strong>generally discouraged</strong> by Google Style.
It is not even required to <em>maintain</em> horizontal alignment in places where it
was already used.</p>

<p>Here is an example without alignment, followed by one with alignment. Both are
allowed, but the latter is discouraged:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pun">{</span><span class="pln">
  tiny</span><span class="pun">:</span><span class="pln"> </span><span class="lit">42</span><span class="pun">,</span><span class="pln"> </span><span class="com">// this is great</span><span class="pln">
  longer</span><span class="pun">:</span><span class="pln"> </span><span class="lit">435</span><span class="pun">,</span><span class="pln"> </span><span class="com">// this too</span><span class="pln">
</span><span class="pun">};</span><span class="pln">

</span><span class="pun">{</span><span class="pln">
  tiny</span><span class="pun">:</span><span class="pln">   </span><span class="lit">42</span><span class="pun">,</span><span class="pln">  </span><span class="com">// permitted, but future edits</span><span class="pln">
  longer</span><span class="pun">:</span><span class="pln"> </span><span class="lit">435</span><span class="pun">,</span><span class="pln"> </span><span class="com">// may leave it unaligned</span><span class="pln">
</span><span class="pun">};</span></pre>

<p class="tip">Tip: Alignment can aid readability, but it creates problems for future
maintenance. Consider a future change that needs to touch just one line. This
change may leave the formerly-pleasing formatting mangled, and that is allowed.
More often it prompts the coder (perhaps you) to adjust whitespace on nearby
lines as well, possibly triggering a cascading series of reformattings. That
one-line change now has a <q>blast radius.</q> This can at worst result in pointless
busywork, but at best it still corrupts version history information, slows down
reviewers and exacerbates merge conflicts.</p>

<h4 id="formatting-function-arguments" style="left: -46px; position: relative;">4.6.4 Function arguments<a href="#formatting-function-arguments" alt="link to formatting-function-arguments"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Prefer to put all function arguments on the same line as the function name. If
doing so would exceed the 80-column limit, the arguments must be line-wrapped in
a readable way. To save space, you may wrap as close to 80 as possible, or put
each argument on its own line to enhance readability. Indentation should be four
spaces. Aligning to the parenthesis is allowed, but discouraged. Below are the
most common patterns for argument wrapping:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">// Arguments start on a new line, indented four spaces. Preferred when the</span><span class="pln">
</span><span class="com">// arguments don't fit on the same line with the function name (or the keyword</span><span class="pln">
</span><span class="com">// "function") but fit entirely on the second line. Works with very long</span><span class="pln">
</span><span class="com">// function names, survives renaming without reindenting, low on space.</span><span class="pln">
doSomething</span><span class="pun">(</span><span class="pln">
    descriptiveArgumentOne</span><span class="pun">,</span><span class="pln"> descriptiveArgumentTwo</span><span class="pun">,</span><span class="pln"> descriptiveArgumentThree</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// …</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">// If the argument list is longer, wrap at 80. Uses less vertical space,</span><span class="pln">
</span><span class="com">// but violates the rectangle rule and is thus not recommended.</span><span class="pln">
doSomething</span><span class="pun">(</span><span class="pln">veryDescriptiveArgumentNumberOne</span><span class="pun">,</span><span class="pln"> veryDescriptiveArgumentTwo</span><span class="pun">,</span><span class="pln">
    tableModelEventHandlerProxy</span><span class="pun">,</span><span class="pln"> artichokeDescriptorAdapterIterator</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// …</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">// Four-space, one argument per line.  Works with long function names,</span><span class="pln">
</span><span class="com">// survives renaming, and emphasizes each argument.</span><span class="pln">
doSomething</span><span class="pun">(</span><span class="pln">
    veryDescriptiveArgumentNumberOne</span><span class="pun">,</span><span class="pln">
    veryDescriptiveArgumentTwo</span><span class="pun">,</span><span class="pln">
    tableModelEventHandlerProxy</span><span class="pun">,</span><span class="pln">
    artichokeDescriptorAdapterIterator</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// …</span><span class="pln">
</span><span class="pun">}</span></pre>

<h3 id="formatting-grouping-parentheses" style="left: -46px; position: relative;">4.7 Grouping parentheses: recommended<a href="#formatting-grouping-parentheses" alt="link to formatting-grouping-parentheses"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Optional grouping parentheses are omitted only when the author and reviewer
agree that there is no reasonable chance that the code will be misinterpreted
without them, nor would they have made the code easier to read. It is <em>not</em>
reasonable to assume that every reader has the entire operator precedence table
memorized.</p>

<p>Do not use unnecessary parentheses around the entire expression following
<code>delete</code>, <code>typeof</code>, <code>void</code>, <code>return</code>, <code>throw</code>, <code>case</code>, <code>in</code>, <code>of</code>, or <code>yield</code>.</p>

<p>Parentheses are required for type casts: <code>/** @type {!Foo} */ (foo)</code>.</p>

<h3 id="formatting-comments" style="left: -46px; position: relative;">4.8 Comments<a href="#formatting-comments" alt="link to formatting-comments"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>This section addresses <em>implementation comments</em>. JSDoc is addressed separately
in <a href="#jsdoc">7 JSDoc</a>.</p>

<h4 id="formatting-block-comment-style" style="left: -46px; position: relative;">4.8.1 Block comment style<a href="#formatting-block-comment-style" alt="link to formatting-block-comment-style"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Block comments are indented at the same level as the surrounding code. They may
be in <code>/* … */</code> or <code>//</code>-style. For multi-line <code>/* … */</code> comments, subsequent
lines must start with <code>*</code> aligned with the <code>*</code> on the previous line, to make
comments obvious with no extra context.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/*
 * This is
 * okay.
 */</span><span class="pln">

</span><span class="com">// And so</span><span class="pln">
</span><span class="com">// is this.</span><span class="pln">

</span><span class="com">/* This is fine, too. */</span></pre>

<p>Comments are not enclosed in boxes drawn with asterisks or other characters.</p>

<p>Do not use JSDoc (<code>/** … */</code>) for implementation comments.</p>

<h4 id="formatting-param-name-comments" style="left: -46px; position: relative;">4.8.2 Parameter Name Comments<a href="#formatting-param-name-comments" alt="link to formatting-param-name-comments"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>“Parameter name” comments should be used whenever the value and method name do
not sufficiently convey the meaning, and refactoring the method to be clearer is
infeasible .
Their preferred format is before the value with <q>=</q>:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pln">someFunction</span><span class="pun">(</span><span class="pln">obviousParam</span><span class="pun">,</span><span class="pln"> </span><span class="com">/* shouldRender= */</span><span class="pln"> </span><span class="kwd">true</span><span class="pun">,</span><span class="pln"> </span><span class="com">/* name= */</span><span class="pln"> </span><span class="str">'hello'</span><span class="pun">);</span></pre>

<p>For consistency with surrounding code you may put them after the value without
<q>=</q>:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pln">someFunction</span><span class="pun">(</span><span class="pln">obviousParam</span><span class="pun">,</span><span class="pln"> </span><span class="kwd">true</span><span class="pln"> </span><span class="com">/* shouldRender */</span><span class="pun">,</span><span class="pln"> </span><span class="str">'hello'</span><span class="pln"> </span><span class="com">/* name */</span><span class="pun">);</span></pre>

<h2 id="language-features" style="left: -46px; position: relative;">5 Language features<a href="#language-features" alt="link to language-features"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h2>

<p>JavaScript includes many dubious (and even dangerous) features. This section
delineates which features may or may not be used, and any additional constraints
on their use.</p>

<p>Language features which are not discussed in this style guide may be used with
no recommendations of their usage.</p>

<h3 id="features-local-variable-declarations" style="left: -46px; position: relative;">5.1 Local variable declarations<a href="#features-local-variable-declarations" alt="link to features-local-variable-declarations"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="features-use-const-and-let" style="left: -46px; position: relative;">5.1.1 Use <code>const</code> and <code>let</code><a href="#features-use-const-and-let" alt="link to features-use-const-and-let"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Declare all local variables with either <code>const</code> or <code>let</code>. Use <code>const</code> by
default, unless a variable needs to be reassigned. The <code class="badcode">var</code> keyword
must not be used.</p>

<h4 id="features-one-variable-per-declaration" style="left: -46px; position: relative;">5.1.2 One variable per declaration<a href="#features-one-variable-per-declaration" alt="link to features-one-variable-per-declaration"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Every local variable declaration declares only one variable: declarations such
as <code class="badcode">let a = 1, b = 2;</code> are not used.</p>

<h4 id="features-declared-when-needed" style="left: -46px; position: relative;">5.1.3 Declared when needed, initialized as soon as possible<a href="#features-declared-when-needed" alt="link to features-declared-when-needed"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Local variables are <strong>not</strong> habitually declared at the start of their containing
block or block-like construct. Instead, local variables are declared close to
the point they are first used (within reason), to minimize their scope, and
initialized as soon as possible.</p>

<h4 id="features-declare-types-as-needed" style="left: -46px; position: relative;">5.1.4 Declare types as needed<a href="#features-declare-types-as-needed" alt="link to features-declare-types-as-needed"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>JSDoc type annotations may be added either on the line above the declaration, or
else inline before the variable name if no other JSDoc is present.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !Array&lt;number&gt; */</span><span class="pln"> data </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[];</span><span class="pln">

</span><span class="com">/**
 * Some description.
 * @type {!Array&lt;number&gt;}
 */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> data </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[];</span></pre>

<p>Mixing inline and JSDoc styles is not allowed: the compiler will only process
the first JsDoc and the inline annotations will be lost.</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">/** Some description. */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !Array&lt;number&gt; */</span><span class="pln"> data </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[];</span></pre>

<p class="tip">Tip: There are many cases where the compiler can infer a templatized type but
not its parameters. This is particularly the case when the initializing literal
or constructor call does not include any values of the template parameter type
(e.g., empty arrays, objects, <code>Map</code>s, or <code>Set</code>s), or if the variable is modified
in a closure. Local variable type annotations are particularly helpful in these
cases since otherwise the compiler will infer the template parameter as unknown.</p>

<h3 id="features-array-literals" style="left: -46px; position: relative;">5.2 Array literals<a href="#features-array-literals" alt="link to features-array-literals"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="features-arrays-trailing-comma" style="left: -46px; position: relative;">5.2.1 Use trailing commas<a href="#features-arrays-trailing-comma" alt="link to features-arrays-trailing-comma"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>



<p>Include a trailing comma whenever there is a line break between the final
element and the closing bracket.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> values </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[</span><span class="pln">
  </span><span class="str">'first value'</span><span class="pun">,</span><span class="pln">
  </span><span class="str">'second value'</span><span class="pun">,</span><span class="pln">
</span><span class="pun">];</span></pre>

<h4 id="features-arrays-ctor" style="left: -46px; position: relative;">5.2.2 Do not use the variadic <code>Array</code> constructor<a href="#features-arrays-ctor" alt="link to features-arrays-ctor"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>The constructor is error-prone if arguments are added or removed. Use a literal
instead.</p>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">const</span><span class="pln"> a1 </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">new</span><span class="pln"> </span><span class="typ">Array</span><span class="pun">(</span><span class="pln">x1</span><span class="pun">,</span><span class="pln"> x2</span><span class="pun">,</span><span class="pln"> x3</span><span class="pun">);</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> a2 </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">new</span><span class="pln"> </span><span class="typ">Array</span><span class="pun">(</span><span class="pln">x1</span><span class="pun">,</span><span class="pln"> x2</span><span class="pun">);</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> a3 </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">new</span><span class="pln"> </span><span class="typ">Array</span><span class="pun">(</span><span class="pln">x1</span><span class="pun">);</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> a4 </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">new</span><span class="pln"> </span><span class="typ">Array</span><span class="pun">();</span></pre>

<p>This works as expected except for the third case: if <code>x1</code> is a whole number then
<code>a3</code> is an array of size <code>x1</code> where all elements are <code>undefined</code>. If <code>x1</code> is any
other number, then an exception will be thrown, and if it is anything else then
it will be a single-element array.</p>

<p>Instead, write</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> a1 </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[</span><span class="pln">x1</span><span class="pun">,</span><span class="pln"> x2</span><span class="pun">,</span><span class="pln"> x3</span><span class="pun">];</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> a2 </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[</span><span class="pln">x1</span><span class="pun">,</span><span class="pln"> x2</span><span class="pun">];</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> a3 </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[</span><span class="pln">x1</span><span class="pun">];</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> a4 </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[];</span></pre>

<p>Explicitly allocating an array of a given length using <code>new Array(length)</code> is
allowed when appropriate.</p>

<h4 id="features-arrays-non-numeric-properties" style="left: -46px; position: relative;">5.2.3 Non-numeric properties<a href="#features-arrays-non-numeric-properties" alt="link to features-arrays-non-numeric-properties"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Do not define or use non-numeric properties on an array (other than <code>length</code>).
Use a <code>Map</code> (or <code>Object</code>) instead.</p>

<h4 id="features-arrays-destructuring" style="left: -46px; position: relative;">5.2.4 Destructuring<a href="#features-arrays-destructuring" alt="link to features-arrays-destructuring"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Array literals may be used on the left-hand side of an assignment to perform
destructuring (such as when unpacking multiple values from a single array or
iterable). A final <q>rest</q> element may be included (with no space between the
<code>...</code> and the variable name). Elements should be omitted if they are unused.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> </span><span class="pun">[</span><span class="pln">a</span><span class="pun">,</span><span class="pln"> b</span><span class="pun">,</span><span class="pln"> c</span><span class="pun">,</span><span class="pln"> </span><span class="pun">...</span><span class="pln">rest</span><span class="pun">]</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> generateResults</span><span class="pun">();</span><span class="pln">
</span><span class="kwd">let</span><span class="pln"> </span><span class="pun">[,</span><span class="pln"> b</span><span class="pun">,,</span><span class="pln"> d</span><span class="pun">]</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> someArray</span><span class="pun">;</span></pre>

<p>Destructuring may also be used for function parameters (note that a parameter
name is required but ignored). Always specify <code>[]</code> as the default value if a
destructured array parameter is optional, and provide default values on the left
hand side:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @param {!Array&lt;number&gt;=} param1 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> optionalDestructuring</span><span class="pun">([</span><span class="pln">a </span><span class="pun">=</span><span class="pln"> </span><span class="lit">4</span><span class="pun">,</span><span class="pln"> b </span><span class="pun">=</span><span class="pln"> </span><span class="lit">2</span><span class="pun">]</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[])</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="pun">…</span><span class="pln"> </span><span class="pun">};</span></pre>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">function</span><span class="pln"> badDestructuring</span><span class="pun">([</span><span class="pln">a</span><span class="pun">,</span><span class="pln"> b</span><span class="pun">]</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[</span><span class="lit">4</span><span class="pun">,</span><span class="pln"> </span><span class="lit">2</span><span class="pun">])</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="pun">…</span><span class="pln"> </span><span class="pun">};</span></pre>

<p class="tip">Tip: For (un)packing multiple values into a function’s parameter or return,
prefer object destructuring to array destructuring when possible, as it allows
naming the individual elements and specifying a different type for each.</p>

<h4 id="features-arrays-spread-operator" style="left: -46px; position: relative;">5.2.5 Spread operator<a href="#features-arrays-spread-operator" alt="link to features-arrays-spread-operator"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Array literals may include the spread operator (<code>...</code>) to flatten elements out
of one or more other iterables. The spread operator should be used instead of
more awkward constructs with <code>Array.prototype</code>. There is no space after the
<code>...</code>.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pun">[...</span><span class="pln">foo</span><span class="pun">]</span><span class="pln">   </span><span class="com">// preferred over Array.prototype.slice.call(foo)</span><span class="pln">
</span><span class="pun">[...</span><span class="pln">foo</span><span class="pun">,</span><span class="pln"> </span><span class="pun">...</span><span class="pln">bar</span><span class="pun">]</span><span class="pln">   </span><span class="com">// preferred over foo.concat(bar)</span></pre>

<h3 id="features-object-literals" style="left: -46px; position: relative;">5.3 Object literals<a href="#features-object-literals" alt="link to features-object-literals"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="features-objects-use-trailing-comma" style="left: -46px; position: relative;">5.3.1 Use trailing commas<a href="#features-objects-use-trailing-comma" alt="link to features-objects-use-trailing-comma"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Include a trailing comma whenever there is a line break between the final
property and the closing brace.</p>

<h4 id="features-objects-ctor" style="left: -46px; position: relative;">5.3.2 Do not use the <code>Object</code> constructor<a href="#features-objects-ctor" alt="link to features-objects-ctor"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>While <code>Object</code> does not have the same problems as <code>Array</code>, it is still
disallowed for consistency. Use an object literal (<code>{}</code> or <code>{a: 0, b: 1, c: 2}</code>)
instead.</p>

<h4 id="features-objects-mixing-keys" style="left: -46px; position: relative;">5.3.3 Do not mix quoted and unquoted keys<a href="#features-objects-mixing-keys" alt="link to features-objects-mixing-keys"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Object literals may represent either <em>structs</em> (with unquoted keys and/or
symbols) or <em>dicts</em> (with quoted and/or computed keys). Do not mix these key
types in a single object literal.</p>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="pun">{</span><span class="pln">
  width</span><span class="pun">:</span><span class="pln"> </span><span class="lit">42</span><span class="pun">,</span><span class="pln"> </span><span class="com">// struct-style unquoted key</span><span class="pln">
  </span><span class="str">'maxWidth'</span><span class="pun">:</span><span class="pln"> </span><span class="lit">43</span><span class="pun">,</span><span class="pln"> </span><span class="com">// dict-style quoted key</span><span class="pln">
</span><span class="pun">}</span></pre>

<p>This also extends to passing the property name to functions, like
<code>hasOwnProperty</code>. In particular, doing so will break in compiled code because
the compiler cannot rename/obfuscate the string literal.</p>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">/** @type {{width: number, maxWidth: (number|undefined)}} */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> o </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">width</span><span class="pun">:</span><span class="pln"> </span><span class="lit">42</span><span class="pun">};</span><span class="pln">
</span><span class="kwd">if</span><span class="pln"> </span><span class="pun">(</span><span class="pln">o</span><span class="pun">.</span><span class="pln">hasOwnProperty</span><span class="pun">(</span><span class="str">'maxWidth'</span><span class="pun">))</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="pun">...</span><span class="pln">
</span><span class="pun">}</span></pre>

<p>This is best implemented as:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @type {{width: number, maxWidth: (number|undefined)}} */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> o </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">width</span><span class="pun">:</span><span class="pln"> </span><span class="lit">42</span><span class="pun">};</span><span class="pln">
</span><span class="kwd">if</span><span class="pln"> </span><span class="pun">(</span><span class="pln">o</span><span class="pun">.</span><span class="pln">maxWidth </span><span class="pun">!=</span><span class="pln"> </span><span class="kwd">null</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="pun">...</span><span class="pln">
</span><span class="pun">}</span></pre>

<h4 id="features-objects-computed-property-names" style="left: -46px; position: relative;">5.3.4 Computed property names<a href="#features-objects-computed-property-names" alt="link to features-objects-computed-property-names"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Computed property names (e.g., <code>{['key' + foo()]: 42}</code>) are allowed, and are
considered dict-style (quoted) keys (i.e., must not be mixed with non-quoted
keys) unless the computed property is a
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol">symbol</a>
(e.g., <code>[Symbol.iterator]</code>). Enum values may also be used for computed keys, but
should not be mixed with non-enum keys in the same literal.</p>

<h4 id="features-objects-method-shorthand" style="left: -46px; position: relative;">5.3.5 Method shorthand<a href="#features-objects-method-shorthand" alt="link to features-objects-method-shorthand"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Methods can be defined on object literals using the method shorthand (<code>{method()
{… }}</code>) in place of a colon immediately followed by a <code>function</code> or arrow
function literal.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">return</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  stuff</span><span class="pun">:</span><span class="pln"> </span><span class="str">'candy'</span><span class="pun">,</span><span class="pln">
  method</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="kwd">return</span><span class="pln"> </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">stuff</span><span class="pun">;</span><span class="pln">  </span><span class="com">// Returns 'candy'</span><span class="pln">
  </span><span class="pun">},</span><span class="pln">
</span><span class="pun">};</span></pre>

<p>Note that <code>this</code> in a method shorthand or <code>function</code> refers to the object
literal itself whereas <code>this</code> in an arrow function refers to the scope outside
the object literal.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">class</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  getObjectLiteral</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">stuff </span><span class="pun">=</span><span class="pln"> </span><span class="str">'fruit'</span><span class="pun">;</span><span class="pln">
    </span><span class="kwd">return</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
      stuff</span><span class="pun">:</span><span class="pln"> </span><span class="str">'candy'</span><span class="pun">,</span><span class="pln">
      method</span><span class="pun">:</span><span class="pln"> </span><span class="pun">()</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">stuff</span><span class="pun">,</span><span class="pln">  </span><span class="com">// Returns 'fruit'</span><span class="pln">
    </span><span class="pun">};</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">}</span></pre>

<h4 id="features-objects-shorthand-properties" style="left: -46px; position: relative;">5.3.6 Shorthand properties<a href="#features-objects-shorthand-properties" alt="link to features-objects-shorthand-properties"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Shorthand properties are allowed on object literals.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> foo </span><span class="pun">=</span><span class="pln"> </span><span class="lit">1</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> bar </span><span class="pun">=</span><span class="pln"> </span><span class="lit">2</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> obj </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  foo</span><span class="pun">,</span><span class="pln">
  bar</span><span class="pun">,</span><span class="pln">
  method</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="kwd">return</span><span class="pln"> </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">foo </span><span class="pun">+</span><span class="pln"> </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">bar</span><span class="pun">;</span><span class="pln"> </span><span class="pun">},</span><span class="pln">
</span><span class="pun">};</span><span class="pln">
assertEquals</span><span class="pun">(</span><span class="lit">3</span><span class="pun">,</span><span class="pln"> obj</span><span class="pun">.</span><span class="pln">method</span><span class="pun">());</span></pre>

<h4 id="features-objects-destructuring" style="left: -46px; position: relative;">5.3.7 Destructuring<a href="#features-objects-destructuring" alt="link to features-objects-destructuring"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Object destructuring patterns may be used on the left-hand side of an assignment
to perform destructuring and unpack multiple values from a single object.</p>

<p>Destructured objects may also be used as function parameters, but should be kept
as simple as possible: a single level of unquoted shorthand properties. Deeper
levels of nesting and computed properties may not be used in parameter
destructuring. Specify any default values in the left-hand-side of the
destructured parameter (<code>{str = 'some default'} = {}</code>, rather than
<code class="badcode">{str} = {str: 'some default'}</code>), and if a
destructured object is itself optional, it must default to <code>{}</code>. The JSDoc for
the destructured parameter may be given any name (the name is unused but is
required by the compiler).</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * @param {string} ordinary
 * @param {{num: (number|undefined), str: (string|undefined)}=} param1
 *     num: The number of times to do something.
 *     str: A string to do stuff to.
 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> destructured</span><span class="pun">(</span><span class="pln">ordinary</span><span class="pun">,</span><span class="pln"> </span><span class="pun">{</span><span class="pln">num</span><span class="pun">,</span><span class="pln"> str </span><span class="pun">=</span><span class="pln"> </span><span class="str">'some default'</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{})</span><span class="pln"> </span><span class="pun">{}</span></pre>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">/** @param {{x: {num: (number|undefined), str: (string|undefined)}}} param1 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> nestedTooDeeply</span><span class="pun">({</span><span class="pln">x</span><span class="pun">:</span><span class="pln"> </span><span class="pun">{</span><span class="pln">num</span><span class="pun">,</span><span class="pln"> str</span><span class="pun">}})</span><span class="pln"> </span><span class="pun">{};</span><span class="pln">
</span><span class="com">/** @param {{num: (number|undefined), str: (string|undefined)}=} param1 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> nonShorthandProperty</span><span class="pun">({</span><span class="pln">num</span><span class="pun">:</span><span class="pln"> a</span><span class="pun">,</span><span class="pln"> str</span><span class="pun">:</span><span class="pln"> b</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{})</span><span class="pln"> </span><span class="pun">{};</span><span class="pln">
</span><span class="com">/** @param {{a: number, b: number}} param1 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> computedKey</span><span class="pun">({</span><span class="pln">a</span><span class="pun">,</span><span class="pln"> b</span><span class="pun">,</span><span class="pln"> </span><span class="pun">[</span><span class="pln">a </span><span class="pun">+</span><span class="pln"> b</span><span class="pun">]:</span><span class="pln"> c</span><span class="pun">})</span><span class="pln"> </span><span class="pun">{};</span><span class="pln">
</span><span class="com">/** @param {{a: number, b: string}=} param1 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> nontrivialDefault</span><span class="pun">({</span><span class="pln">a</span><span class="pun">,</span><span class="pln"> b</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">a</span><span class="pun">:</span><span class="pln"> </span><span class="lit">2</span><span class="pun">,</span><span class="pln"> b</span><span class="pun">:</span><span class="pln"> </span><span class="lit">4</span><span class="pun">})</span><span class="pln"> </span><span class="pun">{};</span></pre>

<p>Destructuring may also be used for <code>goog.require</code> statements, and in this case
must not be wrapped: the entire statement occupies one line, regardless of how
long it is (see <a href="#file-goog-require">3.6 goog.require and goog.requireType statements</a>).</p>

<h4 id="features-objects-enums" style="left: -46px; position: relative;">5.3.8 Enums<a href="#features-objects-enums" alt="link to features-objects-enums"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Enumerations are defined by adding the <code>@enum</code> annotation to an object literal.
Enums must be module-local or assigned directly on <code>exports</code>, not nested under a
type or object.</p>

<p>Additional properties may not be added to an enum after it is defined. Enums
must be constant. All enum values must be either a string literal or a number.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * Supported temperature scales.
 * @enum {string}
 */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="typ">TemperatureScale</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  CELSIUS</span><span class="pun">:</span><span class="pln"> </span><span class="str">'celsius'</span><span class="pun">,</span><span class="pln">
  FAHRENHEIT</span><span class="pun">:</span><span class="pln"> </span><span class="str">'fahrenheit'</span><span class="pun">,</span><span class="pln">
</span><span class="pun">};</span><span class="pln">

</span><span class="com">/**
 * An enum with two values.
 * @enum {number}
 */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="typ">Value</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/** The value used shall have been the first. */</span><span class="pln">
  FIRST_VALUE</span><span class="pun">:</span><span class="pln"> </span><span class="lit">1</span><span class="pun">,</span><span class="pln">
  </span><span class="com">/** The second among two values. */</span><span class="pln">
  SECOND_VALUE</span><span class="pun">:</span><span class="pln"> </span><span class="lit">2</span><span class="pun">,</span><span class="pln">
</span><span class="pun">};</span></pre>

<p>For string enums, all values must be statically initialized and not computed
using arithmetic operators, template literal substitution, function calls or
even a variable reference.</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">const</span><span class="pln"> ABSOLUTE_ZERO </span><span class="pun">=</span><span class="pln"> </span><span class="str">'-273°F'</span><span class="pun">;</span><span class="pln">

</span><span class="com">/**
 * Not supported computed values in string enum.
 * @enum {string}
 */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="typ">TemperatureInFahrenheit</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  MIN_POSSIBLE</span><span class="pun">:</span><span class="pln"> ABSOLUTE_ZERO</span><span class="pun">,</span><span class="pln">
  ZERO_FAHRENHEIT</span><span class="pun">:</span><span class="pln"> </span><span class="lit">0</span><span class="pln"> </span><span class="pun">+</span><span class="pln"> </span><span class="str">'°F'</span><span class="pun">,</span><span class="pln">
  ONE_FAHRENHEIT</span><span class="pun">:</span><span class="pln"> </span><span class="pun">`</span><span class="pln">$</span><span class="pun">{</span><span class="typ">Values</span><span class="pun">.</span><span class="pln">FIRST_VALUE</span><span class="pun">}°</span><span class="pln">F</span><span class="pun">`,</span><span class="pln">
  TWO_FAHRENHEIT</span><span class="pun">:</span><span class="pln"> </span><span class="typ">Values</span><span class="pun">.</span><span class="pln">SECOND_VALUE </span><span class="pun">+</span><span class="pln"> </span><span class="str">'°F'</span><span class="pun">,</span><span class="pln">
  SOME_FAHRENHEIT</span><span class="pun">:</span><span class="pln"> getTemperatureInFahrenheit</span><span class="pun">()</span><span class="pln"> </span><span class="pun">+</span><span class="pln"> </span><span class="str">'°F'</span><span class="pun">,</span><span class="pln">
</span><span class="pun">};</span></pre>

<p class="note">Note: Although TypeScript supports a few more patterns for enum values (e.g <code>A:
'a'+'b'</code>, etc), the restriction of only allowing string literals and numbers for
enum values is to aid migration to TypeScript. For complex values consider using
a const object without <code>@enum</code>. </p>

<h3 id="features-classes" style="left: -46px; position: relative;">5.4 Classes<a href="#features-classes" alt="link to features-classes"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="features-classes-constructors" style="left: -46px; position: relative;">5.4.1 Constructors<a href="#features-classes-constructors" alt="link to features-classes-constructors"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Constructors are optional. Subclass constructors must call <code>super()</code> before
setting any fields or otherwise accessing <code>this</code>. Interfaces should declare
non-method properties in the constructor.</p>

<h4 id="features-classes-fields" style="left: -46px; position: relative;">5.4.2 Fields<a href="#features-classes-fields" alt="link to features-classes-fields"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Define all of a concrete object’s fields (i.e. all properties other than
methods) in the constructor. Annotate fields that are never reassigned with
<code>@const</code> (these need not be deeply immutable). Annotate non-public fields with
the proper visibility annotation (<code>@private</code>, <code>@protected</code>, <code>@package</code>).
<code>@private</code> fields' names may optionally end with an underscore. Fields must not
be defined within a nested scope in the constructor nor on a concrete class's
<code>prototype</code>.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">class</span><span class="pln"> </span><span class="typ">Foo</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">constructor</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="com">/** @private @const {!Bar} */</span><span class="pln">
    </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">bar_ </span><span class="pun">=</span><span class="pln"> computeBar</span><span class="pun">();</span><span class="pln">

    </span><span class="com">/** @protected @const {!Baz} */</span><span class="pln">
    </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">baz </span><span class="pun">=</span><span class="pln"> computeBaz</span><span class="pun">();</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">}</span></pre>

<p class="tip">Tip: Properties should never be added to or removed from an instance after the
constructor is finished, since it significantly hinders VMs’ ability to
optimize. If necessary, fields that are initialized later should be explicitly
set to <code>undefined</code> in the constructor to prevent later shape changes. Adding
<code>@struct</code> to an object will check that undeclared properties are not
added/accessed. Classes have this added by default.</p>

<h4 id="features-classes-computed-properties" style="left: -46px; position: relative;">5.4.3 Computed properties<a href="#features-classes-computed-properties" alt="link to features-classes-computed-properties"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>



<p>Computed properties may only be used in classes when the property is a symbol.
Dict-style properties (that is, quoted or computed non-symbol keys, as defined
in <a href="#features-objects-mixing-keys">5.3.3 Do not mix quoted and unquoted keys</a>) are not allowed. A <code>[Symbol.iterator]</code>
method should be defined for any classes that are logically iterable. Beyond
this, <code>Symbol</code> should be used sparingly.</p>

<p class="tip">Tip: be careful of using any other built-in symbols (e.g.,
<code>Symbol.isConcatSpreadable</code>) as they are not polyfilled by the compiler and will
therefore not work in older browsers.</p>

<h4 id="features-classes-static-methods" style="left: -46px; position: relative;">5.4.4 Static methods<a href="#features-classes-static-methods" alt="link to features-classes-static-methods"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>



<p>Where it does not interfere with readability, prefer module-local functions over
private static methods.</p>

<p>Code should not rely on dynamic dispatch of static methods, because it
interferes with Closure Compiler optimizations. Static methods should only be
called on the base class itself. Static methods should not be called on
variables containing a dynamic instance that may be either the constructor or a
subclass constructor (and must be defined with <code>@nocollapse</code> if this is done),
and must not be called directly on a subclass that doesn’t define the method
itself. Do not access <code>this</code> in static methods.</p>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// Context for the examples below; by itself this code is allowed.</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Base</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/** @nocollapse */</span><span class="pln"> </span><span class="kwd">static</span><span class="pln"> foo</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{}</span><span class="pln">
</span><span class="pun">}</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Sub</span><span class="pln"> extends </span><span class="typ">Base</span><span class="pln"> </span><span class="pun">{}</span><span class="pln">

</span><span class="com">// discouraged: don't call static methods dynamically</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> callFoo</span><span class="pun">(</span><span class="pln">cls</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> cls</span><span class="pun">.</span><span class="pln">foo</span><span class="pun">();</span><span class="pln"> </span><span class="pun">}</span><span class="pln">

</span><span class="com">// Disallowed: don't call static methods on subclasses that don't define it themselves</span><span class="pln">
</span><span class="typ">Sub</span><span class="pun">.</span><span class="pln">foo</span><span class="pun">();</span><span class="pln">

</span><span class="com">// Disallowed: don't access this in static methods.</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Clazz</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">static</span><span class="pln"> foo</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="kwd">return</span><span class="pln"> </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">staticField</span><span class="pun">;</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">}</span><span class="pln">
</span><span class="typ">Class</span><span class="pun">.</span><span class="pln">staticField </span><span class="pun">=</span><span class="pln"> </span><span class="lit">1</span><span class="pun">;</span></pre>

<h4 id="features-classes-old-style" style="left: -46px; position: relative;">5.4.5 Old-style class declarations<a href="#features-classes-old-style" alt="link to features-classes-old-style"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>While ES6 classes are preferred, there are cases where ES6 classes may not be
feasible. For example:</p>

<ol>
<li><p>If there exist or will exist subclasses, including frameworks that create
subclasses, that cannot be immediately changed to use ES6 class syntax. If
such a class were to use ES6 syntax, all downstream subclasses not using ES6
class syntax would need to be modified.</p></li>
<li><p>Frameworks that require a known <code>this</code> value before calling the superclass
constructor, since constructors with ES6 super classes do not have access to
the instance <code>this</code> value until the call to <code>super</code> returns.</p></li>
</ol>

<p>In all other ways the style guide still applies to this code: <code>let</code>, <code>const</code>,
default parameters, rest, and arrow functions should all be used when
appropriate.</p>

<p><code>goog.defineClass</code> allows for a class-like definition similar to ES6 class
syntax:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">let</span><span class="pln"> C </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">defineClass</span><span class="pun">(</span><span class="pln">S</span><span class="pun">,</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/**
   * @param {string} value
   */</span><span class="pln">
  </span><span class="kwd">constructor</span><span class="pun">(</span><span class="pln">value</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    S</span><span class="pun">.</span><span class="pln">call</span><span class="pun">(</span><span class="kwd">this</span><span class="pun">,</span><span class="pln"> </span><span class="lit">2</span><span class="pun">);</span><span class="pln">
    </span><span class="com">/** @const */</span><span class="pln">
    </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">prop </span><span class="pun">=</span><span class="pln"> value</span><span class="pun">;</span><span class="pln">
  </span><span class="pun">},</span><span class="pln">

  </span><span class="com">/**
   * @param {string} param
   * @return {number}
   */</span><span class="pln">
  method</span><span class="pun">(</span><span class="pln">param</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="kwd">return</span><span class="pln"> </span><span class="lit">0</span><span class="pun">;</span><span class="pln">
  </span><span class="pun">},</span><span class="pln">
</span><span class="pun">});</span></pre>

<p>Alternatively, while <code>goog.defineClass</code> should be preferred for all new code,
more traditional syntax is also allowed.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
  * @constructor @extends {S}
  * @param {string} value
  */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> C</span><span class="pun">(</span><span class="pln">value</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  S</span><span class="pun">.</span><span class="pln">call</span><span class="pun">(</span><span class="kwd">this</span><span class="pun">,</span><span class="pln"> </span><span class="lit">2</span><span class="pun">);</span><span class="pln">
  </span><span class="com">/** @const */</span><span class="pln">
  </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">prop </span><span class="pun">=</span><span class="pln"> value</span><span class="pun">;</span><span class="pln">
</span><span class="pun">}</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">inherits</span><span class="pun">(</span><span class="pln">C</span><span class="pun">,</span><span class="pln"> S</span><span class="pun">);</span><span class="pln">

</span><span class="com">/**
 * @param {string} param
 * @return {number}
 */</span><span class="pln">
C</span><span class="pun">.</span><span class="pln">prototype</span><span class="pun">.</span><span class="pln">method </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">function</span><span class="pun">(</span><span class="pln">param</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">return</span><span class="pln"> </span><span class="lit">0</span><span class="pun">;</span><span class="pln">
</span><span class="pun">};</span></pre>

<p>Per-instance properties should be defined in the constructor after the call to
the super class constructor, if there is a super class. Methods should be
defined on the prototype of the constructor.</p>

<p>Defining constructor prototype hierarchies correctly is harder than it first
appears! For that reason, it is best to use <code>goog.inherits</code> from
<a href="http://code.google.com/closure/library/">the Closure Library </a>.</p>

<h4 id="features-classes-prototypes" style="left: -46px; position: relative;">5.4.6 Do not manipulate <code>prototype</code>s directly<a href="#features-classes-prototypes" alt="link to features-classes-prototypes"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>The <code>class</code> keyword allows clearer and more readable class definitions than
defining <code>prototype</code> properties. Ordinary implementation code has no business
manipulating these objects, though they are still useful for defining classes as
defined in <a href="#features-classes-old-style">5.4.5 Old-style class declarations</a>. Mixins and modifying the
prototypes of builtin objects are explicitly forbidden.</p>

<p class="exception"><strong>Exception</strong>: Framework code (such as Polymer, or Angular) may need to use <code>prototype</code>s, and should not resort
to even-worse workarounds to avoid doing so.</p>

<h4 id="features-classes-getters-and-setters" style="left: -46px; position: relative;">5.4.7 Getters and Setters<a href="#features-classes-getters-and-setters" alt="link to features-classes-getters-and-setters"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Do not use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get">JavaScript getter and setter properties</a>. They are potentially
surprising and difficult to reason about, and have limited support in the
compiler. Provide ordinary methods instead.</p>

<p class="exception"><strong>Exception</strong>: there are situations where defining a getter or setter is
unavoidable (e.g. data binding frameworks such as Angular and Polymer, or for
compatibility with external APIs that cannot be adjusted). In these cases only,
getters and setters may be used <em>with caution</em>, provided they are defined with
the <code>get</code> and <code>set</code> shorthand method keywords or <code>Object.defineProperties</code> (not
<code>Object.defineProperty</code>, which interferes with property renaming). Getters
<strong>must not</strong> change observable state.</p>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">class</span><span class="pln"> </span><span class="typ">Foo</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">get</span><span class="pln"> next</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="kwd">return</span><span class="pln"> </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">nextId</span><span class="pun">++;</span><span class="pln"> </span><span class="pun">}</span><span class="pln">
</span><span class="pun">}</span></pre>

<h4 id="features-classes-overriding-tostring" style="left: -46px; position: relative;">5.4.8 Overriding toString<a href="#features-classes-overriding-tostring" alt="link to features-classes-overriding-tostring"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>The <code>toString</code> method may be overridden, but must always succeed and never have
visible side effects.</p>

<p class="tip">Tip: Beware, in particular, of calling other methods from toString, since
exceptional conditions could lead to infinite loops.</p>

<h4 id="features-classes-interfaces" style="left: -46px; position: relative;">5.4.9 Interfaces<a href="#features-classes-interfaces" alt="link to features-classes-interfaces"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Interfaces may be declared with <code>@interface</code> or <code>@record</code>. Interfaces declared
with <code>@record</code> can be explicitly (i.e. via <code>@implements</code>) or implicitly
implemented by a class or object literal.</p>

<p>All methods on an interface must be non-static and method bodies must be empty
blocks. Fields must be declared as uninitialized members in the class
constructor.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * Something that can frobnicate.
 * @record
 */</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Frobnicator</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">constructor</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="com">/** @type {number} The number of attempts before giving up. */</span><span class="pln">
    </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">attempts</span><span class="pun">;</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">

  </span><span class="com">/**
   * Performs the frobnication according to the given strategy.
   * @param {!FrobnicationStrategy} strategy
   */</span><span class="pln">
  frobnicate</span><span class="pun">(</span><span class="pln">strategy</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{}</span><span class="pln">
</span><span class="pun">}</span><span class="pln">
</span></pre>

<h4 id="features-classes-abstract-classes" style="left: -46px; position: relative;">5.4.10 Abstract Classes<a href="#features-classes-abstract-classes" alt="link to features-classes-abstract-classes"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Use abstract classes when appropriate. Abstract classes and methods must be
annotated with <code>@abstract</code>. Do not use <code>goog.abstractMethod</code>. See
<a href="https://github.com/google/closure-compiler/wiki/@abstract-classes-and-methods">abstract classes and methods</a>.</p>

<h4 id="static-containers" style="left: -46px; position: relative;">5.4.11 Do not create static container classes<a href="#static-containers" alt="link to static-containers"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Do not use container classes with only static methods or properties for the sake
of namespacing.</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// container.js</span><span class="pln">
</span><span class="com">// Bad: Container is an exported class that has only static methods and fields.</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Container</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/** @return {number} */</span><span class="pln">
  </span><span class="kwd">static</span><span class="pln"> bar</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="kwd">return</span><span class="pln"> </span><span class="lit">1</span><span class="pun">;</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">/** @const {number} */</span><span class="pln">
</span><span class="typ">Container</span><span class="pun">.</span><span class="pln">FOO </span><span class="pun">=</span><span class="pln"> </span><span class="lit">1</span><span class="pun">;</span><span class="pln">

exports </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="typ">Container</span><span class="pun">};</span></pre>

<p>Instead, export individual constants and functions:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @return {number} */</span><span class="pln">
exports</span><span class="pun">.</span><span class="pln">bar </span><span class="pun">=</span><span class="pln"> </span><span class="pun">()</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">return</span><span class="pln"> </span><span class="lit">1</span><span class="pun">;</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">/** @const {number} */</span><span class="pln">
exports</span><span class="pun">.</span><span class="pln">FOO </span><span class="pun">=</span><span class="pln"> </span><span class="lit">1</span><span class="pun">;</span></pre>

<h4 id="nested-namespaces" style="left: -46px; position: relative;">5.4.12 Do not define nested namespaces<a href="#nested-namespaces" alt="link to nested-namespaces"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Do not define a nested type (e.g. class, typedef, enum, interface) on another
module-local name. </p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// foo.js</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">module</span><span class="pun">(</span><span class="str">'my.namespace'</span><span class="pun">);</span><span class="pln">

</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Foo</span><span class="pln"> </span><span class="pun">{...}</span><span class="pln">

</span><span class="typ">Foo</span><span class="pun">.</span><span class="typ">Bar</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">class</span><span class="pln"> </span><span class="pun">{...};</span><span class="pln">

</span><span class="com">/** @enum {number} */</span><span class="pln">
</span><span class="typ">Foo</span><span class="pun">.</span><span class="typ">Baz</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{...};</span><span class="pln">

</span><span class="com">/** @typedef {{value: number}} */</span><span class="pln">
</span><span class="typ">Foo</span><span class="pun">.</span><span class="typ">Qux</span><span class="pun">;</span><span class="pln">

</span><span class="com">/** @interface */</span><span class="pln">
</span><span class="typ">Foo</span><span class="pun">.</span><span class="typ">Quuz</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">class</span><span class="pln"> </span><span class="pun">{...}</span><span class="pln">

exports</span><span class="pun">.</span><span class="typ">Foo</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="typ">Foo</span><span class="pun">;</span></pre>

<p>These values should be top-level exports. Choose clear names for these values
(e.g. FooConverter for a Converter that could have been nested on Foo). However,
when the module name is redundant with part of the class name, consider omitting
the redundancy: <code>foo.Foo</code> and <code>foo.Converter</code> rather than <code>foo.Foo</code> and
<code>foo.FooConverter</code>. Importers can add the prefix when necessary for clarity
(e.g. <code>import {Converter as FooConverter} from './foo';</code>) but cannot easily
remove the redundancy when importing the entire module as a namespace.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">// foo.js</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">module</span><span class="pun">(</span><span class="str">'my.namespace'</span><span class="pun">);</span><span class="pln">

</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Foo</span><span class="pln"> </span><span class="pun">{...}</span><span class="pln">

</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">FooBar</span><span class="pln"> </span><span class="pun">{...}</span><span class="pln">

</span><span class="com">/** @enum {string} */</span><span class="pln">
</span><span class="kwd">let</span><span class="pln"> </span><span class="typ">FooBaz</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{...};</span><span class="pln">

</span><span class="com">/** @typedef {{value: number}} */</span><span class="pln">
</span><span class="kwd">let</span><span class="pln"> </span><span class="typ">FooQux</span><span class="pun">;</span><span class="pln">

</span><span class="com">/** @interface */</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">FooQuuz</span><span class="pln"> </span><span class="pun">{...};</span><span class="pln">

</span><span class="kwd">export</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="typ">Foo</span><span class="pun">,</span><span class="pln">
  </span><span class="typ">FooBar</span><span class="pun">,</span><span class="pln">
  </span><span class="typ">FooBaz</span><span class="pun">,</span><span class="pln">
  </span><span class="typ">FooQux</span><span class="pun">,</span><span class="pln">
  </span><span class="typ">FooQuuz</span><span class="pun">,</span><span class="pln">
</span><span class="pun">};</span></pre>

<h3 id="features-functions" style="left: -46px; position: relative;">5.5 Functions<a href="#features-functions" alt="link to features-functions"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="features-functions-top-level-functions" style="left: -46px; position: relative;">5.5.1 Top-level functions<a href="#features-functions-top-level-functions" alt="link to features-functions-top-level-functions"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Top-level functions may be defined directly on the <code>exports</code> object, or else
declared locally and optionally exported. See <a href="#file-goog-module-exports">3.3.3 goog.module Exports</a>
for more on exports.</p>

<p class="examples">Examples:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @param {string} str */</span><span class="pln">
exports</span><span class="pun">.</span><span class="pln">processString </span><span class="pun">=</span><span class="pln"> </span><span class="pun">(</span><span class="pln">str</span><span class="pun">)</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// Process the string.</span><span class="pln">
</span><span class="pun">};</span></pre>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @param {string} str */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> processString </span><span class="pun">=</span><span class="pln"> </span><span class="pun">(</span><span class="pln">str</span><span class="pun">)</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// Process the string.</span><span class="pln">
</span><span class="pun">};</span><span class="pln">

exports </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">processString</span><span class="pun">};</span></pre>

<h4 id="features-functions-nested-functions" style="left: -46px; position: relative;">5.5.2 Nested functions and closures<a href="#features-functions-nested-functions" alt="link to features-functions-nested-functions"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Functions may contain nested function definitions. If it is useful to give the
function a name, it should be assigned to a local <code>const</code>.</p>

<h4 id="features-functions-arrow-functions" style="left: -46px; position: relative;">5.5.3 Arrow functions<a href="#features-functions-arrow-functions" alt="link to features-functions-arrow-functions"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Arrow functions provide a concise function syntax and simplify scoping <code>this</code>
for nested functions. Prefer arrow functions over the <code>function</code> keyword for
nested functions (but see <a href="#features-objects-method-shorthand">5.3.5 Method shorthand</a>).</p>

<p>Prefer arrow functions over other <code>this</code> scoping approaches such as
<code>f.bind(this)</code>, <code>goog.bind(f, this)</code>, and <code>const self = this</code>. Arrow functions
are particularly useful for calling into callbacks as they permit explicitly
specifying which parameters to pass to the callback whereas binding will blindly
pass along all parameters.</p>

<p>The left-hand side of the arrow contains zero or more parameters. Parentheses
around the parameters are optional if there is only a single non-destructured
parameter. When parentheses are used, inline parameter types may be specified
(see <a href="#jsdoc-method-and-function-comments">7.8 Method and function comments</a>).</p>

<p class="tip">Tip: Always using parentheses even for single-parameter arrow functions can
avoid situations where adding parameters, but forgetting to add parentheses, may
result in parseable code which no longer works as intended.</p>

<p>The right-hand side of the arrow contains the body of the function. By default
the body is a block statement (zero or more statements surrounded by curly
braces). The body may also be an implicitly returned single expression if
either: the program logic requires returning a value, or the <code>void</code> operator
precedes a single function or method call (using <code>void</code> ensures <code>undefined</code> is
returned, prevents leaking values, and communicates intent). The single
expression form is preferred if it improves readability (e.g., for short or
simple expressions).</p>

<p class="examples">Examples:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * Arrow functions can be documented just like normal functions.
 * @param {number} numParam A number to add.
 * @param {string} strParam Another number to add that happens to be a string.
 * @return {number} The sum of the two parameters.
 */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> moduleLocalFunc </span><span class="pun">=</span><span class="pln"> </span><span class="pun">(</span><span class="pln">numParam</span><span class="pun">,</span><span class="pln"> strParam</span><span class="pun">)</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> numParam </span><span class="pun">+</span><span class="pln"> </span><span class="typ">Number</span><span class="pun">(</span><span class="pln">strParam</span><span class="pun">);</span><span class="pln">

</span><span class="com">// Uses the single expression syntax with `void` because the program logic does</span><span class="pln">
</span><span class="com">// not require returning a value.</span><span class="pln">
getValue</span><span class="pun">((</span><span class="pln">result</span><span class="pun">)</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> </span><span class="kwd">void</span><span class="pln"> alert</span><span class="pun">(`</span><span class="typ">Got</span><span class="pln"> $</span><span class="pun">{</span><span class="pln">result</span><span class="pun">}`));</span><span class="pln">

</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">CallbackExample</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">constructor</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="com">/** @private {number} */</span><span class="pln">
    </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">cachedValue_ </span><span class="pun">=</span><span class="pln"> </span><span class="lit">0</span><span class="pun">;</span><span class="pln">

    </span><span class="com">// For inline callbacks, you can use inline typing for parameters.</span><span class="pln">
    </span><span class="com">// Uses a block statement because the value of the single expression should</span><span class="pln">
    </span><span class="com">// not be returned and the expression is not a single function call.</span><span class="pln">
    getNullableValue</span><span class="pun">((</span><span class="com">/** ?number */</span><span class="pln"> result</span><span class="pun">)</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
      </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">cachedValue_ </span><span class="pun">=</span><span class="pln"> result </span><span class="pun">==</span><span class="pln"> </span><span class="kwd">null</span><span class="pln"> </span><span class="pun">?</span><span class="pln"> </span><span class="lit">0</span><span class="pln"> </span><span class="pun">:</span><span class="pln"> result</span><span class="pun">;</span><span class="pln">
    </span><span class="pun">});</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">}</span></pre>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">/**
 * A function with no params and no returned value.
 * This single expression body usage is illegal because the program logic does
 * not require returning a value and we're missing the `void` operator.
 */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> moduleLocalFunc </span><span class="pun">=</span><span class="pln"> </span><span class="pun">()</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> anotherFunction</span><span class="pun">();</span></pre>

<h4 id="features-functions-generators" style="left: -46px; position: relative;">5.5.4 Generators<a href="#features-functions-generators" alt="link to features-functions-generators"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Generators enable a number of useful abstractions and may be used as needed.</p>

<p>When defining generator functions, attach the <code>*</code> to the <code>function</code> keyword when
present, and separate it with a space from the name of the function. When using
delegating yields, attach the <code>*</code> to the <code>yield</code> keyword.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @return {!Iterator&lt;number&gt;} */</span><span class="pln">
</span><span class="kwd">function</span><span class="pun">*</span><span class="pln"> gen1</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">yield</span><span class="pln"> </span><span class="lit">42</span><span class="pun">;</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">/** @return {!Iterator&lt;number&gt;} */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> gen2 </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">function</span><span class="pun">*()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">yield</span><span class="pun">*</span><span class="pln"> gen1</span><span class="pun">();</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">SomeClass</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/** @return {!Iterator&lt;number&gt;} */</span><span class="pln">
  </span><span class="pun">*</span><span class="pln"> gen</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="kwd">yield</span><span class="pln"> </span><span class="lit">42</span><span class="pun">;</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">}</span></pre>

<h4 id="features-functions-parameter-return-types" style="left: -46px; position: relative;">5.5.5 Parameter and return types<a href="#features-functions-parameter-return-types" alt="link to features-functions-parameter-return-types"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Function parameters and return types should usually be documented with JSDoc
annotations. See <a href="#jsdoc-method-and-function-comments">7.8 Method and function comments</a> for more information.</p>

<h5 id="features-functions-default-parameters">5.5.5.1 Default parameters</h5>

<p>Optional parameters are permitted using the equals operator in the parameter
list. Optional parameters must include spaces on both sides of the equals
operator, be named exactly like required parameters (i.e., not prefixed with
<code>opt_</code>), use the <code>=</code> suffix in their JSDoc type, come after required parameters,
and not use initializers that produce observable side effects. All optional
parameters for concrete functions must have default values, even if that value
is <code>undefined</code>. In contrast to concrete functions, abstract and interface
methods must omit default parameter values.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * @param {string} required This parameter is always needed.
 * @param {string=} optional This parameter can be omitted.
 * @param {!Node=} node Another optional parameter.
 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> maybeDoSomething</span><span class="pun">(</span><span class="pln">required</span><span class="pun">,</span><span class="pln"> optional </span><span class="pun">=</span><span class="pln"> </span><span class="str">''</span><span class="pun">,</span><span class="pln"> node </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">undefined</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{}</span><span class="pln">

</span><span class="com">/** @interface */</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">MyInterface</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/**
   * Interface and abstract methods must omit default parameter values.
   * @param {string=} optional
   */</span><span class="pln">
  someMethod</span><span class="pun">(</span><span class="pln">optional</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{}</span><span class="pln">
</span><span class="pun">}</span></pre>

<p>Use default parameters sparingly. Prefer destructuring (as in
<a href="#features-objects-destructuring">5.3.7 Destructuring</a>) to create readable APIs when there are
more than a small handful of optional parameters that do not have a natural
order.</p>

<p class="note">Note: Unlike Python's default parameters, it is okay to use initializers that
return new mutable objects (such as <code>{}</code> or <code>[]</code>) because the initializer is
evaluated each time the default value is used, so a single object won't be
shared across invocations.</p>

<p class="tip">Tip: While arbitrary expressions including function calls may be used as
initializers, these should be kept as simple as possible. Avoid initializers
that expose shared mutable state, as that can easily introduce unintended
coupling between function calls.</p>

<h5 id="features-functions-rest-parameters">5.5.5.2 Rest parameters</h5>

<p>Use a <em>rest</em> parameter instead of accessing <code>arguments</code>. Rest parameters are
typed with a <code>...</code> prefix in their JSDoc. The rest parameter must be the last
parameter in the list. There is no space between the <code>...</code> and the parameter
name. Do not name the rest parameter <code>var_args</code>. Never name a local variable or
parameter <code>arguments</code>, which confusingly shadows the built-in name.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * @param {!Array&lt;string&gt;} array This is an ordinary parameter.
 * @param {...number} numbers The remainder of arguments are all numbers.
 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> variadic</span><span class="pun">(</span><span class="pln">array</span><span class="pun">,</span><span class="pln"> </span><span class="pun">...</span><span class="pln">numbers</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{}</span></pre>

<h4 id="features-functions-generics" style="left: -46px; position: relative;">5.5.6 Generics<a href="#features-functions-generics" alt="link to features-functions-generics"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Declare generic functions and methods when necessary with <code>@template TYPE</code> in
the JSDoc above the function or method definition.</p>

<h4 id="features-functions-spread-operator" style="left: -46px; position: relative;">5.5.7 Spread operator<a href="#features-functions-spread-operator" alt="link to features-functions-spread-operator"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Function calls may use the spread operator (<code>...</code>). Prefer the spread operator
to <code>Function.prototype.apply</code> when an array or iterable is unpacked into
multiple parameters of a variadic function. There is no space after the <code>...</code>.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">function</span><span class="pln"> myFunction</span><span class="pun">(...</span><span class="pln">elements</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{}</span><span class="pln">
myFunction</span><span class="pun">(...</span><span class="pln">array</span><span class="pun">,</span><span class="pln"> </span><span class="pun">...</span><span class="pln">iterable</span><span class="pun">,</span><span class="pln"> </span><span class="pun">...</span><span class="pln">generator</span><span class="pun">());</span></pre>

<h3 id="features-string-literals" style="left: -46px; position: relative;">5.6 String literals<a href="#features-string-literals" alt="link to features-string-literals"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="features-strings-use-single-quotes" style="left: -46px; position: relative;">5.6.1 Use single quotes<a href="#features-strings-use-single-quotes" alt="link to features-strings-use-single-quotes"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Ordinary string literals are delimited with single quotes (<code>'</code>), rather than
double quotes (<code>"</code>).</p>

<p class="tip">Tip: if a string contains a single quote character, consider using a template
string to avoid having to escape the quote.</p>

<p>Ordinary string literals may not span multiple lines.</p>

<h4 id="features-strings-template-strings" style="left: -46px; position: relative;">5.6.2 Template literals<a href="#features-strings-template-strings" alt="link to features-strings-template-strings"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Use template literals (delimited with <code>`</code>) over complex string
concatenation, particularly if multiple string literals are involved. Template
literals may span multiple lines.</p>

<p>If a template literal spans multiple lines, it does not need to follow the
indentation of the enclosing block, though it may if the added whitespace does
not matter.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">function</span><span class="pln"> arithmetic</span><span class="pun">(</span><span class="pln">a</span><span class="pun">,</span><span class="pln"> b</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">return</span><span class="pln"> </span><span class="pun">`</span><span class="typ">Here</span><span class="pln"> is a table </span><span class="kwd">of</span><span class="pln"> arithmetic operations</span><span class="pun">:</span><span class="pln">
$</span><span class="pun">{</span><span class="pln">a</span><span class="pun">}</span><span class="pln"> </span><span class="pun">+</span><span class="pln"> $</span><span class="pun">{</span><span class="pln">b</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> $</span><span class="pun">{</span><span class="pln">a </span><span class="pun">+</span><span class="pln"> b</span><span class="pun">}</span><span class="pln">
$</span><span class="pun">{</span><span class="pln">a</span><span class="pun">}</span><span class="pln"> </span><span class="pun">-</span><span class="pln"> $</span><span class="pun">{</span><span class="pln">b</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> $</span><span class="pun">{</span><span class="pln">a </span><span class="pun">-</span><span class="pln"> b</span><span class="pun">}</span><span class="pln">
$</span><span class="pun">{</span><span class="pln">a</span><span class="pun">}</span><span class="pln"> </span><span class="pun">*</span><span class="pln"> $</span><span class="pun">{</span><span class="pln">b</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> $</span><span class="pun">{</span><span class="pln">a </span><span class="pun">*</span><span class="pln"> b</span><span class="pun">}</span><span class="pln">
$</span><span class="pun">{</span><span class="pln">a</span><span class="pun">}</span><span class="pln"> </span><span class="pun">/</span><span class="pln"> $</span><span class="pun">{</span><span class="pln">b</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> $</span><span class="pun">{</span><span class="pln">a </span><span class="pun">/</span><span class="pln"> b</span><span class="pun">}`;</span><span class="pln">
</span><span class="pun">}</span></pre>

<h4 id="features-strings-no-line-continuations" style="left: -46px; position: relative;">5.6.3 No line continuations<a href="#features-strings-no-line-continuations" alt="link to features-strings-no-line-continuations"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Do not use <em>line continuations</em> (that is, ending a line inside a string literal
with a backslash) in either ordinary or template string literals. Even though
ES5 allows this, it can lead to tricky errors if any trailing whitespace comes
after the slash, and is less obvious to readers.</p>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">const</span><span class="pln"> longString </span><span class="pun">=</span><span class="pln"> </span><span class="str">'</span><span class="typ">This</span><span class="pln"> is a very </span><span class="kwd">long</span><span class="pln"> string that far exceeds the </span><span class="lit">80</span><span class="pln"> \
    column limit</span><span class="pun">.</span><span class="pln"> </span><span class="typ">It</span><span class="pln"> unfortunately contains </span><span class="kwd">long</span><span class="pln"> stretches </span><span class="kwd">of</span><span class="pln"> spaces due \
    to how the continued lines are indented</span><span class="pun">.</span><span class="str">';</span></pre>

<p>Instead, write</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> longString </span><span class="pun">=</span><span class="pln"> </span><span class="str">'This is a very long string that far exceeds the 80 '</span><span class="pln"> </span><span class="pun">+</span><span class="pln">
    </span><span class="str">'column limit. It does not contain long stretches of spaces since '</span><span class="pln"> </span><span class="pun">+</span><span class="pln">
    </span><span class="str">'the concatenated strings are cleaner.'</span><span class="pun">;</span></pre>

<h3 id="features-number-literals" style="left: -46px; position: relative;">5.7 Number literals<a href="#features-number-literals" alt="link to features-number-literals"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Numbers may be specified in decimal, hex, octal, or binary. Use exactly <code>0x</code>,
<code>0o</code>, and <code>0b</code> prefixes, with lowercase letters, for hex, octal, and binary,
respectively. Never include a leading zero unless it is immediately followed by
<code>x</code>, <code>o</code>, or <code>b</code>.</p>

<h3 id="features-control-structures" style="left: -46px; position: relative;">5.8 Control structures<a href="#features-control-structures" alt="link to features-control-structures"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="features-for-loops" style="left: -46px; position: relative;">5.8.1 For loops<a href="#features-for-loops" alt="link to features-for-loops"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>With ES6, the language now has three different kinds of <code>for</code> loops. All may be
used, though <code>for</code>-<code>of</code> loops should be preferred when possible.</p>

<p><code>for</code>-<code>in</code> loops may only be used on dict-style objects (see
<a href="#features-objects-mixing-keys">5.3.3 Do not mix quoted and unquoted keys</a>), and should not be used to iterate over an
array. <code>Object.prototype.hasOwnProperty</code> should be used in <code>for</code>-<code>in</code> loops to
exclude unwanted prototype properties. Prefer <code>for</code>-<code>of</code> and <code>Object.keys</code> over
<code>for</code>-<code>in</code> when possible.</p>

<h4 id="features-exceptions" style="left: -46px; position: relative;">5.8.2 Exceptions<a href="#features-exceptions" alt="link to features-exceptions"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Exceptions are an important part of the language and should be used whenever
exceptional cases occur. Always throw <code>Error</code>s or subclasses of <code>Error</code>: never
throw string literals or other objects. Always use <code>new</code> when constructing an
<code>Error</code>.</p>

<p>This treatment extends to <code>Promise</code> rejection values as <code>Promise.reject(obj)</code> is
equivalent to <code>throw obj;</code> in async functions.</p>

<p>Custom exceptions provide a great way to convey additional error information
from functions. They should be defined and used wherever the native <code>Error</code> type
is insufficient.</p>

<p>Prefer throwing exceptions over ad-hoc error-handling approaches (such as
passing an error container reference type, or returning an object with an error
property).</p>

<h5 id="features-empty-catch-blocks">5.8.2.1 Empty catch blocks</h5>

<p>It is very rarely correct to do nothing in response to a caught exception. When
it truly is appropriate to take no action whatsoever in a catch block, the
reason this is justified is explained in a comment.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">try</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">return</span><span class="pln"> handleNumericResponse</span><span class="pun">(</span><span class="pln">response</span><span class="pun">);</span><span class="pln">
</span><span class="pun">}</span><span class="pln"> </span><span class="kwd">catch</span><span class="pln"> </span><span class="pun">(</span><span class="pln">ok</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// it's not numeric; that's fine, just continue</span><span class="pln">
</span><span class="pun">}</span><span class="pln">
</span><span class="kwd">return</span><span class="pln"> handleTextResponse</span><span class="pun">(</span><span class="pln">response</span><span class="pun">);</span></pre>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="pln">  </span><span class="kwd">try</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    shouldFail</span><span class="pun">();</span><span class="pln">
    fail</span><span class="pun">(</span><span class="str">'expected an error'</span><span class="pun">);</span><span class="pln">
  </span><span class="pun">}</span><span class="pln"> </span><span class="kwd">catch</span><span class="pln"> </span><span class="pun">(</span><span class="pln">expected</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="pun">}</span></pre>

<p class="tip">Tip: Unlike in some other languages, patterns like the above simply don’t work
since this will catch the error thrown by <code>fail</code>. Use <code>assertThrows()</code> instead.</p>

<h4 id="features-switch-statements" style="left: -46px; position: relative;">5.8.3 Switch statements<a href="#features-switch-statements" alt="link to features-switch-statements"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Terminology Note: Inside the braces of a switch block are one or more statement
groups. Each statement group consists of one or more switch labels (either <code>case
FOO:</code> or <code>default:</code>), followed by one or more statements.</p>

<h5 id="features-switch-fall-through">5.8.3.1 Fall-through: commented</h5>

<p>Within a switch block, each statement group either terminates abruptly (with a
<code>break</code>, <code>return</code> or <code>throw</code>n exception), or is marked with a comment to
indicate that execution will or might continue into the next statement group.
Any comment that communicates the idea of fall-through is sufficient (typically
<code>// fall through</code>). This special comment is not required in the last statement
group of the switch block.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">switch</span><span class="pln"> </span><span class="pun">(</span><span class="pln">input</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">case</span><span class="pln"> </span><span class="lit">1</span><span class="pun">:</span><span class="pln">
  </span><span class="kwd">case</span><span class="pln"> </span><span class="lit">2</span><span class="pun">:</span><span class="pln">
    prepareOneOrTwo</span><span class="pun">();</span><span class="pln">
  </span><span class="com">// fall through</span><span class="pln">
  </span><span class="kwd">case</span><span class="pln"> </span><span class="lit">3</span><span class="pun">:</span><span class="pln">
    handleOneTwoOrThree</span><span class="pun">();</span><span class="pln">
    </span><span class="kwd">break</span><span class="pun">;</span><span class="pln">
  </span><span class="kwd">default</span><span class="pun">:</span><span class="pln">
    handleLargeNumber</span><span class="pun">(</span><span class="pln">input</span><span class="pun">);</span><span class="pln">
</span><span class="pun">}</span></pre>

<h5 id="features-switch-default-case">5.8.3.2 The <code>default</code> case is present</h5>

<p>Each switch statement includes a <code>default</code> statement group, even if it contains
no code. The <code>default</code> statement group must be last.</p>

<h3 id="features-this" style="left: -46px; position: relative;">5.9 this<a href="#features-this" alt="link to features-this"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Only use <code>this</code> in class constructors and methods, in arrow functions defined
within class constructors and methods, or in functions that have an explicit
<code>@this</code> declared in the immediately-enclosing function’s JSDoc.</p>

<p>Never use <code>this</code> to refer to the global object, the context of an <code>eval</code>, the
target of an event, or unnecessarily <code>call()</code>ed or <code>apply()</code>ed functions.</p>

<h3 id="features-equality-checks" style="left: -46px; position: relative;">5.10 Equality Checks<a href="#features-equality-checks" alt="link to features-equality-checks"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Use identity operators (<code>===</code>/<code>!==</code>) except in the cases documented below.</p>

<h4 id="features-equality-checks-exceptions" style="left: -46px; position: relative;">5.10.1 Exceptions Where Coercion is Desirable<a href="#features-equality-checks-exceptions" alt="link to features-equality-checks-exceptions"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Catching both <code>null</code> and <code>undefined</code> values:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">if</span><span class="pln"> </span><span class="pun">(</span><span class="pln">someObjectOrPrimitive </span><span class="pun">==</span><span class="pln"> </span><span class="kwd">null</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// Checking for null catches both null and undefined for objects and</span><span class="pln">
  </span><span class="com">// primitives, but does not catch other falsy values like 0 or the empty</span><span class="pln">
  </span><span class="com">// string.</span><span class="pln">
</span><span class="pun">}</span></pre>

<h3 id="disallowed-features" style="left: -46px; position: relative;">5.11 Disallowed features<a href="#disallowed-features" alt="link to disallowed-features"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="disallowed-features-with" style="left: -46px; position: relative;">5.11.1 with<a href="#disallowed-features-with" alt="link to disallowed-features-with"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Do not use the <code>with</code> keyword. It makes your code harder to understand and has
been banned in strict mode since ES5.</p>

<h4 id="disallowed-features-dynamic-code-evaluation" style="left: -46px; position: relative;">5.11.2 Dynamic code evaluation<a href="#disallowed-features-dynamic-code-evaluation" alt="link to disallowed-features-dynamic-code-evaluation"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Do not use <code>eval</code> or the <code>Function(...string)</code> constructor (except for code
loaders). These features are potentially dangerous and simply do not work in CSP
environments.</p>

<h4 id="disallowed-features-automatic-semicolon-insertion" style="left: -46px; position: relative;">5.11.3 Automatic semicolon insertion<a href="#disallowed-features-automatic-semicolon-insertion" alt="link to disallowed-features-automatic-semicolon-insertion"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Always terminate statements with semicolons (except function and class
declarations, as noted above).</p>

<h4 id="disallowed-features-non-standard-features" style="left: -46px; position: relative;">5.11.4 Non-standard features<a href="#disallowed-features-non-standard-features" alt="link to disallowed-features-non-standard-features"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Do not use non-standard features. This includes old features that have been
removed (e.g., <code>WeakMap.clear</code>), new features that are not yet standardized
(e.g., the current TC39 working draft, proposals at any stage, or proposed but
not-yet-complete web standards), or proprietary features that are only
implemented in some browsers. Use only features defined in the current ECMA-262
or WHATWG standards. (Note that projects writing against specific APIs, such as
Chrome extensions or Node.js, can obviously use those APIs). Non-standard
language “extensions” (such as those provided by some external transpilers) are
forbidden.</p>

<h4 id="disallowed-features-wrapper-objects" style="left: -46px; position: relative;">5.11.5 Wrapper objects for primitive types<a href="#disallowed-features-wrapper-objects" alt="link to disallowed-features-wrapper-objects"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Never use <code>new</code> on the primitive object wrappers (<code>Boolean</code>, <code>Number</code>, <code>String</code>,
<code>Symbol</code>), nor include them in type annotations.</p>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">const</span><span class="pln"> </span><span class="com">/** Boolean */</span><span class="pln"> x </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">new</span><span class="pln"> </span><span class="typ">Boolean</span><span class="pun">(</span><span class="kwd">false</span><span class="pun">);</span><span class="pln">
</span><span class="kwd">if</span><span class="pln"> </span><span class="pun">(</span><span class="pln">x</span><span class="pun">)</span><span class="pln"> alert</span><span class="pun">(</span><span class="kwd">typeof</span><span class="pln"> x</span><span class="pun">);</span><span class="pln">  </span><span class="com">// alerts 'object' - WAT?</span></pre>

<p>The wrappers may be called as functions for coercing (which is preferred over
using <code>+</code> or concatenating the empty string) or creating symbols.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> </span><span class="com">/** boolean */</span><span class="pln"> x </span><span class="pun">=</span><span class="pln"> </span><span class="typ">Boolean</span><span class="pun">(</span><span class="lit">0</span><span class="pun">);</span><span class="pln">
</span><span class="kwd">if</span><span class="pln"> </span><span class="pun">(!</span><span class="pln">x</span><span class="pun">)</span><span class="pln"> alert</span><span class="pun">(</span><span class="kwd">typeof</span><span class="pln"> x</span><span class="pun">);</span><span class="pln">  </span><span class="com">// alerts 'boolean', as expected</span></pre>

<h4 id="disallowed-features-modifying-builtin-objects" style="left: -46px; position: relative;">5.11.6 Modifying builtin objects<a href="#disallowed-features-modifying-builtin-objects" alt="link to disallowed-features-modifying-builtin-objects"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Never modify builtin types, either by adding methods to their constructors or to
their prototypes. Avoid depending on libraries that do this. Note that the
JSCompiler’s runtime library will provide standards-compliant polyfills where
possible; nothing else may modify builtin objects.</p>

<p>Do not add symbols to the global object unless absolutely necessary (e.g.
required by a third-party API).</p>

<h4 id="disallowed-features-omitting-parents-with-new" style="left: -46px; position: relative;">5.11.7 Omitting <code>()</code> when invoking a constructor<a href="#disallowed-features-omitting-parents-with-new" alt="link to disallowed-features-omitting-parents-with-new"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Never invoke a constructor in a <code>new</code> statement without using parentheses <code>()</code>.</p>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">new</span><span class="pln"> </span><span class="typ">Foo</span><span class="pun">;</span></pre>

<p>Use instead:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">new</span><span class="pln"> </span><span class="typ">Foo</span><span class="pun">();</span></pre>

<p>Omitting parentheses can lead to subtle mistakes. These two lines are not
equivalent:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">new</span><span class="pln"> </span><span class="typ">Foo</span><span class="pun">().</span><span class="typ">Bar</span><span class="pun">();</span><span class="pln">
</span><span class="kwd">new</span><span class="pln"> </span><span class="typ">Foo</span><span class="pun">.</span><span class="typ">Bar</span><span class="pun">();</span></pre>

<h2 id="naming" style="left: -46px; position: relative;">6 Naming<a href="#naming" alt="link to naming"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h2>

<h3 id="naming-rules-common-to-all-identifiers" style="left: -46px; position: relative;">6.1 Rules common to all identifiers<a href="#naming-rules-common-to-all-identifiers" alt="link to naming-rules-common-to-all-identifiers"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Identifiers use only ASCII letters and digits, and, in a small number of cases
noted below, underscores and very rarely (when required by frameworks like
Angular) dollar signs.</p>

<p>Give as descriptive a name as possible, within reason. Do not worry about saving
horizontal space as it is far more important to make your code immediately
understandable by a new reader. Do not use abbreviations that are ambiguous or
unfamiliar to readers outside your project, and do not abbreviate by deleting
letters within a word.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pln">errorCount          </span><span class="com">// No abbreviation.</span><span class="pln">
dnsConnectionIndex  </span><span class="com">// Most people know what "DNS" stands for.</span><span class="pln">
referrerUrl         </span><span class="com">// Ditto for "URL".</span><span class="pln">
customerId          </span><span class="com">// "Id" is both ubiquitous and unlikely to be misunderstood.</span></pre>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="pln">n                   </span><span class="com">// Meaningless.</span><span class="pln">
nErr                </span><span class="com">// Ambiguous abbreviation.</span><span class="pln">
nCompConns          </span><span class="com">// Ambiguous abbreviation.</span><span class="pln">
wgcConnections      </span><span class="com">// Only your group knows what this stands for.</span><span class="pln">
pcReader            </span><span class="com">// Lots of things can be abbreviated "pc".</span><span class="pln">
cstmrId             </span><span class="com">// Deletes internal letters.</span><span class="pln">
kSecondsPerDay      </span><span class="com">// Do not use Hungarian notation.</span></pre>

<p class="exception"><strong>Exception</strong>: Variables that are in scope for 10 lines or fewer, including
arguments that are <em>not</em> part of an exported API, <em>may</em> use short (e.g. single
letter) variable names.</p>

<h3 id="naming-rules-by-identifier-type" style="left: -46px; position: relative;">6.2 Rules by identifier type<a href="#naming-rules-by-identifier-type" alt="link to naming-rules-by-identifier-type"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="naming-package-names" style="left: -46px; position: relative;">6.2.1 Package names<a href="#naming-package-names" alt="link to naming-package-names"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Package names are all <code>lowerCamelCase</code>. For example, <code>my.exampleCode.deepSpace</code>,
but not <code class="badcode">my.examplecode.deepspace</code> or
<code class="badcode">my.example_code.deep_space</code>.</p>

<p class="exception"><strong>Exception</strong>: The package name may conform to TypeScript's path-based pattern. This is
typically all lower case with underscores where present in filenames.</p>

<h4 id="naming-class-names" style="left: -46px; position: relative;">6.2.2 Class names<a href="#naming-class-names" alt="link to naming-class-names"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Class, interface, record, and typedef names are written in <code>UpperCamelCase</code>.
Unexported classes are simply locals: they are not marked <code>@private</code>.</p>

<p>Type names are typically nouns or noun phrases. For example, <code>Request</code>,
<code>ImmutableView</code>, or <code>VisibilityMode</code>. Additionally, interface names may
sometimes be adjectives or adjective phrases instead (for example, <code>Readable</code>).</p>

<h4 id="naming-method-names" style="left: -46px; position: relative;">6.2.3 Method names<a href="#naming-method-names" alt="link to naming-method-names"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Method names are written in <code>lowerCamelCase</code>. Names for <code>@private</code> methods may
optionally end with a trailing underscore.</p>

<p>Method names are typically verbs or verb phrases. For example, <code>sendMessage</code> or
<code>stop_</code>. Getter and setter methods for properties are never required, but if
they are used they should be named <code>getFoo</code> (or optionally <code>isFoo</code> or <code>hasFoo</code>
for booleans), or <code>setFoo(value)</code> for setters.</p>

<p>Underscores may also appear in JsUnit test method names to separate logical
components of the name. One typical pattern is
<code>test&lt;MethodUnderTest&gt;_&lt;state&gt;_&lt;expectedOutcome&gt;</code>, for example
<code>testPop_emptyStack_throws</code>. There is no One Correct Way to name test methods.</p>

<h4 id="naming-enum-names" style="left: -46px; position: relative;">6.2.4 Enum names<a href="#naming-enum-names" alt="link to naming-enum-names"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Enum names are written in <code>UpperCamelCase</code>, similar to classes, and should
generally be singular nouns. Individual items within the enum are named in
<code>CONSTANT_CASE</code>.</p>

<h4 id="naming-constant-names" style="left: -46px; position: relative;">6.2.5 Constant names<a href="#naming-constant-names" alt="link to naming-constant-names"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Constant names use <code>CONSTANT_CASE</code>: all uppercase letters, with words separated
by underscores. There is no reason for a constant to be named with a trailing
underscore, since private static properties can be replaced by (implicitly
private) module locals.</p>

<h5 id="naming-definition-of-constant">6.2.5.1 Definition of “constant”</h5>

<p>Every constant is a <code>@const</code> static property or a module-local <code>const</code>
declaration, but not all <code>@const</code> static properties and module-local <code>const</code>s
are constants. Before choosing constant case, consider whether the field really
feels like a <em>deeply immutable</em> constant. For example, if any of that instance's
observable state can change, it is almost certainly not a constant. Merely
intending to never mutate the object is generally not enough.</p>

<p class="examples">Examples:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">// Constants</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> NUMBER </span><span class="pun">=</span><span class="pln"> </span><span class="lit">5</span><span class="pun">;</span><span class="pln">
</span><span class="com">/** @const */</span><span class="pln"> exports</span><span class="pun">.</span><span class="pln">NAMES </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">debug</span><span class="pun">.</span><span class="pln">freeze</span><span class="pun">([</span><span class="str">'Ed'</span><span class="pun">,</span><span class="pln"> </span><span class="str">'Ann'</span><span class="pun">]);</span><span class="pln">
</span><span class="com">/** @enum */</span><span class="pln"> exports</span><span class="pun">.</span><span class="typ">SomeEnum</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> ENUM_CONSTANT</span><span class="pun">:</span><span class="pln"> </span><span class="str">'value'</span><span class="pln"> </span><span class="pun">};</span><span class="pln">

</span><span class="com">// Not constants</span><span class="pln">
</span><span class="kwd">let</span><span class="pln"> letVariable </span><span class="pun">=</span><span class="pln"> </span><span class="str">'non-const'</span><span class="pun">;</span><span class="pln">

</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">MyClass</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">constructor</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="com">/** @const {string} */</span><span class="pln"> </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">nonStatic </span><span class="pun">=</span><span class="pln"> </span><span class="str">'non-static'</span><span class="pun">;</span><span class="pln"> </span><span class="pun">}</span><span class="pln">
</span><span class="pun">};</span><span class="pln">
</span><span class="com">/** @type {string} */</span><span class="pln">
</span><span class="typ">MyClass</span><span class="pun">.</span><span class="pln">staticButMutable </span><span class="pun">=</span><span class="pln"> </span><span class="str">'not @const, can be reassigned'</span><span class="pun">;</span><span class="pln">

</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** Set&lt;string&gt; */</span><span class="pln"> mutableCollection </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">new</span><span class="pln"> </span><span class="typ">Set</span><span class="pun">();</span><span class="pln">

</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** MyImmutableContainer&lt;SomeMutableType&gt; */</span><span class="pln"> stillMutable </span><span class="pun">=</span><span class="pln">
    </span><span class="kwd">new</span><span class="pln"> </span><span class="typ">MyImmutableContainer</span><span class="pun">(</span><span class="pln">mutableInner</span><span class="pun">);</span><span class="pln">

</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="typ">Foo</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'my.foo'</span><span class="pun">);</span><span class="pln">  </span><span class="com">// mirrors imported name</span><span class="pln">

</span><span class="kwd">const</span><span class="pln"> logger </span><span class="pun">=</span><span class="pln"> log</span><span class="pun">.</span><span class="pln">getLogger</span><span class="pun">(</span><span class="str">'loggers.are.not.immutable'</span><span class="pun">);</span></pre>

<p>Constants’ names are typically nouns or noun phrases.</p>

<h5 id="naming-local-aliases">6.2.5.2 Local aliases</h5>

<p>Local aliases should be used whenever they improve readability over
fully-qualified names. Follow the same rules as <code>goog.require</code>s
(<a href="#file-goog-require">3.6 goog.require and goog.requireType statements</a>), maintaining the last part of the aliased name.
Aliases may also be used within functions. Aliases must be <code>const</code>.</p>

<p class="examples">Examples:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> staticHelper </span><span class="pun">=</span><span class="pln"> importedNamespace</span><span class="pun">.</span><span class="pln">staticHelper</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> CONSTANT_NAME </span><span class="pun">=</span><span class="pln"> </span><span class="typ">ImportedClass</span><span class="pun">.</span><span class="pln">CONSTANT_NAME</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="pun">{</span><span class="pln">assert</span><span class="pun">,</span><span class="pln"> assertInstanceof</span><span class="pun">}</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> asserts</span><span class="pun">;</span></pre>

<h4 id="naming-non-constant-field-names" style="left: -46px; position: relative;">6.2.6 Non-constant field names<a href="#naming-non-constant-field-names" alt="link to naming-non-constant-field-names"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Non-constant field names (static or otherwise) are written in <code>lowerCamelCase</code>,
with an optional trailing underscore for private fields.</p>

<p>These names are typically nouns or noun phrases. For example, <code>computedValues</code>
or <code>index_</code>.</p>

<h4 id="naming-parameter-names" style="left: -46px; position: relative;">6.2.7 Parameter names<a href="#naming-parameter-names" alt="link to naming-parameter-names"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Parameter names are written in <code>lowerCamelCase</code>. Note that this applies even if
the parameter expects a constructor.</p>

<p>One-character parameter names should not be used in public methods.</p>

<p class="exception"><strong>Exception</strong>: When required by a third-party framework, parameter names may
begin with a <code>$</code>. This exception does not apply to any other identifiers (e.g.
local variables or properties).</p>

<h4 id="naming-local-variable-names" style="left: -46px; position: relative;">6.2.8 Local variable names<a href="#naming-local-variable-names" alt="link to naming-local-variable-names"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Local variable names are written in <code>lowerCamelCase</code>, except for module-local
(top-level) constants, as described above. Constants in function scopes are
still named in <code>lowerCamelCase</code>. Note that <code>lowerCamelCase</code> is used
even if the variable holds a constructor.</p>

<h4 id="naming-template-parameter-names" style="left: -46px; position: relative;">6.2.9 Template parameter names<a href="#naming-template-parameter-names" alt="link to naming-template-parameter-names"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Template parameter names should be concise, single-word or single-letter
identifiers, and must be all-caps, such as <code>TYPE</code> or <code>THIS</code>.</p>

<h4 id="naming-module-local-names" style="left: -46px; position: relative;">6.2.10 Module-local names<a href="#naming-module-local-names" alt="link to naming-module-local-names"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Module-local names that are not exported are implicitly private. They are not
marked <code>@private</code>. This applies to classes, functions, variables, constants,
enums, and other module-local identifiers.</p>

<h3 id="naming-camel-case-defined" style="left: -46px; position: relative;">6.3 Camel case: defined<a href="#naming-camel-case-defined" alt="link to naming-camel-case-defined"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Sometimes there is more than one reasonable way to convert an English phrase
into camel case, such as when acronyms or unusual constructs like <q>IPv6</q> or
<q>iOS</q> are present. To improve predictability, Google Style specifies the
following (nearly) deterministic scheme.</p>

<p>Beginning with the prose form of the name:</p>

<ol>
<li>Convert the phrase to plain ASCII and remove any apostrophes. For example,
<q>Müller's algorithm</q> might become <q>Muellers algorithm</q>.</li>
<li>Divide this result into words, splitting on spaces and any remaining
punctuation (typically hyphens).
<ol>
<li>Recommended: if any word already has a conventional camel case
appearance in common usage, split this into its constituent parts (e.g.,
<q>AdWords</q> becomes <q>ad words</q>). Note that a word such as <q>iOS</q> is not
really in camel case per se; it defies any convention, so this
recommendation does not apply.</li>
</ol></li>
<li>Now lowercase everything (including acronyms), then uppercase only the first
character of:
<ol>
<li>… each word, to yield <code>UpperCamelCase</code>, or</li>
<li>… each word except the first, to yield <code>lowerCamelCase</code></li>
</ol></li>
<li>Finally, join all the words into a single identifier.</li>
</ol>

<p>Note that the casing of the original words is almost entirely disregarded.</p>

<p>Examples of <code>lowerCamelCase</code>:</p>

<table>
<thead>
<tr>
<th style="text-align: center">Prose form</th>
<th style="text-align: center">Correct</th>
<th style="text-align: center">Incorrect</th>
</tr>
</thead>

<tbody>
<tr>
<td style="text-align: center"><q>XML HTTP request</q></td>
<td style="text-align: center"><code>xmlHttpRequest</code></td>
<td style="text-align: center"><code>XMLHTTPRequest</code></td>
</tr>
<tr>
<td style="text-align: center"><q>new customer ID</q></td>
<td style="text-align: center"><code>newCustomerId</code></td>
<td style="text-align: center"><code>newCustomerID</code></td>
</tr>
<tr>
<td style="text-align: center"><q>inner stopwatch</q></td>
<td style="text-align: center"><code>innerStopwatch</code></td>
<td style="text-align: center"><code>innerStopWatch</code></td>
</tr>
<tr>
<td style="text-align: center"><q>supports IPv6 on iOS?</q></td>
<td style="text-align: center"><code>supportsIpv6OnIos</code></td>
<td style="text-align: center"><code>supportsIPv6OnIOS</code></td>
</tr>
<tr>
<td style="text-align: center"><q>YouTube importer</q></td>
<td style="text-align: center"><code>youTubeImporter</code></td>
<td style="text-align: center"><code>youtubeImporter</code>*</td>
</tr>
</tbody>
</table>

<p>*Acceptable, but not recommended.</p>

<p>For examples of <code>UpperCamelCase</code>, uppercase the first letter of each correct
<code>lowerCamelCase</code> example.</p>

<p class="note">Note: Some words are ambiguously hyphenated in the English language: for example
<q>nonempty</q> and <q>non-empty</q> are both correct, so the method names <code>checkNonempty</code>
and <code>checkNonEmpty</code> are likewise both correct.</p>

<h2 id="jsdoc" style="left: -46px; position: relative;">7 JSDoc<a href="#jsdoc" alt="link to jsdoc"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h2>

<p><a href="https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler">JSDoc</a> is used on all classes, fields, and methods.</p>

<h3 id="jsdoc-general-form" style="left: -46px; position: relative;">7.1 General form<a href="#jsdoc-general-form" alt="link to jsdoc-general-form"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>The basic formatting of JSDoc blocks is as seen in this example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * Multiple lines of JSDoc text are written here,
 * wrapped normally.
 * @param {number} arg A number to do something to.
 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> doSomething</span><span class="pun">(</span><span class="pln">arg</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="pun">…</span><span class="pln"> </span><span class="pun">}</span></pre>

<p>or in this single-line example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @const @private {!Foo} A short bit of JSDoc. */</span><span class="pln">
</span><span class="kwd">this</span><span class="pun">.</span><span class="pln">foo_ </span><span class="pun">=</span><span class="pln"> foo</span><span class="pun">;</span></pre>

<p>If a single-line comment overflows into multiple lines, it must use the
multi-line style with <code>/**</code> and <code>*/</code> on their own lines.</p>

<p>Many tools extract metadata from JSDoc comments to perform code validation and
optimization. As such, these comments <strong>must</strong> be well-formed.</p>

<h3 id="jsdoc-markdown" style="left: -46px; position: relative;">7.2 Markdown<a href="#jsdoc-markdown" alt="link to jsdoc-markdown"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>JSDoc is written in Markdown, though it may include HTML when necessary.</p>

<p>Note that tools that automatically extract JSDoc (e.g. <a href="https://github.com/jleyba/js-dossier">JsDossier</a>) will often
ignore plain text formatting, so if you did this:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">/**
 * Computes weight based on three factors:
 *   items sent
 *   items received
 *   last timestamp
 */</span></pre>

<p>it would come out like this:</p>

<pre class="">Computes weight based on three factors: items sent items received last timestamp
</pre>

<p>Instead, write a Markdown list:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * Computes weight based on three factors:
 *
 *  - items sent
 *  - items received
 *  - last timestamp
 */</span></pre>

<h3 id="jsdoc-tags" style="left: -46px; position: relative;">7.3 JSDoc tags<a href="#jsdoc-tags" alt="link to jsdoc-tags"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Google style allows a subset of JSDoc tags. See
<a href="#appendices-jsdoc-tag-reference">9.1 JSDoc tag reference</a> for the complete list. Most tags must
occupy their own line, with the tag at the beginning of the line.</p>

<p class="disallowed">Disallowed:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">/**
 * The "param" tag must occupy its own line and may not be combined.
 * @param {number} left @param {number} right
 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> add</span><span class="pun">(</span><span class="pln">left</span><span class="pun">,</span><span class="pln"> right</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="pun">...</span><span class="pln"> </span><span class="pun">}</span></pre>

<p>Simple tags that do not require any additional data (such as <code>@private</code>,
<code>@const</code>, <code>@final</code>, <code>@export</code>) may be combined onto the same line, along with an
optional type when appropriate.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * Place more complex annotations (like "implements" and "template")
 * on their own lines. Multiple simple tags (like "export" and "final")
 * may be combined in one line.
 * @export @final
 * @implements {Iterable&lt;TYPE&gt;}
 * @template TYPE
 */</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">MyClass</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/**
   * @param {!ObjType} obj Some object.
   * @param {number=} num An optional number.
   */</span><span class="pln">
  </span><span class="kwd">constructor</span><span class="pun">(</span><span class="pln">obj</span><span class="pun">,</span><span class="pln"> num </span><span class="pun">=</span><span class="pln"> </span><span class="lit">42</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="com">/** @private @const {!Array&lt;!ObjType|number&gt;} */</span><span class="pln">
    </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">data_ </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[</span><span class="pln">obj</span><span class="pun">,</span><span class="pln"> num</span><span class="pun">];</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">}</span></pre>

<p>There is no hard rule for when to combine tags, or in which order, but be
consistent.</p>

<p>For general information about annotating types in JavaScript see
<a href="https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler">Annotating JavaScript for the Closure Compiler</a> and
<a href="https://github.com/google/closure-compiler/wiki/Types-in-the-Closure-Type-System">Types in the Closure Type System</a>.</p>

<h3 id="jsdoc-line-wrapping" style="left: -46px; position: relative;">7.4 Line wrapping<a href="#jsdoc-line-wrapping" alt="link to jsdoc-line-wrapping"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Line-wrapped block tags are indented four spaces. Wrapped description text may
be lined up with the description on previous lines, but this horizontal
alignment is discouraged.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * Illustrates line wrapping for long param/return descriptions.
 * @param {string} foo This is a param with a description too long to fit in
 *     one line.
 * @return {number} This returns something that has a description too long to
 *     fit in one line.
 */</span><span class="pln">
exports</span><span class="pun">.</span><span class="pln">method </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">function</span><span class="pun">(</span><span class="pln">foo</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">return</span><span class="pln"> </span><span class="lit">5</span><span class="pun">;</span><span class="pln">
</span><span class="pun">};</span></pre>

<p>Do not indent when wrapping a <code>@desc</code> or <code>@fileoverview</code> description.</p>

<h3 id="jsdoc-top-file-level-comments" style="left: -46px; position: relative;">7.5 Top/file-level comments<a href="#jsdoc-top-file-level-comments" alt="link to jsdoc-top-file-level-comments"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>A file may have a top-level file overview. A copyright notice, author information,
and default <a href="#jsdoc-visibility-annotations">visibility level</a> are optional.
File overviews are generally recommended whenever a
file consists of more than a single class definition. The top level comment is
designed to orient readers unfamiliar with the code to what is in this file. If
present, it may provide a description of the file's contents and any
dependencies or compatibility information. Wrapped lines are not indented.</p>

<p class="example">Example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * @fileoverview Description of file, its uses and information
 * about its dependencies.
 * @package
 */</span></pre>

<h3 id="jsdoc-class-comments" style="left: -46px; position: relative;">7.6 Class comments<a href="#jsdoc-class-comments" alt="link to jsdoc-class-comments"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Classes, interfaces and records must be documented with a description and any
template parameters, implemented interfaces, visibility, or other appropriate
tags. The class description should provide the reader with enough information to
know how and when to use the class, as well as any additional considerations
necessary to correctly use the class. Textual descriptions may be omitted on the
constructor. When defining a class <code>@constructor</code> and <code>@extends</code> annotations are
not used with the <code>class</code> keyword unless it extends a generic class. When
defining an <code>@interface</code> or a <code>@record</code>, the <code>@extends</code> annotation is used when
defining a subclass and the <code>extends</code> keyword is never used.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * A fancier event target that does cool things.
 * @implements {Iterable&lt;string&gt;}
 */</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">MyFancyTarget</span><span class="pln"> extends </span><span class="typ">EventTarget</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/**
   * @param {string} arg1 An argument that makes this more interesting.
   * @param {!Array&lt;number&gt;} arg2 List of numbers to be processed.
   */</span><span class="pln">
  </span><span class="kwd">constructor</span><span class="pun">(</span><span class="pln">arg1</span><span class="pun">,</span><span class="pln"> arg2</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="com">// ...</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">};</span><span class="pln">

</span><span class="com">/**
 * Records are also helpful.
 * @extends {Iterator&lt;TYPE&gt;}
 * @record
 * @template TYPE
 */</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">Listable</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/** @return {TYPE} The next item in line to be returned. */</span><span class="pln">
  next</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{}</span><span class="pln">
</span><span class="pun">}</span></pre>

<h3 id="jsdoc-enum-and-typedef-comments" style="left: -46px; position: relative;">7.7 Enum and typedef comments<a href="#jsdoc-enum-and-typedef-comments" alt="link to jsdoc-enum-and-typedef-comments"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>All enums and typedefs must be documented with appropriate JSDoc tags
(<code>@typedef</code> or <code>@enum</code>) on the preceding line. Public enums and typedefs must
also have a description. Individual enum items may be documented with a JSDoc
comment on the preceding line.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * A useful type union, which is reused often.
 * @typedef {!FruitType|!FruitTypeEnum}
 */</span><span class="pln">
</span><span class="kwd">let</span><span class="pln"> </span><span class="typ">CoolUnionType</span><span class="pun">;</span><span class="pln">
 
</span><span class="com">/**
 * Types of fruits.
 * @enum {string}
 */</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="typ">FruitTypeEnum</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/** This kind is very sour. */</span><span class="pln">
  SOUR</span><span class="pun">:</span><span class="pln"> </span><span class="str">'sour'</span><span class="pun">,</span><span class="pln">
  </span><span class="com">/** The less-sour kind. */</span><span class="pln">
  SWEET</span><span class="pun">:</span><span class="pln"> </span><span class="str">'sweet'</span><span class="pun">,</span><span class="pln">
</span><span class="pun">};</span></pre>

<p>Typedefs are useful for defining short record types, or aliases for unions,
complex functions, or generic types. Typedefs should be avoided for record types
with many fields, since they do not allow documenting individual fields, nor
using templates or recursive references. For large record types, prefer
<code>@record</code>.</p>

<h3 id="jsdoc-method-and-function-comments" style="left: -46px; position: relative;">7.8 Method and function comments<a href="#jsdoc-method-and-function-comments" alt="link to jsdoc-method-and-function-comments"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>In methods and named functions, parameter and return types must be documented,
even in the case of same-signature <code>@override</code>s. The <code>this</code> type should be
documented when necessary. Return type may be omitted if the function has no
non-empty <code>return</code> statements.</p>

<p>Method, parameter, and return descriptions (but not types) may be omitted if
they are obvious from the rest of the method’s JSDoc or from its signature.</p>

<p>Method descriptions begin with a verb phrase that describes what the method
does. This phrase is not an imperative sentence, but instead is written in the
third person, as if there is an implied <q>This method ...</q> before it.</p>

<p>If a method overrides a superclass method, it must include an <code>@override</code>
annotation. For overridden methods, all <code>@param</code> and <code>@return</code> annotations must
be specified explicitly even if no type from the superclass method is refined.
This is to align with TypeScript.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** A class that does something. */</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">SomeClass</span><span class="pln"> extends </span><span class="typ">SomeBaseClass</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/**
   * Operates on an instance of MyClass and returns something.
   * @param {!MyClass} obj An object that for some reason needs detailed
   *     explanation that spans multiple lines.
   * @param {!OtherClass} obviousOtherClass
   * @return {boolean} Whether something occurred.
   */</span><span class="pln">
  someMethod</span><span class="pun">(</span><span class="pln">obj</span><span class="pun">,</span><span class="pln"> obviousOtherClass</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="pun">...</span><span class="pln"> </span><span class="pun">}</span><span class="pln">

  </span><span class="com">/**
   * @param {string} param
   * @return {string}
   * @override
   */</span><span class="pln">
  overriddenMethod</span><span class="pun">(</span><span class="pln">param</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="pun">...</span><span class="pln"> </span><span class="pun">}</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">/**
 * Demonstrates how top-level functions follow the same rules.  This one
 * makes an array.
 * @param {TYPE} arg
 * @return {!Array&lt;TYPE&gt;}
 * @template TYPE
 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> makeArray</span><span class="pun">(</span><span class="pln">arg</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="pun">...</span><span class="pln"> </span><span class="pun">}</span></pre>

<p>If you only need to document the param and return types of a function, you may
optionally use inline JSDocs in the function's signature. These inline JSDocs
specify the return and param types without tags.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">function</span><span class="pln"> </span><span class="com">/** string */</span><span class="pln"> foo</span><span class="pun">(</span><span class="com">/** number */</span><span class="pln"> arg</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{...}</span></pre>

<p>If you need descriptions or tags, use a single JSDoc comment above the method.
For example, methods which return values need a <code>@return</code> tag.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">class</span><span class="pln"> </span><span class="typ">MyClass</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/**
   * @param {number} arg
   * @return {string}
   */</span><span class="pln">
  bar</span><span class="pun">(</span><span class="pln">arg</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{...}</span><span class="pln">
</span><span class="pun">}</span></pre>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// Illegal inline JSDocs.</span><span class="pln">

</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">MyClass</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/** @return {string} */</span><span class="pln"> foo</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{...}</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">/** No function description allowed inline here. */</span><span class="pln"> </span><span class="kwd">function</span><span class="pln"> bar</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{...}</span><span class="pln">

</span><span class="kwd">function</span><span class="pln"> </span><span class="com">/** Function description is also illegal here. */</span><span class="pln"> baz</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{...}</span></pre>



<p>In anonymous functions annotations are generally optional. If the automatic type
inference is insufficient or explicit annotation improves readability, then
annotate param and return types like this:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pln">promise</span><span class="pun">.</span><span class="pln">then</span><span class="pun">(</span><span class="pln">
    </span><span class="com">/** @return {string} */</span><span class="pln">
    </span><span class="pun">(</span><span class="com">/** !Array&lt;string&gt; */</span><span class="pln"> items</span><span class="pun">)</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
      doSomethingWith</span><span class="pun">(</span><span class="pln">items</span><span class="pun">);</span><span class="pln">
      </span><span class="kwd">return</span><span class="pln"> items</span><span class="pun">[</span><span class="lit">0</span><span class="pun">];</span><span class="pln">
    </span><span class="pun">});</span></pre>

<p>For function type expressions, see <a href="#jsdoc-function-types">7.10.4 Function type expressions</a>.</p>

<h3 id="jsdoc-property-comments" style="left: -46px; position: relative;">7.9 Property comments<a href="#jsdoc-property-comments" alt="link to jsdoc-property-comments"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Property types must be documented. The description may be omitted for private
properties, if name and type provide enough documentation for understanding the
code.</p>

<p>Publicly exported constants are commented the same way as properties.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** My class. */</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">MyClass</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">/** @param {string=} someString */</span><span class="pln">
  </span><span class="kwd">constructor</span><span class="pun">(</span><span class="pln">someString </span><span class="pun">=</span><span class="pln"> </span><span class="str">'default string'</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="com">/** @private @const {string} */</span><span class="pln">
    </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">someString_ </span><span class="pun">=</span><span class="pln"> someString</span><span class="pun">;</span><span class="pln">

    </span><span class="com">/** @private @const {!OtherType} */</span><span class="pln">
    </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">someOtherThing_ </span><span class="pun">=</span><span class="pln"> functionThatReturnsAThing</span><span class="pun">();</span><span class="pln">

    </span><span class="com">/**
     * Maximum number of things per pane.
     * @type {number}
     */</span><span class="pln">
    </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">someProperty </span><span class="pun">=</span><span class="pln"> </span><span class="lit">4</span><span class="pun">;</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">/**
 * The number of times we'll try before giving up.
 * @const {number}
 */</span><span class="pln">
</span><span class="typ">MyClass</span><span class="pun">.</span><span class="pln">RETRY_COUNT </span><span class="pun">=</span><span class="pln"> </span><span class="lit">33</span><span class="pun">;</span></pre>

<h3 id="jsdoc-type-annotations" style="left: -46px; position: relative;">7.10 Type annotations<a href="#jsdoc-type-annotations" alt="link to jsdoc-type-annotations"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Type annotations are found on <code>@param</code>, <code>@return</code>, <code>@this</code>, and <code>@type</code> tags,
and optionally on <code>@const</code>, <code>@export</code>, and any visibility tags. Type annotations
attached to JSDoc tags must always be enclosed in braces.</p>

<h4 id="jsdoc-nullability" style="left: -46px; position: relative;">7.10.1 Nullability<a href="#jsdoc-nullability" alt="link to jsdoc-nullability"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>The type system defines modifiers <code>!</code> and <code>?</code> for non-null and nullable,
respectively. These modifiers must precede the type.</p>

<p>Nullability modifiers have different requirements for different types, which
fall into two broad categories:</p>

<ol>
<li>Type annotations for primitives (<code>string</code>, <code>number</code>, <code>boolean</code>, <code>symbol</code>,
<code>undefined</code>, <code>null</code>) and literals (<code>{function(...): ...}</code> and <code>{{foo:
string...}}</code>) are always non-nullable by default. Use the <code>?</code> modifier to
make it nullable, but omit the redundant <code>!</code>.</li>
<li>Reference types (generally, anything in <code>UpperCamelCase</code>, including
<code>some.namespace.ReferenceType</code>) refer to a class, enum, record, or typedef
defined elsewhere. Since these types may or may not be nullable, it is
impossible to tell from the name alone whether it is nullable or not. Always
use explicit <code>?</code> and <code>!</code> modifiers for these types to prevent ambiguity at
use sites.</li>
</ol>

<p class="bad">Bad:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">const</span><span class="pln"> </span><span class="com">/** MyObject */</span><span class="pln"> myObject </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">null</span><span class="pun">;</span><span class="pln"> </span><span class="com">// Non-primitive types must be annotated.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !number */</span><span class="pln"> someNum </span><span class="pun">=</span><span class="pln"> </span><span class="lit">5</span><span class="pun">;</span><span class="pln"> </span><span class="com">// Primitives are non-nullable by default.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** number? */</span><span class="pln"> someNullableNum </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">null</span><span class="pun">;</span><span class="pln"> </span><span class="com">// ? should precede the type.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !{foo: string, bar: number} */</span><span class="pln"> record </span><span class="pun">=</span><span class="pln"> </span><span class="pun">...;</span><span class="pln"> </span><span class="com">// Already non-nullable.</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** MyTypeDef */</span><span class="pln"> def </span><span class="pun">=</span><span class="pln"> </span><span class="pun">...;</span><span class="pln"> </span><span class="com">// Not sure if MyTypeDef is nullable.</span><span class="pln">

</span><span class="com">// Not sure if object (nullable), enum (non-nullable, unless otherwise</span><span class="pln">
</span><span class="com">// specified), or typedef (depends on definition).</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** SomeCamelCaseName */</span><span class="pln"> n </span><span class="pun">=</span><span class="pln"> </span><span class="pun">...;</span></pre>

<p class="good">Good:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> </span><span class="com">/** ?MyObject */</span><span class="pln"> myObject </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">null</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** number */</span><span class="pln"> someNum </span><span class="pun">=</span><span class="pln"> </span><span class="lit">5</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** ?number */</span><span class="pln"> someNullableNum </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">null</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** {foo: string, bar: number} */</span><span class="pln"> record </span><span class="pun">=</span><span class="pln"> </span><span class="pun">...;</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !MyTypeDef */</span><span class="pln"> def </span><span class="pun">=</span><span class="pln"> </span><span class="pun">...;</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** ?SomeCamelCaseName */</span><span class="pln"> n </span><span class="pun">=</span><span class="pln"> </span><span class="pun">...;</span></pre>

<h4 id="jsdoc-type-casts" style="left: -46px; position: relative;">7.10.2 Type Casts<a href="#jsdoc-type-casts" alt="link to jsdoc-type-casts"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>In cases where the compiler doesn't accurately infer the type of an expression,
and the assertion functions in
<a href="https://google.github.io/closure-library/api/goog.asserts.html">goog.asserts</a>
cannot remedy it, it is
possible to tighten the type by adding a type annotation comment and enclosing
the expression in parentheses. Note that the parentheses are required.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @type {number} */</span><span class="pln"> </span><span class="pun">(</span><span class="pln">x</span><span class="pun">)</span></pre>

<h4 id="jsdoc-template-parameter-types" style="left: -46px; position: relative;">7.10.3 Template Parameter Types<a href="#jsdoc-template-parameter-types" alt="link to jsdoc-template-parameter-types"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Always specify template parameters. This way compiler can do a better job and it
makes it easier for readers to understand what code does.</p>

<p class="bad">Bad:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !Object */</span><span class="pln"> users </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{};</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !Array */</span><span class="pln"> books </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[];</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !Promise */</span><span class="pln"> response </span><span class="pun">=</span><span class="pln"> </span><span class="pun">...;</span></pre>

<p class="good">Good:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !Object&lt;string, !User&gt; */</span><span class="pln"> users </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{};</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !Array&lt;string&gt; */</span><span class="pln"> books </span><span class="pun">=</span><span class="pln"> </span><span class="pun">[];</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !Promise&lt;!Response&gt; */</span><span class="pln"> response </span><span class="pun">=</span><span class="pln"> </span><span class="pun">...;</span><span class="pln">

</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !Promise&lt;undefined&gt; */</span><span class="pln"> thisPromiseReturnsNothingButParameterIsStillUseful </span><span class="pun">=</span><span class="pln"> </span><span class="pun">...;</span><span class="pln">
</span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** !Object&lt;string, *&gt; */</span><span class="pln"> mapOfEverything </span><span class="pun">=</span><span class="pln"> </span><span class="pun">{};</span></pre>

<p>Cases when template parameters should not be used:</p>

<ul>
<li><code>Object</code> is used for type hierarchy and not as map-like structure.</li>
</ul>

<h4 id="jsdoc-function-types" style="left: -46px; position: relative;">7.10.4 Function type expressions<a href="#jsdoc-function-types" alt="link to jsdoc-function-types"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p><strong>Terminology Note</strong>: <em>function type expression</em> refers to a type annotation for
function types with the keyword <code>function</code> in the annotation (see examples
below).</p>

<p>Where the function definition is given, do not use a function type expression.
Specify parameter and return types with <code>@param</code> and <code>@return</code>, or with inline
annotations (see <a href="#jsdoc-method-and-function-comments">7.8 Method and function comments</a>). This includes
anonymous functions and functions defined and assigned to a const (where the
function jsdoc appears above the whole assignment expression).</p>

<p>Function type expressions are needed, for example, inside <code>@typedef</code>, <code>@param</code>
or <code>@return</code>. Use it also for variables or properties of function type, if they
are not immediately initialized with the function definition.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pln">  </span><span class="com">/** @private {function(string): string} */</span><span class="pln">
  </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">idGenerator_ </span><span class="pun">=</span><span class="pln"> googFunctions</span><span class="pun">.</span><span class="pln">identity</span><span class="pun">;</span></pre>

<p>When using a function type expression, always specify the return type
explicitly. Otherwise the default return type is <q>unknown</q> (<code>?</code>), which leads to
strange and unexpected behavior, and is rarely what is actually desired.</p>

<p>Bad - type error, but no warning given:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">/** @param {function()} generateNumber */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> foo</span><span class="pun">(</span><span class="pln">generateNumber</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">const</span><span class="pln"> </span><span class="com">/** number */</span><span class="pln"> x </span><span class="pun">=</span><span class="pln"> generateNumber</span><span class="pun">();</span><span class="pln">  </span><span class="com">// No compile-time type error here.</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

foo</span><span class="pun">(()</span><span class="pln"> </span><span class="pun">=&gt;</span><span class="pln"> </span><span class="str">'clearly not a number'</span><span class="pun">);</span></pre>

<p class="good">Good:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * @param {function(): *} inputFunction1 Can return any type.
 * @param {function(): undefined} inputFunction2 Definitely doesn't return
 *      anything.
 * NOTE: the return type of `foo` itself is safely implied to be {undefined}.
 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> foo</span><span class="pun">(</span><span class="pln">inputFunction1</span><span class="pun">,</span><span class="pln"> inputFunction2</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{...}</span></pre>

<h4 id="jsdoc-whitespace" style="left: -46px; position: relative;">7.10.5 Whitespace<a href="#jsdoc-whitespace" alt="link to jsdoc-whitespace"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Within a type annotation, a single space or line break is required after each
comma or colon. Additional line breaks may be inserted to improve readability or
avoid exceeding the column limit. These breaks should be chosen and indented
following the applicable guidelines (e.g. <a href="#formatting-line-wrapping">4.5 Line-wrapping</a> and
<a href="#formatting-block-indentation">4.2 Block indentation: +2 spaces</a>). No other whitespace is allowed in type
annotations.</p>

<p class="good">Good:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @type {function(string): number} */</span><span class="pln">

</span><span class="com">/** @type {{foo: number, bar: number}} */</span><span class="pln">

</span><span class="com">/** @type {number|string} */</span><span class="pln">

</span><span class="com">/** @type {!Object&lt;string, string&gt;} */</span><span class="pln">

</span><span class="com">/** @type {function(this: Object&lt;string, string&gt;, number): string} */</span><span class="pln">

</span><span class="com">/**
 * @type {function(
 *     !SuperDuperReallyReallyLongTypedefThatForcesTheLineBreak,
 *     !OtherVeryLongTypedef): string}
 */</span><span class="pln">

</span><span class="com">/**
 * @type {!SuperDuperReallyReallyLongTypedefThatForcesTheLineBreak|
 *     !OtherVeryLongTypedef}
 */</span></pre>

<p class="bad">Bad:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="com">// Only put a space after the colon</span><span class="pln">
</span><span class="com">/** @type {function(string) : number} */</span><span class="pln">

</span><span class="com">// Put spaces after colons and commas</span><span class="pln">
</span><span class="com">/** @type {{foo:number,bar:number}} */</span><span class="pln">

</span><span class="com">// No space in union types</span><span class="pln">
</span><span class="com">/** @type {number | string} */</span></pre>

<h3 id="jsdoc-visibility-annotations" style="left: -46px; position: relative;">7.11 Visibility annotations<a href="#jsdoc-visibility-annotations" alt="link to jsdoc-visibility-annotations"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Visibility annotations (<code>@private</code>, <code>@package</code>, <code>@protected</code>) may be specified
in a <code>@fileoverview</code> block, or on any exported symbol or property. Do not
specify visibility for local variables, whether within a function or at the top
level of a module. <code>@private</code> names may optionally end with an underscore.</p>

<h2 id="policies" style="left: -46px; position: relative;">8 Policies<a href="#policies" alt="link to policies"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h2>

<h3 id="policies-be-consistent" style="left: -46px; position: relative;">8.1 Issues unspecified by Google Style: Be Consistent!<a href="#policies-be-consistent" alt="link to policies-be-consistent"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>For any style question that isn't settled definitively by this specification,
prefer to do what the other code in the same file is already doing. If that
doesn't resolve the question, consider emulating the other files in the same
package.</p>

<h3 id="policies-compiler-warnings" style="left: -46px; position: relative;">8.2 Compiler warnings<a href="#policies-compiler-warnings" alt="link to policies-compiler-warnings"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="policies-use-a-standard-warning-set" style="left: -46px; position: relative;">8.2.1 Use a standard warning set<a href="#policies-use-a-standard-warning-set" alt="link to policies-use-a-standard-warning-set"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>As far as possible projects should use
<code>--warning_level=VERBOSE</code>.</p>

<h4 id="policies-how-to-handle-a-warning" style="left: -46px; position: relative;">8.2.2 How to handle a warning<a href="#policies-how-to-handle-a-warning" alt="link to policies-how-to-handle-a-warning"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Before doing anything, make sure you understand exactly what the warning is
telling you. If you're not positive why a warning is appearing, ask for help
.</p>

<p>Once you understand the warning, attempt the following solutions in order:</p>

<ol>
<li><strong>First, fix it or work around it.</strong> Make a strong attempt to actually
address the warning, or find another way to accomplish the task that avoids
the situation entirely.</li>
<li><strong>Otherwise, determine if it's a false alarm.</strong> If you are convinced that
the warning is invalid and that the code is actually safe and correct, add a
comment to convince the reader of this fact and apply the <code>@suppress</code>
annotation.</li>
<li><strong>Otherwise, leave a TODO comment.</strong> This is a <strong>last resort</strong>.
 If you do this, <strong>do
not suppress the warning.</strong> The warning should be visible until it can be
taken care of properly.</li>
</ol>

<h4 id="policies-suppress-a-warning-at-the-narrowest-reasonable-scope" style="left: -46px; position: relative;">8.2.3 Suppress a warning at the narrowest reasonable scope<a href="#policies-suppress-a-warning-at-the-narrowest-reasonable-scope" alt="link to policies-suppress-a-warning-at-the-narrowest-reasonable-scope"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Warnings are suppressed at the narrowest reasonable scope, usually that of a
single local variable or very small method. Often a variable or method is
extracted for that reason alone.</p>

<p>Example</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @suppress {uselessCode} Unrecognized 'use asm' declaration */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> fn</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="str">'use asm'</span><span class="pun">;</span><span class="pln">
  </span><span class="kwd">return</span><span class="pln"> </span><span class="lit">0</span><span class="pun">;</span><span class="pln">
</span><span class="pun">}</span></pre>

<p>Even a large number of suppressions in a class is still better than blinding the
entire class to this type of warning.</p>

<h3 id="policies-deprecation" style="left: -46px; position: relative;">8.3 Deprecation<a href="#policies-deprecation" alt="link to policies-deprecation"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Mark deprecated methods, classes or interfaces with <code>@deprecated</code> annotations. A
deprecation comment must include simple, clear directions for people to fix
their call sites.</p>

<h3 id="policies-code-not-in-google-style" style="left: -46px; position: relative;">8.4 Code not in Google Style<a href="#policies-code-not-in-google-style" alt="link to policies-code-not-in-google-style"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>You will occasionally encounter files in your codebase that are not in proper
Google Style. These may have come from an acquisition, or may have been written
before Google Style took a position on some issue, or may be in non-Google Style
for any other reason.</p>

<h4 id="policies-reformatting-existing-code" style="left: -46px; position: relative;">8.4.1 Reformatting existing code<a href="#policies-reformatting-existing-code" alt="link to policies-reformatting-existing-code"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>When updating the style of existing code, follow these guidelines.</p>

<ol>
<li>It is not required to change all existing code to meet current style
guidelines. Reformatting existing code is a trade-off between code churn and
consistency. Style rules evolve over time and these kinds of tweaks to
maintain compliance would create unnecessary churn. However, if significant
changes are being made to a file it is expected that the file will be in
Google Style.</li>
<li>Be careful not to allow opportunistic style fixes to muddle the focus of a
CL. If you find yourself making a lot of style changes that aren’t critical
to the central focus of a CL, promote those changes to a separate CL.</li>
</ol>

<h4 id="policies-newly-added-code-use-google-style" style="left: -46px; position: relative;">8.4.2 Newly added code: use Google Style<a href="#policies-newly-added-code-use-google-style" alt="link to policies-newly-added-code-use-google-style"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Brand new files use Google Style, regardless of the style choices of other files
in the same package.</p>

<p>When adding new code to a file that is not in Google Style, reformatting the
existing code first is recommended, subject to the advice in
<a href="#policies-reformatting-existing-code">8.4.1 Reformatting existing code</a>.</p>

<p>If this reformatting is not done, then new code should be as consistent as
possible with existing code in the same file, but must not violate the style
guide.</p>

<h3 id="policies-local-style-rules" style="left: -46px; position: relative;">8.5 Local style rules<a href="#policies-local-style-rules" alt="link to policies-local-style-rules"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Teams and projects may adopt additional style rules beyond those in this
document, but must accept that cleanup changes may not abide by these additional
rules, and must not block such cleanup changes due to violating any additional
rules. Beware of excessive rules which serve no purpose. The style guide does
not seek to define style in every possible scenario and neither should you.</p>

<h3 id="policies-generated-code-mostly-exempt" style="left: -46px; position: relative;">8.6 Generated code: mostly exempt<a href="#policies-generated-code-mostly-exempt" alt="link to policies-generated-code-mostly-exempt"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Source code generated by the build process is not required to be in Google
Style. However, any generated identifiers that will be referenced from
hand-written source code must follow the naming requirements. As a special
exception, such identifiers are allowed to contain underscores, which may help
to avoid conflicts with hand-written identifiers.</p>

<h2 id="appendices" style="left: -46px; position: relative;">9 Appendices<a href="#appendices" alt="link to appendices"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h2>

<h3 id="appendices-jsdoc-tag-reference" style="left: -46px; position: relative;">9.1 JSDoc tag reference<a href="#appendices-jsdoc-tag-reference" alt="link to appendices-jsdoc-tag-reference"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>JSDoc serves multiple purposes in JavaScript. In addition to being used to
generate documentation it is also used to control tooling. The best known are
the Closure Compiler type annotations.</p>

<h4 id="appendices-type-annotations" style="left: -46px; position: relative;">9.1.1 Type annotations and other Closure Compiler annotations<a href="#appendices-type-annotations" alt="link to appendices-type-annotations"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Documentation for JSDoc used by the Closure Compiler is described in
<a href="https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler">Annotating JavaScript for the Closure Compiler</a> and
<a href="https://github.com/google/closure-compiler/wiki/Types-in-the-Closure-Type-System">Types in the Closure Type System</a>.</p>

<h4 id="appendices-documentation-annotations" style="left: -46px; position: relative;">9.1.2 Documentation annotations<a href="#appendices-documentation-annotations" alt="link to appendices-documentation-annotations"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>In addition to the JSDoc described in
<a href="https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler">Annotating JavaScript for the Closure Compiler</a> the following tags are common
and well supported by various documentation generation tools (such as
<a href="https://github.com/jleyba/js-dossier">JsDossier</a>) for purely documentation purposes.</p>

<section class="zippy">

<h5>9.1.2.1 <code>@author</code> or <code>@owner</code> - <em>Not recommended.</em></h5>

<p><strong>Not recommended.</strong></p>

<p class="syntax">Syntax: <code>@author username@google.com (First Last)</code></p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * @fileoverview Utilities for handling textareas.
 * @author kuth@google.com (Uthur Pendragon)
 */</span></pre>

<p>Documents the author of a file or the owner of a test, generally only used in
the <code>@fileoverview</code> comment. The <code>@owner</code> tag is used by the unit test dashboard
to determine who owns the test results.</p>

</section>

<section class="zippy">

<h5>9.1.2.2 <code>@bug</code></h5>

<p class="syntax">Syntax: <code>@bug bugnumber</code></p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @bug 1234567 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> testSomething</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// …</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">/**
 * @bug 1234568
 * @bug 1234569
 */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> testTwoBugs</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// …</span><span class="pln">
</span><span class="pun">}</span></pre>

<p>Indicates what bugs the given test function regression tests.</p>

<p>Multiple bugs should each have their own <code>@bug</code> line, to make searching for
regression tests as easy as possible.</p>

</section>

<section class="zippy">

<h5>9.1.2.3 <code>@code</code> - <em>Deprecated. Do not use.</em></h5>

<p><strong>Deprecated. Do not use. Use Markdown backticks instead.</strong></p>

<p class="syntax">Syntax: <code>{@code ...}</code></p>

<p>Historically, <code>`BatchItem`</code> was written as
<code class="badcode">{@code BatchItem}</code>.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** Processes pending `BatchItem` instances. */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> processBatchItems</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{}</span></pre>

<p>Indicates that a term in a JSDoc description is code so it may be correctly
formatted in generated documentation.</p>

</section>

<section class="zippy">

<h5>9.1.2.4 <code>@desc</code></h5>

<p class="syntax">Syntax: <code>@desc Message description</code></p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** @desc Notifying a user that their account has been created. */</span><span class="pln">
exports</span><span class="pun">.</span><span class="pln">MSG_ACCOUNT_CREATED </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">getMsg</span><span class="pun">(</span><span class="pln">
    </span><span class="str">'Your account has been successfully created.'</span><span class="pun">);</span></pre>

</section>

<section class="zippy">

<h5>9.1.2.5 <code>@link</code></h5>

<p class="syntax">Syntax: <code>{@link ...}</code></p>

<p>This tag is used to generate cross-reference links within generated
documentation.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/** Processes pending {@link BatchItem} instances. */</span><span class="pln">
</span><span class="kwd">function</span><span class="pln"> processBatchItems</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{}</span></pre>

<p><strong>Historical note:</strong> @link tags have also been used to create external links in
generated documentation. For external links, always use Markdown's link syntax
instead:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * This class implements a useful subset of the
 * [native Event interface](https://dom.spec.whatwg.org/#event).
 */</span><span class="pln">
</span><span class="kwd">class</span><span class="pln"> </span><span class="typ">ApplicationEvent</span><span class="pln"> </span><span class="pun">{}</span></pre>

</section>

<section class="zippy">

<h5>9.1.2.6 <code>@see</code></h5>

<p class="syntax">Syntax: <code>@see Link</code></p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * Adds a single item, recklessly.
 * @see #addSafely
 * @see goog.Collect
 * @see goog.RecklessAdder#add
 */</span></pre>

<p>Reference a lookup to another class function or method.</p>

</section>

<section class="zippy">

<h5>9.1.2.7 <code>@supported</code></h5>

<p class="syntax">Syntax: <code>@supported Description</code></p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="com">/**
 * @fileoverview Event Manager
 * Provides an abstracted interface to the browsers' event systems.
 * @supported IE10+, Chrome, Safari
 */</span></pre>

<p>Used in a fileoverview to indicate what browsers are supported by the file.</p>

</section>

<p>You may also see other types of JSDoc annotations in third-party code. These
annotations appear in the <a href="http://code.google.com/p/jsdoc-toolkit/wiki/TagReference">JSDoc Toolkit Tag Reference</a> but are not considered
part of valid Google style.</p>

<h4 id="appendices-framework-specific-annotations" style="left: -46px; position: relative;">9.1.3 Framework specific annotations<a href="#appendices-framework-specific-annotations" alt="link to appendices-framework-specific-annotations"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>The following annotations are specific to a particular framework.</p>

<section class="zippy">

<h5>9.1.3.1 <code>@ngInject</code> for Angular 1</h5>

</section>

<section class="zippy">

<h5>9.1.3.2 <code>@polymerBehavior</code> for Polymer</h5>



<p class="https"><a href="https://github.com/google/closure-compiler/wiki/Polymer-Pass">https://github.com/google/closure-compiler/wiki/Polymer-Pass</a>
</p>

</section>

<section class="zippy">

</section>

<h4 id="appendices-notes-about-standard-closure-compiler-annotations" style="left: -46px; position: relative;">9.1.4 Notes about standard Closure Compiler annotations<a href="#appendices-notes-about-standard-closure-compiler-annotations" alt="link to appendices-notes-about-standard-closure-compiler-annotations"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>The following tags used to be standard but are now deprecated.</p>

<section class="zippy">

<h5>9.1.4.1 <code>@expose</code> - <em>Deprecated. Do not use.</em></h5>

<p><strong>Deprecated. Do not use. Use <code>@export</code> and/or <code>@nocollapse</code> instead.</strong></p>

</section>

<section class="zippy">

<h5>9.1.4.2 <code>@inheritDoc</code> - <em>Deprecated. Do not use.</em></h5>

<p><strong>Deprecated. Do not use. Use <code>@override</code> instead.</strong></p>

</section>

<h3 id="appendices-commonly-misunderstood-style-rules" style="left: -46px; position: relative;">9.2 Commonly misunderstood style rules<a href="#appendices-commonly-misunderstood-style-rules" alt="link to appendices-commonly-misunderstood-style-rules"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>Here is a collection of lesser-known or commonly misunderstood facts about
Google Style for JavaScript. (The following are true statements; this is not a
list of <q>myths.</q>)</p>

<ul>
<li>Neither a copyright statement nor <code>@author</code> credit is required in a source
file. (Neither is explicitly recommended, either.)</li>
<li>There is no <q>hard and fast</q> rule governing how to order the members of a
class (<a href="#features-classes">5.4 Classes</a>).</li>
<li>Empty blocks can usually be represented concisely as <code>{}</code>, as detailed in
(<a href="#formatting-empty-blocks">4.1.3 Empty blocks: may be concise</a>).</li>
<li>The prime directive of line-wrapping is: prefer to break at a higher
syntactic level (<a href="#formatting-where-to-break">4.5.1 Where to break</a>).</li>
<li>Non-ASCII characters are allowed in string literals, comments and JSDoc, and
in fact are recommended when they make the code easier to read than the
equivalent Unicode escape would (<a href="#non-ascii-characters">2.3.3 Non-ASCII characters</a>).</li>
</ul>

<h3 id="appendices-style-related-tools" style="left: -46px; position: relative;">9.3 Style-related tools<a href="#appendices-style-related-tools" alt="link to appendices-style-related-tools"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<p>The following tools exist to support various aspects of Google Style.</p>

<h4 id="appendices-tools-closure-compiler" style="left: -46px; position: relative;">9.3.1 Closure Compiler<a href="#appendices-tools-closure-compiler" alt="link to appendices-tools-closure-compiler"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>This program performs type checking and
other checks, optimizations and other transformations (such as lowering code to
ECMAScript 5).</p>

<h4 id="appendices-clang-format" style="left: -46px; position: relative;">9.3.2 <code>clang-format</code><a href="#appendices-clang-format" alt="link to appendices-clang-format"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>This program  reformats
JavaScript source code into Google Style, and also follows a number of
non-required but frequently readability-enhancing formatting practices. The
output produced by <code>clang-format</code> is compliant with the style guide.
</p>

<p><code>clang-format</code> is not required. Authors are allowed to change its output, and
reviewers are allowed to ask for such changes; disputes are worked out in the
usual way. However, subtrees may choose to opt in to such enforcement locally.</p>

<h4 id="appendices-closure-compiler-linter" style="left: -46px; position: relative;">9.3.3 Closure compiler linter<a href="#appendices-closure-compiler-linter" alt="link to appendices-closure-compiler-linter"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>This program  checks for a
variety of missteps and anti-patterns.</p>

<h4 id="appendices-conformance-framework" style="left: -46px; position: relative;">9.3.4 Conformance framework<a href="#appendices-conformance-framework" alt="link to appendices-conformance-framework"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>The JS Conformance Framework is a tool that is part of the Closure Compiler that
provides developers a simple means to specify a set of additional checks to be
run against their code base above the standard checks. Conformance checks can,
for example, forbid access to a certain property, or calls to a certain
function, or missing type information (unknowns).</p>

<p>These rules are commonly used to enforce critical restrictions (such as defining
globals, which could break the codebase) and security patterns (such as using
<code>eval</code> or assigning to <code>innerHTML</code>), or more loosely to improve code quality.</p>

<p>For additional information see the official documentation for the
<a href="https://github.com/google/closure-compiler/wiki/JS-Conformance-Framework">JS Conformance Framework</a>.</p>

<h3 id="appendices-legacy-exceptions" style="left: -46px; position: relative;">9.4 Exceptions for legacy platforms<a href="#appendices-legacy-exceptions" alt="link to appendices-legacy-exceptions"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h3>

<h4 id="appendices-legacy-exceptions-overview" style="left: -46px; position: relative;">9.4.1 Overview<a href="#appendices-legacy-exceptions-overview" alt="link to appendices-legacy-exceptions-overview"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>This section describes exceptions and additional rules to be followed when
modern ECMAScript syntax is not available to the code authors. Exceptions to the
recommended style are required when modern ECMAScript syntax is not possible and
are outlined here:</p>

<ul>
<li>Use of <code>var</code> declarations is allowed</li>
<li>Use of <code>arguments</code> is allowed</li>
<li>Optional parameters without default values are allowed</li>
</ul>

<h4 id="appendices-legacy-exceptions-var" style="left: -46px; position: relative;">9.4.2 Use <code>var</code><a href="#appendices-legacy-exceptions-var" alt="link to appendices-legacy-exceptions-var"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<h5 id="appendices-legacy-exceptions-var-scope">9.4.2.1 <code>var</code> declarations are NOT block-scoped</h5>

<p><code>var</code> declarations are scoped to the beginning of the nearest enclosing
function, script or module, which can cause unexpected behavior, especially with
function closures that reference <code>var</code> declarations inside of loops. The
following code gives an example:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">for</span><span class="pln"> </span><span class="pun">(</span><span class="kwd">var</span><span class="pln"> i </span><span class="pun">=</span><span class="pln"> </span><span class="lit">0</span><span class="pun">;</span><span class="pln"> i </span><span class="pun">&lt;</span><span class="pln"> </span><span class="lit">3</span><span class="pun">;</span><span class="pln"> </span><span class="pun">++</span><span class="pln">i</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">var</span><span class="pln"> iteration </span><span class="pun">=</span><span class="pln"> i</span><span class="pun">;</span><span class="pln">
  setTimeout</span><span class="pun">(</span><span class="kwd">function</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> console</span><span class="pun">.</span><span class="pln">log</span><span class="pun">(</span><span class="pln">iteration</span><span class="pun">);</span><span class="pln"> </span><span class="pun">},</span><span class="pln"> i</span><span class="pun">*</span><span class="lit">1000</span><span class="pun">);</span><span class="pln">
</span><span class="pun">}</span><span class="pln">

</span><span class="com">// logs 2, 2, 2 -- NOT 0, 1, 2</span><span class="pln">
</span><span class="com">// because `iteration` is function-scoped, not local to the loop.</span><span class="pln">
</span></pre>

<h5 id="appendices-legacy-exceptions-var-declare">9.4.2.2 Declare variables as close as possible to first use</h5>

<p>Even though <code>var</code> declarations are scoped to the beginning of the enclosing
function, <code>var</code> declarations should be as close as possible to their first use,
for readability purposes. However, do not put a <code>var</code> declaration inside a block
if that variable is referenced outside the block. For example:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">function</span><span class="pln"> sillyFunction</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">var</span><span class="pln"> count </span><span class="pun">=</span><span class="pln"> </span><span class="lit">0</span><span class="pun">;</span><span class="pln">
  </span><span class="kwd">for</span><span class="pln"> </span><span class="pun">(</span><span class="kwd">var</span><span class="pln"> x in y</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
    </span><span class="com">// "count" could be declared here, but don't do that.</span><span class="pln">
    count</span><span class="pun">++;</span><span class="pln">
  </span><span class="pun">}</span><span class="pln">
  console</span><span class="pun">.</span><span class="pln">log</span><span class="pun">(</span><span class="pln">count </span><span class="pun">+</span><span class="pln"> </span><span class="str">' items in y'</span><span class="pun">);</span><span class="pln">
</span><span class="pun">}</span></pre>

<h5 id="appendices-legacy-exceptions-var-const">9.4.2.3 Use @const for constants variables</h5>

<p>For global declarations where the <code>const</code> keyword would be used, if it were
available, annotate the <code>var</code> declaration with <code>@const</code> instead (this is
optional for local variables).</p>

<h4 id="appendices-legacy-exceptions-function" style="left: -46px; position: relative;">9.4.3 Do not use block scoped functions declarations<a href="#appendices-legacy-exceptions-function" alt="link to appendices-legacy-exceptions-function"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<p>Do <strong>not</strong> do this:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="kwd">if</span><span class="pln"> </span><span class="pun">(</span><span class="pln">x</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">function</span><span class="pln"> foo</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{}</span><span class="pln">
</span><span class="pun">}</span></pre>

<p>While most JavaScript VMs implemented before ECMAScript 6 support function
declarations within blocks it was not standardized. Implementations were
inconsistent with each other and with the now-standard ECMAScript behavior for
block scoped function declaration. The ECMAScript 5 standard and prior only
allow for function declarations in the root statement list of a script or
function and explicitly ban them in block scopes in strict mode.</p>

<p>To get consistent behavior, instead use a <code>var</code> initialized with a function
expression to define a function within a block:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="kwd">if</span><span class="pln"> </span><span class="pun">(</span><span class="pln">x</span><span class="pun">)</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="kwd">var</span><span class="pln"> foo </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">function</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{};</span><span class="pln">
</span><span class="pun">}</span></pre>

<h4 id="appendices-legacy-exceptions-goog-provide" style="left: -46px; position: relative;">9.4.4 Dependency management with <code>goog.provide</code>/<code>goog.require</code><a href="#appendices-legacy-exceptions-goog-provide" alt="link to appendices-legacy-exceptions-goog-provide"><img src="include/link.png" width="21" height="21" style="float:left;position:relative;bottom:5px;"></a></h4>

<h5 id="appendices-legacy-exceptions-goog-provide-summary">9.4.4.1 Summary</h5>

<p class="warning"><strong>WARNING: <code>goog.provide</code> dependency management is deprecated.</strong> All new files,
even in projects using <code>goog.provide</code> for older files, should use
<a href="#source-file-structure"><code>goog.module</code></a>. The following rules are for
pre-existing <code>goog.provide</code> files only.</p>

<ul>
<li>Place all <code>goog.provide</code>s first, <code>goog.require</code>s second. Separate provides
from requires with an empty line.</li>
<li>Sort the entries alphabetically (uppercase first).</li>
<li>Don't wrap <code>goog.provide</code> and <code>goog.require</code> statements. Exceed 80 columns
if necessary.</li>
<li>Only provide top-level symbols.</li>
</ul>

<p><code>goog.provide</code> statements should be grouped together and placed first. All
<code>goog.require</code> statements should follow. The two lists should be separated with
an empty line.</p>

<p>Similar to import statements in other languages, <code>goog.provide</code> and
<code>goog.require</code> statements should be written in a single line, even if they
exceed the 80 column line length limit.</p>

<p>The lines should be sorted alphabetically, with uppercase letters coming first:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pln">goog</span><span class="pun">.</span><span class="pln">provide</span><span class="pun">(</span><span class="str">'namespace.MyClass'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">provide</span><span class="pun">(</span><span class="str">'namespace.helperFoo'</span><span class="pun">);</span><span class="pln">

goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'an.extremelyLongNamespace.thatSomeoneThought.wouldBeNice.andNowItIsLonger.Than80Columns'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'goog.dom'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'goog.dom.TagName'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'goog.dom.classes'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'goog.dominoes'</span><span class="pun">);</span><span class="pln">
</span></pre>

<p>All members defined on a class should be in the same file. Only top-level
classes should be provided in a file that contains multiple members defined on
the same class (e.g. enums, inner classes, etc).</p>

<p>Do this:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pln">goog</span><span class="pun">.</span><span class="pln">provide</span><span class="pun">(</span><span class="str">'namespace.MyClass'</span><span class="pun">);</span></pre>

<p>Not this:</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="pln">goog</span><span class="pun">.</span><span class="pln">provide</span><span class="pun">(</span><span class="str">'namespace.MyClass'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">provide</span><span class="pun">(</span><span class="str">'namespace.MyClass.CONSTANT'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">provide</span><span class="pun">(</span><span class="str">'namespace.MyClass.Enum'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">provide</span><span class="pun">(</span><span class="str">'namespace.MyClass.InnerClass'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">provide</span><span class="pun">(</span><span class="str">'namespace.MyClass.TypeDef'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">provide</span><span class="pun">(</span><span class="str">'namespace.MyClass.staticMethod'</span><span class="pun">);</span></pre>

<p>Members on namespaces may also be provided:</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pln">goog</span><span class="pun">.</span><span class="pln">provide</span><span class="pun">(</span><span class="str">'foo.bar'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">provide</span><span class="pun">(</span><span class="str">'foo.bar.CONSTANT'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">provide</span><span class="pun">(</span><span class="str">'foo.bar.method'</span><span class="pun">);</span></pre>

<h5 id="appendices-legacy-exceptions-goog-scope">9.4.4.2 Aliasing with <code>goog.scope</code></h5>

<p class="warning"><strong>WARNING: <code>goog.scope</code> is deprecated.</strong> New files should not use <code>goog.scope</code>
even in projects with existing <code>goog.scope</code> usage.</p>

<p><code>goog.scope</code> may be used to shorten references to namespaced symbols in code
using <code>goog.provide</code>/<code>goog.require</code> dependency management.</p>

<p>Only one <code>goog.scope</code> invocation may be added per file. Always place it in the
global scope.</p>

<p>The opening <code>goog.scope(function() {</code> invocation must be preceded by exactly one
blank line and follow any <code>goog.provide</code> statements, <code>goog.require</code> statements,
or top-level comments. The invocation must be closed on the last line in the
file. Append <code>// goog.scope</code> to the closing statement of the scope. Separate the
comment from the semicolon by two spaces.</p>

<p>Similar to C++ namespaces, do not indent under <code>goog.scope</code> declarations.
Instead, continue from the 0 column.</p>

<p>Only make aliases for names that will not be re-assigned to another object
(e.g., most constructors, enums, and namespaces). Do not do this (see below for
how to alias a constructor):</p>

<pre class="language-js prettyprint bad prettyprinted" style=""><span class="pln">goog</span><span class="pun">.</span><span class="pln">scope</span><span class="pun">(</span><span class="kwd">function</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
</span><span class="kwd">var</span><span class="pln"> </span><span class="typ">Button</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">ui</span><span class="pun">.</span><span class="typ">Button</span><span class="pun">;</span><span class="pln">

</span><span class="typ">Button</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">function</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="pun">...</span><span class="pln"> </span><span class="pun">};</span><span class="pln">
</span><span class="pun">...</span></pre>

<p>Names must be the same as the last property of the global that they are
aliasing.</p>

<pre class="language-js prettyprint good prettyprinted" style=""><span class="pln">goog</span><span class="pun">.</span><span class="pln">provide</span><span class="pun">(</span><span class="str">'my.module.SomeType'</span><span class="pun">);</span><span class="pln">

goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'goog.dom'</span><span class="pun">);</span><span class="pln">
goog</span><span class="pun">.</span><span class="pln">require</span><span class="pun">(</span><span class="str">'goog.ui.Button'</span><span class="pun">);</span><span class="pln">

goog</span><span class="pun">.</span><span class="pln">scope</span><span class="pun">(</span><span class="kwd">function</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
</span><span class="kwd">var</span><span class="pln"> </span><span class="typ">Button</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">ui</span><span class="pun">.</span><span class="typ">Button</span><span class="pun">;</span><span class="pln">
</span><span class="kwd">var</span><span class="pln"> dom </span><span class="pun">=</span><span class="pln"> goog</span><span class="pun">.</span><span class="pln">dom</span><span class="pun">;</span><span class="pln">

</span><span class="com">// Alias new types after the constructor declaration.</span><span class="pln">
my</span><span class="pun">.</span><span class="pln">module</span><span class="pun">.</span><span class="typ">SomeType</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">function</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln"> </span><span class="pun">...</span><span class="pln"> </span><span class="pun">};</span><span class="pln">
</span><span class="kwd">var</span><span class="pln"> </span><span class="typ">SomeType</span><span class="pln"> </span><span class="pun">=</span><span class="pln"> my</span><span class="pun">.</span><span class="pln">module</span><span class="pun">.</span><span class="typ">SomeType</span><span class="pun">;</span><span class="pln">

</span><span class="com">// Declare methods on the prototype as usual:</span><span class="pln">
</span><span class="typ">SomeType</span><span class="pun">.</span><span class="pln">prototype</span><span class="pun">.</span><span class="pln">findButton </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">function</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span><span class="pln">
  </span><span class="com">// Button as aliased above.</span><span class="pln">
  </span><span class="kwd">this</span><span class="pun">.</span><span class="pln">button </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">new</span><span class="pln"> </span><span class="typ">Button</span><span class="pun">(</span><span class="pln">dom</span><span class="pun">.</span><span class="pln">getElement</span><span class="pun">(</span><span class="str">'my-button'</span><span class="pun">));</span><span class="pln">
</span><span class="pun">};</span><span class="pln">
</span><span class="pun">...</span><span class="pln">
</span><span class="pun">});</span><span class="pln">  </span><span class="com">// goog.scope</span></pre>

<h5 id="appendices-legacy-exceptions-forward-declare">9.4.4.3 <code>goog.forwardDeclare</code></h5>

<p>Prefer to use <code>goog.requireType</code> instead of <code>goog.forwardDeclare</code> to break
circular dependencies between files in the same library. Unlike <code>goog.require</code>,
a <code>goog.requireType</code> statement is allowed to import a namespace before it is
defined.</p>

<p><code>goog.forwardDeclare</code> statements must follow the same style rules as
<code>goog.require</code> and <code>goog.requireType</code>. The entire block of
<code>goog.forwardDeclare</code>, <code>goog.require</code> and <code>goog.requireType</code> statements is
sorted alphabetically.</p>

<p><code>goog.forwardDeclare</code> is used in legacy code to break circular references
spanning <em>across library boundaries</em>. This pattern however is poorly supported
by build tools and should not be used. Code should be organized to avoid
circular dependencies across libraries (by splitting/merging libraries).</p>

<h5 id="appendices-legacy-exceptions-module-get">9.4.4.4 <code>goog.module.get(name)</code></h5>

<p>If a <code>goog.provide</code> file depends on a <code>goog.module</code> file, the <code>goog.provide</code>
file can not normally refer to the module's exports via a global name. Instead,
in addition to <code>goog.require()</code>ing the module, the <code>goog.provide</code> file must
fetch the module's export object by calling <code>goog.module.get('module.name')</code>.</p>

<p class="note">Note: Only calling <code>goog.module.get('module.name')</code> does not create a build-time
dependency of your code on the module. The <code>goog.require</code> is needed for the
build dependency.</p>

<h5 id="appendices-legacy-exceptions-declareLegacyNamespace">9.4.4.5 <code>goog.module.declareLegacyNamespace()</code></h5>

<p class="warning"><strong>WARNING: <code>goog.module.declareLegacyNamespace</code> is only for transitional use.</strong></p>

<p><code>goog.module.declareLegacyNamespace</code> is only for use while migrating a
JavaScript file and its consumers from <code>goog.provide</code> to <code>goog.module</code>
. Update consumers of
your <a href="#source-file-structure"><code>goog.module</code></a> to use <code>goog.module</code> themselves.
Remove calls to <code>goog.module.declareLegacyNamespace</code> whenever possible.
</p>

<p>If you can't update consumers of a legacy namespace from <code>goog.provide</code> to
<code>goog.module</code> soon, please wrap the contents of your file in a call to
<code>goog.scope</code>, use <code>goog.module.get</code> to import the legacy namespace--and then
delete the call to <code>goog.module.declareLegacyNamespace</code> in your <code>goog.module</code>.</p>

<p>Calling <code>goog.module.declareLegacyNamespace()</code> inside a <code>goog.module(name)</code> will
declare the module's namespace as a global name just like a <code>goog.provide()</code>
call does. This allows a non <code>goog.module</code> namespace to access the module's
exports without calling <code>goog.module.get(name)</code>.</p>

</div>


</body></html>