import assert from 'node:assert/strict'
import ts from 'typescript'
import { readFileSync } from 'node:fs'
import { createRequire, Module } from 'node:module'
const require=createRequire(import.meta.url)
const filename=require.resolve('../shared/lib/post-schema.ts')
const compiled=ts.transpileModule(readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText
const loaded=new Module(filename)
loaded.filename=filename
loaded.paths=Module._nodeModulePaths(filename.slice(0,filename.lastIndexOf('/')))
loaded._compile(compiled,filename)
const {documentSchema,mediaFilenames}=loaded.exports
const base={title:'Test',content:{type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'Safe'}]}]}}
assert(documentSchema.safeParse(base).success)
for(const href of ['javascript:alert(1)','data:text/html,test','//evil.test','/\\evil',' javaScript:alert(1)','java\nscript:alert(1)']){
 const value=structuredClone(base);value.content.content[0].content[0].marks=[{type:'link',attrs:{href}}]
 assert(!documentSchema.safeParse(value).success,href)
}
for(const node of [{type:'script',text:'alert(1)'},{type:'image',attrs:{src:'https://evil.test/a.png',alt:'photo'}},{type:'paragraph',attrs:{onclick:'alert(1)'}}]){
 assert(!documentSchema.safeParse({...base,content:{type:'doc',content:[node]}}).success)
}
let nested={type:'paragraph'};for(let i=0;i<25;i++)nested={type:'blockquote',content:[nested]}
assert(!documentSchema.safeParse({...base,content:{type:'doc',content:[nested]}}).success)
assert.deepEqual(mediaFilenames(documentSchema.parse(base)),[])
console.log('Document allowlist, unsafe URLs, remote images and nesting limits: PASS')

// Every accepted node must also satisfy the actual editor schema when reopened.
const { getSchema } = await import('@tiptap/core')
const { default: StarterKit } = await import('@tiptap/starter-kit')
const { default: Image } = await import('@tiptap/extension-image')
const { TableKit } = await import('@tiptap/extension-table')
const editorSchema = getSchema([
 StarterKit.configure({heading:{levels:[2,3]},code:false,codeBlock:false,strike:false,underline:false,horizontalRule:false}),
 Image, TableKit,
])
const paragraph={type:'paragraph',content:[{type:'text',text:'Body'}]}
const examples=[
 base.content,
 {type:'doc',content:[{type:'bulletList',content:[{type:'listItem',content:[paragraph]}]}]},
 {type:'doc',content:[{type:'table',content:[{type:'tableRow',content:[{type:'tableHeader',content:[paragraph]},{type:'tableCell',content:[paragraph]}]}]}]},
 {type:'doc',content:[{type:'blockquote',content:[{type:'heading',attrs:{level:2},content:[{type:'text',text:'Heading'}]},paragraph]}]},
]
for(const content of examples){
 const parsed=documentSchema.parse({...base,content})
 editorSchema.nodeFromJSON(parsed.content).check()
}
for(const node of [
 {type:'text'}, {type:'text',text:''}, {type:'bulletList'},
 {type:'table',content:[]}, {type:'tableRow',content:[]}, {type:'tableCell',content:[]},
 {type:'listItem',content:[{type:'bulletList',content:[{type:'listItem',content:[paragraph]}]}]},
 {type:'heading',attrs:{level:[2]}}, {type:'horizontalRule'},
])assert(!documentSchema.safeParse({...base,content:{type:'doc',content:[node]}}).success)
const emptyText={type:'doc',content:[{type:'paragraph',content:[{type:'text'}]}]}
assert(!documentSchema.safeParse({...base,content:emptyText}).success)
console.log('Tiptap reopening grammar and malformed text/list/table rejection: PASS')
for (const block of [
 {type:'bulletList',content:[{type:'listItem',content:[]}]},
 {type:'bulletList',content:[{type:'listItem',content:[{type:'bulletList',content:[{type:'listItem',content:[paragraph]}]}]}]},
 {type:'paragraph',content:[{type:'text',text:'test',marks:[{type:'strike'}]}]},
 {type:'paragraph',content:[{type:'text',text:''}]},
])assert(!documentSchema.safeParse({...base,content:{type:'doc',content:[block]}}).success)
