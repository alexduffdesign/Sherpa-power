class o{constructor(t){this.buffer="",this.onStableSegment=t,this.state="NORMAL",this.currentLine="",this.listType=null,this.listItems=[]}appendText(t){this.buffer+=t,this.processBuffer()}end(){this.processBuffer(!0),this.flush()}processBuffer(t=!1){for(;this.buffer.length>0;){const i=this.buffer[0];if(this.buffer=this.buffer.slice(1),this.currentLine+=i,i===`
`){const e=this.currentLine.trim();this.currentLine="",this.handleLine(e)}if(t&&this.currentLine.trim()!==""){const e=this.currentLine.trim();this.currentLine="",this.handleLine(e)}}}handleLine(t){if(t.startsWith("#")){const s=t.match(/^(#{1,6})\s+(.*)$/);if(s){const n=s[1].length,r=s[2],h=`<h${n}>${this.parseInlineMarkdown(r)}</h${n}>`;this.onStableSegment(h),console.log("Stable Segment:",h);return}}if(t.startsWith("- ")||t.startsWith("* ")){this.listType!=="ul"&&(this.flushList(),this.listType="ul");const s=t.slice(2).trim();this.listItems.push(`<li>${this.parseInlineMarkdown(s)}</li>`);return}const i=t.match(/^(\d+)\.\s+(.*)$/);if(i){this.listType!=="ol"&&(this.flushList(),this.listType="ol");const s=i[2].trim();this.listItems.push(`<li>${this.parseInlineMarkdown(s)}</li>`);return}if(t===""){this.flush();return}this.listType&&this.flushList();const e=`<p>${this.parseInlineMarkdown(t)}</p>`;this.onStableSegment(e)}flushList(){if(this.listItems.length>0&&this.listType){const t=`<${this.listType}>${this.listItems.join("")}</${this.listType}>`;this.onStableSegment(t),console.log("Stable Segment (List):",t),this.listItems=[],this.listType=null}}flush(){if(this.flushList(),this.currentLine.trim()!==""){const t=`<p>${this.parseInlineMarkdown(this.currentLine.trim())}</p>`;this.onStableSegment(t),console.log("Stable Segment (Flush):",t),this.currentLine=""}}parseInlineMarkdown(t){return t=t.replace(/(\*\*|__)(.*?)\1/g,"<strong>$2</strong>"),t=t.replace(/(\*|_)(.*?)\1/g,"<em>$2</em>"),t=t.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank">$1</a>'),t}}export{o as S};
//# sourceMappingURL=streaming-markdown-parser.Bd3zPGns.js.map
