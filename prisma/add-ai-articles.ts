import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { resolve } from 'path'

// 加载环境变量
dotenv.config({ path: resolve(process.cwd(), '.env.production') })
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

const prisma = new PrismaClient()

const articles = [
  {
    title: 'AI辅助编程：从GitHub Copilot到ChatGPT的开发者新体验',
    slug: 'ai-assisted-programming-from-copilot-to-chatgpt',
    excerpt: '探索AI如何改变软件开发流程，从代码补全到智能调试，AI工具正在成为每个开发者的得力助手。',
    content: `# AI辅助编程：从GitHub Copilot到ChatGPT的开发者新体验

在人工智能快速发展的今天，AI辅助编程已经从概念变成了现实。无论是GitHub Copilot、ChatGPT还是其他AI编程工具，它们正在深刻改变着软件开发的方式。

## AI编程工具的发展历程

### 1. 代码补全的演进

传统的代码编辑器只能提供简单的语法补全，而现代的AI工具能够：

- **理解上下文**：不只是语法，还能理解代码的意图和业务逻辑
- **生成完整函数**：根据注释或函数名生成完整的实现代码
- **多语言支持**：在同一项目中混合使用多种编程语言

### 2. GitHub Copilot：AI编程的里程碑

GitHub Copilot基于OpenAI的Codex模型，能够：

\`\`\`typescript
// 你只需要写注释
// 创建一个函数来验证邮箱格式并发送验证邮件
async function sendVerificationEmail(email: string) {
  // Copilot会自动生成完整的实现代码
}
\`\`\`

### 3. ChatGPT：对话式编程助手

与Copilot不同，ChatGPT提供了更灵活的交互方式：

- 可以解释复杂的代码逻辑
- 帮助调试错误
- 提供代码重构建议
- 生成测试用例

## AI编程的实际应用场景

### 场景1：快速原型开发

\`\`\`python
# 使用AI快速生成RESTful API框架
# 你只需要描述需求，AI可以生成完整的Flask/FastAPI代码

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    name: str
    email: str

@app.post("/users/")
async def create_user(user: User):
    # AI生成的代码
    return {"message": f"User {user.name} created"}
\`\`\`

### 场景2：代码优化和重构

AI可以帮助识别代码中的问题并提供优化建议：

- 性能瓶颈分析
- 代码重复检测
- 安全漏洞识别
- 最佳实践建议

### 场景3：学习和探索新技术

当你遇到不熟悉的技术栈时，AI可以：

1. 提供详细的学习路径
2. 生成示例代码
3. 解答技术问题
4. 推荐相关资源

## AI编程的最佳实践

### 1. 明确你的需求

在使用AI工具时，清晰的需求描述非常重要：

❌ 不好的提示：\`写个函数\`
✅ 好的提示：\`创建一个TypeScript函数，接受用户ID和订单数组，计算总金额并返回格式化的货币字符串\`

### 2. 审查和测试生成的代码

AI生成的代码虽然高效，但必须：

- 仔细审查逻辑正确性
- 运行单元测试
- 检查安全性问题
- 确保符合项目规范

### 3. 理解代码，不要盲目复制

AI是工具，不是替代品。作为开发者，你需要：

- 理解生成代码的工作原理
- 能够维护和修改这些代码
- 在AI无法解决时能够手动解决

## AI编程的未来展望

### 短期趋势（1-2年）

- **更好的上下文理解**：AI能够理解整个项目结构
- **更准确的代码生成**：减少错误，提高代码质量
- **多模态支持**：结合文本、图像、音频进行编程

### 长期愿景（5-10年）

- **完全自动化的软件开发**：从需求到部署的自动化流程
- **自然语言编程**：直接用自然语言描述需求，AI自动生成应用
- **个性化编程助手**：学习开发者习惯，提供个性化建议

## 挑战和注意事项

### 1. 代码质量问题

AI生成的代码可能：
- 存在安全漏洞
- 不符合最佳实践
- 性能未优化
- 缺乏必要的错误处理

### 2. 过度依赖的风险

过度依赖AI可能导致：
- 编程能力退化
- 缺乏创新思维
- 无法解决复杂问题

### 3. 版权和合规问题

使用AI生成的代码需要注意：
- 版权归属
- 开源协议兼容性
- 商业使用限制

## 结论

AI辅助编程正在成为软件开发的新常态。作为开发者，我们应该：

1. **拥抱变化**：积极学习使用AI工具
2. **保持批判**：审查和测试所有生成的代码
3. **持续学习**：AI是工具，编程能力仍然是核心
4. **合理使用**：在效率和代码质量之间找到平衡

AI不会替代程序员，但使用AI的程序员会替代不使用AI的程序员。让我们在AI的帮助下，成为更高效、更有创造力的开发者。

---

**相关资源：**
- [GitHub Copilot官方文档](https://docs.github.com/en/copilot)
- [ChatGPT编程指南](https://platform.openai.com/docs/guides/gpt-best-practices)
- [AI编程工具对比](https://example.com/ai-tools-comparison)

**标签**：AI编程、GitHub Copilot、ChatGPT、开发工具、生产力`,
    status: 'PUBLISHED' as const,
    category: 'AI编程',
    tags: ['AI编程', 'GitHub Copilot', 'ChatGPT', '开发工具'],
  },
  {
    title: '使用LangChain构建智能应用：从零开始学习AI Agent开发',
    slug: 'building-ai-applications-with-langchain',
    excerpt: '深入浅出地介绍如何使用LangChain框架构建AI应用，包括链式调用、记忆管理和工具集成等核心概念。',
    content: `# 使用LangChain构建智能应用：从零开始学习AI Agent开发

LangChain是一个强大的Python框架，专门用于构建基于大语言模型（LLM）的应用程序。无论是简单的文本生成还是复杂的AI Agent，LangChain都能提供优雅的解决方案。

## 什么是LangChain？

LangChain是一个开源的Python库，它简化了：

- **与LLM的交互**：统一的接口连接不同的语言模型
- **链式调用**：将多个LLM调用组合成复杂的应用流程
- **数据加载**：从各种数据源加载和处理数据
- **工具集成**：将外部工具和服务集成到AI应用中

## 核心概念

### 1. 链（Chains）

链是LangChain的核心概念，它允许你将多个组件连接起来：

\`\`\`python
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# 创建LLM实例
llm = OpenAI(temperature=0.7)

# 定义提示模板
prompt = PromptTemplate(
    input_variables=["topic"],
    template="写一篇关于{topic}的技术博客文章，要求专业且易懂。"
)

# 创建链
chain = LLMChain(llm=llm, prompt=prompt)

# 执行链
result = chain.run("Python异步编程")
print(result)
\`\`\`

### 2. 记忆（Memory）

让AI应用记住对话历史：

\`\`\`python
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

memory = ConversationBufferMemory()
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True
)

# 第一次对话
conversation.predict(input="我喜欢Python编程")

# 第二次对话（AI会记住之前的对话）
conversation.predict(input="我刚才说我喜欢什么？")
\`\`\`

### 3. 代理（Agents）

Agent是可以使用工具的智能系统：

\`\`\`python
from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType

# 定义工具
tools = [
    Tool(
        name="搜索引擎",
        func=search_web,
        description="用于搜索互联网信息"
    ),
    Tool(
        name="计算器",
        func=calculate,
        description="用于执行数学计算"
    )
]

# 初始化Agent
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# Agent可以根据问题选择使用哪个工具
result = agent.run("北京今天的天气怎么样？")
\`\`\`

## 实际应用案例

### 案例1：智能文档问答系统

\`\`\`python
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA

# 1. 加载文档
loader = PyPDFLoader("technical_document.pdf")
documents = loader.load()

# 2. 分割文档
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
texts = text_splitter.split_documents(documents)

# 3. 创建向量数据库
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(texts, embeddings)

# 4. 创建问答链
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# 5. 提问
answer = qa_chain.run("这个文档的主要内容是什么？")
print(answer)
\`\`\`

### 案例2：代码生成和审查工具

\`\`\`python
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

code_review_template = """
作为一个资深的代码审查专家，请审查以下代码：

代码：
{code}

请从以下几个方面进行审查：
1. 代码质量和可读性
2. 潜在的性能问题
3. 安全性问题
4. 最佳实践建议

审查结果：
"""

prompt = PromptTemplate(
    input_variables=["code"],
    template=code_review_template
)

review_chain = LLMChain(llm=llm, prompt=prompt)

code = """
def process_user_data(user_id):
    query = f"SELECT * FROM users WHERE id = {user_id}"
    return execute_query(query)
"""

review = review_chain.run(code=code)
print(review)
\`\`\`

## 高级特性

### 1. 自定义链

创建符合特定需求的链：

\`\`\`python
from langchain.chains import SimpleSequentialChain

# 创建第一个链：生成博客大纲
outline_chain = LLMChain(
    llm=llm,
    prompt=PromptTemplate(
        input_variables=["topic"],
        template="为{topic}创建一个详细的博客大纲"
    )
)

# 创建第二个链：根据大纲写文章
article_chain = LLMChain(
    llm=llm,
    prompt=PromptTemplate(
        input_variables=["outline"],
        template="根据以下大纲写一篇完整的文章：\\n{outline}"
    )
)

# 组合链
full_chain = SimpleSequentialChain(
    chains=[outline_chain, article_chain],
    verbose=True
)

result = full_chain.run("TypeScript高级类型系统")
\`\`\`

### 2. 流式输出

实现实时的文本流输出：

\`\`\`python
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

streaming_llm = OpenAI(
    streaming=True,
    callbacks=[StreamingStdOutCallbackHandler()],
    temperature=0.7
)

streaming_llm("请详细介绍React Hooks的工作原理")
\`\`\`

### 3. 数据连接器

从各种数据源加载数据：

\`\`\`python
from langchain.document_loaders import (
    WebBaseLoader,
    CSVLoader,
    JSONLoader
)

# 从网页加载
web_loader = WebBaseLoader("https://example.com/article")
web_docs = web_loader.load()

# 从CSV加载
csv_loader = CSVLoader("data.csv")
csv_docs = csv_loader.load()

# 从JSON加载
json_loader = JSONLoader("data.json", jq_schema=".[]")
json_docs = json_loader.load()
\`\`\`

## 最佳实践

### 1. 提示工程

编写清晰、具体的提示：

❌ **不好的提示**：
\`\`\`
写点代码
\`\`\`

✅ **好的提示**：
\`\`\`
创建一个TypeScript函数，实现快速排序算法。
要求：
- 使用泛型支持任意可比较类型
- 添加JSDoc注释
- 包含类型注解
- 时间复杂度为O(n log n)
\`\`\`

### 2. 错误处理

总是添加错误处理逻辑：

\`\`\`python
from langchain.callbacks import get_openai_callback

try:
    with get_openai_callback() as cb:
        result = chain.run(input="你的问题")
        print(f"Token使用情况: {cb.total_tokens}")
except Exception as e:
    print(f"错误: {e}")
    # 实现重试或降级逻辑
\`\`\`

### 3. 成本控制

监控和管理API调用成本：

\`\`\`python
from langchain.callbacks import get_openai_callback

with get_openai_callback() as cb:
    # 执行多个LLM调用
    result1 = chain1.run(input1)
    result2 = chain2.run(input2)
    
    print(f"总Token数: {cb.total_tokens}")
    print(f"总成本: {cb.total_cost}")
\`\`\`

## 总结

LangChain为构建AI应用提供了一个强大而灵活的框架。通过掌握链、记忆、代理等核心概念，你可以快速构建出实用的AI应用。

关键要点：
- **链式调用**：组合多个组件实现复杂功能
- **记忆管理**：让AI记住对话历史
- **工具集成**：扩展AI的能力边界
- **提示工程**：编写高质量的提示以获得更好的结果

随着AI技术的不断发展，LangChain也在持续演进。保持学习，跟上最新的发展，你就能构建出越来越强大的AI应用。

---

**相关资源：**
- [LangChain官方文档](https://python.langchain.com/)
- [LangChain GitHub仓库](https://github.com/langchain-ai/langchain)
- [LangChain示例集合](https://github.com/langchain-ai/langchain/tree/master/templates)

**标签**：LangChain、AI应用、Python、LLM、Agent开发`,
    status: 'PUBLISHED' as const,
    category: 'AI编程',
    tags: ['LangChain', 'Python', 'AI应用', 'LLM'],
  },
  {
    title: 'Prompt Engineering实战指南：如何与AI高效对话',
    slug: 'prompt-engineering-practical-guide',
    excerpt: '掌握提示工程的核心技巧，学会如何编写有效的提示词，让AI生成更准确、更有用的内容。',
    content: `# Prompt Engineering实战指南：如何与AI高效对话

Prompt Engineering（提示工程）是AI时代最重要的技能之一。无论是使用ChatGPT、Claude还是其他大语言模型，掌握有效的提示编写技巧都能显著提升工作效率。

## 什么是Prompt Engineering？

Prompt Engineering是设计和优化输入提示（prompts）的艺术和科学，目的是让AI模型产生更准确、更有用的输出。

### 为什么重要？

- **准确性提升**：好的提示可以减少AI的误解和错误
- **效率提升**：清晰的提示能更快得到想要的结果
- **成本优化**：减少需要重新生成或修正的次数
- **能力边界**：好的提示可以让AI完成更复杂的任务

## 核心原则

### 1. 清晰明确

❌ **模糊的提示**：
\`\`\`
写一篇关于编程的文章
\`\`\`

✅ **清晰的提示**：
\`\`\`
写一篇2000字的技术博客文章，主题是"Python异步编程的最佳实践"。
要求：
- 面向中级开发者
- 包含实际代码示例
- 说明异步编程的优势和适用场景
- 提供常见问题的解决方案
\`\`\`

### 2. 提供上下文

上下文越丰富，AI的回答越准确：

\`\`\`
我是一名前端开发者，正在使用Next.js 14构建一个博客系统。
我需要实现一个文章编辑器的Markdown预览功能。

具体要求：
- 使用react-markdown库
- 支持代码高亮（shiki）
- 实时预览
- 响应式设计

请提供完整的实现代码和说明。
\`\`\`

### 3. 使用示例（Few-shot Learning）

通过示例引导AI理解你的需求：

\`\`\`
请将以下用户需求转换为技术需求文档：

示例1：
用户需求：用户希望能够搜索文章
技术需求：实现全文搜索功能，支持关键词匹配，返回相关文章列表

示例2：
用户需求：用户希望能够评论文章
技术需求：实现评论系统，支持嵌套回复，需要审核机制

现在转换以下需求：
用户需求：用户希望能够收藏喜欢的文章
技术需求：
\`\`\`

### 4. 分步骤思考（Chain of Thought）

让AI展示思考过程：

\`\`\`
分析以下代码的性能问题，并按以下步骤思考：
1. 识别性能瓶颈
2. 分析问题原因
3. 提出优化方案
4. 评估优化效果

代码：
[你的代码]
\`\`\`

## 实用技巧

### 技巧1：角色设定

给AI指定一个专业角色：

\`\`\`
你是一位经验丰富的全栈架构师，擅长系统设计和性能优化。
请帮我设计一个高并发的API架构方案。
\`\`\`

### 技巧2：输出格式控制

明确指定输出格式：

\`\`\`
请用JSON格式输出以下信息：
- 文章标题
- 摘要
- 关键词列表
- 发布时间

JSON格式示例：
{
  "title": "标题",
  "summary": "摘要",
  "keywords": ["关键词1", "关键词2"],
  "publishTime": "2024-01-01"
}
\`\`\`

### 技巧3：迭代优化

不断优化提示以获得更好的结果：

**第一版提示**：
\`\`\`
写一个登录功能
\`\`\`

**第二版（添加更多细节）**：
\`\`\`
使用Next.js 14和NextAuth.js实现一个安全的登录功能
\`\`\`

**第三版（完整需求）**：
\`\`\`
使用Next.js 14和NextAuth.js v5实现登录功能，要求：
1. 支持邮箱密码登录
2. 实现JWT认证
3. 添加"记住我"功能
4. 密码强度验证
5. 错误处理和用户反馈
6. 响应式设计

请提供完整的实现代码，包括：
- API路由处理
- 登录表单组件
- 认证中间件
- 类型定义
\`\`\`

### 技巧4：约束和限制

明确约束条件：

\`\`\`
生成一个密码生成器函数，要求：
- 长度8-16个字符
- 必须包含大小写字母、数字和特殊字符
- 不能包含连续重复字符
- 不能包含常见弱密码模式
- 返回TypeScript函数，包含类型注解
\`\`\`

## 实际应用场景

### 场景1：代码生成

\`\`\`markdown
请使用React和TypeScript创建一个可复用的Modal组件。

功能要求：
1. 支持自定义标题和内容
2. 可以通过props控制显示/隐藏
3. 点击遮罩层关闭
4. 支持ESC键关闭
5. 包含打开/关闭动画
6. 响应式设计

代码要求：
- 使用函数组件和Hooks
- 完整的TypeScript类型定义
- 遵循React最佳实践
- 添加JSDoc注释
- 使用Tailwind CSS进行样式设计
\`\`\`

### 场景2：代码审查

\`\`\`markdown
作为一个资深代码审查专家，请审查以下代码：

审查维度：
1. **代码质量**：可读性、可维护性
2. **性能**：是否有性能问题
3. **安全性**：是否有安全漏洞
4. **最佳实践**：是否符合行业标准

对每个问题：
- 说明问题所在
- 解释为什么是问题
- 提供改进建议
- 给出优化后的代码示例

代码：
[你的代码]
\`\`\`

### 场景3：技术文档编写

\`\`\`markdown
为以下API端点编写技术文档：

API端点：POST /api/users

要求文档包含：
1. 功能描述
2. 请求参数说明（JSON Schema）
3. 响应格式说明
4. 错误码定义
5. 请求示例
6. 响应示例
7. 注意事项

格式使用Markdown，要求专业、清晰、完整。
\`\`\`

### 场景4：问题诊断

\`\`\`markdown
我遇到了一个错误，请帮我诊断问题：

错误信息：
[错误信息]

代码上下文：
[相关代码]

环境信息：
- Node.js版本：18.17.0
- 框架：Next.js 14
- 数据库：PostgreSQL 14

请按以下步骤分析：
1. 分析错误原因
2. 定位问题位置
3. 提供解决方案
4. 给出修复后的代码
\`\`\`

## 高级技巧

### 1. 使用思维链（Chain of Thought）

\`\`\`markdown
解决这个问题的步骤：

问题：[你的问题]

思考过程：
1. 首先，我需要理解问题的本质
2. 然后，分析可能的解决方案
3. 接着，评估每个方案的优缺点
4. 最后，选择最优方案并实现

请按照以上步骤详细分析。
\`\`\`

### 2. 反向提示（Negative Prompting）

明确不想要的内容：

\`\`\`markdown
写一篇关于TypeScript的技术文章，要求：
- 面向中级开发者
- 包含实际示例
- 深入浅出

不要包含：
- 基础语法介绍（假设读者已掌握）
- 过于简单的示例
- 营销性语言
\`\`\`

### 3. 条件分支

让AI根据不同情况给出不同答案：

\`\`\`markdown
根据项目规模选择合适的状态管理方案：

如果项目是小到中型（< 50个组件）：
推荐使用：[方案A]
理由：[原因]

如果项目是中到大型（50-200个组件）：
推荐使用：[方案B]
理由：[原因]

如果项目是大型企业应用（> 200个组件）：
推荐使用：[方案C]
理由：[原因]

请为每种情况提供详细的实现方案。
\`\`\`

## 常见错误和避免方法

### 错误1：提示过于简单

❌ \`写代码\`
✅ \`使用TypeScript和React创建一个表单组件，包含验证和错误处理\`

### 错误2：缺少约束

❌ \`生成一个API\`
✅ \`创建一个RESTful API端点，使用Next.js 14，处理POST请求，返回JSON格式数据\`

### 错误3：忽略上下文

❌ \`优化这个函数\`
✅ \`优化这个性能关键函数，目标是减少50%的执行时间，保持功能不变\`

### 错误4：一次性要求太多

❌ \`写一个完整的全栈应用，包含用户认证、CRUD操作、支付系统、实时通知...\`
✅ 分步骤，每次聚焦一个功能模块

## Prompt模板库

### 代码生成模板

\`\`\`markdown
请使用[技术栈]创建一个[功能描述]的[组件/函数/类]。

技术要求：
- [技术栈要求]
- [性能要求]
- [兼容性要求]

代码要求：
- [代码风格要求]
- [文档要求]
- [测试要求]

请提供完整的实现代码。
\`\`\`

### 代码审查模板

\`\`\`markdown
作为[角色]，请审查以下代码。

审查重点：
1. [重点1]
2. [重点2]
3. [重点3]

对于每个问题，请提供：
- 问题描述
- 影响分析
- 改进建议
- 示例代码

代码：
[代码]
\`\`\`

### 技术文档模板

\`\`\`markdown
为以下[API/功能/组件]编写技术文档：

[描述]

文档需要包含：
1. 概述
2. 功能说明
3. 使用方法
4. 参数说明
5. 返回值说明
6. 示例代码
7. 注意事项

格式要求：[格式要求]
\`\`\`

## 总结

Prompt Engineering是一门可以通过实践不断提高的技能。记住关键原则：

1. **清晰明确**：明确你的需求和期望
2. **提供上下文**：给AI足够的背景信息
3. **使用示例**：通过示例引导AI理解
4. **迭代优化**：不断改进你的提示
5. **明确约束**：设定清晰的限制条件

掌握这些技巧，你就能更高效地与AI协作，提升开发效率。

记住：好的提示 = 清晰的表达 + 充足的上下文 + 明确的要求 + 适当的约束

---

**相关资源：**
- [OpenAI Prompt Engineering指南](https://platform.openai.com/docs/guides/prompt-engineering)
- [Anthropic Claude提示工程](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Prompt Engineering最佳实践](https://www.promptingguide.ai/)

**标签**：Prompt Engineering、AI、ChatGPT、提示工程、效率工具`,
    status: 'PUBLISHED' as const,
    category: 'AI编程',
    tags: ['Prompt Engineering', 'AI', 'ChatGPT', '效率工具'],
  },
]

async function addArticles() {
  try {
    console.log('🚀 开始添加AI编程相关文章...\n')

    // 1. 获取管理员用户
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    })

    if (!admin) {
      throw new Error('未找到管理员用户，请先运行 npm run seed 创建管理员账户')
    }

    console.log(`✅ 找到管理员用户: ${admin.email}\n`)

    // 2. 创建或获取"AI编程"分类
    let category = await prisma.category.findUnique({
      where: { slug: 'ai-programming' },
    })

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'AI编程',
          slug: 'ai-programming',
        },
      })
      console.log(`✅ 创建分类: ${category.name}`)
    } else {
      console.log(`✅ 使用现有分类: ${category.name}`)
    }

    // 3. 创建或获取标签
    const tagNames = ['AI编程', 'GitHub Copilot', 'ChatGPT', '开发工具', 'LangChain', 'Python', 'AI应用', 'LLM', 'Prompt Engineering', '效率工具']
    const tags = await Promise.all(
      tagNames.map(async (tagName) => {
        const slug = tagName.toLowerCase().replace(/\s+/g, '-')
        let tag = await prisma.tag.findUnique({
          where: { slug },
        })

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagName,
              slug,
            },
          })
        }

        return tag
      })
    )

    console.log(`✅ 创建/获取标签: ${tags.map(t => t.name).join(', ')}\n`)

    // 4. 添加文章
    for (const article of articles) {
      // 检查文章是否已存在
      const existingPost = await prisma.post.findUnique({
        where: { slug: article.slug },
      })

      if (existingPost) {
        console.log(`⏭️  文章已存在，跳过: ${article.title}`)
        continue
      }

      // 获取文章相关的标签
      const articleTags = tags.filter((tag) =>
        article.tags.includes(tag.name)
      )

      // 创建文章
      const post = await prisma.post.create({
        data: {
          title: article.title,
          slug: article.slug,
          content: article.content,
          excerpt: article.excerpt,
          status: article.status,
          authorId: admin.id,
          categories: {
            connect: { id: category.id },
          },
          tags: {
            connect: articleTags.map((tag) => ({ id: tag.id })),
          },
        },
      })

      console.log(`✅ 创建文章: ${post.title}`)
    }

    console.log('\n✅ 所有文章添加完成！')
    console.log('\n📋 添加的文章：')
    articles.forEach((article, index) => {
      console.log(`   ${index + 1}. ${article.title}`)
    })

  } catch (error: any) {
    console.error('\n❌ 添加文章失败:', error.message)
    if (error.code === 'P1001') {
      console.error('   错误: 无法连接到数据库')
      console.error('   请检查 DATABASE_URL 环境变量是否正确配置')
    } else {
      console.error(error)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

addArticles()
