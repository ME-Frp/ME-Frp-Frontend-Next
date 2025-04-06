<template>
  <div>
    <div class="loading-container" v-if="loading">
      <NSpin size="large" />
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="markdown-container" :class="{ 'dark-theme': themeStore.isDarkMode.value }" ref="contentRef"
      v-html="renderedContent"></div>

    <!-- 使用NaiveUI的NModal组件 -->
    <!-- 图片查看模态框 -->
    <NModal v-model:show="showImageModal" :mask-closable="true" preset="card"
      style="width: 90vw; max-width: 1200px; height: 90vh;" :auto-focus="false">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>图片查看</span>
        </div>
      </template>
      <div class="modal-image-container">
        <img :src="modalImage" class="modal-image" alt="查看大图" />
      </div>
    </NModal>

    <!-- 代码全屏查看模态框 -->
    <NModal v-model:show="showCodeModal" :mask-closable="true" preset="card"
      style="width: 90vw; max-width: 1200px; height: 90vh;" :auto-focus="false">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>代码查看</span>
        </div>
      </template>
      <div v-html="modalCodeContent"></div>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted, h, createApp, computed, inject } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js/lib/core'
import {
  NSpin,
  NCode,
  NTable,
  NAlert,
  NModal,
  NButton,
  NCard,
  NSpace,
  NConfigProvider,
  useMessage
} from 'naive-ui'
import { useRoute } from 'vue-router'
import 'highlight.js/styles/vs2015.css'

// 导入语言
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import bash from 'highlight.js/lib/languages/bash'
import ini from 'highlight.js/lib/languages/ini'
import yaml from 'highlight.js/lib/languages/yaml'
import json from 'highlight.js/lib/languages/json'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import xml from 'highlight.js/lib/languages/xml'
import markdown from 'highlight.js/lib/languages/markdown'
import 'highlight.js/styles/github-dark.css'
import { Window } from '../types'

// 声明window类型，使$message可用
declare const window: Window & {
  $message?: any;
  __tableParsingTested?: boolean;
  __manualTableTested?: boolean;
};

// 注册语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('ini', ini)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('yml', yaml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('md', markdown)
hljs.registerLanguage('markdown', markdown)

// 使用全局主题
const themeStore = inject('theme') as {
  isDarkMode: { value: boolean },
  theme: { value: any },
  toggleTheme: () => void
}

const message = useMessage()
// 使用全局消息服务（已在AppContent中初始化）
const globalMessage = window.$message

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  path: {
    type: String,
    default: ''
  }
})

const loading = ref(true)
const error = ref('')
const markdownText = ref('')
const renderedContent = ref('')
const contentRef = ref(null)

// 模态框相关状态
const showImageModal = ref(false)
const modalImage = ref('')
const showCodeModal = ref(false)
const modalCodeContent = ref('')

// 获取操作系统主题
const osTheme = computed(() => themeStore.isDarkMode.value ? 'dark' : 'light')
// 主题配置
const themeRef = computed(() => {
  return osTheme.value === 'dark' ? themeStore.theme.value : themeStore.theme.value
})

// 设置CSS变量的通用函数
const setupThemeVariables = () => {
  const isDark = themeStore.isDarkMode.value;
  const rootElement = document.documentElement;

  // 只为内联代码保留CSS变量设置
  if (isDark) {
    // 只设置内联代码颜色
    rootElement.style.setProperty('--inline-code-color', '#ff9292');
    rootElement.style.setProperty('--inline-code-dark-color', '#ff9292');
  } else {
    // 只设置内联代码颜色
    rootElement.style.setProperty('--inline-code-color', '#d56161');
    rootElement.style.setProperty('--inline-code-dark-color', '#ff9292');
  }
  console.log('内联代码CSS变量已更新，当前主题:', isDark ? '暗色' : '亮色');
};

// 配置 marked
// 配置以确保正确处理换行和表格
marked.use({
  breaks: true,  // 将单个换行符转换为 <br>
  gfm: true,     // 使用 GitHub 风格的 Markdown (自动包含表格支持)
  pedantic: false // 不使用pedantic模式，这样标准markdown表格格式可以正确解析
})

// 在处理Markdown前，预处理表格语法以确保它们被正确解析
const preprocessMarkdownTables = (text: string): string => {
  // 检测是否包含表格语法
  if (!text.includes('|')) return text;

  console.log('检测到包含管道符号的文本，开始处理表格...');

  // 将文本按行分割，方便处理表格
  const lines = text.split('\n');
  let inTable = false;
  let tableStartIndex = -1;
  let processedLines = [];

  // 处理每一行
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // 检测表格开始行（包含至少两个 | 字符，这意味着至少有一列）
    if (!inTable && trimmedLine.includes('|') && (trimmedLine.match(/\|/g) || []).length >= 2) {
      inTable = true;
      tableStartIndex = i;
      processedLines.push(line); // 添加表格头部行
      console.log(`检测到表格开始行: ${trimmedLine}`);

      // 检查下一行是否是分隔符行
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      if (!nextLine.includes('|') || !nextLine.includes('-')) {
        // 如果下一行不是有效的分隔符行，插入一个
        const cellCount = (trimmedLine.match(/\|/g) || []).length - 1;
        const separatorLine = '|' + ' --- |'.repeat(cellCount);
        processedLines.push(separatorLine);
        console.log(`自动添加分隔符行: ${separatorLine}`);
      }
      continue;
    }

    // 处理表格中的行
    if (inTable) {
      // 检测表格结束（空行或不包含|的行）
      if (trimmedLine === '' || !trimmedLine.includes('|')) {
        inTable = false;
        // 添加空行以结束表格
        processedLines.push('');
        console.log('检测到表格结束');
      } else {
        // 针对缺少前导或尾部|的行进行修复
        let fixedLine = trimmedLine;
        if (!fixedLine.startsWith('|')) {
          fixedLine = '| ' + fixedLine;
        }
        if (!fixedLine.endsWith('|')) {
          fixedLine = fixedLine + ' |';
        }

        // 确保分隔行有足够的分隔符
        if (fixedLine.includes('-') && fixedLine.includes('|')) {
          // 计算需要的分隔符数量（基于其他行的单元格数量）
          let cellCount = 0;

          // 先尝试从表头获取列数
          if (tableStartIndex >= 0 && tableStartIndex < i) {
            const headerLine = lines[tableStartIndex].trim();
            cellCount = (headerLine.match(/\|/g) || []).length - 1;
          }

          // 确保分隔行包含足够的分隔符
          if (cellCount > 0) {
            const separators = fixedLine.split('|').filter(part => part.trim() !== '');
            if (separators.length < cellCount) {
              fixedLine = '|' + ' --- |'.repeat(cellCount);
            }
          }
        }

        processedLines.push(fixedLine);
      }
    } else {
      // 非表格内容直接添加
      processedLines.push(line);
    }
  }

  // 如果文件末尾正好是表格，需要添加空行结束表格
  if (inTable) {
    processedLines.push('');
    console.log('文件末尾是表格，添加空行');
  }

  const result = processedLines.join('\n');
  console.log('表格预处理完成');

  // 确保表格结构完整，添加调试信息
  console.log('预处理后的表格内容示例:');
  const tableLines = result.split('\n').filter(line => line.trim().includes('|')).slice(0, 5);
  tableLines.forEach((line, i) => console.log(`预处理后表格行 ${i + 1}: ${line}`));

  return result;
};

/**
 * 处理Markdown文本
 * @param {string} text - Markdown文本
 * @returns {string} - 处理后的HTML
 */
function processMarkdown(text: string): string {
  try {
    console.log('开始处理Markdown文本，长度:', text.length);

    // 使用前先确保所有表格相关标记都被清除
    if (typeof window !== 'undefined') {
      // 记录处理状态，而不是重置状态
      if (!window.__tableParsingTested) {
        console.log('首次处理表格，设置状态标记');
        window.__tableParsingTested = true;
      } else {
        console.log('已有表格处理记录，保持现有状态');
      }
    }

    // 预处理特殊值，确保null和undefined能正确显示
    text = text.replace(/^null$/gm, '`null`');
    text = text.replace(/^undefined$/gm, '`undefined`');

    // 使用marked解析Markdown
    let html = marked.parse(text) as string;

    // 清除潜在的XSS风险
    html = DOMPurify.sanitize(html);

    // 检查是否已经存在处理过的表格
    if (typeof document !== 'undefined') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const processedTables = tempDiv.querySelectorAll('.table-responsive table.markdown-table');
      if (processedTables.length > 0) {
        console.log(`检测到${processedTables.length}个已处理的表格，跳过表格处理`);
      } else {
        // 增强表格处理
        console.log('未检测到已处理的表格，进行表格增强处理');
        html = enhanceTablesInHTML(html, themeStore.isDarkMode.value);
      }
    } else {
      // 在非浏览器环境中简单处理
      html = enhanceTablesInHTML(html, false);
    }

    // 应用代码高亮
    if (typeof document !== 'undefined') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // 处理代码块
      tempDiv.querySelectorAll('pre code').forEach((el) => {
        try {
          if (el.className.includes('language-')) {
            const lang = el.className.replace('language-', '').trim();
            if (hljs.getLanguage(lang)) {
              hljs.highlightElement(el as HTMLElement);
            }
          } else {
            // 手动获取文本内容并高亮，而不是直接传递元素
            const codeText = el.textContent || '';
            const result = hljs.highlightAuto(codeText);
            el.innerHTML = result.value;
            el.classList.add(`hljs`);
            if (result.language) {
              el.classList.add(`language-${result.language}`);
            }
          }
        } catch (e) {
          console.error('代码高亮出错:', e);
        }
      });

      // 处理内联代码
      tempDiv.querySelectorAll('p code, li code').forEach((el) => {
        el.classList.add('inline-code');
      });

      html = tempDiv.innerHTML;
    }

    console.log('Markdown处理完成，输出HTML长度:', html.length);
    return html;
  } catch (error) {
    console.error('处理Markdown出错:', error);
    return `<div class="error">Markdown处理错误: ${error}</div>`;
  }
}

// 从原始文本中提取完整的表格块
const extractTableBlocks = (text: string): string[] => {
  try {
    const lines = text.split('\n');
    const tableBlocks: string[] = [];
    let currentTable: string[] = [];
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // 检测表格开始
      if (!inTable && line.includes('|') && (line.match(/\|/g) || []).length >= 2) {
        inTable = true;
        currentTable = [lines[i]];

        // 检查下一行是否是分隔符行
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (nextLine.includes('|') && nextLine.includes('-')) {
            // 下一行是分隔符行，添加并继续
            i++;
            currentTable.push(lines[i]);
            continue;
          } else if (nextLine.includes('|')) {
            // 下一行是数据行但不是分隔符行，需要自动添加一个分隔符行
            const cellCount = (line.match(/\|/g) || []).length - 1;
            currentTable.push('|' + ' --- |'.repeat(cellCount));
            // 不增加i，下一行将在下一次循环中处理
          } else {
            // 下一行不是表格内容，结束表格
            inTable = false;
            if (currentTable.length >= 2) { // 至少需要有表头和分隔符
              tableBlocks.push(currentTable.join('\n'));
            }
            currentTable = [];
          }
        }
      }
      // 处理表格中的行
      else if (inTable) {
        if (line === '' || !line.includes('|')) {
          // 表格结束
          inTable = false;
          if (currentTable.length >= 2) {
            tableBlocks.push(currentTable.join('\n'));
          }
          currentTable = [];
        } else {
          // 添加表格行
          currentTable.push(lines[i]);
        }
      }
    }

    // 处理文件末尾的表格
    if (inTable && currentTable.length >= 2) {
      tableBlocks.push(currentTable.join('\n'));
    }

    return tableBlocks;
  } catch (e) {
    console.error('提取表格块时出错:', e);
    return [];
  }
};

// 手动构建表格HTML的辅助函数
const constructTableHtml = (markdownText: string): string => {
  try {
    console.log('正在手动构建表格HTML，输入文本长度:', markdownText.length);

    // 提取所有表格相关行，去除空行
    const tableLines = markdownText.split('\n')
      .map(line => line.trim())
      .filter(line => line && line.includes('|'));

    if (tableLines.length < 2) {
      console.log('表格行数不足，至少需要2行');
      return '';
    }

    console.log(`找到${tableLines.length}行表格内容`);

    // 查找分隔行的索引（包含 '-' 字符的行）
    let separatorIndex = -1;
    for (let i = 0; i < tableLines.length; i++) {
      if (tableLines[i].includes('-') && tableLines[i].includes('|')) {
        separatorIndex = i;
        break;
      }
    }

    // 如果没有找到分隔行，尝试将第二行作为分隔行
    if (separatorIndex === -1 && tableLines.length >= 2) {
      separatorIndex = 1;
      console.log('未找到明确的分隔行，以第二行作为分隔行');
    } else if (separatorIndex === -1) {
      console.log('未找到分隔行且行数不足');
      return '';
    }

    console.log(`识别到分隔行索引: ${separatorIndex}, 内容: ${tableLines[separatorIndex]}`);

    // 提取列对齐信息
    const alignInfo = [];
    const separatorParts = tableLines[separatorIndex]
      .split('|')
      .map(part => part.trim())
      .filter(part => part !== '');

    separatorParts.forEach(part => {
      if (part.startsWith(':') && part.endsWith(':')) {
        alignInfo.push('center'); // 居中对齐 :---:
      } else if (part.endsWith(':')) {
        alignInfo.push('right');  // 右对齐 ---:
      } else {
        alignInfo.push('left');   // 默认左对齐 ---
      }
    });

    console.log('列对齐信息:', alignInfo.join(', '));

    // 提取表头行和数据行
    const headerLine = tableLines[0];
    const dataLines = tableLines.slice(separatorIndex + 1);

    console.log(`数据行数量: ${dataLines.length}`);
    if (dataLines.length > 0) {
      console.log('数据行示例:', dataLines[0]);
    }

    // 解析表头单元格
    const headers = headerLine
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell !== '');

    if (headers.length === 0) {
      console.log('未找到有效的表头单元格');
      return '';
    }

    console.log(`提取了${headers.length}个表头单元格:`, headers.join(', '));

    // 均匀分配列宽
    const columnCount = headers.length;
    const isSimpleTable = columnCount <= 5;
    const columnWidth = isSimpleTable ? `${Math.floor(100 / columnCount)}%` : 'auto';
    console.log(`列数: ${columnCount}, 是否简单表格: ${isSimpleTable}, 列宽: ${columnWidth}`);

    // 选择表格布局模式
    const layoutMode = columnCount > 5 ? 'fixed' : 'adaptive';

    // 创建唯一ID，避免生成重复的表格
    const tableId = `md-table-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 创建表格HTML
    let tableHtml = `<table id="${tableId}" class="markdown-table table-${layoutMode}" style="width:100%;">`;
    tableHtml += '<thead><tr>';

    // 添加表头单元格，应用对齐样式
    headers.forEach((header, index) => {
      const align = index < alignInfo.length ? alignInfo[index] : 'left';
      const style = `text-align:${align};` + (isSimpleTable ? `width:${columnWidth};` : '');
      tableHtml += `<th style="${style}" class="align-${align}">${header}</th>`;
    });

    tableHtml += '</tr></thead><tbody>';

    // 添加数据行
    let dataRowCount = 0;
    dataLines.forEach(line => {
      if (!line || !line.includes('|')) return;

      const cells = line
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell !== '');

      if (cells.length > 0) {
        dataRowCount++;
        tableHtml += '<tr>';

        // 处理每个单元格，应用对齐样式
        cells.forEach((cell, index) => {
          // 确保单元格数不超过表头数，如果超过就合并到最后一列
          if (index >= headers.length && headers.length > 0) {
            const lastIndex = headers.length - 1;
            const lastAlign = lastIndex < alignInfo.length ? alignInfo[lastIndex] : 'left';
            const isNumeric = /^[\$¥€£]?\s*-?\d+(\.\d+)?%?$/.test(cell);
            const finalAlign = isNumeric ? 'right' : lastAlign;
            const style = `text-align:${finalAlign};` + (isSimpleTable ? `width:${columnWidth};` : '');

            tableHtml += `<td style="${style}" class="align-${lastAlign}">${cell}</td>`;
          } else {
            const align = index < alignInfo.length ? alignInfo[index] : 'left';
            const alignClass = `align-${align}`;
            const isNumeric = /^[\$¥€£]?\s*-?\d+(\.\d+)?%?$/.test(cell);
            const finalAlign = isNumeric ? 'right' : align;
            const style = `text-align:${finalAlign};` + (isSimpleTable ? `width:${columnWidth};` : '');

            tableHtml += `<td style="${style}" class="${alignClass}">${cell}</td>`;
          }
        });

        // 如果单元格数少于表头数，添加空单元格
        if (cells.length < headers.length) {
          for (let i = cells.length; i < headers.length; i++) {
            const align = i < alignInfo.length ? alignInfo[i] : 'left';
            const style = `text-align:${align};` + (isSimpleTable ? `width:${columnWidth};` : '');
            tableHtml += `<td style="${style}" class="align-${align}"></td>`;
          }
        }

        tableHtml += '</tr>';
      }
    });

    // 如果没有数据行，添加一个空行
    if (dataRowCount === 0) {
      tableHtml += '<tr>';
      headers.forEach((_, index) => {
        const align = index < alignInfo.length ? alignInfo[index] : 'left';
        const style = `text-align:${align};` + (isSimpleTable ? `width:${columnWidth};` : '');
        tableHtml += `<td style="${style}" class="align-${align}">-</td>`;
      });
      tableHtml += '</tr>';
    }

    tableHtml += '</tbody></table>';

    // 包装表格为响应式布局
    const wrapperId = `wrapper-${tableId}`;
    const wrapperHtml = `<div id="${wrapperId}" class="table-responsive table-${layoutMode}" style="width:100%;display:block;" data-original-table="${tableId}">${tableHtml}</div>`;

    console.log(`手动生成表格HTML成功，数据行数: ${dataRowCount}, HTML长度: ${wrapperHtml.length}`);
    return wrapperHtml;
  } catch (e) {
    console.error('手动构建表格HTML出错:', e);
    return '';
  }
};

// 深度清理内容的辅助函数，用于移除所有[object Object]相关内容
const deepCleanContent = (content: any): string => {
  // 处理空值情况
  if (content === null || content === undefined) {
    return '';
  }

  // 确保是字符串，无论输入是什么类型
  let cleanedContent = String(content);

  // 替换掉各种特殊字符和特殊字面量 - 保留null和undefined文本
  cleanedContent = cleanedContent
    .replace(/\[object Object\]/g, '')
    // .replace(/undefined/g, '') // 不再替换undefined文本
    // .replace(/null/g, '') // 不再替换null文本
    .replace(/NaN/g, '0')
    .trim();

  // 处理转义字符
  cleanedContent = cleanedContent
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r');

  return cleanedContent;
};

// 增强渲染后的内容 - 简化逻辑，仅处理必要功能
const enhanceRenderedContent = (html: string) => {
  try {
    // 创建临时div用于DOM操作
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 确保标题有ID和锚点
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      // 为每个标题添加ID，使用标题文本作为ID
      const headingText = heading.textContent || '';
      // 创建一个基于标题文本的ID，去除特殊字符和空格
      const headingId = headingText
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-') // 保留中文和数字字母，其他替换为短横线
        .replace(/^-+|-+$/g, '') // 移除开头和结尾的短横线
        .replace(/^(\d)/, 'h-$1'); // 如果ID以数字开头，添加前缀

      // 使用标题文本作为ID，如果为空则使用序号
      heading.id = headingId || `heading-${index}`;

      // 如果标题没有锚点链接，添加一个
      if (!heading.querySelector('.header-anchor')) {
        const anchor = document.createElement('a');
        anchor.href = `#${heading.id}`;
        anchor.className = 'header-anchor';
        anchor.textContent = '#';
        heading.insertBefore(anchor, heading.firstChild);
      }
    });

    // 处理所有的图片，添加点击放大功能
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
      const wrapper = document.createElement('div');
      wrapper.className = 'img-wrapper';
      const newImg = img.cloneNode(true) as HTMLImageElement;
      wrapper.appendChild(newImg);
      img.parentNode?.replaceChild(wrapper, img);
      newImg.dataset.action = 'zoom';
      newImg.dataset.src = newImg.src;
    });

    // 处理所有链接
    const links = tempDiv.querySelectorAll('a');
    links.forEach(link => {
      // 检查是否是外部链接
      if (link.href && link.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      } else if (link.hash) {
        // 内部锚点链接，添加平滑滚动
        link.dataset.smooth = 'true';
      }
    });

    return tempDiv.innerHTML;
  } catch (err) {
    console.error('增强渲染内容时出错:', err);
    return html; // 出错时返回原始内容
  }
};

// 获取并渲染 Markdown 内容
const fetchMarkdownContent = async () => {
  loading.value = true;
  error.value = '';

  try {
    // 如果提供了直接内容，直接渲染
    if (props.content) {
      // 预处理内容
      markdownText.value = deepCleanContent(props.content);

      try {
        // 确保 markdownText.value 是字符串
        if (markdownText.value === null || markdownText.value === undefined) {
          markdownText.value = '';
        }

        // 检查内容是否包含表格
        const hasTableSyntax = markdownText.value.includes('|') &&
          (markdownText.value.match(/\|/g) || []).length >= 2 &&
          (markdownText.value.includes('\n|') || markdownText.value.includes('|\n'));

        if (hasTableSyntax) {
          console.log('内容中检测到表格，进行预处理...');
          markdownText.value = preprocessMarkdownTables(markdownText.value);
        }

        // 处理 Markdown
        console.log('处理Markdown前的内容长度:', markdownText.value.length);
        renderedContent.value = processMarkdown(markdownText.value);
        console.log('处理Markdown后设置renderedContent，长度:', renderedContent.value.length);

        // DOM更新后尝试处理代码块，但不立即执行
        loading.value = false;

        // 不要在这里调用renderNaiveUIComponents，让watch处理
        setTimeout(() => {
          if (contentRef.value) {
            console.log('💥延迟处理：DOM已准备好，处理事件');
            setupEventListeners();
            // 代码块的渲染由watch处理，这里不调用renderNaiveUIComponents
          } else {
            console.warn('💥延迟处理后contentRef仍不存在');
          }
        }, 100); // 延迟100ms

        return;
      } catch (parseError) {
        console.error('Markdown解析错误:', parseError);
        error.value = '内容格式不正确，无法解析';
        loading.value = false;
        return;
      }
    }

    // 确定 Markdown 文件的路径
    let filePath = props.path || '';

    if (!filePath) {
      throw new Error('未提供有效的Markdown路径');
    }

    // 如果路径不是以 '/' 开头，添加前缀
    if (!filePath.startsWith('/')) {
      filePath = `/docs/${filePath}`;
    }

    // 如果路径不是以 '.md' 结尾，添加后缀
    if (!filePath.endsWith('.md')) {
      filePath = `${filePath}.md`;
    }

    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`无法加载 Markdown 文件: ${response.statusText || '未知错误'}`);
    }

    const text = await response.text();

    // 确保 text 是有效的字符串
    if (!text || typeof text !== 'string' || text.trim() === '') {
      throw new Error('加载的Markdown文件内容为空或无效');
    }

    // 使用深度清理函数处理文件内容
    markdownText.value = deepCleanContent(text);

    try {
      // 确保 markdownText.value 是字符串
      if (markdownText.value === null || markdownText.value === undefined) {
        markdownText.value = '';
      }

      // 处理 Markdown
      console.log('处理Markdown前的内容长度:', markdownText.value.length);
      renderedContent.value = processMarkdown(markdownText.value);
      console.log('处理Markdown后设置renderedContent，长度:', renderedContent.value.length);

      // 使用延迟处理替代立即执行
      loading.value = false;

      // 使用延迟处理机制，给DOM更多时间渲染
      setTimeout(() => {
        if (contentRef.value) {
          console.log('💥延迟处理：DOM已准备好，处理事件');
          setupEventListeners();
          // 代码块的渲染由watch处理，这里不调用renderNaiveUIComponents
        } else {
          console.warn('💥延迟处理后contentRef仍不存在');
        }
      }, 100); // 延迟100ms

    } catch (parseError) {
      console.error('Markdown文件解析错误:', parseError);
      error.value = '文档格式不正确，无法解析';
      loading.value = false;
      return;
    }

  } catch (err) {
    console.error('加载 Markdown 文件时出错:', err);
    error.value = err instanceof Error ? err.message : '加载 Markdown 内容时出错';
    loading.value = false;
  }
};

// 添加事件监听器
const setupEventListeners = () => {
  if (!contentRef.value) return;

  // 图片点击放大
  const images = contentRef.value.querySelectorAll('[data-action="zoom"]');
  images.forEach((img: HTMLImageElement) => {
    img.addEventListener('click', () => {
      const src = img.dataset.src || img.src;
      if (src) {
        openImageModal(src);
      }
    });
  });

  // 平滑滚动锚点链接
  const smoothLinks = contentRef.value.querySelectorAll('[data-smooth="true"]');
  smoothLinks.forEach((link: HTMLAnchorElement) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href) {
        const targetElement = document.querySelector(href);
        if (targetElement) {

          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          if (window.innerWidth <= 768) {
            window.scrollBy(0, 30);
          }

          // 更新 URL，但不触发跳转
          history.pushState(null, '', href);
        }
      }
    });
  });
};

// 重置渲染标记，在内容变化时调用
const resetRenderingFlags = () => {
  if (!contentRef.value) return;

  console.log('💥重置渲染标记');
  contentRef.value.removeAttribute('data-code-rendered');

  // 重置所有已处理的代码块标记
  const processedElements = contentRef.value.querySelectorAll('[data-processed="true"]');
  processedElements.forEach(el => {
    el.removeAttribute('data-processed');
  });
};

// 监听 content 属性变化，重新渲染内容
watch(() => props.content, (newContent) => {
  if (newContent !== undefined && newContent !== null) {
    try {
      // 重置渲染状态，确保新内容能够被处理
      resetRenderingFlags();

      // 使用深度清理函数处理内容
      markdownText.value = deepCleanContent(newContent);

      try {
        // 确保 markdownText.value 是字符串
        if (markdownText.value === null || markdownText.value === undefined) {
          markdownText.value = '';
        }

        // 处理 Markdown
        console.log('处理Markdown前的内容长度:', markdownText.value.length);
        renderedContent.value = processMarkdown(markdownText.value);
        console.log('处理Markdown后设置renderedContent，长度:', renderedContent.value.length);

        // 使用nextTick包装而不是await
        nextTick(() => {
          console.log('content watch: DOM已更新，准备处理事件和NCode');
          if (contentRef.value) {
            console.log('contentRef存在，调用setupEventListeners和renderNaiveUIComponents');
            setupEventListeners();
            renderNaiveUIComponents();
          } else {
            console.warn('contentRef不存在，无法设置事件和渲染NCode');
          }
        });
      } catch (parseError) {
        console.error('动态内容解析错误:', parseError);
        error.value = '内容格式不正确，无法解析';
        return;
      }
    } catch (err) {
      console.error('渲染 Markdown 内容时出错:', err);
      error.value = err instanceof Error ? err.message : '渲染 Markdown 内容时出错';
    }
  }
}, { immediate: false });

// 监听 path 属性变化，重新加载内容
watch(() => props.path, (newPath) => {
  if (newPath) {
    // 重置渲染状态，确保新内容能够被处理
    resetRenderingFlags();
    fetchMarkdownContent();
  }
}, { immediate: false });

// 初始化时和每次路由变化时都确保CSS变量设置正确
watch(() => props.path, () => {
  console.log('路径变化，重新设置CSS变量');
  setupThemeVariables();

  // 检查是否需要重新加载内容
  if (props.path) {
    fetchMarkdownContent();
  }
}, { immediate: true });

// 监听内容变化
watch(() => props.content, () => {
  console.log('内容变化，重新设置CSS变量');
  setupThemeVariables();

  // 检查是否需要重新处理内容
  if (props.content) {
    fetchMarkdownContent();
  }
}, { immediate: true });

onMounted(() => {
  // 添加全局错误处理
  const handleErrors = (event: ErrorEvent) => {
    console.error('Markdown渲染错误:', event);
    const errorMessage = event.message || '渲染Markdown时发生未知错误';

    // 如果是marked相关错误，提供更友好的提示
    if (errorMessage.includes('marked') || errorMessage.includes('toLowerCase')) {
      error.value = '解析Markdown时出现问题，可能是格式不正确或内容损坏';
      globalMessage.error('Markdown解析失败，请检查文档格式');
    }
  };

  // 注册全局错误处理
  window.addEventListener('error', handleErrors);

  // 初始设置主题变量
  setupThemeVariables();

  // 初始加载内容
  console.log('💥组件挂载，开始初始加载内容');
  if (props.path || props.content) {
    console.log('💥调用fetchMarkdownContent加载内容');
    fetchMarkdownContent();
  }

  // 在组件挂载后，完全依赖watch来处理代码块的渲染
  // 不再在这里手动调用renderNaiveUIComponents
  console.log('💥组件挂载完成，代码块将由watch监听器渲染');

  // 确保标题锚点存在，并添加额外检查
  setTimeout(() => {
    if (contentRef.value) {
      console.log('💥检查并确保标题锚点存在');
      const headings = contentRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6');

      headings.forEach((heading, index) => {
        // 检查标题是否已有ID
        if (!heading.id) {
          // 为每个标题添加ID，使用标题文本作为ID
          const headingText = heading.textContent || '';
          const headingId = headingText
            .toLowerCase()
            .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .replace(/^(\d)/, 'h-$1');

          // 使用标题文本作为ID，如果为空则使用序号
          heading.id = headingId || `heading-${index}`;
        }

        // 检查标题是否已有锚点链接
        if (!heading.querySelector('.header-anchor')) {
          const anchor = document.createElement('a');
          anchor.href = `#${heading.id}`;
          anchor.className = 'header-anchor';
          anchor.textContent = '#';
          anchor.style.opacity = '0.5'; // 增加默认可见度
          heading.insertBefore(anchor, heading.firstChild);
          console.log(`💥为标题 "${heading.textContent}" 添加了锚点`);
        }
      });
    }
  }, 500); // 增加等待时间确保内容已渲染
});

// 打开图片模态框
const openImageModal = (src: string) => {
  modalImage.value = src;
  showImageModal.value = true;
};

// 关闭图片模态框
const closeImageModal = () => {
  showImageModal.value = false;
};

// 打开代码模态框
const openCodeModal = (codeHtml: string) => {
  modalCodeContent.value = codeHtml;
  showCodeModal.value = true;
};

// 关闭代码模态框
const closeCodeModal = () => {
  showCodeModal.value = false;
};

// 复制代码到剪贴板
const copyToClipboard = async (text: string, el: HTMLElement) => {
  try {
    await navigator.clipboard.writeText(text);
    el.classList.add('copied');
    el.textContent = '已复制';
    globalMessage.success('代码已复制到剪贴板');
    setTimeout(() => {
      el.classList.remove('copied');
      el.textContent = '复制';
    }, 2000);
  } catch (err) {
    globalMessage.error('复制失败，请手动复制');
    console.error('无法复制到剪贴板:', err);
  }
};

// 创建包含语法高亮的HTML，考虑主题样式
const createCodeHtml = (highlighted, codeLang, codeContent) => {
  // 简化复制按钮，只使用文本并确保CSS变量正确生效
  return `
    <div class="n-code-fallback">
      <div class="code-header">
        <span class="language-tag">${codeLang || 'text'}</span>
        <button class="action-button copy-btn">复制</button>
      </div>
      <pre class="code-content"><code class="hljs ${codeLang ? `language-${codeLang}` : ''}">${highlighted}</code></pre>
    </div>
  `;
};

// 获取主题相关的样式
const getFallbackStyles = () => {
  // 始终返回深色主题的颜色，不再受全局主题影响
  const bgColor = '#1e1e1e';
  const textColor = 'rgba(255, 255, 255, 0.85)';

  return { bgColor, textColor };
};

// 处理 Markdown 内容后，渲染 NCode 组件
const renderNaiveUIComponents = () => {
  console.log('💥开始执行renderNaiveUIComponents函数💥');
  if (!contentRef.value) {
    console.error('contentRef不存在，无法渲染NCode组件');
    return;
  }

  // 检查是否已经渲染过，避免重复渲染
  if (contentRef.value.getAttribute('data-code-rendered') === 'true') {
    console.log('💥代码块已经渲染过，跳过重复渲染');
    return;
  }

  try {
    // 直接在整个容器中查找所有pre>code元素
    console.log('💥直接查找所有代码元素');
    const preCodes = contentRef.value.querySelectorAll('pre > code');
    console.log('💥找到pre>code元素数量:', preCodes.length);

    if (preCodes.length > 0) {
      console.log('💥开始处理pre>code元素');
      // 直接处理pre>code元素
      Array.from(preCodes).forEach((codeEl: HTMLElement, index) => {
        // 检查此代码块是否已经处理过
        if (codeEl.parentElement?.getAttribute('data-processed') === 'true') {
          console.log(`💥代码块 #${index + 1} 已处理过，跳过`);
          return;
        }

        try {
          // 获取代码内容和语言
          let codeContent = codeEl.textContent || '';
          let codeLang = '';

          // 特别处理JSON中的null和undefined
          if (codeEl.classList.contains('language-json')) {
            // 先保存原始内容
            const originalContent = codeContent;

            // 正确处理JSON中的特殊值
            try {
              // 将undefined转换为字符串以便显示
              codeContent = codeContent.replace(/"([^"]+)":\s*undefined/g, '"$1": "undefined"');

              // 确保语法高亮仍然有效
              if (codeContent !== originalContent) {
                codeEl.textContent = codeContent;
              }
            } catch (jsonError) {
              console.error('💥处理JSON特殊值时出错:', jsonError);
            }
          }

          // 尝试从类名中获取语言
          const classNames = Array.from(codeEl.classList);
          for (const className of classNames) {
            if (className.startsWith('language-')) {
              codeLang = className.replace('language-', '');
              break;
            }
          }

          // 其余代码保持不变
          // 创建挂载点
          const mountPoint = document.createElement('div');
          mountPoint.className = 'n-code-mount-point';
          mountPoint.setAttribute('data-processed', 'true');

          // 替换原始元素
          const preEl = codeEl.parentElement;
          if (preEl) {
            preEl.setAttribute('data-processed', 'true'); // 标记为已处理
            preEl.parentNode?.replaceChild(mountPoint, preEl);

            // 直接渲染代码块，不调用外部函数
            try {
              let highlighted = codeContent;

              // 尝试使用hljs进行高亮
              if (codeLang && hljs.getLanguage(codeLang)) {
                try {
                  highlighted = hljs.highlight(codeContent, { language: codeLang }).value;
                  console.log(`💥成功使用highlight.js高亮代码，语言: ${codeLang}`);
                } catch (e) {
                  console.error('💥Highlight.js语法高亮失败:', e);
                }
              } else {
                // 尝试自动检测语言
                try {
                  const result = hljs.highlightAuto(codeContent);
                  highlighted = result.value;
                  codeLang = result.language || '';
                  console.log(`💥自动检测到语言: ${codeLang}`);
                } catch (e) {
                  console.error('💥自动语言检测失败:', e);
                }
              }

              // 创建包含语法高亮的HTML
              const html = createCodeHtml(highlighted, codeLang, codeContent);

              // 设置HTML内容
              mountPoint.innerHTML = html;
              console.log(`💥代码块 #${index + 1} 渲染成功 (HTML方式)`);

              // 添加复制功能
              const copyButton = mountPoint.querySelector('.copy-btn');
              if (copyButton) {
                copyButton.addEventListener('click', () => {
                  try {
                    navigator.clipboard.writeText(codeContent);
                    globalMessage.success('代码已复制到剪贴板');
                    copyButton.textContent = '已复制';
                    copyButton.classList.add('copied');
                    setTimeout(() => {
                      copyButton.textContent = '复制';
                      copyButton.classList.remove('copied');
                    }, 2000);
                  } catch (err) {
                    globalMessage.error('复制失败，请手动复制');
                    console.error('无法复制到剪贴板:', err);
                  }
                });
              }
            } catch (htmlError) {
              console.error(`💥HTML方式失败:`, htmlError);
              // 最终回退：纯文本
              const { bgColor, textColor } = getFallbackStyles();
              mountPoint.innerHTML = `<pre style="margin:0;padding:16px;overflow:auto;background:${bgColor};color:${textColor};"><code>${codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
              console.log(`💥代码块 #${index + 1} 使用纯文本方式展示`);
            }
          }
        } catch (err) {
          console.error(`💥处理pre>code #${index + 1} 时出错:`, err);
        }
      });

      // 处理内联代码元素
      const inlineCodeElements = contentRef.value.querySelectorAll('code:not(pre > code)');
      console.log('💥找到内联code元素数量:', inlineCodeElements.length);

      if (inlineCodeElements.length > 0) {
        Array.from(inlineCodeElements).forEach((codeEl: HTMLElement, index) => {
          try {
            const codeContent = codeEl.textContent || '';
            if (codeContent.trim().length > 0) {
              // 只需添加基本样式即可，不需要高亮
              codeEl.classList.add('inline-code');
            }
          } catch (err) {
            console.error(`💥处理内联代码 #${index + 1} 时出错:`, err);
          }
        });
      }
    } else {
      // 查找所有需要渲染为 NCode 的元素
      const nCodeWrappers = contentRef.value.querySelectorAll('.n-code-wrapper');
      console.log('💥找到.n-code-wrapper元素数量:', nCodeWrappers.length);

      if (nCodeWrappers.length > 0) {
        console.log('💥开始处理.n-code-wrapper元素');
        // 处理特殊格式的代码块
        Array.from(nCodeWrappers).forEach((wrapper: HTMLElement, index) => {
          // 检查此代码块是否已经处理过
          if (wrapper.getAttribute('data-processed') === 'true') {
            console.log(`💥代码块包装器 #${index + 1} 已处理过，跳过`);
            return;
          }

          try {
            // 标记为已处理
            wrapper.setAttribute('data-processed', 'true');

            const codeEl = wrapper.querySelector('.n-code');
            if (!codeEl) {
              console.warn(`💥代码块 #${index + 1} 没有找到.n-code元素`);
              return;
            }

            const codeLang = codeEl.getAttribute('data-code-lang') || '';
            let codeContent = '';

            try {
              // 尝试从data-code属性解码
              const encodedCode = codeEl.getAttribute('data-code');
              if (encodedCode) {
                codeContent = decodeURIComponent(encodedCode);
                console.log(`💥成功从data-code解码代码内容，长度: ${codeContent.length}`);
              }
            } catch (decodeError) {
              console.error('💥解码代码内容出错:', decodeError);
            }

            // 如果解码失败，使用textContent作为备选
            if (!codeContent) {
              codeContent = codeEl.textContent || '';
              console.log(`💥使用textContent作为备选，长度: ${codeContent.length}`);
            }

            // 创建挂载点
            const mountPoint = document.createElement('div');
            mountPoint.className = 'n-code-mount-point';

            // 替换原始元素
            wrapper.replaceWith(mountPoint);

            // 使用与pre>code相同的HTML渲染方法
            try {
              let highlighted = codeContent;

              // 尝试使用hljs进行高亮
              if (codeLang && hljs.getLanguage(codeLang)) {
                try {
                  highlighted = hljs.highlight(codeContent, { language: codeLang }).value;
                  console.log(`💥成功使用highlight.js高亮代码，语言: ${codeLang}`);
                } catch (e) {
                  console.error('💥Highlight.js语法高亮失败:', e);
                }
              } else {
                // 尝试自动检测语言
                try {
                  const result = hljs.highlightAuto(codeContent);
                  highlighted = result.value;
                  console.log(`💥自动检测到语言: ${result.language || 'unknown'}`);
                } catch (e) {
                  console.error('💥自动语言检测失败:', e);
                }
              }

              // 创建包含语法高亮的HTML
              const html = createCodeHtml(highlighted, codeLang, codeContent);

              // 设置HTML内容
              mountPoint.innerHTML = html;
              console.log(`💥代码块 #${index + 1} 渲染成功 (HTML方式)`);

              // 添加复制功能
              const copyButton = mountPoint.querySelector('.copy-btn');
              if (copyButton) {
                copyButton.addEventListener('click', () => {
                  try {
                    navigator.clipboard.writeText(codeContent);
                    globalMessage.success('代码已复制到剪贴板');
                    copyButton.textContent = '已复制';
                    copyButton.classList.add('copied');
                    setTimeout(() => {
                      copyButton.textContent = '复制';
                      copyButton.classList.remove('copied');
                    }, 2000);
                  } catch (err) {
                    globalMessage.error('复制失败，请手动复制');
                    console.error('无法复制到剪贴板:', err);
                  }
                });
              }
            } catch (htmlError) {
              console.error(`💥HTML方式失败:`, htmlError);
              // 最终回退：纯文本
              const { bgColor, textColor } = getFallbackStyles();
              mountPoint.innerHTML = `<pre style="margin:0;padding:16px;overflow:auto;background:${bgColor};color:${textColor};"><code>${codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
              console.log(`💥代码块 #${index + 1} 使用纯文本方式展示`);
            }
          } catch (blockError) {
            console.error(`💥处理代码块 #${index + 1} 时出错:`, blockError);
          }
        });
      } else {
        // 处理孤立的code标签
        const codeElements = contentRef.value.querySelectorAll('code');
        console.log('💥找到普通code元素数量:', codeElements.length);

        if (codeElements.length === 0) {
          console.log('💥未找到任何代码块元素');
          console.log('💥内容结构:', contentRef.value.innerHTML.substring(0, 300) + '...');
          return;
        }

        // 处理普通的code元素
        Array.from(codeElements).forEach((codeEl: HTMLElement, index) => {
          try {
            const codeContent = codeEl.textContent || '';
            // 内联代码直接添加样式
            codeEl.classList.add('inline-code');
            console.log(`💥处理内联代码 #${index + 1}`);
          } catch (err) {
            console.error(`💥处理内联代码 #${index + 1} 时出错:`, err);
          }
        });
      }
    }

    // 标记容器为已渲染，避免重复处理
    contentRef.value.setAttribute('data-code-rendered', 'true');
    console.log('💥renderNaiveUIComponents函数执行完成，已标记为已渲染');
  } catch (error) {
    console.error('💥渲染 NCode 组件时出错:', error);
  }
};

// 表格解析测试函数
const testTableParsing = async (customMarkdown?: string) => {
  const testTableMarkdown = customMarkdown || `
# 表格测试

下面是一个简单的表格:

| 标题1 | 标题2 | 标题3 |
| ---- | ---- | ---- |
| 单元格1 | 单元格2 | 单元格3 |
| 100 | 200 | 300 |

## 另一个表格

| 名称 | 年龄 | 职业 |
| ---- | ---- | ---- |
| 张三 | 25 | 工程师 |
| 李四 | 30 | 设计师 |
| 王五 | 28 | 产品经理 |
`;

  // 尝试解析表格
  console.log('开始表格解析测试...');
  console.log('测试Markdown内容:', testTableMarkdown);
  try {
    // 第1步：预处理表格
    console.log('第1步：预处理表格...');
    const processed = preprocessMarkdownTables(testTableMarkdown);
    console.log('预处理后的表格Markdown:', processed);

    // 第2步：解析Markdown为HTML
    console.log('第2步：解析Markdown为HTML...');
    // 处理可能的异步解析
    let parsedHtml = '';
    try {
      const parsed = marked.parse(processed);
      // 处理可能是Promise的情况
      if (parsed instanceof Promise) {
        parsedHtml = await parsed;
        console.log('异步解析完成');
      } else {
        parsedHtml = parsed as string;
        console.log('同步解析完成');
      }
    } catch (e) {
      console.error('marked.parse 执行错误:', e);
      // 尝试直接解析，跳过marked
      console.log('尝试备用解析方法...');
      const lines = processed.split('\n');
      let html = '<div>';
      let inTable = false;
      let tableHtml = '';

      for (const line of lines) {
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
          if (!inTable) {
            inTable = true;
            tableHtml = '<table border="1"><thead>';
          }

          // 处理表格行
          const cells = line.split('|').filter(cell => cell.trim() !== '');
          const isHeader = line.includes('---');

          if (isHeader) {
            continue; // 跳过分隔符行
          }

          const rowHtml = cells.map(cell => `<td>${cell.trim()}</td>`).join('');
          tableHtml += `<tr>${rowHtml}</tr>`;

          if (inTable && (line.trim() === '' || !line.includes('|'))) {
            inTable = false;
            tableHtml += '</tbody></table>';
            html += tableHtml;
          }
        } else if (inTable) {
          inTable = false;
          tableHtml += '</tbody></table>';
          html += tableHtml;
        } else {
          html += `<p>${line}</p>`;
        }
      }

      if (inTable) {
        tableHtml += '</tbody></table>';
        html += tableHtml;
      }

      html += '</div>';
      parsedHtml = html;
      console.log('备用解析完成:', parsedHtml);
    }

    // 第3步：分析生成的HTML
    console.log('第3步：分析生成的HTML...');
    console.log('HTML长度:', parsedHtml.length);
    console.log('HTML摘要:', parsedHtml.substring(0, 200) + '...');

    // 检查是否包含表格标签
    if (typeof parsedHtml === 'string' && parsedHtml.includes('<table>') && parsedHtml.includes('</table>')) {
      console.log('表格解析成功!');

      // 计算生成的表格数量
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = parsedHtml;
      const tableCount = tempDiv.querySelectorAll('table').length;
      console.log(`检测到 ${tableCount} 个表格`);

      // 检查表格结构
      const firstTable = tempDiv.querySelector('table');
      if (firstTable) {
        console.log('表格结构:', {
          rows: firstTable.querySelectorAll('tr').length,
          hasThead: !!firstTable.querySelector('thead'),
          hasTbody: !!firstTable.querySelector('tbody'),
          cells: firstTable.querySelectorAll('td').length
        });

        // 输出HTML结构以便调试
        console.log('表格HTML结构:', firstTable.outerHTML);
      }
    } else {
      console.warn('表格解析失败，未找到<table>标签');

      // 尝试手动生成表格HTML
      console.log('尝试手动生成表格HTML...');
      const lines = processed.split('\n');
      const tableParts = [];
      let currentTable = [];

      for (const line of lines) {
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
          currentTable.push(line);
        } else if (currentTable.length > 0) {
          tableParts.push([...currentTable]);
          currentTable = [];
        }
      }

      if (currentTable.length > 0) {
        tableParts.push([...currentTable]);
      }

      console.log('识别到的表格部分数量:', tableParts.length);
      for (let i = 0; i < tableParts.length; i++) {
        console.log(`表格 #${i + 1}:`, tableParts[i]);
      }
    }
  } catch (error) {
    console.error('表格解析测试出错:', error);
  }
};

// 声明全局NaiveUI类型
declare global {
  interface Window {
    $naive?: {
      NCode?: typeof NCode;
      [key: string]: any;
    };
  }
}

// 在处理完 Markdown 后调用 NCode 渲染
watch(() => renderedContent.value, () => {
  console.log('💥监测到renderedContent变化，准备渲染NCode组件');

  // 渲染前先检查是否已经渲染过
  if (contentRef.value && contentRef.value.getAttribute('data-code-rendered') === 'true') {
    console.log('💥内容已经渲染过代码块，跳过重复渲染');
    return;
  }

  // 使用轮询机制等待 contentRef 出现
  const maxAttempts = 5;
  let attempts = 0;

  const tryRender = () => {
    if (contentRef.value) {
      // 再次检查是否已渲染过
      if (contentRef.value.getAttribute('data-code-rendered') === 'true') {
        console.log('💥DOM已更新，但代码块已渲染过，跳过');
        return true;
      }

      console.log('💥DOM已更新，调用setupEventListeners和renderNaiveUIComponents');
      setupEventListeners();
      renderNaiveUIComponents();
      return true;
    } else if (attempts < maxAttempts) {
      attempts++;
      console.log(`💥contentRef.value不存在，尝试第${attempts}次等待 (剩余${maxAttempts - attempts}次)`);
      setTimeout(tryRender, 100); // 每100ms检查一次
      return false;
    } else {
      console.warn('💥达到最大尝试次数，contentRef仍不存在');
      return false;
    }
  };

  // 先用 nextTick 尝试一次
  nextTick(() => {
    if (!tryRender()) {
      console.log('💥初次尝试失败，开始轮询等待contentRef');
    }
  });
}, { immediate: true }); // 添加immediate: true确保初始化时也执行

// 监听主题变化，更新代码块样式
watch(() => themeStore.isDarkMode.value, () => {
  console.log('主题变化，更新CSS变量和代码块样式');

  // 调用通用函数更新CSS变量
  setupThemeVariables();

  // 当主题变化时，仅更新代码块的样式
  if (contentRef.value) {
    // 找到所有已渲染的代码块挂载点
    const mountPoints = contentRef.value.querySelectorAll('.n-code-mount-point');
    if (mountPoints.length > 0) {
      console.log(`找到 ${mountPoints.length} 个代码块，样式已通过CSS变量更新`);
    }

    // 同时更新内联代码样式
    try {
      const inlineCodes = contentRef.value.querySelectorAll('.inline-code');
      if (inlineCodes.length > 0) {
        console.log(`找到 ${inlineCodes.length} 个内联代码，样式已通过CSS变量更新`);
      }
    } catch (err) {
      console.error('更新内联代码样式出错:', err);
    }
  }
});

// 计算当前是否为暗黑模式
const isDarkMode = computed(() => themeStore.isDarkMode.value);

// 为直接提供的内容测试表格解析功能
const testDirectContentTableParsing = async (content: string) => {
  if (!content) return;

  console.log('测试直接内容表格解析...');
  console.log('内容预览:', content.substring(0, 100) + (content.length > 100 ? '...' : ''));

  try {
    // 清理并预处理内容
    const cleanedContent = deepCleanContent(content);
    const processed = preprocessMarkdownTables(cleanedContent);

    // 使用处理后的内容来渲染，这将触发正常的渲染流程
    markdownText.value = processed;
    renderedContent.value = processMarkdown(markdownText.value);

    // 通过设置一个标志值表示已经进行过测试
    if (typeof window !== 'undefined') {
      window.__tableParsingTested = true;
    }

    console.log('直接内容表格解析测试完成');
  } catch (error) {
    console.error('直接内容表格解析测试失败:', error);
  }
};

// 监听 props.content 变化并测试表格解析
watch(() => props.content, (newContent) => {
  // 只在内容第一次设置时进行测试，避免无限循环
  if (newContent && typeof window !== 'undefined' && !window.__tableParsingTested) {
    testDirectContentTableParsing(newContent);
  }
}, { immediate: true });

// 检测一个列是否应该是数字对齐的（包含数字、金额、百分比等）
function isNumericColumn(values: string[]): boolean {
  // 如果没有值，则不是数字列
  if (values.length === 0) return false;

  // 检查所有值
  return values.every(value => {
    const trimmed = value.trim();
    // 空值不影响判断
    if (trimmed === '') return true;
    // 测试是否是数字（包括带有货币符号、小数点、逗号的数字）
    return /^[\$¥€£]?\s*-?\d+([,\.]\d+)*%?$/.test(trimmed);
  });
}

// 添加使用NTable处理表格的函数
const processTablesWithNTable = () => {
  if (!contentRef.value) return;

  // 查找所有表格元素
  const contentElement = contentRef.value as HTMLElement;
  const tables = contentElement.querySelectorAll('table');
  console.log(`找到${tables.length}个表格，准备处理样式`);

  if (tables.length === 0) {
    console.log('没有找到表格，跳过处理');
    return;
  }

  // 检查是否已经处理过表格
  if (typeof window !== 'undefined' && window.__manualTableTested) {
    console.log('表格已经处理过，避免重复处理');
    return;
  }

  let tableCount = 0;

  tables.forEach((table, index) => {
    try {
      // 检查表格是否已经处理过
      if (table.getAttribute('data-processed') === 'true') {
        console.log(`表格 #${index + 1} 已处理过，跳过`);
        return;
      }

      // 检查表格是否已经在响应式包装器中
      const isInWrapper = table.closest('.table-responsive') !== null;
      if (isInWrapper) {
        console.log(`表格 #${index + 1} 已在响应式包装器中，跳过创建包装器`);
        table.setAttribute('data-processed', 'true');
        table.classList.add('markdown-table');
        table.style.width = '100%';
        return;
      }

      tableCount++;
      console.log(`处理表格 ${tableCount}`);

      // 标记表格为已处理
      table.setAttribute('data-processed', 'true');

      // 给表格添加基础样式类和宽度属性
      table.classList.add('markdown-table');
      table.style.width = '100%';

      // 获取表头和数据行
      const headers = table.querySelectorAll('thead th');
      const rows = table.querySelectorAll('tbody tr');

      // 检查表格特征，用于决定布局模式
      const columnCount = headers.length || (rows[0]?.querySelectorAll('td').length || 0);
      const hasLongContent = checkForLongContent(table);
      const isWideTable = columnCount > 5;

      // 决定表格布局模式 (默认使用自适应模式以填满空间)
      let layoutMode = 'adaptive';
      if (isWideTable || hasLongContent) {
        layoutMode = 'fixed';
      }

      // 添加布局模式类
      table.classList.add(`table-${layoutMode}`);
      console.log(`表格模式: ${layoutMode} (列数: ${columnCount}, 是否有长内容: ${hasLongContent})`);

      // 如果列数较少，均匀分配列宽
      if (layoutMode === 'adaptive' && columnCount > 0 && columnCount <= 5) {
        const width = `${Math.floor(100 / columnCount)}%`;

        // 设置均匀的列宽
        headers.forEach(header => {
          (header as HTMLElement).style.width = width;
        });

        // 确保第一行也设置了宽度
        if (rows.length > 0) {
          const firstRowCells = rows[0].querySelectorAll('td');
          firstRowCells.forEach(cell => {
            (cell as HTMLElement).style.width = width;
          });
        }

        console.log(`设置列均匀宽度: ${width}`);
      }

      // 处理表格对齐方式
      processTableAlignment(table);

      // 创建表格包装器用于响应式布局
      const wrapper = document.createElement('div');
      wrapper.className = `table-responsive table-${layoutMode}`;
      wrapper.style.width = '100%';
      wrapper.style.display = 'block';

      // 确保表格父容器具有足够宽度
      const parentWidth = table.parentElement?.offsetWidth || 0;
      const containerWidth = contentElement.offsetWidth || 0;
      console.log(`表格父容器宽度: ${parentWidth}, 内容容器宽度: ${containerWidth}`);

      // 放置表格到包装器中
      if (table.parentNode) {
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }

      // 为固定模式表格添加滚动指示器
      if (layoutMode === 'fixed') {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator right';
        indicator.textContent = '滑动查看更多';
        wrapper.appendChild(indicator);

        // 添加滚动事件监听器
        setTimeout(() => {
          const tableWrapper = document.querySelector(`.table-responsive.table-fixed:nth-child(${tableCount})`);
          if (tableWrapper) {
            const scrollIndicator = tableWrapper.querySelector('.scroll-indicator');
            if (scrollIndicator && tableWrapper instanceof HTMLElement) {
              // 初始化滚动指示器状态
              updateScrollIndicator(tableWrapper, scrollIndicator);

              // 添加滚动事件监听
              tableWrapper.addEventListener('scroll', () => {
                updateScrollIndicator(tableWrapper as HTMLElement, scrollIndicator);
              });
            }
          }
        }, 100);
      }
    } catch (error) {
      console.error(`处理表格 #${index + 1} 时出错:`, error);
    }
  });

  if (typeof window !== 'undefined') {
    window.__manualTableTested = true;
  }

  console.log(`表格处理完成: 总共处理了 ${tableCount} 个表格`);

  // 在处理完成后再次检查表格宽度
  setTimeout(() => {
    const allTables = contentElement.querySelectorAll('table.markdown-table');
    allTables.forEach((table, index) => {
      const actualWidth = (table as HTMLElement).offsetWidth;
      const parentWidth = table.parentElement?.offsetWidth || 0;
      const wrapperWidth = table.closest('.table-responsive')?.clientWidth || 0;

      console.log(`表格 #${index + 1} 的实际宽度: ${actualWidth}px, 父容器宽度: ${parentWidth}px, 包装器宽度: ${wrapperWidth}px`);

      // 如果表格宽度不足，强制设置为100%
      if (actualWidth < parentWidth * 0.95) {
        console.log(`表格 #${index + 1} 宽度不足，强制设置为100%`);
        (table as HTMLElement).style.width = '100%';
      }
    });
  }, 300);
};

/**
 * 检查表格是否包含长内容
 * @param {HTMLTableElement} table - 表格元素
 * @return {boolean} - 是否包含长内容
 */
function checkForLongContent(table: HTMLTableElement): boolean {
  const cells = table.querySelectorAll('th, td');
  let hasLongContent = false;

  cells.forEach(cell => {
    // 判断单元格内容是否过长
    const content = cell.textContent || '';
    if (content.length > 30 || content.includes(' ') && content.length > 20) {
      hasLongContent = true;
    }
  });

  return hasLongContent;
}

/**
 * 处理表格对齐方式
 * @param {HTMLTableElement} table - 表格元素
 */
function processTableAlignment(table: HTMLTableElement) {
  const headerCells = table.querySelectorAll('thead th');
  const rows = table.querySelectorAll('tbody tr');

  // 检测每列是否都是数字（用于右对齐）
  const numericColumns: boolean[] = [];

  // 初始化数组
  headerCells.forEach((_, index) => {
    numericColumns[index] = true;
  });

  // 检查每列的内容
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell, index) => {
      if (index < numericColumns.length) {
        const content = cell.textContent || '';
        const isNumeric = /^[\d.,]+$/.test(content.trim());
        numericColumns[index] = numericColumns[index] && isNumeric;
      }
    });
  });

  // 应用对齐样式
  headerCells.forEach((cell, index) => {
    if (numericColumns[index]) {
      cell.classList.add('align-right');
    }
  });

  // 为数据单元格设置对齐方式
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell, index) => {
      if (index < numericColumns.length && numericColumns[index]) {
        cell.classList.add('align-right');
      }
    });
  });
}

/**
 * 更新滚动指示器状态
 * @param {HTMLElement} wrapper - 表格包装器
 * @param {Element} indicator - 滚动指示器
 */
function updateScrollIndicator(wrapper: HTMLElement, indicator: Element) {
  // 检查元素是否存在
  if (!wrapper || !indicator) return;

  const hasHorizontalScroll = wrapper.scrollWidth > wrapper.clientWidth;

  // 如果没有水平滚动，隐藏指示器
  if (!hasHorizontalScroll) {
    indicator.classList.add('hidden');
    return;
  } else {
    indicator.classList.remove('hidden');
  }

  const isAtLeft = wrapper.scrollLeft <= 0;
  const isAtRight = wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth;

  // 移除所有方向类
  indicator.classList.remove('left', 'right', 'both');

  // 根据滚动位置设置适当的类
  if (isAtLeft) {
    indicator.classList.add('right');
    indicator.textContent = '向右滑动查看更多';
  } else if (isAtRight) {
    indicator.classList.add('left');
    indicator.textContent = '向左滑动查看更多';
  } else {
    indicator.classList.add('both');
    indicator.textContent = '左右滑动查看更多';
  }
}

// 检测一个列是否应该是数字对齐的（包含数字、金额、百分比等）
const isNumberColumn = (data: Record<string, string>[], headerKey: string): boolean => {
  // 如果没有数据，默认为左对齐
  if (data.length === 0) return false;

  // 检查至少70%的单元格是否包含数字格式
  let numberCount = 0;

  for (const row of data) {
    const value = String(row[headerKey] || '').trim();

    // 判断是否为数字格式（整数、小数、金额、百分比）
    if (/^[\$¥€£]?\s*-?\d+(\.\d+)?%?$/.test(value)) {
      numberCount++;
    }
  }

  // 如果超过70%的单元格是数字格式，则认为这一列应该右对齐
  return (numberCount / data.length) >= 0.7;
};

// 在内容渲染完成后处理表格
watch(() => renderedContent.value, () => {
  // 确保DOM已更新
  nextTick(() => {
    if (contentRef.value) {
      // 首先渲染代码块
      renderNaiveUIComponents();

      // 等待代码块渲染完成后再处理表格
      setTimeout(() => {
        processTablesWithNTable();
      }, 100);
    }
  });
}, { immediate: false });

// 添加监听主题变化时重新渲染表格
watch(() => themeStore.isDarkMode.value, () => {
  // 主题变化后只更新表格样式，而不重新创建结构
  nextTick(() => {
    if (contentRef.value) {
      console.log('主题变化，只更新表格样式');

      // 获取所有表格和包装器
      const tables = contentRef.value.querySelectorAll('table.markdown-table');
      const wrappers = contentRef.value.querySelectorAll('.table-responsive');

      // 检查是否存在表格
      if (tables.length === 0) {
        console.log('没有找到表格，无需更新样式');
        return;
      }

      console.log(`找到 ${tables.length} 个表格，${wrappers.length} 个包装器，更新样式`);

      // 只更新表格样式，不重新创建结构
      const isDark = themeStore.isDarkMode.value;

      // 更新滚动指示器状态
      wrappers.forEach(wrapper => {
        if (wrapper.classList.contains('table-fixed')) {
          const indicator = wrapper.querySelector('.scroll-indicator');
          if (indicator && wrapper instanceof HTMLElement) {
            updateScrollIndicator(wrapper, indicator);
          }
        }
      });

      console.log('表格样式更新完成');
    }
  });
});

/**
 * 处理Markdown表格，将其替换为更好的HTML表格结构
 * @param {string} html - 原始HTML
 * @param {boolean} isDarkTheme - 是否为暗色主题
 */
function enhanceTablesInHTML(html: string, isDarkTheme = false) {
  if (!html) return html;

  if (typeof document === 'undefined') return html;

  // 创建临时DOM元素来解析HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // 查找所有表格元素
  const tables = tempDiv.querySelectorAll('table');
  if (!tables.length) return html;

  let tableCount = 0;

  tables.forEach((table) => {
    // 检查表格是否已经在响应式包装器中
    const isInWrapper = table.closest('.table-responsive') !== null;
    if (isInWrapper) {
      console.log(`表格已在响应式包装器中，跳过创建包装器`);
      table.classList.add('markdown-table');
      (table as HTMLElement).style.width = '100%';
      return;
    }

    tableCount++;
    console.log(`处理表格 ${tableCount}`);

    // 为表格添加基础样式类和宽度属性
    table.classList.add('markdown-table');
    (table as HTMLElement).style.width = '100%';

    // 获取表头和数据行
    const headers = table.querySelectorAll('thead th');
    const rows = table.querySelectorAll('tbody tr');

    // 检查表格特征，用于决定布局模式
    const columnCount = headers.length || (rows[0]?.querySelectorAll('td').length || 0);
    const hasLongContent = checkForLongContent(table);
    const isWideTable = columnCount > 5;

    // 决定表格布局模式 (默认使用自适应模式以填满空间)
    let layoutMode = 'adaptive';
    if (isWideTable || hasLongContent) {
      layoutMode = 'fixed';
    }

    // 添加布局模式类
    table.classList.add(`table-${layoutMode}`);
    console.log(`表格模式: ${layoutMode} (列数: ${columnCount}, 是否有长内容: ${hasLongContent})`);

    // 如果列数较少，均匀分配列宽
    if (layoutMode === 'adaptive' && columnCount > 0 && columnCount <= 5) {
      const width = `${Math.floor(100 / columnCount)}%`;

      // 设置均匀的列宽
      headers.forEach(header => {
        (header as HTMLElement).style.width = width;
      });

      // 确保第一行也设置了宽度
      if (rows.length > 0) {
        const firstRowCells = rows[0].querySelectorAll('td');
        firstRowCells.forEach(cell => {
          (cell as HTMLElement).style.width = width;
        });
      }

      console.log(`设置列均匀宽度: ${width}`);
    }

    // 处理表格对齐方式
    processTableAlignment(table);

    // 添加响应式包装器
    const wrapper = document.createElement('div');
    wrapper.className = `table-responsive table-${layoutMode}`;
    wrapper.style.width = '100%';
    wrapper.style.display = 'block';

    // 放置表格到包装器中
    table.parentNode?.insertBefore(wrapper, table);
    wrapper.appendChild(table);

    // 为固定模式表格添加滚动指示器
    if (layoutMode === 'fixed') {
      const indicator = document.createElement('div');
      indicator.className = 'scroll-indicator right';
      indicator.textContent = '滑动查看更多';
      wrapper.appendChild(indicator);
    }
  });

  return tempDiv.innerHTML;
}
</script>

<style lang="scss">
@use '../assets/styles/components/markdownDisplay.scss';

/* 表格样式 */
.markdown-container {
  .table-responsive {
    overflow-x: auto;
    margin-bottom: 1rem;
    position: relative;
    /* 用于定位滚动指示器 */
    width: 100%;
    /* 确保容器本身填满宽度 */
    display: block;
    /* 确保容器是块级元素 */

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(136, 136, 136, 0.5);
      border-radius: 3px;
    }

    // /* 自适应表格样式 */
    // &.table-adaptive {
    //   overflow-x: visible;

    //   table {
    //     table-layout: auto;
    //     width: 100% !important; /* 强制宽度100% */
    //     max-width: 100%;

    //     td, th {
    //       word-break: break-word;
    //       hyphens: auto;
    //     }

    //     .truncate-text {
    //       max-width: 200px;
    //       white-space: nowrap;
    //       overflow: hidden;
    //       text-overflow: ellipsis;
    //     }
    //   }
    // }

    /* 固定宽度表格样式 */
    &.table-fixed {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      /* 平滑滚动 */

      table {
        table-layout: fixed;
        width: 100% !important;
        /* 强制宽度100% */
        min-width: 100%;

        /* 单元格内容可能较长 */
        td,
        th {
          min-width: 120px;
          white-space: normal;
          word-break: normal;
        }

        .auto-width {
          width: auto;
          min-width: 60px;
        }
      }

      /* 滚动指示器样式 */
      .scroll-indicator {
        position: absolute;
        bottom: -18px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 0.8rem;
        color: #666;
        opacity: 0.8;
        transition: opacity 0.3s ease;
        pointer-events: none;

        &.fade-out {
          opacity: 0;
        }

        &.left::before {
          content: "← ";
        }

        &.right::after {
          content: " →";
        }

        &.both::before {
          content: "← ";
        }

        &.both::after {
          content: " →";
        }

        &.hidden {
          opacity: 0;
        }
      }
    }
  }

  table.markdown-table {
    width: 100% !important;
    /* 强制表格宽度 */
    border-collapse: collapse;
    font-size: 0.9rem;
    margin: 0.5rem 0;
    box-sizing: border-box;
    /* 确保边框不会增加宽度 */

    th,
    td {
      padding: 8px 12px;
      border: 1px solid #ddd;
      text-align: left;
    }

    th,
    .table-header {
      font-weight: bold;
      background-color: #f5f5f7;
    }

    tr:nth-child(even) {
      background-color: #fafafa;
    }

    .align-right {
      text-align: right;
    }

    .align-center {
      text-align: center;
    }

    /* 自适应表格样式 */
    &.table-adaptive {
      width: 100% !important;
      table-layout: auto;

      td {
        width: auto;
        /* 允许单元格根据内容调整宽度 */
      }

      th {
        width: auto;
        /* 允许表头根据内容调整宽度 */
      }

      @media (max-width: 768px) {

        /* 在小屏幕上微调样式 */
        th,
        td {
          padding: 6px 8px;
          font-size: 0.85rem;
        }
      }
    }

    /* 固定宽度表格样式 */
    &.table-fixed {
      table-layout: fixed;
      width: 100% !important;

      th,
      td {
        overflow: hidden;
        word-break: normal;
        width: auto;
        /* 自动计算列宽 */
      }

      @media (max-width: 768px) {

        /* 在小屏幕上微调样式 */
        th,
        td {
          min-width: 100px;
        }
      }
    }
  }

  /* 暗色模式样式 */
  &.dark-theme {
    table.markdown-table {
      border-color: #444;

      th,
      td {
        border-color: #444;
      }

      th,
      .table-header {
        background-color: #333;
        color: #eee;
      }

      tr:nth-child(even) {
        background-color: #2a2a2a;
      }

      tr:hover {
        background-color: #3a3a3a;
      }
    }

    .table-responsive {
      .scroll-indicator {
        color: #aaa;
      }
    }
  }
}
</style>