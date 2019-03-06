<template lang="html">
  <div :class="className" ref="downloadMenuBox">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        下载<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="v,k in types" :command="k">下载 {{k}} 文件</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import _each from 'lodash/each.js'
import Vue from 'vue'
import {Dropdown, DropdownMenu, DropdownItem} from 'element-ui'
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

const downloadAttrSupported = document.createElement('a').download !== undefined
function pick() {
    var args = arguments,
        i,
        arg,
        length = args.length;
    for (i = 0; i < length; i++) {
        arg = args[i];
        if (arg !== undefined && arg !== null) {
            return arg;
        }
    }
}

function error(msg, stop) {
    if (stop) {
        throw new Error(msg);
    }
    // else ...
    if (window.console) {
        console.log(msg); // eslint-disable-line no-console
    }
}
export default {
  data(){
    return {
      types: {
        CSV: 'CSV',
        XLS: 'XLS'
      },
    }
  },
  props: {
    dataRows: {
      type: Array,
      default(){
        return [[1,2,3,4,5]]
      }
    },
    csvOptions: {
      type: Object,
      default(){
        return {
          lineDelimiter: '\n'
        }
      }
    },
    className:{
      type: String,
      default: 'download-menu'
    },
    options: {
      type: Object,
      default(){
        return {
          useRowspanHeaders: false,
          useMultiLevelHeaders: false,
          filename: 'text',
          tableCaption: false,
          title: 'text'
        }
      }
    }
  },
  methods: {
    handleCommand(command){
      if(command === this.types.CSV){
        this.downloadCSV()
      }else if(command === this.types.XLS){
        this.downloadXLS()
      }
    },
    downloadCSV () {
		    var csv = this.getCSV(true);
		    this.fileDownload(
		        'data:text/csv,\uFEFF' + encodeURIComponent(csv),
		        'csv',
		        csv,
		        'text/csv'
		    );
		},
    downloadXLS () {
		    var uri = 'data:application/vnd.ms-excel;base64,',
		        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
		            'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
		            'xmlns="http://www.w3.org/TR/REC-html40">' +
		            '<head><!--[if gte mso 9]><xml><x:ExcelWorkbook>' +
		            '<x:ExcelWorksheets><x:ExcelWorksheet>' +
		            '<x:Name>Ark1</x:Name>' +
		            '<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>' +
		            '</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook>' +
		            '</xml><![endif]-->' +
		            '<style>td{border:none;font-family: Calibri, sans-serif;} ' +
		            '.number{mso-number-format:"0.00";} ' +
		            '.text{ mso-number-format:"\@";}</style>' +
		            '<meta name=ProgId content=Excel.Sheet>' +
		            '<meta charset=UTF-8>' +
		            '</head><body>' +
		            this.getTable(true) +
		            '</body></html>',
		        base64 = function (s) {
		            return window.btoa(unescape(encodeURIComponent(s))); // #50
		        };
		    this.fileDownload(
		        uri + base64(template),
		        'xls',
		        template,
		        'application/vnd.ms-excel'
		    );
		},
    getCSV (useLocalDecimalPoint) {
		    var csv = '',
		        rows = this.dataRows,
		        csvOptions = this.csvOptions,
		        decimalPoint = pick(
		            csvOptions.decimalPoint,
		            csvOptions.itemDelimiter !== ',' && useLocalDecimalPoint ?
		                (1.1).toLocaleString()[1] :
		                '.'
		        ),
		        // use ';' for direct to Excel
		        itemDelimiter = pick(
		            csvOptions.itemDelimiter,
		            decimalPoint === ',' ? ';' : ','
		        ),
		        // '\n' isn't working with the js csv data extraction
		        lineDelimiter = csvOptions.lineDelimiter;

		    // Transform the rows to CSV
		    _each(rows, function (row, i) {
		        var val = '',
		            j = row.length;
		        while (j--) {
		            val = row[j];
		            if (typeof val === 'string') {
		                val = '"' + val + '"';
		            }
		            if (typeof val === 'number') {
		                if (decimalPoint !== '.') {
		                    val = val.toString().replace('.', decimalPoint);
		                }
		            }
		            row[j] = val;
		        }
		        // Add the values
		        csv += row.join(itemDelimiter);

		        // Add the line delimiter
		        if (i < rows.length - 1) {
		            csv += lineDelimiter;
		        }
		    });
		    return csv;
		},
    getTable (useLocalDecimalPoint) {
		    var html = '<table>',
		        options = this.options,
		        decimalPoint = useLocalDecimalPoint ? (1.1).toLocaleString()[1] : '.',
		        useMultiLevelHeaders = pick(
		            options.useMultiLevelHeaders, true
		        ),
		        rows = this.dataRows,
		        rowLength = 0,
		        topHeaders = useMultiLevelHeaders ? rows.shift() : null,
		        subHeaders = rows.shift(),
		        // Compare two rows for equality
		        isRowEqual = function (row1, row2) {
		            var i = row1.length;
		            if (row2.length === i) {
		                while (i--) {
		                    if (row1[i] !== row2[i]) {
		                        return false;
		                    }
		                }
		            } else {
		                return false;
		            }
		            return true;
		        },
		        // Get table cell HTML from value
		        getCellHTMLFromValue = function (tag, classes, attrs, value) {
		            var val = pick(value, ''),
		                className = 'text' + (classes ? ' ' + classes : '');
		            // Convert to string if number
		            if (typeof val === 'number') {
		                val = val.toString();
		                if (decimalPoint === ',') {
		                    val = val.replace('.', decimalPoint);
		                }
		                className = 'number';
		            } else if (!value) {
		                className = 'empty';
		            }
		            return '<' + tag + (attrs ? ' ' + attrs : '') +
		                    ' class="' + className + '">' +
		                    val + '</' + tag + '>';
		        },
		        // Get table header markup from row data
		        getTableHeaderHTML = function (topheaders, subheaders, rowLength) {
		            var html = '<thead>',
		                i = 0,
		                len = rowLength || subheaders && subheaders.length,
		                next,
		                cur,
		                curColspan = 0,
		                rowspan;
		            // Clean up multiple table headers. Chart.getDataRows() returns two
		            // levels of headers when using multilevel, not merged. We need to
		            // merge identical headers, remove redundant headers, and keep it
		            // all marked up nicely.
		            if (
		                useMultiLevelHeaders &&
		                topheaders &&
		                subheaders &&
		                !isRowEqual(topheaders, subheaders)
		            ) {
		                html += '<tr>';
		                for (; i < len; ++i) {
		                    cur = topheaders[i];
		                    next = topheaders[i + 1];
		                    if (cur === next) {
		                        ++curColspan;
		                    } else if (curColspan) {
		                        // Ended colspan
		                        // Add cur to HTML with colspan.
		                        html += getCellHTMLFromValue(
		                            'th',
		                            'highcharts-table-topheading',
		                            'scope="col" ' +
		                            'colspan="' + (curColspan + 1) + '"',
		                            cur
		                        );
		                        curColspan = 0;
		                    } else {
		                        // Cur is standalone. If it is same as sublevel,
		                        // remove sublevel and add just toplevel.
		                        if (cur === subheaders[i]) {
		                            if (options.useRowspanHeaders) {
		                                rowspan = 2;
		                                delete subheaders[i];
		                            } else {
		                                rowspan = 1;
		                                subheaders[i] = '';
		                            }
		                        } else {
		                            rowspan = 1;
		                        }
		                        html += getCellHTMLFromValue(
		                            'th',
		                            'highcharts-table-topheading',
		                            'scope="col"' +
		                            (rowspan > 1 ?
		                                ' valign="top" rowspan="' + rowspan + '"' :
		                            ''),
		                            cur
		                        );
		                    }
		                }
		                html += '</tr>';
		            }

		            // Add the subheaders (the only headers if not using multilevels)
		            if (subheaders) {
		                html += '<tr>';
		                for (i = 0, len = subheaders.length; i < len; ++i) {
		                    if (subheaders[i] !== undefined) {
		                        html += getCellHTMLFromValue(
		                            'th', null, 'scope="col"', subheaders[i]
		                        );
		                    }
		                }
		                html += '</tr>';
		            }
		            html += '</thead>';
		            return html;
		        };

		    // Add table caption
		    if (options.tableCaption !== false) {
		        html += '<caption class="highcharts-table-caption">' + pick(
		                options.tableCaption,
		                (
		                    options.title ?
		                    htmlencode(options.title) :
		                    'Chart'
		                )) +
		                '</caption>';
		    }

		    // Find longest row
		    for (var i = 0, len = rows.length; i < len; ++i) {
		        if (rows[i].length > rowLength) {
		            rowLength = rows[i].length;
		        }
		    }

		    // Add header
		    html += getTableHeaderHTML(
		        topHeaders,
		        subHeaders,
		        Math.max(rowLength, subHeaders.length)
		    );

		    // Transform the rows to HTML
		    html += '<tbody>';
		    _each(rows, function (row) {
		        html += '<tr>';
		        for (var j = 0; j < rowLength; j++) {
		            // Make first column a header too. Especially important for
		            // category axes, but also might make sense for datetime? Should
		            // await user feedback on this.
		            html += getCellHTMLFromValue(
		                j ? 'td' : 'th',
		                null,
		                j ? '' : 'scope="row"',
		                row[j]
		            );
		        }
		        html += '</tr>';
		    });
		    html += '</tbody></table>';

		    return html;
		},
    fileDownload (href, extension, content) {
		    var a,
		        blobObject,
		        name;

		    if (this.options.filename) {
		        name = this.options.filename;
		    } else if (this.title) {
		        name = this.title.replace(/ /g, '-').toLowerCase();
		    } else {
		        name = 'text';
		    }

		    // MS specific. Check this first because of bug with Edge (#76)
		    if (window.Blob && window.navigator.msSaveOrOpenBlob) {
		        // Falls to msSaveOrOpenBlob if download attribute is not supported
		        blobObject = new window.Blob(
		            ['\uFEFF' + content], // #7084
		            { type: 'text/csv' }
		        );
		        window.navigator.msSaveOrOpenBlob(blobObject, name + '.' + extension);

		    // Download attribute supported
		    } else if (downloadAttrSupported) {
		        a = document.createElement('a');
		        a.href = href;
		        a.download = name + '.' + extension;
		        this.$refs.downloadMenuBox.appendChild(a); // #111
		        a.click();
		        a.remove();

		    } else {
		        error('The browser doesn\'t support downloading files');
		    }
		}
  }
}
</script>

<style lang="css">
</style>
