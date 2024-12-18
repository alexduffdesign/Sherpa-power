var ge=Object.defineProperty;var fe=(h,e,t)=>e in h?ge(h,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):h[e]=t;var b=(h,e,t)=>fe(h,typeof e!="symbol"?e+"":e,t);class be extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null}set eventBus(e){this._eventBus=e}connectedCallback(){const e=this.getAttribute("label"),t=this.getAttribute("payload");this.render(e,t)}render(e,t){this.shadowRoot.innerHTML=`
      <style>
        .button-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: var(--spacing-4);
        }

        .button {
          padding: var(--spacing-3);
          background-color: #FFFFFF;
          border: none;
          border-radius: var(--rounded);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }

        .button:hover {
          background-color: #f0f0f0;
        }
      </style>
      <div class="button-container">
        <button class="button" data-button-data='${t}' aria-label="${e}">${e}</button>
      </div>
    `,this.shadowRoot.querySelector(".button").addEventListener("click",()=>{if(!this._eventBus){console.error("No eventBus assigned to ButtonComponent");return}try{const n=JSON.parse(t);this._eventBus.emit("buttonClicked",n)}catch(n){console.error("Error parsing button payload:",n)}})}}function Z(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}let R=Z();function ie(h){R=h}const z={exec:()=>null};function f(h,e=""){let t=typeof h=="string"?h:h.source;const n={replace:(i,s)=>{let r=typeof s=="string"?s:s.source;return r=r.replace(x.caret,"$1"),t=t.replace(i,r),n},getRegex:()=>new RegExp(t,e)};return n}const x={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:h=>new RegExp(`^( {0,3}${h})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:h=>new RegExp(`^ {0,${Math.min(3,h-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:h=>new RegExp(`^ {0,${Math.min(3,h-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:h=>new RegExp(`^ {0,${Math.min(3,h-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:h=>new RegExp(`^ {0,${Math.min(3,h-1)}}#`),htmlBeginRegex:h=>new RegExp(`^ {0,${Math.min(3,h-1)}}<(?:[a-z].*>|!--)`,"i")},me=/^(?:[ \t]*(?:\n|$))+/,ke=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,xe=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,L=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,we=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,re=/(?:[*+-]|\d{1,9}[.)])/,oe=f(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,re).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).getRegex(),j=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,ye=/^[^\n]+/,H=/(?!\s*\])(?:\\.|[^\[\]\\])+/,_e=f(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",H).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),ve=f(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,re).getRegex(),F="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",O=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,$e=f("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",O).replace("tag",F).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ae=f(j).replace("hr",L).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",F).getRegex(),Re=f(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",ae).getRegex(),Q={blockquote:Re,code:ke,def:_e,fences:xe,heading:we,hr:L,html:$e,lheading:oe,list:ve,newline:me,paragraph:ae,table:z,text:ye},K=f("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",L).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",F).getRegex(),Se={...Q,table:K,paragraph:f(j).replace("hr",L).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",K).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",F).getRegex()},Te={...Q,html:f(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",O).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:z,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:f(j).replace("hr",L).replace("heading",` *#{1,6} *[^
]`).replace("lheading",oe).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},le=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ce=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,ce=/^( {2,}|\\)\n(?!\s*$)/,ze=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,q=/[\p{P}\p{S}]/u,G=/[\s\p{P}\p{S}]/u,he=/[^\s\p{P}\p{S}]/u,Ae=f(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,G).getRegex(),Le=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,Be=f(/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,"u").replace(/punct/g,q).getRegex(),Ie=f("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,he).replace(/punctSpace/g,G).replace(/punct/g,q).getRegex(),Ee=f("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,he).replace(/punctSpace/g,G).replace(/punct/g,q).getRegex(),Pe=f(/\\(punct)/,"gu").replace(/punct/g,q).getRegex(),Fe=f(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),qe=f(O).replace("(?:-->|$)","-->").getRegex(),Me=f("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",qe).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),I=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Ne=f(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",I).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),ue=f(/^!?\[(label)\]\[(ref)\]/).replace("label",I).replace("ref",H).getRegex(),pe=f(/^!?\[(ref)\](?:\[\])?/).replace("ref",H).getRegex(),De=f("reflink|nolink(?!\\()","g").replace("reflink",ue).replace("nolink",pe).getRegex(),U={_backpedal:z,anyPunctuation:Pe,autolink:Fe,blockSkip:Le,br:ce,code:Ce,del:z,emStrongLDelim:Be,emStrongRDelimAst:Ie,emStrongRDelimUnd:Ee,escape:le,link:Ne,nolink:pe,punctuation:Ae,reflink:ue,reflinkSearch:De,tag:Me,text:ze,url:z},Ze={...U,link:f(/^!?\[(label)\]\((.*?)\)/).replace("label",I).getRegex(),reflink:f(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",I).getRegex()},D={...U,escape:f(le).replace("])","~|])").getRegex(),url:f(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},je={...D,br:f(ce).replace("{2,}","*").getRegex(),text:f(D.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},B={normal:Q,gfm:Se,pedantic:Te},T={normal:U,gfm:D,breaks:je,pedantic:Ze},He={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},ee=h=>He[h];function v(h,e){if(e){if(x.escapeTest.test(h))return h.replace(x.escapeReplace,ee)}else if(x.escapeTestNoEncode.test(h))return h.replace(x.escapeReplaceNoEncode,ee);return h}function te(h){try{h=encodeURI(h).replace(x.percentDecode,"%")}catch{return null}return h}function ne(h,e){var s;const t=h.replace(x.findPipe,(r,o,c)=>{let a=!1,l=o;for(;--l>=0&&c[l]==="\\";)a=!a;return a?"|":" |"}),n=t.split(x.splitPipe);let i=0;if(n[0].trim()||n.shift(),n.length>0&&!((s=n.at(-1))!=null&&s.trim())&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;i<n.length;i++)n[i]=n[i].trim().replace(x.slashPipe,"|");return n}function C(h,e,t){const n=h.length;if(n===0)return"";let i=0;for(;i<n;){const s=h.charAt(n-i-1);if(s===e&&!t)i++;else if(s!==e&&t)i++;else break}return h.slice(0,n-i)}function Oe(h,e){if(h.indexOf(e[1])===-1)return-1;let t=0;for(let n=0;n<h.length;n++)if(h[n]==="\\")n++;else if(h[n]===e[0])t++;else if(h[n]===e[1]&&(t--,t<0))return n;return-1}function se(h,e,t,n,i){const s=e.href,r=e.title||null,o=h[1].replace(i.other.outputLinkReplace,"$1");if(h[0].charAt(0)!=="!"){n.state.inLink=!0;const c={type:"link",raw:t,href:s,title:r,text:o,tokens:n.inlineTokens(o)};return n.state.inLink=!1,c}return{type:"image",raw:t,href:s,title:r,text:o}}function Qe(h,e,t){const n=h.match(t.other.indentCodeCompensation);if(n===null)return e;const i=n[1];return e.split(`
`).map(s=>{const r=s.match(t.other.beginningSpace);if(r===null)return s;const[o]=r;return o.length>=i.length?s.slice(i.length):s}).join(`
`)}class E{constructor(e){b(this,"options");b(this,"rules");b(this,"lexer");this.options=e||R}space(e){const t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){const t=this.rules.block.code.exec(e);if(t){const n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:C(n,`
`)}}}fences(e){const t=this.rules.block.fences.exec(e);if(t){const n=t[0],i=Qe(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:i}}}heading(e){const t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){const i=C(n,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(n=i.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){const t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:C(t[0],`
`)}}blockquote(e){const t=this.rules.block.blockquote.exec(e);if(t){let n=C(t[0],`
`).split(`
`),i="",s="";const r=[];for(;n.length>0;){let o=!1;const c=[];let a;for(a=0;a<n.length;a++)if(this.rules.other.blockquoteStart.test(n[a]))c.push(n[a]),o=!0;else if(!o)c.push(n[a]);else break;n=n.slice(a);const l=c.join(`
`),u=l.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${l}`:l,s=s?`${s}
${u}`:u;const p=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,r,!0),this.lexer.state.top=p,n.length===0)break;const d=r.at(-1);if((d==null?void 0:d.type)==="code")break;if((d==null?void 0:d.type)==="blockquote"){const k=d,m=k.raw+`
`+n.join(`
`),w=this.blockquote(m);r[r.length-1]=w,i=i.substring(0,i.length-k.raw.length)+w.raw,s=s.substring(0,s.length-k.text.length)+w.text;break}else if((d==null?void 0:d.type)==="list"){const k=d,m=k.raw+`
`+n.join(`
`),w=this.list(m);r[r.length-1]=w,i=i.substring(0,i.length-d.raw.length)+w.raw,s=s.substring(0,s.length-k.raw.length)+w.raw,n=m.substring(r.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:r,text:s}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim();const i=n.length>1,s={type:"list",raw:"",ordered:i,start:i?+n.slice(0,-1):"",loose:!1,items:[]};n=i?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=i?n:"[*+-]");const r=this.rules.other.listItemRegex(n);let o=!1;for(;e;){let a=!1,l="",u="";if(!(t=r.exec(e))||this.rules.block.hr.test(e))break;l=t[0],e=e.substring(l.length);let p=t[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,M=>" ".repeat(3*M.length)),d=e.split(`
`,1)[0],k=!p.trim(),m=0;if(this.options.pedantic?(m=2,u=p.trimStart()):k?m=t[1].length+1:(m=t[2].search(this.rules.other.nonSpaceChar),m=m>4?1:m,u=p.slice(m),m+=t[1].length),k&&this.rules.other.blankLine.test(d)&&(l+=d+`
`,e=e.substring(d.length+1),a=!0),!a){const M=this.rules.other.nextBulletRegex(m),W=this.rules.other.hrRegex(m),J=this.rules.other.fencesBeginRegex(m),Y=this.rules.other.headingBeginRegex(m),de=this.rules.other.htmlBeginRegex(m);for(;e;){const N=e.split(`
`,1)[0];let S;if(d=N,this.options.pedantic?(d=d.replace(this.rules.other.listReplaceNesting,"  "),S=d):S=d.replace(this.rules.other.tabCharGlobal,"    "),J.test(d)||Y.test(d)||de.test(d)||M.test(d)||W.test(d))break;if(S.search(this.rules.other.nonSpaceChar)>=m||!d.trim())u+=`
`+S.slice(m);else{if(k||p.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||J.test(p)||Y.test(p)||W.test(p))break;u+=`
`+d}!k&&!d.trim()&&(k=!0),l+=N+`
`,e=e.substring(N.length+1),p=S.slice(m)}}s.loose||(o?s.loose=!0:this.rules.other.doubleBlankLine.test(l)&&(o=!0));let w=null,X;this.options.gfm&&(w=this.rules.other.listIsTask.exec(u),w&&(X=w[0]!=="[ ] ",u=u.replace(this.rules.other.listReplaceTask,""))),s.items.push({type:"list_item",raw:l,task:!!w,checked:X,loose:!1,text:u,tokens:[]}),s.raw+=l}const c=s.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;s.raw=s.raw.trimEnd();for(let a=0;a<s.items.length;a++)if(this.lexer.state.top=!1,s.items[a].tokens=this.lexer.blockTokens(s.items[a].text,[]),!s.loose){const l=s.items[a].tokens.filter(p=>p.type==="space"),u=l.length>0&&l.some(p=>this.rules.other.anyLine.test(p.raw));s.loose=u}if(s.loose)for(let a=0;a<s.items.length;a++)s.items[a].loose=!0;return s}}html(e){const t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){const t=this.rules.block.def.exec(e);if(t){const n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:i,title:s}}}table(e){var o;const t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;const n=ne(t[1]),i=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),s=(o=t[3])!=null&&o.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],r={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===i.length){for(const c of i)this.rules.other.tableAlignRight.test(c)?r.align.push("right"):this.rules.other.tableAlignCenter.test(c)?r.align.push("center"):this.rules.other.tableAlignLeft.test(c)?r.align.push("left"):r.align.push(null);for(let c=0;c<n.length;c++)r.header.push({text:n[c],tokens:this.lexer.inline(n[c]),header:!0,align:r.align[c]});for(const c of s)r.rows.push(ne(c,r.header.length).map((a,l)=>({text:a,tokens:this.lexer.inline(a),header:!1,align:r.align[l]})));return r}}lheading(e){const t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){const t=this.rules.block.paragraph.exec(e);if(t){const n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){const t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){const t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){const t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){const t=this.rules.inline.link.exec(e);if(t){const n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;const r=C(n.slice(0,-1),"\\");if((n.length-r.length)%2===0)return}else{const r=Oe(t[2],"()");if(r>-1){const c=(t[0].indexOf("!")===0?5:4)+t[1].length+r;t[2]=t[2].substring(0,r),t[0]=t[0].substring(0,c).trim(),t[3]=""}}let i=t[2],s="";if(this.options.pedantic){const r=this.rules.other.pedanticHrefTitle.exec(i);r&&(i=r[1],s=r[3])}else s=t[3]?t[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),se(t,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){const i=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),s=t[i.toLowerCase()];if(!s){const r=n[0].charAt(0);return{type:"text",raw:r,text:r}}return se(n,s,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let i=this.rules.inline.emStrongLDelim.exec(e);if(!i||i[3]&&n.match(this.rules.other.unicodeAlphaNumeric))return;if(!(i[1]||i[2]||"")||!n||this.rules.inline.punctuation.exec(n)){const r=[...i[0]].length-1;let o,c,a=r,l=0;const u=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,t=t.slice(-1*e.length+r);(i=u.exec(t))!=null;){if(o=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!o)continue;if(c=[...o].length,i[3]||i[4]){a+=c;continue}else if((i[5]||i[6])&&r%3&&!((r+c)%3)){l+=c;continue}if(a-=c,a>0)continue;c=Math.min(c,c+a+l);const p=[...i[0]][0].length,d=e.slice(0,r+i.index+p+c);if(Math.min(r,c)%2){const m=d.slice(1,-1);return{type:"em",raw:d,text:m,tokens:this.lexer.inlineTokens(m)}}const k=d.slice(2,-2);return{type:"strong",raw:d,text:k,tokens:this.lexer.inlineTokens(k)}}}}codespan(e){const t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," ");const i=this.rules.other.nonSpaceChar.test(n),s=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return i&&s&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){const t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){const t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){const t=this.rules.inline.autolink.exec(e);if(t){let n,i;return t[2]==="@"?(n=t[1],i="mailto:"+n):(n=t[1],i=n),{type:"link",raw:t[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}url(e){var n;let t;if(t=this.rules.inline.url.exec(e)){let i,s;if(t[2]==="@")i=t[0],s="mailto:"+i;else{let r;do r=t[0],t[0]=((n=this.rules.inline._backpedal.exec(t[0]))==null?void 0:n[0])??"";while(r!==t[0]);i=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:i,href:s,tokens:[{type:"text",raw:i,text:i}]}}}inlineText(e){const t=this.rules.inline.text.exec(e);if(t){const n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}}class y{constructor(e){b(this,"tokens");b(this,"options");b(this,"state");b(this,"tokenizer");b(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||R,this.options.tokenizer=this.options.tokenizer||new E,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={other:x,block:B.normal,inline:T.normal};this.options.pedantic?(t.block=B.pedantic,t.inline=T.pedantic):this.options.gfm&&(t.block=B.gfm,this.options.breaks?t.inline=T.breaks:t.inline=T.gfm),this.tokenizer.rules=t}static get rules(){return{block:B,inline:T}}static lex(e,t){return new y(t).lex(e)}static lexInline(e,t){return new y(t).inlineTokens(e)}lex(e){e=e.replace(x.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){const n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){var i,s,r;for(this.options.pedantic&&(e=e.replace(x.tabCharGlobal,"    ").replace(x.spaceLine,""));e;){let o;if((s=(i=this.options.extensions)==null?void 0:i.block)!=null&&s.some(a=>(o=a.call({lexer:this},e,t))?(e=e.substring(o.raw.length),t.push(o),!0):!1))continue;if(o=this.tokenizer.space(e)){e=e.substring(o.raw.length);const a=t.at(-1);o.raw.length===1&&a!==void 0?a.raw+=`
`:t.push(o);continue}if(o=this.tokenizer.code(e)){e=e.substring(o.raw.length);const a=t.at(-1);(a==null?void 0:a.type)==="paragraph"||(a==null?void 0:a.type)==="text"?(a.raw+=`
`+o.raw,a.text+=`
`+o.text,this.inlineQueue.at(-1).src=a.text):t.push(o);continue}if(o=this.tokenizer.fences(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.heading(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.hr(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.blockquote(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.list(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.html(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.def(e)){e=e.substring(o.raw.length);const a=t.at(-1);(a==null?void 0:a.type)==="paragraph"||(a==null?void 0:a.type)==="text"?(a.raw+=`
`+o.raw,a.text+=`
`+o.raw,this.inlineQueue.at(-1).src=a.text):this.tokens.links[o.tag]||(this.tokens.links[o.tag]={href:o.href,title:o.title});continue}if(o=this.tokenizer.table(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.lheading(e)){e=e.substring(o.raw.length),t.push(o);continue}let c=e;if((r=this.options.extensions)!=null&&r.startBlock){let a=1/0;const l=e.slice(1);let u;this.options.extensions.startBlock.forEach(p=>{u=p.call({lexer:this},l),typeof u=="number"&&u>=0&&(a=Math.min(a,u))}),a<1/0&&a>=0&&(c=e.substring(0,a+1))}if(this.state.top&&(o=this.tokenizer.paragraph(c))){const a=t.at(-1);n&&(a==null?void 0:a.type)==="paragraph"?(a.raw+=`
`+o.raw,a.text+=`
`+o.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):t.push(o),n=c.length!==e.length,e=e.substring(o.raw.length);continue}if(o=this.tokenizer.text(e)){e=e.substring(o.raw.length);const a=t.at(-1);(a==null?void 0:a.type)==="text"?(a.raw+=`
`+o.raw,a.text+=`
`+o.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=a.text):t.push(o);continue}if(e){const a="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(a);break}else throw new Error(a)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){var o,c,a;let n=e,i=null;if(this.tokens.links){const l=Object.keys(this.tokens.links);if(l.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(n))!=null;)l.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(n=n.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.blockSkip.exec(n))!=null;)n=n.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(n))!=null;)n=n.slice(0,i.index)+"++"+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let s=!1,r="";for(;e;){s||(r=""),s=!1;let l;if((c=(o=this.options.extensions)==null?void 0:o.inline)!=null&&c.some(p=>(l=p.call({lexer:this},e,t))?(e=e.substring(l.raw.length),t.push(l),!0):!1))continue;if(l=this.tokenizer.escape(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.tag(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.link(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(l.raw.length);const p=t.at(-1);l.type==="text"&&(p==null?void 0:p.type)==="text"?(p.raw+=l.raw,p.text+=l.text):t.push(l);continue}if(l=this.tokenizer.emStrong(e,n,r)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.codespan(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.br(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.del(e)){e=e.substring(l.raw.length),t.push(l);continue}if(l=this.tokenizer.autolink(e)){e=e.substring(l.raw.length),t.push(l);continue}if(!this.state.inLink&&(l=this.tokenizer.url(e))){e=e.substring(l.raw.length),t.push(l);continue}let u=e;if((a=this.options.extensions)!=null&&a.startInline){let p=1/0;const d=e.slice(1);let k;this.options.extensions.startInline.forEach(m=>{k=m.call({lexer:this},d),typeof k=="number"&&k>=0&&(p=Math.min(p,k))}),p<1/0&&p>=0&&(u=e.substring(0,p+1))}if(l=this.tokenizer.inlineText(u)){e=e.substring(l.raw.length),l.raw.slice(-1)!=="_"&&(r=l.raw.slice(-1)),s=!0;const p=t.at(-1);(p==null?void 0:p.type)==="text"?(p.raw+=l.raw,p.text+=l.text):t.push(l);continue}if(e){const p="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(p);break}else throw new Error(p)}}return t}}class P{constructor(e){b(this,"options");b(this,"parser");this.options=e||R}space(e){return""}code({text:e,lang:t,escaped:n}){var r;const i=(r=(t||"").match(x.notSpaceStart))==null?void 0:r[0],s=e.replace(x.endingNewline,"")+`
`;return i?'<pre><code class="language-'+v(i)+'">'+(n?s:v(s,!0))+`</code></pre>
`:"<pre><code>"+(n?s:v(s,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){const t=e.ordered,n=e.start;let i="";for(let o=0;o<e.items.length;o++){const c=e.items[o];i+=this.listitem(c)}const s=t?"ol":"ul",r=t&&n!==1?' start="'+n+'"':"";return"<"+s+r+`>
`+i+"</"+s+`>
`}listitem(e){var n;let t="";if(e.task){const i=this.checkbox({checked:!!e.checked});e.loose?((n=e.tokens[0])==null?void 0:n.type)==="paragraph"?(e.tokens[0].text=i+" "+e.tokens[0].text,e.tokens[0].tokens&&e.tokens[0].tokens.length>0&&e.tokens[0].tokens[0].type==="text"&&(e.tokens[0].tokens[0].text=i+" "+v(e.tokens[0].tokens[0].text),e.tokens[0].tokens[0].escaped=!0)):e.tokens.unshift({type:"text",raw:i+" ",text:i+" ",escaped:!0}):t+=i+" "}return t+=this.parser.parse(e.tokens,!!e.loose),`<li>${t}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let s=0;s<e.header.length;s++)n+=this.tablecell(e.header[s]);t+=this.tablerow({text:n});let i="";for(let s=0;s<e.rows.length;s++){const r=e.rows[s];n="";for(let o=0;o<r.length;o++)n+=this.tablecell(r[o]);i+=this.tablerow({text:n})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+i+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){const t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${v(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){const i=this.parser.parseInline(n),s=te(e);if(s===null)return i;e=s;let r='<a href="'+e+'"';return t&&(r+=' title="'+v(t)+'"'),r+=">"+i+"</a>",r}image({href:e,title:t,text:n}){const i=te(e);if(i===null)return v(n);e=i;let s=`<img src="${e}" alt="${n}"`;return t&&(s+=` title="${v(t)}"`),s+=">",s}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:v(e.text)}}class V{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}}class _{constructor(e){b(this,"options");b(this,"renderer");b(this,"textRenderer");this.options=e||R,this.options.renderer=this.options.renderer||new P,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new V}static parse(e,t){return new _(t).parse(e)}static parseInline(e,t){return new _(t).parseInline(e)}parse(e,t=!0){var i,s;let n="";for(let r=0;r<e.length;r++){const o=e[r];if((s=(i=this.options.extensions)==null?void 0:i.renderers)!=null&&s[o.type]){const a=o,l=this.options.extensions.renderers[a.type].call({parser:this},a);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(a.type)){n+=l||"";continue}}const c=o;switch(c.type){case"space":{n+=this.renderer.space(c);continue}case"hr":{n+=this.renderer.hr(c);continue}case"heading":{n+=this.renderer.heading(c);continue}case"code":{n+=this.renderer.code(c);continue}case"table":{n+=this.renderer.table(c);continue}case"blockquote":{n+=this.renderer.blockquote(c);continue}case"list":{n+=this.renderer.list(c);continue}case"html":{n+=this.renderer.html(c);continue}case"paragraph":{n+=this.renderer.paragraph(c);continue}case"text":{let a=c,l=this.renderer.text(a);for(;r+1<e.length&&e[r+1].type==="text";)a=e[++r],l+=`
`+this.renderer.text(a);t?n+=this.renderer.paragraph({type:"paragraph",raw:l,text:l,tokens:[{type:"text",raw:l,text:l,escaped:!0}]}):n+=l;continue}default:{const a='Token with "'+c.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}parseInline(e,t=this.renderer){var i,s;let n="";for(let r=0;r<e.length;r++){const o=e[r];if((s=(i=this.options.extensions)==null?void 0:i.renderers)!=null&&s[o.type]){const a=this.options.extensions.renderers[o.type].call({parser:this},o);if(a!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(o.type)){n+=a||"";continue}}const c=o;switch(c.type){case"escape":{n+=t.text(c);break}case"html":{n+=t.html(c);break}case"link":{n+=t.link(c);break}case"image":{n+=t.image(c);break}case"strong":{n+=t.strong(c);break}case"em":{n+=t.em(c);break}case"codespan":{n+=t.codespan(c);break}case"br":{n+=t.br(c);break}case"del":{n+=t.del(c);break}case"text":{n+=t.text(c);break}default:{const a='Token with "'+c.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return n}}class A{constructor(e){b(this,"options");b(this,"block");this.options=e||R}preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}provideLexer(){return this.block?y.lex:y.lexInline}provideParser(){return this.block?_.parse:_.parseInline}}b(A,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"]));class Ge{constructor(...e){b(this,"defaults",Z());b(this,"options",this.setOptions);b(this,"parse",this.parseMarkdown(!0));b(this,"parseInline",this.parseMarkdown(!1));b(this,"Parser",_);b(this,"Renderer",P);b(this,"TextRenderer",V);b(this,"Lexer",y);b(this,"Tokenizer",E);b(this,"Hooks",A);this.use(...e)}walkTokens(e,t){var i,s;let n=[];for(const r of e)switch(n=n.concat(t.call(this,r)),r.type){case"table":{const o=r;for(const c of o.header)n=n.concat(this.walkTokens(c.tokens,t));for(const c of o.rows)for(const a of c)n=n.concat(this.walkTokens(a.tokens,t));break}case"list":{const o=r;n=n.concat(this.walkTokens(o.items,t));break}default:{const o=r;(s=(i=this.defaults.extensions)==null?void 0:i.childTokens)!=null&&s[o.type]?this.defaults.extensions.childTokens[o.type].forEach(c=>{const a=o[c].flat(1/0);n=n.concat(this.walkTokens(a,t))}):o.tokens&&(n=n.concat(this.walkTokens(o.tokens,t)))}}return n}use(...e){const t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{const i={...n};if(i.async=this.defaults.async||i.async||!1,n.extensions&&(n.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){const r=t.renderers[s.name];r?t.renderers[s.name]=function(...o){let c=s.renderer.apply(this,o);return c===!1&&(c=r.apply(this,o)),c}:t.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const r=t[s.level];r?r.unshift(s.tokenizer):t[s.level]=[s.tokenizer],s.start&&(s.level==="block"?t.startBlock?t.startBlock.push(s.start):t.startBlock=[s.start]:s.level==="inline"&&(t.startInline?t.startInline.push(s.start):t.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(t.childTokens[s.name]=s.childTokens)}),i.extensions=t),n.renderer){const s=this.defaults.renderer||new P(this.defaults);for(const r in n.renderer){if(!(r in s))throw new Error(`renderer '${r}' does not exist`);if(["options","parser"].includes(r))continue;const o=r,c=n.renderer[o],a=s[o];s[o]=(...l)=>{let u=c.apply(s,l);return u===!1&&(u=a.apply(s,l)),u||""}}i.renderer=s}if(n.tokenizer){const s=this.defaults.tokenizer||new E(this.defaults);for(const r in n.tokenizer){if(!(r in s))throw new Error(`tokenizer '${r}' does not exist`);if(["options","rules","lexer"].includes(r))continue;const o=r,c=n.tokenizer[o],a=s[o];s[o]=(...l)=>{let u=c.apply(s,l);return u===!1&&(u=a.apply(s,l)),u}}i.tokenizer=s}if(n.hooks){const s=this.defaults.hooks||new A;for(const r in n.hooks){if(!(r in s))throw new Error(`hook '${r}' does not exist`);if(["options","block"].includes(r))continue;const o=r,c=n.hooks[o],a=s[o];A.passThroughHooks.has(r)?s[o]=l=>{if(this.defaults.async)return Promise.resolve(c.call(s,l)).then(p=>a.call(s,p));const u=c.call(s,l);return a.call(s,u)}:s[o]=(...l)=>{let u=c.apply(s,l);return u===!1&&(u=a.apply(s,l)),u}}i.hooks=s}if(n.walkTokens){const s=this.defaults.walkTokens,r=n.walkTokens;i.walkTokens=function(o){let c=[];return c.push(r.call(this,o)),s&&(c=c.concat(s.call(this,o))),c}}this.defaults={...this.defaults,...i}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return y.lex(e,t??this.defaults)}parser(e,t){return _.parse(e,t??this.defaults)}parseMarkdown(e){return(n,i)=>{const s={...i},r={...this.defaults,...s},o=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&s.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof n>"u"||n===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));r.hooks&&(r.hooks.options=r,r.hooks.block=e);const c=r.hooks?r.hooks.provideLexer():e?y.lex:y.lexInline,a=r.hooks?r.hooks.provideParser():e?_.parse:_.parseInline;if(r.async)return Promise.resolve(r.hooks?r.hooks.preprocess(n):n).then(l=>c(l,r)).then(l=>r.hooks?r.hooks.processAllTokens(l):l).then(l=>r.walkTokens?Promise.all(this.walkTokens(l,r.walkTokens)).then(()=>l):l).then(l=>a(l,r)).then(l=>r.hooks?r.hooks.postprocess(l):l).catch(o);try{r.hooks&&(n=r.hooks.preprocess(n));let l=c(n,r);r.hooks&&(l=r.hooks.processAllTokens(l)),r.walkTokens&&this.walkTokens(l,r.walkTokens);let u=a(l,r);return r.hooks&&(u=r.hooks.postprocess(u)),u}catch(l){return o(l)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){const i="<p>An error occurred:</p><pre>"+v(n.message+"",!0)+"</pre>";return t?Promise.resolve(i):i}if(t)return Promise.reject(n);throw n}}}const $=new Ge;function g(h,e){return $.parse(h,e)}g.options=g.setOptions=function(h){return $.setOptions(h),g.defaults=$.defaults,ie(g.defaults),g};g.getDefaults=Z;g.defaults=R;g.use=function(...h){return $.use(...h),g.defaults=$.defaults,ie(g.defaults),g};g.walkTokens=function(h,e){return $.walkTokens(h,e)};g.parseInline=$.parseInline;g.Parser=_;g.parser=_.parse;g.Renderer=P;g.TextRenderer=V;g.Lexer=y;g.lexer=y.lex;g.Tokenizer=E;g.Hooks=A;g.parse=g;g.options;g.setOptions;g.use;g.walkTokens;g.parseInline;_.parse;y.lex;function Ue(h){return h?g.parse(h):""}class Ve extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.content="",this.displayedContent="",this.animationInterval=null,this.animationSpeed=30}connectedCallback(){const e=this.getAttribute("sender"),t=this.getAttribute("content")||"";this.content=t,this.render(e,this.content)}appendContent(e){this.content+=e,this.animateContent()}updateContent(e){this.content=e;const t=this.getAttribute("sender");this.render(t,this.content)}render(e,t){const n=e==="assistant";this.displayedContent="",this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          width: 100%;
        }
        .message-wrapper {
          display: flex;
          align-items: flex-end;
          width: 100%;
          margin-bottom: var(--spacing-6);
          gap: var(--spacing-2);
        }

        .message-wrapper--assistant {
          justify-content: flex-start;
        }

        .message-wrapper--user {
          justify-content: flex-end;
        }

        .assistant-icon {
          width: 30px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--spacing-2);
        }

        .message {
          max-width: 80%;
          padding: var(--spacing-4);
          border-radius: 20px;
          word-wrap: break-word;
          background-color: ${n?"#FFFFFF":"rgba(255, 255, 255, 0.1)"};
          color: ${n?"#231F25":"#FFFFFF"};
          border: ${n?"none":"1px solid #FFFFFF"};
          overflow: hidden;
          white-space: pre-wrap;
          font-family: inherit;
        }

        .message--assistant {
          background-color: #FFFFFF;
          color: #231F25 !important;
          border-bottom-left-radius: 4px;
        }

        .message--user {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid #FFFFFF;
          color: white;
        }

        .message__content {
          display: flex;
          flex-direction: column;
          gap: 1em;
          flex-grow: 1;
          font-family: inherit;
        }

        /* Markdown styling */
        .message__content h1, .message__content h2, .message__content h3 {
          margin: 0.5em 0;
        }

        .message__content a {
          color: #0066cc;
          text-decoration: none;
        }

        .message__content a:hover {
          text-decoration: underline;
        }

        .message__content strong {
          font-weight: bold;
        }

        .message__content em {
          font-style: italic;
        }

        /* Add more markdown styles as needed */
      </style>
      <div class="message-wrapper message-wrapper--${e}">
        ${n?'<div class="assistant-icon">🤖</div>':""}
        <div class="message message--${e}">
          <div class="message__content">${t}</div>
        </div>
      </div>
    `,n&&this.animateContent()}animateContent(){if(!(this.getAttribute("sender")==="assistant"))return;const n=this.shadowRoot.querySelector(".message__content");if(!n)return;const i=this.content;this.displayedContent="",this.animationInterval&&clearInterval(this.animationInterval),n.innerHTML="";const s=Ue(i),r=document.createElement("div");r.innerHTML=s;const o=Array.from(r.childNodes);this.animateNodes(n,o)}animateNodes(e,t){t.forEach(n=>{if(n.nodeType===Node.TEXT_NODE)this.animateTextNode(e,n.textContent);else if(n.nodeType===Node.ELEMENT_NODE){const i=document.createElement(n.tagName.toLowerCase());Array.from(n.attributes).forEach(s=>{i.setAttribute(s.name,s.value)}),e.appendChild(i),this.animateNodes(i,n.childNodes)}})}animateTextNode(e,t){let n=0;const i=document.createElement("span");e.appendChild(i),this.animationInterval=setInterval(()=>{n<t.length?(i.textContent+=t[n],n++,this.scrollToBottom()):(clearInterval(this.animationInterval),this.animationInterval=null)},this.animationSpeed)}scrollToBottom(){this.parentElement.scrollTop=this.parentElement.scrollHeight}}class Xe extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null,this.items=[],this.currentIndex=0,this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.moveLeft=this.moveLeft.bind(this),this.moveRight=this.moveRight.bind(this),this.handleResize=this.handleResize.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}set eventBus(e){this._eventBus=e}connectedCallback(){const e=this.getAttribute("data-carousel");if(!e){console.error("No data-carousel attribute found. Cannot render carousel.");return}let t;try{t=JSON.parse(e)}catch(n){console.error("Failed to parse carousel data:",n);return}if(!t||!Array.isArray(t.cards)){console.error("carouselData.cards is not defined or not an array");return}this.renderCarousel(t)}renderCarousel(e){this.carouselData=e,this.shadowRoot.innerHTML=`
      <style>
        h6 {
          font-family: var(--heading-font-family);
          font-weight: var(--heading-font-weight);
          font-style: var(--heading-font-style);
          letter-spacing: var(--heading-letter-spacing);
          text-transform: var(--heading-text-transform);
          overflow-wrap: anywhere;
          font-size: var(--text-sm);
        }

        .button {
          --button-background: var(--button-background-primary) /
            var(--button-background-opacity, 1);
          --button-text-color: var(--button-text-primary);
          --button-outline-color: white;
          -webkit-appearance: none;
          appearance: none;
          border-color: white;
          border-radius: 8px;
          border-width: 1px;
          background-color: rgb(var(--button-background));
          color: rgb(var(--button-text-color));
          text-align: center;
          font-size: var(--text-h6);
          letter-spacing: var(--text-letter-spacing);
          padding-block-start: var(--spacing-2-5);
          padding-block-end: var(--spacing-2-5);
          padding-inline-start: var(--spacing-5);
          padding-inline-end: var(--spacing-5);
          font-weight: bold;
          line-height: 1.6;
          transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          display: inline-block;
          position: relative;
        }

        .carousel {
          position: relative;
          width: 100%;
          overflow: hidden;
          margin-bottom: var(--spacing-4);
          box-sizing: border-box;
        }

        .carousel__container {
          display: flex;
          transition: transform 0.3s ease-out;
          max-width: 100%;
        }

        .carousel__item {
          flex: 0 0 100%;
          display: flex;
          gap: var(--spacing-4);
          box-sizing: border-box;
          max-width: 100%;
          align-items: flex-start;
        }

        .carousel__item-wrapper {
          flex: 0 0 100%;
          max-width: 100%;
          min-width: 0;
        }

        .carousel__button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.8);
          border: solid 1px #403545;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
        }

        .carousel__button--left {
          left: 10px;
        }

        .carousel__button--right {
          right: 10px;
        }

        .carousel__item-button {
          font-size: var(--text-sm);
        }

        .carousel__item-content {
          background: #FFFFFF;
          border-radius: 8px;
          padding: var(--spacing-4);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .carousel__item-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          margin-bottom: var(--spacing-2);
          object-fit: cover;
        }

        .carousel__item-title {
          font-weight: bold;
          margin-bottom: var(--spacing-0);
          margin-top: var(--spacing-0);
          font-size: var(--text-base);
        }

        .carousel__item-description {
          margin-bottom: var(--spacing-4);
          margin-top: var(--spacing-0);
          font-size: var(--text-sm);
          color: #403545 !important;
          flex-grow: 1;
        }

        @media (min-width: 1000px) {
          .carousel__item {
            flex: 0 0 50%;
            max-width: 50%;
          }

          .carousel__item-wrapper {
            flex: 0 0 calc(100% - var(--spacing-2));
            max-width: calc(100% - var(--spacing-2));
          }
        }
      </style>
      <div class="carousel">
        <div class="carousel__container">
          <!-- Items appended here -->
        </div>
        <button class="carousel__button carousel__button--left" aria-label="Previous slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="carousel__button carousel__button--right" aria-label="Next slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `,this.carouselContainer=this.shadowRoot.querySelector(".carousel__container"),this.leftButton=this.shadowRoot.querySelector(".carousel__button--left"),this.rightButton=this.shadowRoot.querySelector(".carousel__button--right"),this.carouselData.cards.forEach((t,n)=>{const i=document.createElement("div");i.classList.add("carousel__item");const s=document.createElement("div");s.classList.add("carousel__item-wrapper");const r=document.createElement("div");if(r.classList.add("carousel__item-content"),t.imageUrl){const o=document.createElement("img");o.src=t.imageUrl,o.alt=t.title||"",o.classList.add("carousel__item-image"),r.appendChild(o)}if(t.title){const o=document.createElement("h6");o.classList.add("carousel__item-title"),o.textContent=t.title,r.appendChild(o)}if(t.description&&t.description.text){const o=document.createElement("p");o.classList.add("carousel__item-description"),o.textContent=t.description.text,r.appendChild(o)}if(t.buttons&&t.buttons.length>0){const o=t.buttons[0],c=document.createElement("button");c.classList.add("button","carousel__item-button"),c.setAttribute("data-button-index",n),c.setAttribute("data-button-payload",JSON.stringify(o.request)),c.setAttribute("data-button-text",o.name),c.textContent=o.name||"Select",r.appendChild(c),c.addEventListener("click",this.handleButtonClick)}s.appendChild(r),i.appendChild(s),this.carouselContainer.appendChild(i),this.items.push(i)}),this.initCarousel(),this.leftButton.addEventListener("click",this.moveLeft),this.rightButton.addEventListener("click",this.moveRight),window.addEventListener("resize",this.handleResize),this.updateVisibility(),this.updatePosition()}initCarousel(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updateVisibility(),this.updatePosition()}handleResize(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}moveLeft(){const e=this.itemsPerSlide;this.currentIndex=Math.max(0,this.currentIndex-e),this.updatePosition(),this.updateVisibility()}moveRight(){const e=this.itemsPerSlide;this.currentIndex=Math.min(this.items.length-e,this.currentIndex+e),this.updatePosition(),this.updateVisibility()}updatePosition(){const e=-(this.currentIndex/this.itemsPerSlide)*100;this.carouselContainer.style.transform=`translateX(${e}%)`}updateVisibility(){this.leftButton.disabled=this.currentIndex===0,this.rightButton.disabled=this.currentIndex>=this.items.length-this.itemsPerSlide}handleButtonClick(e){if(!this._eventBus){console.error("No eventBus assigned to CarouselComponent");return}const t=e.target,n=parseInt(t.getAttribute("data-button-index"),10),i=this.carouselData.cards[n];if(!i||!i.buttons||i.buttons.length===0){console.warn("No button data found for this card.");return}const s=i.buttons[0];console.log("Original button data:",s);const r=s.request.payload.title,o=r?`Selected ${r}`:"Selected Power Station";this._eventBus.emit("carouselButtonClicked",{action:s.request,label:o}),this.remove()}}customElements.define("button-component",be);customElements.define("message-component",Ve);customElements.define("carousel-component",Xe);console.log("MessageComponent defined");console.log("ButtonComponent defined");console.log("CarouselComponent defined");
//# sourceMappingURL=chatbot-components.CgGSILkk.js.map
