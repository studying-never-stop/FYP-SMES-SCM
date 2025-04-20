<template>
  <div class="report-ai-container">
    <!-- 报告区域 -->
    <el-card class="report-section">
      <template #header>
        <div class="card-header">
          <span>Monthly Operation Report</span>
          <div class="btn-group">
            <el-button type="primary" @click="generateReport" :loading="loading">Generate</el-button>
            <el-button @click="copyReport" :disabled="!report">Copy</el-button>
            <el-button @click="downloadReport" :disabled="!report">Download</el-button>
            <el-button @click="exportPDF" :disabled="!report">Export PDF</el-button>
          </div>
        </div>
      </template>
      <div id="pdf-target">
        <div v-if="report">
          <pre class="report-content">{{ report }}</pre>
        </div>
        <div v-else>
          <el-empty description="No report generated yet" />
        </div>
      </div>
    </el-card>

    <!-- AI 助手区域 -->
    <div class="ai-card">
      <div class="card-header">
        <span>AI Assistant</span>
        <el-button type="danger" size="small" @click="clearChat">Clear</el-button>
      </div>

      <div class="ai-card-body">
        <div ref="chatContainer" class="chat-history">
          <div
            v-for="(msg, idx) in messages"
            :key="idx"
            class="chat-message"
            :class="msg.role"
          >
            <div v-if="msg.role === 'user'"><strong>You:</strong> {{ msg.content }}</div>
            <div v-else class="markdown" v-html="renderMarkdown(msg.content)"></div>
          </div>
        </div>

        <div class="chat-input">
          <el-input v-model="input" placeholder="Ask something..." @keyup.enter="sendMessage" />
          <el-button type="primary" @click="sendMessage" :disabled="!input">Send</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'
import html2pdf from 'html2pdf.js'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const report = ref<string>('')
const loading = ref(false)
const input = ref('')
const messages = ref<ChatMessage[]>([
  {
    role: 'assistant',
    content: 'Hi! I’m your AI assistant. Ask me anything about your company’s operations.'
  }
])
const chatContainer = ref<HTMLElement | null>(null)
const headers = {
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
}

// 报告生成
const generateReport = async () => {
  loading.value = true
  try {
    const { data } = await axios.post('/api/report-ai/generate', {}, { headers })
    report.value = data
    ElMessage.success('Report generated successfully!')
  } catch (err) {
    console.error(err)
    ElMessage.error('Failed to generate report')
  } finally {
    loading.value = false
  }
}

// 复制
const copyReport = async () => {
  try {
    await navigator.clipboard.writeText(report.value)
    ElMessage.success('Copied to clipboard!')
  } catch {
    ElMessage.error('Copy failed!')
  }
}

// 下载 txt
const downloadReport = () => {
  const blob = new Blob([report.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'monthly_report.txt'
  a.click()
  URL.revokeObjectURL(url)
}

// 导出 pdf
const exportPDF = () => {
  const target = document.getElementById('pdf-target')
  if (!target) return

  const opt = {
    margin: 0.5,
    filename: `monthly_report_${new Date().toISOString().slice(0, 10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().from(target).set(opt).save()
}

// 聊天发送
const sendMessage = async () => {
  if (!input.value.trim()) return
  messages.value.push({ role: 'user', content: input.value })

  try {
    const { data } = await axios.post<string>('/api/ai-assistant/chat', {
      messages: messages.value
    }, { headers })

    messages.value.push({ role: 'assistant', content: data })
    input.value = ''

    await nextTick()
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('Failed to communicate with AI')
  }
}

// 清空聊天
const clearChat = () => {
  messages.value = [
    {
      role: 'assistant',
      content: 'Hi! I’m your AI assistant. Ask me anything about your company’s operations.'
    }
  ]
}

// markdown 渲染
const renderMarkdown = (text: string) => marked.parse(text)
</script>

<style scoped>
.report-ai-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  gap: 12px;
  padding: 16px;
}

.report-section {
  flex: 2;
  overflow-y: auto;
  min-height: 0;
}

/* ✅ AI 助手卡片区域（不再使用 el-card） */
.ai-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 12px;
  height: 33vh;
  overflow: hidden;
}

.ai-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.chat-history {
  flex: 1;
  padding: 8px;
  background-color: #fafafa;
  border-radius: 6px;
}

.chat-message {
  margin-bottom: 10px;
  word-break: break-word;
}

.chat-message.user {
  text-align: right;
}

.chat-message.assistant {
  text-align: left;
}

.markdown {
  padding: 6px 10px;
  background: #f5f5f5;
  border-radius: 4px;
  line-height: 1.6;
  word-break: break-word;
}

.chat-input {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.report-content {
  white-space: pre-wrap;
  line-height: 1.6;
  font-family: "Courier New", monospace;
  font-size: 14px;
}
</style>
