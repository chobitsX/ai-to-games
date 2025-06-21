# 字母打地鼠游戏 - 安装指南

## 🚀 快速开始

### 方法一：使用脚本快速启动

1. **给脚本添加执行权限**
   ```bash
   chmod +x start-game.sh
   ```

2. **运行启动脚本**
   ```bash
   ./start-game.sh
   ```

### 方法二：手动安装

#### 1. 环境要求

确保你的系统已安装以下软件：

- **Node.js** (版本 16 或更高)
  - 下载地址：https://nodejs.org/
  - 验证安装：`node --version`

- **npm** (通常随 Node.js 一起安装)
  - 验证安装：`npm --version`

#### 2. 安装步骤

1. **克隆或下载项目**
   ```bash
   # 如果使用 Git
   git clone <repository-url>
   cd letter-game-augment-code
   
   # 或者直接下载并解压项目文件
   ```

2. **安装项目依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **打开浏览器**
   
   开发服务器启动后，会自动打开浏览器访问 `http://localhost:3000`
   
   如果没有自动打开，请手动在浏览器中访问该地址。

## 🛠️ 其他命令

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

### 代码检查
```bash
npm run lint
```

## 🔧 故障排除

### 常见问题

#### 1. Node.js 未安装
**错误信息**：`bash: node: command not found`

**解决方案**：
- 访问 https://nodejs.org/ 下载并安装 Node.js
- 选择 LTS (长期支持) 版本
- 安装完成后重启终端

#### 2. npm 未安装
**错误信息**：`bash: npm: command not found`

**解决方案**：
- npm 通常随 Node.js 一起安装
- 如果单独缺失，可以重新安装 Node.js
- 或者使用 yarn 作为替代：`yarn install` 和 `yarn dev`

#### 3. 端口被占用
**错误信息**：`Port 3000 is already in use`

**解决方案**：
- 关闭占用端口的其他应用
- 或者修改 `vite.config.js` 中的端口设置
- 或者在启动时指定端口：`npm run dev -- --port 3001`

#### 4. 依赖安装失败
**错误信息**：`npm ERR!` 相关错误

**解决方案**：
```bash
# 清理 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

#### 5. 浏览器兼容性问题
**现象**：游戏无法正常运行或显示异常

**解决方案**：
- 使用现代浏览器（Chrome 90+、Firefox 88+、Safari 14+、Edge 90+）
- 启用 JavaScript
- 清除浏览器缓存
- 检查浏览器控制台是否有错误信息

## 🌐 浏览器支持

| 浏览器 | 最低版本 | 推荐版本 |
|--------|----------|----------|
| Chrome | 90+ | 最新版本 |
| Firefox | 88+ | 最新版本 |
| Safari | 14+ | 最新版本 |
| Edge | 90+ | 最新版本 |

## 📱 移动设备支持

游戏支持移动设备访问，但建议使用键盘进行游戏以获得最佳体验。

在移动设备上：
- 可以正常浏览游戏界面
- 触摸操作有限
- 建议连接外接键盘

## 🎮 游戏要求

### 硬件要求
- **CPU**：现代双核处理器
- **内存**：至少 2GB RAM
- **显卡**：支持硬件加速的显卡
- **网络**：无需网络连接（本地运行）

### 软件要求
- **操作系统**：Windows 10+、macOS 10.15+、Linux（现代发行版）
- **浏览器**：见上方浏览器支持表
- **JavaScript**：必须启用

## 🔍 性能优化建议

1. **关闭不必要的浏览器标签页**
2. **确保浏览器硬件加速已启用**
3. **使用有线网络连接（如果需要）**
4. **关闭其他占用资源的应用程序**
5. **定期清理浏览器缓存**

## 📞 获取帮助

如果遇到问题：

1. **检查控制台错误**
   - 按 F12 打开开发者工具
   - 查看 Console 标签页中的错误信息

2. **查看网络状态**
   - 确保所有资源都正确加载
   - 检查 Network 标签页

3. **尝试硬刷新**
   - Windows/Linux: Ctrl + F5
   - macOS: Cmd + Shift + R

4. **重启浏览器**
   - 完全关闭浏览器后重新打开

## 🎯 开发模式功能

在开发模式下，游戏包含额外的调试功能：

- **性能监控**：点击左上角的监控按钮
- **控制台测试**：在浏览器控制台运行 `runGameTests()`
- **调试信息**：查看详细的游戏状态和性能数据

## 📦 部署到生产环境

如果需要部署到 Web 服务器：

1. **构建项目**
   ```bash
   npm run build
   ```

2. **上传 dist 目录**
   - 将 `dist` 目录中的所有文件上传到 Web 服务器
   - 确保服务器支持单页应用（SPA）路由

3. **配置服务器**
   - 设置正确的 MIME 类型
   - 启用 gzip 压缩
   - 配置缓存策略

---

**祝你游戏愉快！** 🎮✨
