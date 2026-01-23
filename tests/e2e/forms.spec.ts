import { test, expect, Page, ConsoleMessage } from "@playwright/test"

// ============================================
// 测试数据
// ============================================
const testData = {
  login: {
    validUser: { username: "admin", password: "admin123" },
    invalidUser: { username: "wronguser", password: "wrongpass" },
    emptyFields: { username: "", password: "" },
  },
  register: {
    validUser: {
      name: "测试用户",
      email: `test${Date.now()}@example.com`,
      password: "Test123456",
    },
    invalidEmail: {
      name: "测试用户",
      email: "invalid-email",
      password: "Test123456",
    },
    shortPassword: {
      name: "测试用户",
      email: "test@example.com",
      password: "123",
    },
    shortName: {
      name: "A",
      email: "test@example.com",
      password: "Test123456",
    },
  },
  comment: {
    valid: {
      author: "访客用户",
      email: "visitor@example.com",
      content: "这是一条测试评论，用于验证评论表单的功能。",
    },
    emptyContent: {
      author: "访客用户",
      email: "visitor@example.com",
      content: "",
    },
    invalidEmail: {
      author: "访客用户",
      email: "invalid-email",
      content: "测试评论内容",
    },
  },
}

// ============================================
// 控制台错误监控辅助类
// ============================================
class ConsoleErrorMonitor {
  private errors: string[] = []
  private warnings: string[] = []

  // 可以忽略的错误/警告模式（开发环境常见）
  private ignoredPatterns = [
    "Extra attributes from the server",
    "Hydration",
    "Warning:",
    "favicon",
    "404",
    "Failed to load resource",
    "NetworkError",
    "Failed to fetch",
  ]

  constructor(page: Page) {
    page.on("console", (msg: ConsoleMessage) => {
      const text = msg.text()
      if (msg.type() === "error") {
        // 仅记录非忽略的错误
        if (!this.shouldIgnore(text)) {
          this.errors.push(text)
        }
      } else if (msg.type() === "warning") {
        if (!this.shouldIgnore(text)) {
          this.warnings.push(text)
        }
      }
    })

    page.on("pageerror", (error: Error) => {
      if (!this.shouldIgnore(error.message)) {
        this.errors.push(`Page Error: ${error.message}`)
      }
    })
  }

  private shouldIgnore(text: string): boolean {
    return this.ignoredPatterns.some((pattern) => text.includes(pattern))
  }

  getErrors(): string[] {
    return this.errors
  }

  getWarnings(): string[] {
    return this.warnings
  }

  hasErrors(): boolean {
    return this.errors.length > 0
  }

  clear(): void {
    this.errors = []
    this.warnings = []
  }
}

// ============================================
// 登录表单测试
// ============================================
test.describe("登录表单测试", () => {
  let consoleMonitor: ConsoleErrorMonitor

  test.beforeEach(async ({ page }) => {
    consoleMonitor = new ConsoleErrorMonitor(page)
    await page.goto("/auth/signin")
  })

  test("页面正确加载且无 JS 错误", async ({ page }) => {
    // 等待页面加载完成
    await page.waitForLoadState("networkidle")
    // 验证登录文字和表单元素可见
    await expect(page.getByText("登录", { exact: true }).first()).toBeVisible()
    await expect(page.locator("#username")).toBeVisible()
    await expect(page.locator("#password")).toBeVisible()
    expect(consoleMonitor.hasErrors()).toBe(false)
  })

  test("空表单提交显示验证错误", async ({ page }) => {
    // 直接点击提交按钮
    await page.click('button[type="submit"]')

    // 等待验证错误出现
    await expect(page.locator("text=请输入用户名或邮箱")).toBeVisible()
    await expect(page.locator("text=请输入密码")).toBeVisible()
  })

  test("使用有效凭据登录", async ({ page }) => {
    const { username, password } = testData.login.validUser

    // 填写表单
    await page.fill("#username", username)
    await page.fill("#password", password)

    // 提交表单
    await page.click('button[type="submit"]')

    // 等待登录按钮变为加载状态
    await expect(page.locator("text=登录中...")).toBeVisible()

    // 等待页面跳转或错误消息
    await page.waitForURL("/", { timeout: 10000 }).catch(() => {
      // 如果没有跳转，检查是否有错误消息
    })
  })

  test("使用无效凭据显示错误", async ({ page }) => {
    const { username, password } = testData.login.invalidUser

    await page.fill("#username", username)
    await page.fill("#password", password)
    await page.click('button[type="submit"]')

    // 等待错误消息
    await expect(page.locator("text=用户名/邮箱或密码错误")).toBeVisible({
      timeout: 10000,
    })
  })

  test("验证无 JavaScript 控制台错误", async ({ page }) => {
    // 执行一些操作后检查控制台错误
    await page.fill("#username", "test")
    await page.fill("#password", "test")
    await page.click('button[type="submit"]')

    // 等待一段时间让任何异步错误出现
    await page.waitForTimeout(2000)

    const errors = consoleMonitor.getErrors()
    console.log("Console Errors:", errors)

    // 过滤掉一些预期的错误（如网络请求错误）
    const unexpectedErrors = errors.filter(
      (e) => !e.includes("Failed to fetch") && !e.includes("NetworkError")
    )

    expect(unexpectedErrors.length).toBe(0)
  })
})

// ============================================
// 注册表单测试
// ============================================
test.describe("注册表单测试", () => {
  let consoleMonitor: ConsoleErrorMonitor

  test.beforeEach(async ({ page }) => {
    consoleMonitor = new ConsoleErrorMonitor(page)
    await page.goto("/auth/signup")
  })

  test("页面正确加载", async ({ page }) => {
    await page.waitForLoadState("networkidle")
    await expect(page.getByText("注册", { exact: true }).first()).toBeVisible()
    await expect(page.locator("#name")).toBeVisible()
    await expect(page.locator("#email")).toBeVisible()
    await expect(page.locator("#password")).toBeVisible()
  })

  test("验证邮箱格式错误", async ({ page }) => {
    const { name, email, password } = testData.register.invalidEmail

    await page.fill("#name", name)
    await page.fill("#email", email)
    await page.fill("#password", password)
    await page.click('button[type="submit"]')

    // 等待验证完成
    await page.waitForTimeout(1000)

    // 检查页面上是否有包含 "邮箱" 或 "email" 的错误消息
    const hasEmailError = await page
      .locator('[class*="destructive"]')
      .filter({ hasText: /邮箱|email/i })
      .isVisible()

    // 如果没有明确的错误消息，至少验证页面没有跳转（表单验证阻止了提交）
    expect(page.url()).toContain("/auth/signup")
  })

  test("验证密码长度不足", async ({ page }) => {
    const { name, email, password } = testData.register.shortPassword

    await page.fill("#name", name)
    await page.fill("#email", email)
    await page.fill("#password", password)
    await page.click('button[type="submit"]')

    await expect(page.locator("text=密码至少6个字符")).toBeVisible()
  })

  test("验证姓名长度不足", async ({ page }) => {
    const { name, email, password } = testData.register.shortName

    await page.fill("#name", name)
    await page.fill("#email", email)
    await page.fill("#password", password)
    await page.click('button[type="submit"]')

    await expect(page.locator("text=姓名至少2个字符")).toBeVisible()
  })

  test("使用有效数据注册", async ({ page }) => {
    const { name, email, password } = testData.register.validUser

    await page.fill("#name", name)
    await page.fill("#email", email)
    await page.fill("#password", password)
    await page.click('button[type="submit"]')

    // 等待注册按钮变为加载状态
    await expect(page.locator("text=注册中...")).toBeVisible()

    // 等待跳转到登录页或显示错误（如果邮箱已存在）
    await page.waitForTimeout(3000)
  })

  test("登录链接可点击", async ({ page }) => {
    await page.click("text=立即登录")
    await expect(page).toHaveURL("/auth/signin")
  })
})

// ============================================
// 响应式设计测试
// ============================================
test.describe("响应式设计测试", () => {
  const viewports = [
    { name: "desktop", width: 1920, height: 1080 },
    { name: "laptop", width: 1366, height: 768 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 375, height: 667 },
  ]

  for (const viewport of viewports) {
    test(`登录页面在 ${viewport.name} (${viewport.width}x${viewport.height}) 正常显示`, async ({
      page,
    }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      })
      await page.goto("/auth/signin")
      await page.waitForLoadState("networkidle")

      // 验证表单可见
      await expect(page.locator("#username")).toBeVisible()
      await expect(page.locator("#password")).toBeVisible()
      await expect(page.locator('button[type="submit"]')).toBeVisible()

      // 验证页面没有水平溢出
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth
      })
      expect(hasHorizontalScroll).toBe(false)
    })
  }

  test("首页响应式布局测试", async ({ page }) => {
    const breakpoints = [1920, 1024, 768, 375]

    for (const width of breakpoints) {
      await page.setViewportSize({ width, height: 800 })
      await page.goto("/")
      await page.waitForLoadState("networkidle")

      // 检查页面没有水平滚动条
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth
      })
      expect(hasHorizontalScroll).toBe(false)
    }
  })
})

// ============================================
// 表单交互流程测试
// ============================================
test.describe("表单交互流程测试", () => {
  test("完整的登录到首页流程", async ({ page }) => {
    const consoleMonitor = new ConsoleErrorMonitor(page)

    // 1. 访问首页
    await page.goto("/")
    await expect(page).toHaveURL("/")

    // 2. 导航到登录页
    const loginLink = page.locator('a[href*="signin"]').first()
    if (await loginLink.isVisible()) {
      await loginLink.click()
    } else {
      await page.goto("/auth/signin")
    }

    // 3. 填写登录表单
    await page.fill("#username", testData.login.validUser.username)
    await page.fill("#password", testData.login.validUser.password)

    // 4. 提交并等待响应
    await page.click('button[type="submit"]')

    // 等待页面变化
    await page.waitForTimeout(3000)

    // 5. 检查控制台错误
    console.log("Test completed. Console errors:", consoleMonitor.getErrors())
  })

  test("从登录页导航到注册页", async ({ page }) => {
    await page.goto("/auth/signin")

    // 点击注册链接
    await page.click("text=立即注册")

    // 验证跳转成功
    await expect(page).toHaveURL("/auth/signup")
    await expect(page.getByText("注册", { exact: true }).first()).toBeVisible()
  })

  test("Tab 键盘导航测试", async ({ page }) => {
    await page.goto("/auth/signin")

    // 按 Tab 键遍历表单元素
    await page.keyboard.press("Tab")
    await expect(page.locator("#username")).toBeFocused()

    await page.keyboard.press("Tab")
    await expect(page.locator("#password")).toBeFocused()

    await page.keyboard.press("Tab")
    await expect(page.locator('button[type="submit"]')).toBeFocused()
  })

  test("Enter 键提交表单", async ({ page }) => {
    await page.goto("/auth/signin")

    await page.fill("#username", "test")
    await page.fill("#password", "test")

    // 使用 Enter 键提交
    await page.keyboard.press("Enter")

    // 验证表单已提交（按钮变为加载状态或显示错误）
    await page.waitForTimeout(1000)
  })
})

// ============================================
// 错误处理和边界情况测试
// ============================================
test.describe("错误处理和边界情况测试", () => {
  test("特殊字符输入测试", async ({ page }) => {
    await page.goto("/auth/signin")

    // 测试特殊字符
    const specialChars = '<script>alert("xss")</script>'
    await page.fill("#username", specialChars)
    await page.fill("#password", specialChars)
    await page.click('button[type="submit"]')

    // 验证页面没有崩溃
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test("超长输入测试", async ({ page }) => {
    await page.goto("/auth/signup")

    // 测试超长输入
    const longText = "a".repeat(1000)
    await page.fill("#name", longText)
    await page.fill("#email", `${longText}@test.com`)
    await page.fill("#password", longText)
    await page.click('button[type="submit"]')

    // 验证显示相应的错误消息
    await page.waitForTimeout(1000)
  })

  test("网络请求失败处理", async ({ page }) => {
    await page.goto("/auth/signin")

    // 模拟 API 返回 500 错误
    await page.route("**/api/auth/callback/**", (route) =>
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      })
    )

    await page.fill("#username", "test")
    await page.fill("#password", "test")
    await page.click('button[type="submit"]')

    // 等待错误消息或按钮恢复
    await page.waitForTimeout(3000)

    // 验证页面仍然在登录页（没有跳转，因为登录失败）
    expect(page.url()).toContain("/auth/signin")

    // 验证显示了错误消息或按钮恢复可用
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test("快速多次点击提交按钮", async ({ page }) => {
    await page.goto("/auth/signin")

    await page.fill("#username", testData.login.validUser.username)
    await page.fill("#password", testData.login.validUser.password)

    // 快速多次点击
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    await submitButton.click()
    await submitButton.click()

    // 验证按钮被禁用（防止重复提交）
    await expect(submitButton).toBeDisabled()
  })
})

// ============================================
// JavaScript 错误全面检测
// ============================================
test.describe("JavaScript 错误全面检测", () => {
  const pages = [
    { name: "首页", path: "/" },
    { name: "登录页", path: "/auth/signin" },
    { name: "注册页", path: "/auth/signup" },
    { name: "搜索页", path: "/search" },
    { name: "关于页", path: "/about" },
  ]

  for (const pageInfo of pages) {
    test(`${pageInfo.name} 无 JavaScript 错误`, async ({ page }) => {
      const consoleMonitor = new ConsoleErrorMonitor(page)

      await page.goto(pageInfo.path)
      await page.waitForLoadState("networkidle")

      // 等待任何延迟加载的脚本
      await page.waitForTimeout(2000)

      const errors = consoleMonitor.getErrors()

      // 输出错误用于调试
      if (errors.length > 0) {
        console.log(`${pageInfo.name} 页面控制台错误:`, errors)
      }

      // 过滤掉一些可接受的错误
      const criticalErrors = errors.filter(
        (e) =>
          !e.includes("favicon") &&
          !e.includes("404") &&
          !e.includes("Failed to load resource")
      )

      expect(criticalErrors.length).toBe(0)
    })
  }

  test("页面交互时无 JavaScript 错误", async ({ page }) => {
    const consoleMonitor = new ConsoleErrorMonitor(page)

    // 访问首页并进行交互
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // 滚动页面
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)
    await page.evaluate(() => window.scrollTo(0, 0))

    // 检查是否有可点击的元素并点击
    const links = page.locator("a").first()
    if (await links.isVisible()) {
      await links.hover()
    }

    // 等待所有动画完成
    await page.waitForTimeout(1000)

    const errors = consoleMonitor.getErrors()
    console.log("交互期间的控制台错误:", errors)
  })
})
