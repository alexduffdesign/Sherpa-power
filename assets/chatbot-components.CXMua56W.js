var Pn=Object.defineProperty;var Dn=(p,e,t)=>e in p?Pn(p,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):p[e]=t;var T=(p,e,t)=>Dn(p,typeof e!="symbol"?e+"":e,t);import{S as Mn}from"./streaming-markdown-parser.DIrdmlP7.js";class On extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null}set eventBus(e){this._eventBus=e}connectedCallback(){const e=this.getAttribute("label"),t=this.getAttribute("payload");this.render(e,t)}render(e,t){this.shadowRoot.innerHTML=`
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
    `,this.shadowRoot.querySelector(".button").addEventListener("click",()=>{if(!this._eventBus){console.error("No eventBus assigned to ButtonComponent");return}try{const n=JSON.parse(t);this._eventBus.emit("buttonClicked",n)}catch(n){console.error("Error parsing button payload:",n)}})}}function pt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}let te=pt();function rn(p){te=p}const Te={exec:()=>null};function w(p,e=""){let t=typeof p=="string"?p:p.source;const n={replace:(i,s)=>{let o=typeof s=="string"?s:s.source;return o=o.replace(D.caret,"$1"),t=t.replace(i,o),n},getRegex:()=>new RegExp(t,e)};return n}const D={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] /,listReplaceTask:/^\[[ xX]\] +/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:p=>new RegExp(`^( {0,3}${p})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:p=>new RegExp(`^ {0,${Math.min(3,p-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:p=>new RegExp(`^ {0,${Math.min(3,p-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:p=>new RegExp(`^ {0,${Math.min(3,p-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:p=>new RegExp(`^ {0,${Math.min(3,p-1)}}#`),htmlBeginRegex:p=>new RegExp(`^ {0,${Math.min(3,p-1)}}<(?:[a-z].*>|!--)`,"i")},zn=/^(?:[ \t]*(?:\n|$))+/,$n=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Fn=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,Ee=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Bn=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,on=/(?:[*+-]|\d{1,9}[.)])/,an=w(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,on).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).getRegex(),ht=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Un=/^[^\n]+/,dt=/(?!\s*\])(?:\\.|[^\[\]\\])+/,Hn=w(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",dt).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),qn=w(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,on).getRegex(),Be="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",ft=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Gn=w("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",ft).replace("tag",Be).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),ln=w(ht).replace("hr",Ee).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Be).getRegex(),Wn=w(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",ln).getRegex(),gt={blockquote:Wn,code:$n,def:Hn,fences:Fn,heading:Bn,hr:Ee,html:Gn,lheading:an,list:qn,newline:zn,paragraph:ln,table:Te,text:Un},Gt=w("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",Ee).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Be).getRegex(),jn={...gt,table:Gt,paragraph:w(ht).replace("hr",Ee).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Gt).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Be).getRegex()},Zn={...gt,html:w(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",ft).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Te,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:w(ht).replace("hr",Ee).replace("heading",` *#{1,6} *[^
]`).replace("lheading",an).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},cn=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Yn=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,un=/^( {2,}|\\)\n(?!\s*$)/,Xn=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,Ue=/[\p{P}\p{S}]/u,mt=/[\s\p{P}\p{S}]/u,pn=/[^\s\p{P}\p{S}]/u,Vn=w(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,mt).getRegex(),Qn=/\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g,Kn=w(/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,"u").replace(/punct/g,Ue).getRegex(),Jn=w("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)","gu").replace(/notPunctSpace/g,pn).replace(/punctSpace/g,mt).replace(/punct/g,Ue).getRegex(),ei=w("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,pn).replace(/punctSpace/g,mt).replace(/punct/g,Ue).getRegex(),ti=w(/\\(punct)/,"gu").replace(/punct/g,Ue).getRegex(),ni=w(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),ii=w(ft).replace("(?:-->|$)","-->").getRegex(),si=w("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",ii).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),ze=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,ri=w(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",ze).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),hn=w(/^!?\[(label)\]\[(ref)\]/).replace("label",ze).replace("ref",dt).getRegex(),dn=w(/^!?\[(ref)\](?:\[\])?/).replace("ref",dt).getRegex(),oi=w("reflink|nolink(?!\\()","g").replace("reflink",hn).replace("nolink",dn).getRegex(),bt={_backpedal:Te,anyPunctuation:ti,autolink:ni,blockSkip:Qn,br:un,code:Yn,del:Te,emStrongLDelim:Kn,emStrongRDelimAst:Jn,emStrongRDelimUnd:ei,escape:cn,link:ri,nolink:dn,punctuation:Vn,reflink:hn,reflinkSearch:oi,tag:si,text:Xn,url:Te},ai={...bt,link:w(/^!?\[(label)\]\((.*?)\)/).replace("label",ze).getRegex(),reflink:w(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",ze).getRegex()},lt={...bt,escape:w(cn).replace("])","~|])").getRegex(),url:w(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},li={...lt,br:w(un).replace("{2,}","*").getRegex(),text:w(lt.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Pe={normal:gt,gfm:jn,pedantic:Zn},ge={normal:bt,gfm:lt,breaks:li,pedantic:ai},ci={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Wt=p=>ci[p];function j(p,e){if(e){if(D.escapeTest.test(p))return p.replace(D.escapeReplace,Wt)}else if(D.escapeTestNoEncode.test(p))return p.replace(D.escapeReplaceNoEncode,Wt);return p}function jt(p){try{p=encodeURI(p).replace(D.percentDecode,"%")}catch{return null}return p}function Zt(p,e){var s;const t=p.replace(D.findPipe,(o,a,u)=>{let l=!1,c=a;for(;--c>=0&&u[c]==="\\";)l=!l;return l?"|":" |"}),n=t.split(D.splitPipe);let i=0;if(n[0].trim()||n.shift(),n.length>0&&!((s=n.at(-1))!=null&&s.trim())&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;i<n.length;i++)n[i]=n[i].trim().replace(D.slashPipe,"|");return n}function me(p,e,t){const n=p.length;if(n===0)return"";let i=0;for(;i<n;){const s=p.charAt(n-i-1);if(s===e&&!t)i++;else if(s!==e&&t)i++;else break}return p.slice(0,n-i)}function ui(p,e){if(p.indexOf(e[1])===-1)return-1;let t=0;for(let n=0;n<p.length;n++)if(p[n]==="\\")n++;else if(p[n]===e[0])t++;else if(p[n]===e[1]&&(t--,t<0))return n;return-1}function Yt(p,e,t,n,i){const s=e.href,o=e.title||null,a=p[1].replace(i.other.outputLinkReplace,"$1");if(p[0].charAt(0)!=="!"){n.state.inLink=!0;const u={type:"link",raw:t,href:s,title:o,text:a,tokens:n.inlineTokens(a)};return n.state.inLink=!1,u}return{type:"image",raw:t,href:s,title:o,text:a}}function pi(p,e,t){const n=p.match(t.other.indentCodeCompensation);if(n===null)return e;const i=n[1];return e.split(`
`).map(s=>{const o=s.match(t.other.beginningSpace);if(o===null)return s;const[a]=o;return a.length>=i.length?s.slice(i.length):s}).join(`
`)}class $e{constructor(e){T(this,"options");T(this,"rules");T(this,"lexer");this.options=e||te}space(e){const t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){const t=this.rules.block.code.exec(e);if(t){const n=t[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?n:me(n,`
`)}}}fences(e){const t=this.rules.block.fences.exec(e);if(t){const n=t[0],i=pi(n,t[3]||"",this.rules);return{type:"code",raw:n,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:i}}}heading(e){const t=this.rules.block.heading.exec(e);if(t){let n=t[2].trim();if(this.rules.other.endingHash.test(n)){const i=me(n,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceChar.test(i))&&(n=i.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:n,tokens:this.lexer.inline(n)}}}hr(e){const t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:me(t[0],`
`)}}blockquote(e){const t=this.rules.block.blockquote.exec(e);if(t){let n=me(t[0],`
`).split(`
`),i="",s="";const o=[];for(;n.length>0;){let a=!1;const u=[];let l;for(l=0;l<n.length;l++)if(this.rules.other.blockquoteStart.test(n[l]))u.push(n[l]),a=!0;else if(!a)u.push(n[l]);else break;n=n.slice(l);const c=u.join(`
`),g=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${c}`:c,s=s?`${s}
${g}`:g;const m=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(g,o,!0),this.lexer.state.top=m,n.length===0)break;const b=o.at(-1);if((b==null?void 0:b.type)==="code")break;if((b==null?void 0:b.type)==="blockquote"){const y=b,_=y.raw+`
`+n.join(`
`),O=this.blockquote(_);o[o.length-1]=O,i=i.substring(0,i.length-y.raw.length)+O.raw,s=s.substring(0,s.length-y.text.length)+O.text;break}else if((b==null?void 0:b.type)==="list"){const y=b,_=y.raw+`
`+n.join(`
`),O=this.list(_);o[o.length-1]=O,i=i.substring(0,i.length-b.raw.length)+O.raw,s=s.substring(0,s.length-y.raw.length)+O.raw,n=_.substring(o.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:o,text:s}}}list(e){let t=this.rules.block.list.exec(e);if(t){let n=t[1].trim();const i=n.length>1,s={type:"list",raw:"",ordered:i,start:i?+n.slice(0,-1):"",loose:!1,items:[]};n=i?`\\d{1,9}\\${n.slice(-1)}`:`\\${n}`,this.options.pedantic&&(n=i?n:"[*+-]");const o=this.rules.other.listItemRegex(n);let a=!1;for(;e;){let l=!1,c="",g="";if(!(t=o.exec(e))||this.rules.block.hr.test(e))break;c=t[0],e=e.substring(c.length);let m=t[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,le=>" ".repeat(3*le.length)),b=e.split(`
`,1)[0],y=!m.trim(),_=0;if(this.options.pedantic?(_=2,g=m.trimStart()):y?_=t[1].length+1:(_=t[2].search(this.rules.other.nonSpaceChar),_=_>4?1:_,g=m.slice(_),_+=t[1].length),y&&this.rules.other.blankLine.test(b)&&(c+=b+`
`,e=e.substring(b.length+1),l=!0),!l){const le=this.rules.other.nextBulletRegex(_),V=this.rules.other.hrRegex(_),S=this.rules.other.fencesBeginRegex(_),X=this.rules.other.headingBeginRegex(_),ce=this.rules.other.htmlBeginRegex(_);for(;e;){const ue=e.split(`
`,1)[0];let Q;if(b=ue,this.options.pedantic?(b=b.replace(this.rules.other.listReplaceNesting,"  "),Q=b):Q=b.replace(this.rules.other.tabCharGlobal,"    "),S.test(b)||X.test(b)||ce.test(b)||le.test(b)||V.test(b))break;if(Q.search(this.rules.other.nonSpaceChar)>=_||!b.trim())g+=`
`+Q.slice(_);else{if(y||m.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||S.test(m)||X.test(m)||V.test(m))break;g+=`
`+b}!y&&!b.trim()&&(y=!0),c+=ue+`
`,e=e.substring(ue.length+1),m=Q.slice(_)}}s.loose||(a?s.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(a=!0));let O=null,Ae;this.options.gfm&&(O=this.rules.other.listIsTask.exec(g),O&&(Ae=O[0]!=="[ ] ",g=g.replace(this.rules.other.listReplaceTask,""))),s.items.push({type:"list_item",raw:c,task:!!O,checked:Ae,loose:!1,text:g,tokens:[]}),s.raw+=c}const u=s.items.at(-1);if(u)u.raw=u.raw.trimEnd(),u.text=u.text.trimEnd();else return;s.raw=s.raw.trimEnd();for(let l=0;l<s.items.length;l++)if(this.lexer.state.top=!1,s.items[l].tokens=this.lexer.blockTokens(s.items[l].text,[]),!s.loose){const c=s.items[l].tokens.filter(m=>m.type==="space"),g=c.length>0&&c.some(m=>this.rules.other.anyLine.test(m.raw));s.loose=g}if(s.loose)for(let l=0;l<s.items.length;l++)s.items[l].loose=!0;return s}}html(e){const t=this.rules.block.html.exec(e);if(t)return{type:"html",block:!0,raw:t[0],pre:t[1]==="pre"||t[1]==="script"||t[1]==="style",text:t[0]}}def(e){const t=this.rules.block.def.exec(e);if(t){const n=t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),i=t[2]?t[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",s=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:n,raw:t[0],href:i,title:s}}}table(e){var a;const t=this.rules.block.table.exec(e);if(!t||!this.rules.other.tableDelimiter.test(t[2]))return;const n=Zt(t[1]),i=t[2].replace(this.rules.other.tableAlignChars,"").split("|"),s=(a=t[3])!=null&&a.trim()?t[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:t[0],header:[],align:[],rows:[]};if(n.length===i.length){for(const u of i)this.rules.other.tableAlignRight.test(u)?o.align.push("right"):this.rules.other.tableAlignCenter.test(u)?o.align.push("center"):this.rules.other.tableAlignLeft.test(u)?o.align.push("left"):o.align.push(null);for(let u=0;u<n.length;u++)o.header.push({text:n[u],tokens:this.lexer.inline(n[u]),header:!0,align:o.align[u]});for(const u of s)o.rows.push(Zt(u,o.header.length).map((l,c)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:o.align[c]})));return o}}lheading(e){const t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:t[2].charAt(0)==="="?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){const t=this.rules.block.paragraph.exec(e);if(t){const n=t[1].charAt(t[1].length-1)===`
`?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:n,tokens:this.lexer.inline(n)}}}text(e){const t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){const t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:t[1]}}tag(e){const t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&this.rules.other.startATag.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){const t=this.rules.inline.link.exec(e);if(t){const n=t[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(n)){if(!this.rules.other.endAngleBracket.test(n))return;const o=me(n.slice(0,-1),"\\");if((n.length-o.length)%2===0)return}else{const o=ui(t[2],"()");if(o>-1){const u=(t[0].indexOf("!")===0?5:4)+t[1].length+o;t[2]=t[2].substring(0,o),t[0]=t[0].substring(0,u).trim(),t[3]=""}}let i=t[2],s="";if(this.options.pedantic){const o=this.rules.other.pedanticHrefTitle.exec(i);o&&(i=o[1],s=o[3])}else s=t[3]?t[3].slice(1,-1):"";return i=i.trim(),this.rules.other.startAngleBracket.test(i)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(n)?i=i.slice(1):i=i.slice(1,-1)),Yt(t,{href:i&&i.replace(this.rules.inline.anyPunctuation,"$1"),title:s&&s.replace(this.rules.inline.anyPunctuation,"$1")},t[0],this.lexer,this.rules)}}reflink(e,t){let n;if((n=this.rules.inline.reflink.exec(e))||(n=this.rules.inline.nolink.exec(e))){const i=(n[2]||n[1]).replace(this.rules.other.multipleSpaceGlobal," "),s=t[i.toLowerCase()];if(!s){const o=n[0].charAt(0);return{type:"text",raw:o,text:o}}return Yt(n,s,n[0],this.lexer,this.rules)}}emStrong(e,t,n=""){let i=this.rules.inline.emStrongLDelim.exec(e);if(!i||i[3]&&n.match(this.rules.other.unicodeAlphaNumeric))return;if(!(i[1]||i[2]||"")||!n||this.rules.inline.punctuation.exec(n)){const o=[...i[0]].length-1;let a,u,l=o,c=0;const g=i[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(g.lastIndex=0,t=t.slice(-1*e.length+o);(i=g.exec(t))!=null;){if(a=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!a)continue;if(u=[...a].length,i[3]||i[4]){l+=u;continue}else if((i[5]||i[6])&&o%3&&!((o+u)%3)){c+=u;continue}if(l-=u,l>0)continue;u=Math.min(u,u+l+c);const m=[...i[0]][0].length,b=e.slice(0,o+i.index+m+u);if(Math.min(o,u)%2){const _=b.slice(1,-1);return{type:"em",raw:b,text:_,tokens:this.lexer.inlineTokens(_)}}const y=b.slice(2,-2);return{type:"strong",raw:b,text:y,tokens:this.lexer.inlineTokens(y)}}}}codespan(e){const t=this.rules.inline.code.exec(e);if(t){let n=t[2].replace(this.rules.other.newLineCharGlobal," ");const i=this.rules.other.nonSpaceChar.test(n),s=this.rules.other.startingSpaceChar.test(n)&&this.rules.other.endingSpaceChar.test(n);return i&&s&&(n=n.substring(1,n.length-1)),{type:"codespan",raw:t[0],text:n}}}br(e){const t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){const t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){const t=this.rules.inline.autolink.exec(e);if(t){let n,i;return t[2]==="@"?(n=t[1],i="mailto:"+n):(n=t[1],i=n),{type:"link",raw:t[0],text:n,href:i,tokens:[{type:"text",raw:n,text:n}]}}}url(e){var n;let t;if(t=this.rules.inline.url.exec(e)){let i,s;if(t[2]==="@")i=t[0],s="mailto:"+i;else{let o;do o=t[0],t[0]=((n=this.rules.inline._backpedal.exec(t[0]))==null?void 0:n[0])??"";while(o!==t[0]);i=t[0],t[1]==="www."?s="http://"+t[0]:s=t[0]}return{type:"link",raw:t[0],text:i,href:s,tokens:[{type:"text",raw:i,text:i}]}}}inlineText(e){const t=this.rules.inline.text.exec(e);if(t){const n=this.lexer.state.inRawBlock;return{type:"text",raw:t[0],text:t[0],escaped:n}}}}class B{constructor(e){T(this,"tokens");T(this,"options");T(this,"state");T(this,"tokenizer");T(this,"inlineQueue");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||te,this.options.tokenizer=this.options.tokenizer||new $e,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={other:D,block:Pe.normal,inline:ge.normal};this.options.pedantic?(t.block=Pe.pedantic,t.inline=ge.pedantic):this.options.gfm&&(t.block=Pe.gfm,this.options.breaks?t.inline=ge.breaks:t.inline=ge.gfm),this.tokenizer.rules=t}static get rules(){return{block:Pe,inline:ge}}static lex(e,t){return new B(t).lex(e)}static lexInline(e,t){return new B(t).inlineTokens(e)}lex(e){e=e.replace(D.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){const n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){var i,s,o;for(this.options.pedantic&&(e=e.replace(D.tabCharGlobal,"    ").replace(D.spaceLine,""));e;){let a;if((s=(i=this.options.extensions)==null?void 0:i.block)!=null&&s.some(l=>(a=l.call({lexer:this},e,t))?(e=e.substring(a.raw.length),t.push(a),!0):!1))continue;if(a=this.tokenizer.space(e)){e=e.substring(a.raw.length);const l=t.at(-1);a.raw.length===1&&l!==void 0?l.raw+=`
`:t.push(a);continue}if(a=this.tokenizer.code(e)){e=e.substring(a.raw.length);const l=t.at(-1);(l==null?void 0:l.type)==="paragraph"||(l==null?void 0:l.type)==="text"?(l.raw+=`
`+a.raw,l.text+=`
`+a.text,this.inlineQueue.at(-1).src=l.text):t.push(a);continue}if(a=this.tokenizer.fences(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.heading(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.hr(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.blockquote(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.list(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.html(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.def(e)){e=e.substring(a.raw.length);const l=t.at(-1);(l==null?void 0:l.type)==="paragraph"||(l==null?void 0:l.type)==="text"?(l.raw+=`
`+a.raw,l.text+=`
`+a.raw,this.inlineQueue.at(-1).src=l.text):this.tokens.links[a.tag]||(this.tokens.links[a.tag]={href:a.href,title:a.title});continue}if(a=this.tokenizer.table(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.lheading(e)){e=e.substring(a.raw.length),t.push(a);continue}let u=e;if((o=this.options.extensions)!=null&&o.startBlock){let l=1/0;const c=e.slice(1);let g;this.options.extensions.startBlock.forEach(m=>{g=m.call({lexer:this},c),typeof g=="number"&&g>=0&&(l=Math.min(l,g))}),l<1/0&&l>=0&&(u=e.substring(0,l+1))}if(this.state.top&&(a=this.tokenizer.paragraph(u))){const l=t.at(-1);n&&(l==null?void 0:l.type)==="paragraph"?(l.raw+=`
`+a.raw,l.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=l.text):t.push(a),n=u.length!==e.length,e=e.substring(a.raw.length);continue}if(a=this.tokenizer.text(e)){e=e.substring(a.raw.length);const l=t.at(-1);(l==null?void 0:l.type)==="text"?(l.raw+=`
`+a.raw,l.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=l.text):t.push(a);continue}if(e){const l="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(l);break}else throw new Error(l)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){var a,u,l;let n=e,i=null;if(this.tokens.links){const c=Object.keys(this.tokens.links);if(c.length>0)for(;(i=this.tokenizer.rules.inline.reflinkSearch.exec(n))!=null;)c.includes(i[0].slice(i[0].lastIndexOf("[")+1,-1))&&(n=n.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(i=this.tokenizer.rules.inline.blockSkip.exec(n))!=null;)n=n.slice(0,i.index)+"["+"a".repeat(i[0].length-2)+"]"+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;(i=this.tokenizer.rules.inline.anyPunctuation.exec(n))!=null;)n=n.slice(0,i.index)+"++"+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let s=!1,o="";for(;e;){s||(o=""),s=!1;let c;if((u=(a=this.options.extensions)==null?void 0:a.inline)!=null&&u.some(m=>(c=m.call({lexer:this},e,t))?(e=e.substring(c.raw.length),t.push(c),!0):!1))continue;if(c=this.tokenizer.escape(e)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.tag(e)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.link(e)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(c.raw.length);const m=t.at(-1);c.type==="text"&&(m==null?void 0:m.type)==="text"?(m.raw+=c.raw,m.text+=c.text):t.push(c);continue}if(c=this.tokenizer.emStrong(e,n,o)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.codespan(e)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.br(e)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.del(e)){e=e.substring(c.raw.length),t.push(c);continue}if(c=this.tokenizer.autolink(e)){e=e.substring(c.raw.length),t.push(c);continue}if(!this.state.inLink&&(c=this.tokenizer.url(e))){e=e.substring(c.raw.length),t.push(c);continue}let g=e;if((l=this.options.extensions)!=null&&l.startInline){let m=1/0;const b=e.slice(1);let y;this.options.extensions.startInline.forEach(_=>{y=_.call({lexer:this},b),typeof y=="number"&&y>=0&&(m=Math.min(m,y))}),m<1/0&&m>=0&&(g=e.substring(0,m+1))}if(c=this.tokenizer.inlineText(g)){e=e.substring(c.raw.length),c.raw.slice(-1)!=="_"&&(o=c.raw.slice(-1)),s=!0;const m=t.at(-1);(m==null?void 0:m.type)==="text"?(m.raw+=c.raw,m.text+=c.text):t.push(c);continue}if(e){const m="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(m);break}else throw new Error(m)}}return t}}class Fe{constructor(e){T(this,"options");T(this,"parser");this.options=e||te}space(e){return""}code({text:e,lang:t,escaped:n}){var o;const i=(o=(t||"").match(D.notSpaceStart))==null?void 0:o[0],s=e.replace(D.endingNewline,"")+`
`;return i?'<pre><code class="language-'+j(i)+'">'+(n?s:j(s,!0))+`</code></pre>
`:"<pre><code>"+(n?s:j(s,!0))+`</code></pre>
`}blockquote({tokens:e}){return`<blockquote>
${this.parser.parse(e)}</blockquote>
`}html({text:e}){return e}heading({tokens:e,depth:t}){return`<h${t}>${this.parser.parseInline(e)}</h${t}>
`}hr(e){return`<hr>
`}list(e){const t=e.ordered,n=e.start;let i="";for(let a=0;a<e.items.length;a++){const u=e.items[a];i+=this.listitem(u)}const s=t?"ol":"ul",o=t&&n!==1?' start="'+n+'"':"";return"<"+s+o+`>
`+i+"</"+s+`>
`}listitem(e){var n;let t="";if(e.task){const i=this.checkbox({checked:!!e.checked});e.loose?((n=e.tokens[0])==null?void 0:n.type)==="paragraph"?(e.tokens[0].text=i+" "+e.tokens[0].text,e.tokens[0].tokens&&e.tokens[0].tokens.length>0&&e.tokens[0].tokens[0].type==="text"&&(e.tokens[0].tokens[0].text=i+" "+j(e.tokens[0].tokens[0].text),e.tokens[0].tokens[0].escaped=!0)):e.tokens.unshift({type:"text",raw:i+" ",text:i+" ",escaped:!0}):t+=i+" "}return t+=this.parser.parse(e.tokens,!!e.loose),`<li>${t}</li>
`}checkbox({checked:e}){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph({tokens:e}){return`<p>${this.parser.parseInline(e)}</p>
`}table(e){let t="",n="";for(let s=0;s<e.header.length;s++)n+=this.tablecell(e.header[s]);t+=this.tablerow({text:n});let i="";for(let s=0;s<e.rows.length;s++){const o=e.rows[s];n="";for(let a=0;a<o.length;a++)n+=this.tablecell(o[a]);i+=this.tablerow({text:n})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+t+`</thead>
`+i+`</table>
`}tablerow({text:e}){return`<tr>
${e}</tr>
`}tablecell(e){const t=this.parser.parseInline(e.tokens),n=e.header?"th":"td";return(e.align?`<${n} align="${e.align}">`:`<${n}>`)+t+`</${n}>
`}strong({tokens:e}){return`<strong>${this.parser.parseInline(e)}</strong>`}em({tokens:e}){return`<em>${this.parser.parseInline(e)}</em>`}codespan({text:e}){return`<code>${j(e,!0)}</code>`}br(e){return"<br>"}del({tokens:e}){return`<del>${this.parser.parseInline(e)}</del>`}link({href:e,title:t,tokens:n}){const i=this.parser.parseInline(n),s=jt(e);if(s===null)return i;e=s;let o='<a href="'+e+'"';return t&&(o+=' title="'+j(t)+'"'),o+=">"+i+"</a>",o}image({href:e,title:t,text:n}){const i=jt(e);if(i===null)return j(n);e=i;let s=`<img src="${e}" alt="${n}"`;return t&&(s+=` title="${j(t)}"`),s+=">",s}text(e){return"tokens"in e&&e.tokens?this.parser.parseInline(e.tokens):"escaped"in e&&e.escaped?e.text:j(e.text)}}class kt{strong({text:e}){return e}em({text:e}){return e}codespan({text:e}){return e}del({text:e}){return e}html({text:e}){return e}text({text:e}){return e}link({text:e}){return""+e}image({text:e}){return""+e}br(){return""}}class U{constructor(e){T(this,"options");T(this,"renderer");T(this,"textRenderer");this.options=e||te,this.options.renderer=this.options.renderer||new Fe,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new kt}static parse(e,t){return new U(t).parse(e)}static parseInline(e,t){return new U(t).parseInline(e)}parse(e,t=!0){var i,s;let n="";for(let o=0;o<e.length;o++){const a=e[o];if((s=(i=this.options.extensions)==null?void 0:i.renderers)!=null&&s[a.type]){const l=a,c=this.options.extensions.renderers[l.type].call({parser:this},l);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(l.type)){n+=c||"";continue}}const u=a;switch(u.type){case"space":{n+=this.renderer.space(u);continue}case"hr":{n+=this.renderer.hr(u);continue}case"heading":{n+=this.renderer.heading(u);continue}case"code":{n+=this.renderer.code(u);continue}case"table":{n+=this.renderer.table(u);continue}case"blockquote":{n+=this.renderer.blockquote(u);continue}case"list":{n+=this.renderer.list(u);continue}case"html":{n+=this.renderer.html(u);continue}case"paragraph":{n+=this.renderer.paragraph(u);continue}case"text":{let l=u,c=this.renderer.text(l);for(;o+1<e.length&&e[o+1].type==="text";)l=e[++o],c+=`
`+this.renderer.text(l);t?n+=this.renderer.paragraph({type:"paragraph",raw:c,text:c,tokens:[{type:"text",raw:c,text:c,escaped:!0}]}):n+=c;continue}default:{const l='Token with "'+u.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return n}parseInline(e,t=this.renderer){var i,s;let n="";for(let o=0;o<e.length;o++){const a=e[o];if((s=(i=this.options.extensions)==null?void 0:i.renderers)!=null&&s[a.type]){const l=this.options.extensions.renderers[a.type].call({parser:this},a);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(a.type)){n+=l||"";continue}}const u=a;switch(u.type){case"escape":{n+=t.text(u);break}case"html":{n+=t.html(u);break}case"link":{n+=t.link(u);break}case"image":{n+=t.image(u);break}case"strong":{n+=t.strong(u);break}case"em":{n+=t.em(u);break}case"codespan":{n+=t.codespan(u);break}case"br":{n+=t.br(u);break}case"del":{n+=t.del(u);break}case"text":{n+=t.text(u);break}default:{const l='Token with "'+u.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return n}}class ye{constructor(e){T(this,"options");T(this,"block");this.options=e||te}preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}provideLexer(){return this.block?B.lex:B.lexInline}provideParser(){return this.block?U.parse:U.parseInline}}T(ye,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens"]));class hi{constructor(...e){T(this,"defaults",pt());T(this,"options",this.setOptions);T(this,"parse",this.parseMarkdown(!0));T(this,"parseInline",this.parseMarkdown(!1));T(this,"Parser",U);T(this,"Renderer",Fe);T(this,"TextRenderer",kt);T(this,"Lexer",B);T(this,"Tokenizer",$e);T(this,"Hooks",ye);this.use(...e)}walkTokens(e,t){var i,s;let n=[];for(const o of e)switch(n=n.concat(t.call(this,o)),o.type){case"table":{const a=o;for(const u of a.header)n=n.concat(this.walkTokens(u.tokens,t));for(const u of a.rows)for(const l of u)n=n.concat(this.walkTokens(l.tokens,t));break}case"list":{const a=o;n=n.concat(this.walkTokens(a.items,t));break}default:{const a=o;(s=(i=this.defaults.extensions)==null?void 0:i.childTokens)!=null&&s[a.type]?this.defaults.extensions.childTokens[a.type].forEach(u=>{const l=a[u].flat(1/0);n=n.concat(this.walkTokens(l,t))}):a.tokens&&(n=n.concat(this.walkTokens(a.tokens,t)))}}return n}use(...e){const t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(n=>{const i={...n};if(i.async=this.defaults.async||i.async||!1,n.extensions&&(n.extensions.forEach(s=>{if(!s.name)throw new Error("extension name required");if("renderer"in s){const o=t.renderers[s.name];o?t.renderers[s.name]=function(...a){let u=s.renderer.apply(this,a);return u===!1&&(u=o.apply(this,a)),u}:t.renderers[s.name]=s.renderer}if("tokenizer"in s){if(!s.level||s.level!=="block"&&s.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");const o=t[s.level];o?o.unshift(s.tokenizer):t[s.level]=[s.tokenizer],s.start&&(s.level==="block"?t.startBlock?t.startBlock.push(s.start):t.startBlock=[s.start]:s.level==="inline"&&(t.startInline?t.startInline.push(s.start):t.startInline=[s.start]))}"childTokens"in s&&s.childTokens&&(t.childTokens[s.name]=s.childTokens)}),i.extensions=t),n.renderer){const s=this.defaults.renderer||new Fe(this.defaults);for(const o in n.renderer){if(!(o in s))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;const a=o,u=n.renderer[a],l=s[a];s[a]=(...c)=>{let g=u.apply(s,c);return g===!1&&(g=l.apply(s,c)),g||""}}i.renderer=s}if(n.tokenizer){const s=this.defaults.tokenizer||new $e(this.defaults);for(const o in n.tokenizer){if(!(o in s))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;const a=o,u=n.tokenizer[a],l=s[a];s[a]=(...c)=>{let g=u.apply(s,c);return g===!1&&(g=l.apply(s,c)),g}}i.tokenizer=s}if(n.hooks){const s=this.defaults.hooks||new ye;for(const o in n.hooks){if(!(o in s))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;const a=o,u=n.hooks[a],l=s[a];ye.passThroughHooks.has(o)?s[a]=c=>{if(this.defaults.async)return Promise.resolve(u.call(s,c)).then(m=>l.call(s,m));const g=u.call(s,c);return l.call(s,g)}:s[a]=(...c)=>{let g=u.apply(s,c);return g===!1&&(g=l.apply(s,c)),g}}i.hooks=s}if(n.walkTokens){const s=this.defaults.walkTokens,o=n.walkTokens;i.walkTokens=function(a){let u=[];return u.push(o.call(this,a)),s&&(u=u.concat(s.call(this,a))),u}}this.defaults={...this.defaults,...i}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return B.lex(e,t??this.defaults)}parser(e,t){return U.parse(e,t??this.defaults)}parseMarkdown(e){return(n,i)=>{const s={...i},o={...this.defaults,...s},a=this.onError(!!o.silent,!!o.async);if(this.defaults.async===!0&&s.async===!1)return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof n>"u"||n===null)return a(new Error("marked(): input parameter is undefined or null"));if(typeof n!="string")return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(n)+", string expected"));o.hooks&&(o.hooks.options=o,o.hooks.block=e);const u=o.hooks?o.hooks.provideLexer():e?B.lex:B.lexInline,l=o.hooks?o.hooks.provideParser():e?U.parse:U.parseInline;if(o.async)return Promise.resolve(o.hooks?o.hooks.preprocess(n):n).then(c=>u(c,o)).then(c=>o.hooks?o.hooks.processAllTokens(c):c).then(c=>o.walkTokens?Promise.all(this.walkTokens(c,o.walkTokens)).then(()=>c):c).then(c=>l(c,o)).then(c=>o.hooks?o.hooks.postprocess(c):c).catch(a);try{o.hooks&&(n=o.hooks.preprocess(n));let c=u(n,o);o.hooks&&(c=o.hooks.processAllTokens(c)),o.walkTokens&&this.walkTokens(c,o.walkTokens);let g=l(c,o);return o.hooks&&(g=o.hooks.postprocess(g)),g}catch(c){return a(c)}}}onError(e,t){return n=>{if(n.message+=`
Please report this to https://github.com/markedjs/marked.`,e){const i="<p>An error occurred:</p><pre>"+j(n.message+"",!0)+"</pre>";return t?Promise.resolve(i):i}if(t)return Promise.reject(n);throw n}}}const ee=new hi;function x(p,e){return ee.parse(p,e)}x.options=x.setOptions=function(p){return ee.setOptions(p),x.defaults=ee.defaults,rn(x.defaults),x};x.getDefaults=pt;x.defaults=te;x.use=function(...p){return ee.use(...p),x.defaults=ee.defaults,rn(x.defaults),x};x.walkTokens=function(p,e){return ee.walkTokens(p,e)};x.parseInline=ee.parseInline;x.Parser=U;x.parser=U.parse;x.Renderer=Fe;x.TextRenderer=kt;x.Lexer=B;x.lexer=B.lex;x.Tokenizer=$e;x.Hooks=ye;x.parse=x;x.options;x.setOptions;x.use;x.walkTokens;x.parseInline;U.parse;B.lex;/*! @license DOMPurify 3.2.3 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.3/LICENSE */const{entries:fn,setPrototypeOf:Xt,isFrozen:di,getPrototypeOf:fi,getOwnPropertyDescriptor:gi}=Object;let{freeze:M,seal:H,create:gn}=Object,{apply:ct,construct:ut}=typeof Reflect<"u"&&Reflect;M||(M=function(e){return e});H||(H=function(e){return e});ct||(ct=function(e,t,n){return e.apply(t,n)});ut||(ut=function(e,t){return new e(...t)});const De=F(Array.prototype.forEach),Vt=F(Array.prototype.pop),be=F(Array.prototype.push),Oe=F(String.prototype.toLowerCase),nt=F(String.prototype.toString),Qt=F(String.prototype.match),ke=F(String.prototype.replace),mi=F(String.prototype.indexOf),bi=F(String.prototype.trim),q=F(Object.prototype.hasOwnProperty),P=F(RegExp.prototype.test),xe=ki(TypeError);function F(p){return function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];return ct(p,e,n)}}function ki(p){return function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return ut(p,t)}}function k(p,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Oe;Xt&&Xt(p,null);let n=e.length;for(;n--;){let i=e[n];if(typeof i=="string"){const s=t(i);s!==i&&(di(e)||(e[n]=s),i=s)}p[i]=!0}return p}function xi(p){for(let e=0;e<p.length;e++)q(p,e)||(p[e]=null);return p}function J(p){const e=gn(null);for(const[t,n]of fn(p))q(p,t)&&(Array.isArray(n)?e[t]=xi(n):n&&typeof n=="object"&&n.constructor===Object?e[t]=J(n):e[t]=n);return e}function _e(p,e){for(;p!==null;){const n=gi(p,e);if(n){if(n.get)return F(n.get);if(typeof n.value=="function")return F(n.value)}p=fi(p)}function t(){return null}return t}const Kt=M(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),it=M(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),st=M(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),_i=M(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),rt=M(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),wi=M(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Jt=M(["#text"]),en=M(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),ot=M(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),tn=M(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Me=M(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Ti=H(/\{\{[\w\W]*|[\w\W]*\}\}/gm),yi=H(/<%[\w\W]*|[\w\W]*%>/gm),Ei=H(/\$\{[\w\W]*}/gm),Ai=H(/^data-[\-\w.\u00B7-\uFFFF]+$/),Si=H(/^aria-[\-\w]+$/),mn=H(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Ri=H(/^(?:\w+script|data):/i),Ci=H(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),bn=H(/^html$/i),Li=H(/^[a-z][.\w]*(-[.\w]+)+$/i);var nn=Object.freeze({__proto__:null,ARIA_ATTR:Si,ATTR_WHITESPACE:Ci,CUSTOM_ELEMENT:Li,DATA_ATTR:Ai,DOCTYPE_NAME:bn,ERB_EXPR:yi,IS_ALLOWED_URI:mn,IS_SCRIPT_OR_DATA:Ri,MUSTACHE_EXPR:Ti,TMPLIT_EXPR:Ei});const we={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,progressingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},vi=function(){return typeof window>"u"?null:window},Ii=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let n=null;const i="data-tt-policy-suffix";t&&t.hasAttribute(i)&&(n=t.getAttribute(i));const s="dompurify"+(n?"#"+n:"");try{return e.createPolicy(s,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+s+" could not be created."),null}},sn=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function kn(){let p=arguments.length>0&&arguments[0]!==void 0?arguments[0]:vi();const e=f=>kn(f);if(e.version="3.2.3",e.removed=[],!p||!p.document||p.document.nodeType!==we.document)return e.isSupported=!1,e;let{document:t}=p;const n=t,i=n.currentScript,{DocumentFragment:s,HTMLTemplateElement:o,Node:a,Element:u,NodeFilter:l,NamedNodeMap:c=p.NamedNodeMap||p.MozNamedAttrMap,HTMLFormElement:g,DOMParser:m,trustedTypes:b}=p,y=u.prototype,_=_e(y,"cloneNode"),O=_e(y,"remove"),Ae=_e(y,"nextSibling"),le=_e(y,"childNodes"),V=_e(y,"parentNode");if(typeof o=="function"){const f=t.createElement("template");f.content&&f.content.ownerDocument&&(t=f.content.ownerDocument)}let S,X="";const{implementation:ce,createNodeIterator:ue,createDocumentFragment:Q,getElementsByTagName:xn}=t,{importNode:_n}=n;let $=sn();e.isSupported=typeof fn=="function"&&typeof V=="function"&&ce&&ce.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:He,ERB_EXPR:qe,TMPLIT_EXPR:Ge,DATA_ATTR:wn,ARIA_ATTR:Tn,IS_SCRIPT_OR_DATA:yn,ATTR_WHITESPACE:xt,CUSTOM_ELEMENT:En}=nn;let{IS_ALLOWED_URI:_t}=nn,R=null;const wt=k({},[...Kt,...it,...st,...rt,...Jt]);let L=null;const Tt=k({},[...en,...ot,...tn,...Me]);let A=Object.seal(gn(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),pe=null,We=null,yt=!0,je=!0,Et=!1,At=!0,ne=!1,Ze=!0,K=!1,Ye=!1,Xe=!1,ie=!1,Se=!1,Re=!1,St=!0,Rt=!1;const An="user-content-";let Ve=!0,he=!1,se={},re=null;const Ct=k({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Lt=null;const vt=k({},["audio","video","img","source","image","track"]);let Qe=null;const It=k({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Ce="http://www.w3.org/1998/Math/MathML",Le="http://www.w3.org/2000/svg",Z="http://www.w3.org/1999/xhtml";let oe=Z,Ke=!1,Je=null;const Sn=k({},[Ce,Le,Z],nt);let ve=k({},["mi","mo","mn","ms","mtext"]),Ie=k({},["annotation-xml"]);const Rn=k({},["title","style","font","a","script"]);let de=null;const Cn=["application/xhtml+xml","text/html"],Ln="text/html";let C=null,ae=null;const vn=t.createElement("form"),Nt=function(r){return r instanceof RegExp||r instanceof Function},et=function(){let r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(ae&&ae===r)){if((!r||typeof r!="object")&&(r={}),r=J(r),de=Cn.indexOf(r.PARSER_MEDIA_TYPE)===-1?Ln:r.PARSER_MEDIA_TYPE,C=de==="application/xhtml+xml"?nt:Oe,R=q(r,"ALLOWED_TAGS")?k({},r.ALLOWED_TAGS,C):wt,L=q(r,"ALLOWED_ATTR")?k({},r.ALLOWED_ATTR,C):Tt,Je=q(r,"ALLOWED_NAMESPACES")?k({},r.ALLOWED_NAMESPACES,nt):Sn,Qe=q(r,"ADD_URI_SAFE_ATTR")?k(J(It),r.ADD_URI_SAFE_ATTR,C):It,Lt=q(r,"ADD_DATA_URI_TAGS")?k(J(vt),r.ADD_DATA_URI_TAGS,C):vt,re=q(r,"FORBID_CONTENTS")?k({},r.FORBID_CONTENTS,C):Ct,pe=q(r,"FORBID_TAGS")?k({},r.FORBID_TAGS,C):{},We=q(r,"FORBID_ATTR")?k({},r.FORBID_ATTR,C):{},se=q(r,"USE_PROFILES")?r.USE_PROFILES:!1,yt=r.ALLOW_ARIA_ATTR!==!1,je=r.ALLOW_DATA_ATTR!==!1,Et=r.ALLOW_UNKNOWN_PROTOCOLS||!1,At=r.ALLOW_SELF_CLOSE_IN_ATTR!==!1,ne=r.SAFE_FOR_TEMPLATES||!1,Ze=r.SAFE_FOR_XML!==!1,K=r.WHOLE_DOCUMENT||!1,ie=r.RETURN_DOM||!1,Se=r.RETURN_DOM_FRAGMENT||!1,Re=r.RETURN_TRUSTED_TYPE||!1,Xe=r.FORCE_BODY||!1,St=r.SANITIZE_DOM!==!1,Rt=r.SANITIZE_NAMED_PROPS||!1,Ve=r.KEEP_CONTENT!==!1,he=r.IN_PLACE||!1,_t=r.ALLOWED_URI_REGEXP||mn,oe=r.NAMESPACE||Z,ve=r.MATHML_TEXT_INTEGRATION_POINTS||ve,Ie=r.HTML_INTEGRATION_POINTS||Ie,A=r.CUSTOM_ELEMENT_HANDLING||{},r.CUSTOM_ELEMENT_HANDLING&&Nt(r.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(A.tagNameCheck=r.CUSTOM_ELEMENT_HANDLING.tagNameCheck),r.CUSTOM_ELEMENT_HANDLING&&Nt(r.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(A.attributeNameCheck=r.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),r.CUSTOM_ELEMENT_HANDLING&&typeof r.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(A.allowCustomizedBuiltInElements=r.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),ne&&(je=!1),Se&&(ie=!0),se&&(R=k({},Jt),L=[],se.html===!0&&(k(R,Kt),k(L,en)),se.svg===!0&&(k(R,it),k(L,ot),k(L,Me)),se.svgFilters===!0&&(k(R,st),k(L,ot),k(L,Me)),se.mathMl===!0&&(k(R,rt),k(L,tn),k(L,Me))),r.ADD_TAGS&&(R===wt&&(R=J(R)),k(R,r.ADD_TAGS,C)),r.ADD_ATTR&&(L===Tt&&(L=J(L)),k(L,r.ADD_ATTR,C)),r.ADD_URI_SAFE_ATTR&&k(Qe,r.ADD_URI_SAFE_ATTR,C),r.FORBID_CONTENTS&&(re===Ct&&(re=J(re)),k(re,r.FORBID_CONTENTS,C)),Ve&&(R["#text"]=!0),K&&k(R,["html","head","body"]),R.table&&(k(R,["tbody"]),delete pe.tbody),r.TRUSTED_TYPES_POLICY){if(typeof r.TRUSTED_TYPES_POLICY.createHTML!="function")throw xe('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof r.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw xe('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');S=r.TRUSTED_TYPES_POLICY,X=S.createHTML("")}else S===void 0&&(S=Ii(b,i)),S!==null&&typeof X=="string"&&(X=S.createHTML(""));M&&M(r),ae=r}},Pt=k({},[...it,...st,..._i]),Dt=k({},[...rt,...wi]),In=function(r){let h=V(r);(!h||!h.tagName)&&(h={namespaceURI:oe,tagName:"template"});const d=Oe(r.tagName),E=Oe(h.tagName);return Je[r.namespaceURI]?r.namespaceURI===Le?h.namespaceURI===Z?d==="svg":h.namespaceURI===Ce?d==="svg"&&(E==="annotation-xml"||ve[E]):!!Pt[d]:r.namespaceURI===Ce?h.namespaceURI===Z?d==="math":h.namespaceURI===Le?d==="math"&&Ie[E]:!!Dt[d]:r.namespaceURI===Z?h.namespaceURI===Le&&!Ie[E]||h.namespaceURI===Ce&&!ve[E]?!1:!Dt[d]&&(Rn[d]||!Pt[d]):!!(de==="application/xhtml+xml"&&Je[r.namespaceURI]):!1},G=function(r){be(e.removed,{element:r});try{V(r).removeChild(r)}catch{O(r)}},Ne=function(r,h){try{be(e.removed,{attribute:h.getAttributeNode(r),from:h})}catch{be(e.removed,{attribute:null,from:h})}if(h.removeAttribute(r),r==="is")if(ie||Se)try{G(h)}catch{}else try{h.setAttribute(r,"")}catch{}},Mt=function(r){let h=null,d=null;if(Xe)r="<remove></remove>"+r;else{const v=Qt(r,/^[\r\n\t ]+/);d=v&&v[0]}de==="application/xhtml+xml"&&oe===Z&&(r='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+r+"</body></html>");const E=S?S.createHTML(r):r;if(oe===Z)try{h=new m().parseFromString(E,de)}catch{}if(!h||!h.documentElement){h=ce.createDocument(oe,"template",null);try{h.documentElement.innerHTML=Ke?X:E}catch{}}const I=h.body||h.documentElement;return r&&d&&I.insertBefore(t.createTextNode(d),I.childNodes[0]||null),oe===Z?xn.call(h,K?"html":"body")[0]:K?h.documentElement:I},Ot=function(r){return ue.call(r.ownerDocument||r,r,l.SHOW_ELEMENT|l.SHOW_COMMENT|l.SHOW_TEXT|l.SHOW_PROCESSING_INSTRUCTION|l.SHOW_CDATA_SECTION,null)},tt=function(r){return r instanceof g&&(typeof r.nodeName!="string"||typeof r.textContent!="string"||typeof r.removeChild!="function"||!(r.attributes instanceof c)||typeof r.removeAttribute!="function"||typeof r.setAttribute!="function"||typeof r.namespaceURI!="string"||typeof r.insertBefore!="function"||typeof r.hasChildNodes!="function")},zt=function(r){return typeof a=="function"&&r instanceof a};function Y(f,r,h){De(f,d=>{d.call(e,r,h,ae)})}const $t=function(r){let h=null;if(Y($.beforeSanitizeElements,r,null),tt(r))return G(r),!0;const d=C(r.nodeName);if(Y($.uponSanitizeElement,r,{tagName:d,allowedTags:R}),r.hasChildNodes()&&!zt(r.firstElementChild)&&P(/<[/\w]/g,r.innerHTML)&&P(/<[/\w]/g,r.textContent)||r.nodeType===we.progressingInstruction||Ze&&r.nodeType===we.comment&&P(/<[/\w]/g,r.data))return G(r),!0;if(!R[d]||pe[d]){if(!pe[d]&&Bt(d)&&(A.tagNameCheck instanceof RegExp&&P(A.tagNameCheck,d)||A.tagNameCheck instanceof Function&&A.tagNameCheck(d)))return!1;if(Ve&&!re[d]){const E=V(r)||r.parentNode,I=le(r)||r.childNodes;if(I&&E){const v=I.length;for(let z=v-1;z>=0;--z){const W=_(I[z],!0);W.__removalCount=(r.__removalCount||0)+1,E.insertBefore(W,Ae(r))}}}return G(r),!0}return r instanceof u&&!In(r)||(d==="noscript"||d==="noembed"||d==="noframes")&&P(/<\/no(script|embed|frames)/i,r.innerHTML)?(G(r),!0):(ne&&r.nodeType===we.text&&(h=r.textContent,De([He,qe,Ge],E=>{h=ke(h,E," ")}),r.textContent!==h&&(be(e.removed,{element:r.cloneNode()}),r.textContent=h)),Y($.afterSanitizeElements,r,null),!1)},Ft=function(r,h,d){if(St&&(h==="id"||h==="name")&&(d in t||d in vn))return!1;if(!(je&&!We[h]&&P(wn,h))){if(!(yt&&P(Tn,h))){if(!L[h]||We[h]){if(!(Bt(r)&&(A.tagNameCheck instanceof RegExp&&P(A.tagNameCheck,r)||A.tagNameCheck instanceof Function&&A.tagNameCheck(r))&&(A.attributeNameCheck instanceof RegExp&&P(A.attributeNameCheck,h)||A.attributeNameCheck instanceof Function&&A.attributeNameCheck(h))||h==="is"&&A.allowCustomizedBuiltInElements&&(A.tagNameCheck instanceof RegExp&&P(A.tagNameCheck,d)||A.tagNameCheck instanceof Function&&A.tagNameCheck(d))))return!1}else if(!Qe[h]){if(!P(_t,ke(d,xt,""))){if(!((h==="src"||h==="xlink:href"||h==="href")&&r!=="script"&&mi(d,"data:")===0&&Lt[r])){if(!(Et&&!P(yn,ke(d,xt,"")))){if(d)return!1}}}}}}return!0},Bt=function(r){return r!=="annotation-xml"&&Qt(r,En)},Ut=function(r){Y($.beforeSanitizeAttributes,r,null);const{attributes:h}=r;if(!h||tt(r))return;const d={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:L,forceKeepAttr:void 0};let E=h.length;for(;E--;){const I=h[E],{name:v,namespaceURI:z,value:W}=I,fe=C(v);let N=v==="value"?W:bi(W);if(d.attrName=fe,d.attrValue=N,d.keepAttr=!0,d.forceKeepAttr=void 0,Y($.uponSanitizeAttribute,r,d),N=d.attrValue,Rt&&(fe==="id"||fe==="name")&&(Ne(v,r),N=An+N),Ze&&P(/((--!?|])>)|<\/(style|title)/i,N)){Ne(v,r);continue}if(d.forceKeepAttr||(Ne(v,r),!d.keepAttr))continue;if(!At&&P(/\/>/i,N)){Ne(v,r);continue}ne&&De([He,qe,Ge],qt=>{N=ke(N,qt," ")});const Ht=C(r.nodeName);if(Ft(Ht,fe,N)){if(S&&typeof b=="object"&&typeof b.getAttributeType=="function"&&!z)switch(b.getAttributeType(Ht,fe)){case"TrustedHTML":{N=S.createHTML(N);break}case"TrustedScriptURL":{N=S.createScriptURL(N);break}}try{z?r.setAttributeNS(z,v,N):r.setAttribute(v,N),tt(r)?G(r):Vt(e.removed)}catch{}}}Y($.afterSanitizeAttributes,r,null)},Nn=function f(r){let h=null;const d=Ot(r);for(Y($.beforeSanitizeShadowDOM,r,null);h=d.nextNode();)Y($.uponSanitizeShadowNode,h,null),$t(h),Ut(h),h.content instanceof s&&f(h.content);Y($.afterSanitizeShadowDOM,r,null)};return e.sanitize=function(f){let r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},h=null,d=null,E=null,I=null;if(Ke=!f,Ke&&(f="<!-->"),typeof f!="string"&&!zt(f))if(typeof f.toString=="function"){if(f=f.toString(),typeof f!="string")throw xe("dirty is not a string, aborting")}else throw xe("toString is not a function");if(!e.isSupported)return f;if(Ye||et(r),e.removed=[],typeof f=="string"&&(he=!1),he){if(f.nodeName){const W=C(f.nodeName);if(!R[W]||pe[W])throw xe("root node is forbidden and cannot be sanitized in-place")}}else if(f instanceof a)h=Mt("<!---->"),d=h.ownerDocument.importNode(f,!0),d.nodeType===we.element&&d.nodeName==="BODY"||d.nodeName==="HTML"?h=d:h.appendChild(d);else{if(!ie&&!ne&&!K&&f.indexOf("<")===-1)return S&&Re?S.createHTML(f):f;if(h=Mt(f),!h)return ie?null:Re?X:""}h&&Xe&&G(h.firstChild);const v=Ot(he?f:h);for(;E=v.nextNode();)$t(E),Ut(E),E.content instanceof s&&Nn(E.content);if(he)return f;if(ie){if(Se)for(I=Q.call(h.ownerDocument);h.firstChild;)I.appendChild(h.firstChild);else I=h;return(L.shadowroot||L.shadowrootmode)&&(I=_n.call(n,I,!0)),I}let z=K?h.outerHTML:h.innerHTML;return K&&R["!doctype"]&&h.ownerDocument&&h.ownerDocument.doctype&&h.ownerDocument.doctype.name&&P(bn,h.ownerDocument.doctype.name)&&(z="<!DOCTYPE "+h.ownerDocument.doctype.name+`>
`+z),ne&&De([He,qe,Ge],W=>{z=ke(z,W," ")}),S&&Re?S.createHTML(z):z},e.setConfig=function(){let f=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};et(f),Ye=!0},e.clearConfig=function(){ae=null,Ye=!1},e.isValidAttribute=function(f,r,h){ae||et({});const d=C(f),E=C(r);return Ft(d,E,h)},e.addHook=function(f,r){typeof r=="function"&&be($[f],r)},e.removeHook=function(f){return Vt($[f])},e.removeHooks=function(f){$[f]=[]},e.removeAllHooks=function(){$=sn()},e}var Ni=kn();function at(p){const e=x(p);return Ni.sanitize(e)}class Pi extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.isStreaming=!1,this.animationFrameId=null,this.defaultAnimationSpeed=15,this.currentAnimationSpeed=this.defaultAnimationSpeed,this.streamingParser=null}connectedCallback(){const e=this.getAttribute("sender"),t=this.getAttribute("content")||"";this.isStreaming=this.hasAttribute("streaming"),this.render(e,t),!this.isStreaming&&t?this.animateNonStreamedContent(t):this.isStreaming&&t&&(this.streamingParser=new Mn(n=>{this.appendHTMLContent(n)}),this.streamingParser.appendText(t))}appendContent(e){if(console.log("appendContent:",e),this.streamingParser)this.streamingParser.appendText(e);else{const t=at(e);this.appendHTMLContent(t)}}appendHTMLContent(e){const t=this.shadowRoot.querySelector(".message__content");if(t){const n=document.createElement("div");for(n.innerHTML=e;n.firstChild;)t.appendChild(n.firstChild);this.scrollToBottom()}}finalizeContentAndAnimate(){console.log("finalizeContentAndAnimate called"),this.streamingParser&&(this.streamingParser.end(),this.streamingParser=null)}animateNonStreamedContent(e){const t=this.shadowRoot.querySelector(".message__content");if(!t)return;const n=at(e),i=document.createElement("div");i.innerHTML=n,this.animateNodesSequentially(t,i.childNodes)}async animateNodesSequentially(e,t){const n=new Set(["p","div","h1","h2","h3","ul","ol","li","blockquote","pre","h4","h5","h6"]);for(const i of t)if(i.nodeType===Node.TEXT_NODE){if(i.textContent.trim()==="")continue;await this.animateTextNode(e,i.textContent)}else if(i.nodeType===Node.ELEMENT_NODE){const s=i.tagName.toLowerCase();n.has(s);const o=document.createElement(s);Array.from(i.attributes).forEach(a=>{o.setAttribute(a.name,a.value)}),e.appendChild(o),await this.animateNodesSequentially(o,i.childNodes)}}animateTextNode(e,t){return new Promise(n=>{let i=0;const s=document.createElement("span");e.appendChild(s);let o=performance.now();const a=u=>{u-o>=this.currentAnimationSpeed&&(s.textContent+=t[i],i++,this.scrollToBottom(),o=u),i<t.length?this.animationFrameId=requestAnimationFrame(a):n()};this.animationFrameId=requestAnimationFrame(a)})}render(e,t){const n=e==="assistant";this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          width: 100%;
        }
        p {
          margin-top: var(--spacing-1);
          margin-bottom: var(--spacing-1);
        }
        .message-wrapper {
          display: flex;
          align-items: flex-start;
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
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--spacing-2);
          font-size: 1.2em;
          line-height: 1;
        }

        .message {
          display: inline-block;
          max-width: 80%;
          padding: var(--spacing-4);
          border-radius: 20px;
          word-wrap: break-word;
          background-color: ${n?"#FFFFFF":"rgba(255, 255, 255, 0.1)"};
          color: ${n?"#231F25":"#FFFFFF"};
          border: ${n?"none":"1px solid #FFFFFF"};
          overflow: hidden;
          font-family: inherit;
          position: relative;
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
          white-space: pre-wrap; /* Preserve newlines and spaces */
        }

        .message.fade-out {
          opacity: 0;
        }

        .message.fade-in {
          opacity: 1;
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
          font-family: inherit;
          word-break: break-word;
        }

        /* Markdown styling */
        .message__content h1,
        .message__content h2,
        .message__content h3,
        .message__content h4,
        .message__content h5,
        .message__content h6 {
          margin: 1em 0 0.5em 0;
          line-height: 1.2;
        }

        .message__content h1:first-child,
        .message__content h2:first-child,
        .message__content h3:first-child,
        .message__content h4:first-child,
        .message__content h5:first-child,
        .message__content h6:first-child {
          margin-top: 0;
        }

        .message__content h1 { font-size: 1.6em; }
        .message__content h2 { font-size: 1.4em; }
        .message__content h3 { font-size: 1.2em; }
        .message__content h4 { font-size: 1.1em; }
        .message__content h5 { font-size: 1em; }
        .message__content h6 { font-size: 0.9em; }

        .message__content a {
          color: #0066cc;
          text-decoration: none;
        }

        .message__content a:hover {
          text-decoration: underline;
        }

        .message__content p {
          margin: 0.5em 0;
          line-height: 1.4;
        }

        .message__content ul,
        .message__content ol {
          margin: 0.5em 0;
          padding-left: 2em;
        }

        .message__content li {
          margin: 0.25em 0;
        }

        .message__content code {
          background-color: rgba(0, 0, 0, 0.05);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
        }

        .message__content pre {
          background-color: rgba(0, 0, 0, 0.05);
          padding: 1em;
          border-radius: 4px;
          overflow-x: auto;
          margin: 0.5em 0;
        }

        .message__content pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
        }

        .message__content blockquote {
          margin: 0.5em 0;
          padding-left: 1em;
          border-left: 4px solid rgba(0, 0, 0, 0.1);
          color: rgba(0, 0, 0, 0.7);
        }

        .message__content img {
          max-width: 100%;
          height: auto;
        }

        .message__content table {
          border-collapse: collapse;
          margin: 0.5em 0;
          width: 100%;
        }

        .message__content th,
        .message__content td {
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 0.4em 0.8em;
          text-align: left;
        }

        .message__content th {
          background-color: rgba(0, 0, 0, 0.05);
        }
      </style>
      <div class="message-wrapper message-wrapper--${e}">
        ${n?'<div class="assistant-icon">🤖</div>':""}
        <div class="message message--${e}">
          <div class="message__content">${this.isStreaming?"":at(t)}</div>
        </div>
      </div>
    `}scrollToBottom(){this.parentElement&&(this.parentElement.scrollTop=this.parentElement.scrollHeight)}disconnectedCallback(){this.animationFrameId&&cancelAnimationFrame(this.animationFrameId),this.streamingParser&&(this.streamingParser.end(),this.streamingParser=null)}}class Di extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._eventBus=null,this.items=[],this.currentIndex=0,this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.moveLeft=this.moveLeft.bind(this),this.moveRight=this.moveRight.bind(this),this.handleResize=this.handleResize.bind(this),this.handleButtonClick=this.handleButtonClick.bind(this)}set eventBus(e){this._eventBus=e}connectedCallback(){const e=this.getAttribute("data-carousel");if(!e){console.error("No data-carousel attribute found. Cannot render carousel.");return}let t;try{t=JSON.parse(e)}catch(n){console.error("Failed to parse carousel data:",n);return}if(!t||!Array.isArray(t.cards)){console.error("carouselData.cards is not defined or not an array");return}this.renderCarousel(t)}renderCarousel(e){this.carouselData=e,this.shadowRoot.innerHTML=`
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
    `,this.carouselContainer=this.shadowRoot.querySelector(".carousel__container"),this.leftButton=this.shadowRoot.querySelector(".carousel__button--left"),this.rightButton=this.shadowRoot.querySelector(".carousel__button--right"),this.carouselData.cards.forEach((t,n)=>{const i=document.createElement("div");i.classList.add("carousel__item");const s=document.createElement("div");s.classList.add("carousel__item-wrapper");const o=document.createElement("div");if(o.classList.add("carousel__item-content"),t.imageUrl){const a=document.createElement("img");a.src=t.imageUrl,a.alt=t.title||"",a.classList.add("carousel__item-image"),o.appendChild(a)}if(t.title){const a=document.createElement("h6");a.classList.add("carousel__item-title"),a.textContent=t.title,o.appendChild(a)}if(t.description&&t.description.text){const a=document.createElement("p");a.classList.add("carousel__item-description"),a.textContent=t.description.text,o.appendChild(a)}if(t.buttons&&t.buttons.length>0){const a=t.buttons[0],u=document.createElement("button");u.classList.add("button","carousel__item-button"),u.setAttribute("data-button-index",n),u.setAttribute("data-button-payload",JSON.stringify(a.request)),u.setAttribute("data-button-text",a.name),u.textContent=a.name||"Select",o.appendChild(u),u.addEventListener("click",this.handleButtonClick)}s.appendChild(o),i.appendChild(s),this.carouselContainer.appendChild(i),this.items.push(i)}),this.initCarousel(),this.leftButton.addEventListener("click",this.moveLeft),this.rightButton.addEventListener("click",this.moveRight),window.addEventListener("resize",this.handleResize),this.updateVisibility(),this.updatePosition()}initCarousel(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updateVisibility(),this.updatePosition()}handleResize(){this.isDesktop=window.matchMedia("(min-width: 1000px)").matches,this.itemsPerSlide=this.isDesktop?2:1,this.currentIndex=0,this.updatePosition(),this.updateVisibility()}moveLeft(){const e=this.itemsPerSlide;this.currentIndex=Math.max(0,this.currentIndex-e),this.updatePosition(),this.updateVisibility()}moveRight(){const e=this.itemsPerSlide;this.currentIndex=Math.min(this.items.length-e,this.currentIndex+e),this.updatePosition(),this.updateVisibility()}updatePosition(){const e=-(this.currentIndex/this.itemsPerSlide)*100;this.carouselContainer.style.transform=`translateX(${e}%)`}updateVisibility(){this.leftButton.disabled=this.currentIndex===0,this.rightButton.disabled=this.currentIndex>=this.items.length-this.itemsPerSlide}handleButtonClick(e){if(!this._eventBus){console.error("No eventBus assigned to CarouselComponent");return}const t=e.target,n=parseInt(t.getAttribute("data-button-index"),10),i=this.carouselData.cards[n];if(!i||!i.buttons||i.buttons.length===0){console.warn("No button data found for this card.");return}const s=i.buttons[0];console.log("Original button data:",s);const o=s.request.payload.title,a=o?`Selected ${o}`:"Selected Power Station";this._eventBus.emit("carouselButtonClicked",{action:s.request,label:a}),this.remove()}}customElements.define("button-component",On);customElements.define("message-component",Pi);customElements.define("carousel-component",Di);console.log("MessageComponent defined");console.log("ButtonComponent defined");console.log("CarouselComponent defined");
//# sourceMappingURL=chatbot-components.CXMua56W.js.map
