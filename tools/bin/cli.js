#!/usr/bin/env node

const path = require('path')
const fs = require('fs').promises
const { program } = require('commander')
const { exec } = require('child_process')
const iconv = require('iconv-lite')
const prettier = require('prettier')
const babelParserOptions = require('../.babel.parser.config.js')
const jsonParserOptions = require('../.json.parser.config.js')

const _ = require('lodash')
const translate = require('google-translate-api')

// const { copyToClipboard } = require('../src/utils.js')

const regSplitRow = /[\r\n]/
const regSplitCol = /[\s\t]{2,}/

program.command('headers [headersText]').action(async headersText => {
  let columns = []
  if (/\.(txt|csv)$/.test(headersText)) {
    //从文件读取
    const data = await fs.readFile(headersText, 'utf-8')
    const rows = data.split(regSplitRow).filter(d => d && /[^\t\s]+/.test(d))
    columns = rows.map(text => {
      const [prop] = text.split(regSplitCol)
      return {
        prop,
        label: `$t(tableHeader.${prop})`
      }
    })
  } else {
    columns = headersText.split(/、/).map((text, i) => ({
      prop: `propname${i}`,
      label: text
    }))
  }
  if (program.opts().handle === '1') {
    columns.push({ prop: 'handle', label: '操作', fixed: 'right', width: 60, slot: { body: 'handle' } })
  }
  // copyToClipboard(iconv.encode(prettier.format(JSON.stringify(columns), babelParserOptions).replace(/^;/, ''), 'gbk'), console.log)
  exec('clip').stdin.end(iconv.encode(prettier.format(JSON.stringify(columns), babelParserOptions).replace(/^;/, ''), 'gbk'))
})

program.command('viewDetail [details]').action(async details => {
  const data = await fs.readFile(details, 'utf-8')
  const rows = data.split(regSplitRow).filter(d => d && /[^\t\s]+/.test(d))
  const columns = rows
    .map(text => {
      const [label, prop] = text.split(regSplitCol)
      return {
        prop,
        label
      }
    })
    .map(({ prop, label }) => `<el-form-item label="${label}"><FormItemContent :content="detail.${prop}" /></el-form-item>`)
    .join('')
  const formHtml = `<el-form class="win-form-view">${columns}</el-form>`
  // console.log(prettier.format(formHtml, { parser: 'vue' }))
  exec('clip').stdin.end(iconv.encode(prettier.format(formHtml, { parser: 'vue' }), 'gbk'))
  console.log('内容已复制到剪切板')
})

program.command('csvToForm [filepath]').action(async filepath => {
  try {
    const data = await fs.readFile(filepath, 'utf-8')
    const rows = data.split(regSplitRow).filter(d => d && /[^\t\s]+/.test(d))
    const formItemDisabled = program.opts().disabled === '1'

    const formItems = rows.map(text => {
      const [label, name, type, options, required] = text.split(regSplitCol)
      let formItem = `<el-form-item :required="${required === '否' ? 'false' : 'true'}" label="${label}" prop="${name}">`
      let optsHTML
      switch (type) {
        case '选择':
          optsHTML = options
            .split(/[,，]/)
            .map(o => `<el-option label="${o}" value="${o}"></el-option>`)
            .join('')
          formItem += `<el-select v-model="formModel.${name}" :disabled="${formItemDisabled}" placeholder="请选择${label}">${optsHTML}</el-select>`
          break
        case '文本填写':
          formItem += `<el-input :disabled="${formItemDisabled}" v-model="formModel.${name}" placeholder="请输入${label}"></el-input>`
          break
        case '单选':
          formItem += `<el-radio v-model="formModel.${name}" :label="true">是</el-radio>`
          formItem += `<el-radio v-model="formModel.${name}" :label="false">否</el-radio>`
          break
        case '日期选择':
          formItem += `<el-date-picker v-model="formModel.${name}" :disabled="${formItemDisabled}" placeholder="请输入${label}"></el-date-picker>`
          break
        default:
          formItem += `<el-input :disabled="${formItemDisabled}" v-model="formModel.${name}" placeholder="请输入${label}"></el-input>`
          break
      }
      formItem += `</el-form-item>`
      return formItem
    })
    const btnsGroupFormItem = `<el-form-item>
      <div class="btns-group">
        <el-button type="primary" :disabled="loading" @click="submit">保存</el-button>
        <el-button type="plain">取 消</el-button>
      </div>
      </el-form-item>`
    const form = `<el-form ref="form" :model="formModel" :rules="rules" label-position="right" label-width="120px" class="win-form">
          ${formItems.join('\n')}\n
          ${btnsGroupFormItem}
        </el-form>`
    // const vueHtml = prettier.format(form, { parser: 'vue' })
    // console.log(vueHtml)
    exec('clip').stdin.end(iconv.encode(prettier.format(form, { parser: 'vue' }), 'gbk'))
    console.log('内容已复制到剪切板')
  } catch (error) {
    console.log(error)
  }
})

program.command('csvToFormRules [filepath]').action(async filepath => {
  try {
    const data = await fs.readFile(filepath, 'utf-8')
    const rows = data.split(regSplitRow).filter(d => d && /[^\t\s]+/.test(d))
    const formRules = rows.reduce((res, text) => {
      const [label, name, type, , required] = text.split(regSplitCol)
      if (required !== '否') {
        res[name] = [{ required: true, message: `请${type === '选择' ? '选择' : '输入'}${label}` }]
      }
      return res
    }, {})
    // const jsonFormRules = JSON.stringify(formRules)
    // console.log(jsonFormRules)
    exec('clip').stdin.end(iconv.encode(JSON.stringify(formRules), 'gbk'))
    console.log('内容已复制到剪切板')
  } catch (error) {
    console.log(error)
  }
})

program.command('csvToFormModel [filepath]').action(async filepath => {
  try {
    const data = await fs.readFile(filepath, 'utf-8')
    const rows = data.split(regSplitRow).filter(d => d && /[^\t\s]+/.test(d))
    const formModel = rows.reduce((res, text) => {
      const [, name] = text.split(regSplitCol)
      res[name] = ''
      return res
    }, {})
    // const jsonFormModel = JSON.stringify(formModel)
    // console.log(jsonFormModel)
    exec('clip').stdin.end(iconv.encode(JSON.stringify(formModel), 'gbk'))
    console.log('内容已复制到剪切板')
  } catch (error) {
    console.log(error)
  }
})

program.command('csvToGeoJson [filepath]').action(async filepath => {
  try {
    const data = await fs.readFile(filepath, 'utf-8')
    const rows = data.split(regSplitRow).filter(d => d && /[^\t\s]+/.test(d))
    const features = rows.map(text => {
      const [, siteNo, siteName, lng, lat, line] = text.split(/\t+/)
      return {
        type: 'Feature',
        properties: {
          siteNo,
          siteName,
          line
        },
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        }
      }
    })
    exec('clip').stdin.end(iconv.encode(prettier.format(JSON.stringify(features), babelParserOptions).replace(/^;/, ''), 'gbk'))
    console.log('内容已复制到剪切板')
  } catch (error) {
    console.log(error)
  }
})

function convertValue(val, type) {
  let res = val
  switch (type) {
    case 'int':
      res = parseInt(val)
      break
    case 'null':
      res = /null/.test(val) ? null : val
      break
    default:
      res = val
  }
  return res
}
program.command('textToTableData [filepath]').action(async filepath => {
  try {
    const data = await fs.readFile(filepath, 'utf-8')
    const rows = data.split(regSplitRow).filter(d => d && /[^\t\s]+/.test(d))
    // 表头字段
    const dataHeader = await fs.readFile(filepath.replace(/\.txt/, 'Header.txt'), 'utf-8')
    const rowsHeader = dataHeader.split(regSplitRow).filter(d => d && /[^\t\s]+/.test(d))
    const props = rowsHeader.map(text => {
      const [prop, type] = text.split(regSplitCol)
      return { prop, type }
    })

    const tableData = rows.map(text => {
      const cols = text.split(regSplitCol)
      return cols.reduce((res, col, i) => {
        if (!props[i]) {
          return res
        }
        const { prop, type } = props[i]
        res[prop] = convertValue(col, type)
        return res
      }, {})
    })

    // Mac OS下报错
    // exec('clip').stdin.end(iconv.encode(prettier.format(JSON.stringify(tableData), jsonParserOptions).replace(/^;/, ''), 'gbk'))
    await fs.writeFile(
      `${path.resolve(filepath, '../../')}/${filepath.match(/([^/]+)\./)[1]}.json`,
      iconv.encode(prettier.format(JSON.stringify(tableData), jsonParserOptions).replace(/^;/, ''), 'utf-8'),
      'utf-8'
    )
  } catch (error) {
    console.log(error)
  }
})

async function traverse(dirname, cb) {
  const files = await fs.readdir(dirname)
  for (const file of files) {
    const dpath = path.join(dirname, file)
    const stat = await fs.stat(dpath)
    if (stat.isDirectory()) {
      traverse(dpath, cb)
    }
    cb(dpath, stat)
  }
}

program.command('normalizeFileName [filepath]').action(async filepath => {
  async function normalizeFileName(filepath) {
    let update = false
    const dpath = filepath.replace(/\/([\w-]+)(\.(js|vue|css|scss|ttf|woff|woff2))?$/, (input, match, index, match2) => {
      console.log(index)
      const code = match.charCodeAt(0)
      let res = match
      if (65 <= code && code <= 90 && match2 !== 'vue') {
        // 大写字母开头的文件（夹）名称<.Vue除外>
        update = true
        res = String.fromCharCode(code + 32) + match.substring(1)
      }
      if (/[-_]\w/.test(res)) {
        update = true
        res = _.camelCase(res)
      }
      if (/^Mos/i.test(res)) {
        // 其他业务项目拷贝过来的组件更改业务名称
        update = true
        res = `${match2 === 'vue' ? 'A' : 'a'}tg${match.substring(3)}`
      }
      const ext = `.${match2}`
      return `/${res}${match2 ? ext : ''}`
    })
    if (update) {
      // await fs.rename(filepath, dpath)
      console.log(filepath, dpath)
    }
  }
  try {
    traverse(filepath, normalizeFileName)
  } catch (error) {
    console.log(error)
  }
})

// 按照模式更改文件（夹）名称
program.command('changeFileName [filepath]').action(async filepath => {
  async function changeFileName(filepath) {
    let update = false
    const dpath = filepath.replace(/(account)Manage/, (input, match) => {
      let res = match
      res = `userManage`
      update = true
      return res
    })
    if (update) {
      // await fs.rename(filepath, dpath)
      console.log(filepath, dpath)
    }
  }
  try {
    await traverse(filepath, changeFileName)
  } catch (error) {
    console.log(error)
  }
})

program.command('translateTableHeader [filepath]').action(async filepath => {
  const data = await fs.readFile(filepath, 'utf-8')
  const rows = data.split(regSplitRow).filter(d => d && /[^\t\s]+/.test(d))
  const res = rows.reduce(async (memo, text) => {
    const [label, prop] = text.split(regSplitCol)
    const trans = await translate(label, {
      from: 'zh-cn',
      to: 'en'
    })
    memo[prop] = trans.text
    return memo
  }, {})
  exec('clip').stdin.end(iconv.encode(prettier.format(JSON.stringify(res), babelParserOptions).replace(/^;/, ''), 'gbk'))
  console.log('内容已复制到剪切板')
})

program.option('-h, --handle <handle>', 'with handle column:0/1', '1')
program.option('-d, --disabled <disabled>', 'disable formItem:0/1', '0')

program.parse(process.argv)
