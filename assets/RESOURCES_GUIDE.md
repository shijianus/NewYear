# 资源文件说明

本文件说明需要添加到项目中的资源文件。

## 音频资源 (assets/audio/)

### 必需文件列表

1. **bgm_solar.mp3**
   - 用途：阳历元旦背景音乐
   - 风格：轻快、现代、流行/电子风格
   - 时长：建议2-3分钟（可循环）
   - 音质：128kbps或更高

2. **bgm_lunar.mp3**
   - 用途：农历春节背景音乐
   - 风格：温暖、大气、包含民乐/管弦乐元素
   - 时长：建议2-3分钟（可循环）
   - 音质：128kbps或更高

3. **launch.mp3**
   - 用途：烟花发射音效
   - 时长：约1-2秒
   - 格式：MP3

4. **explosion_small.mp3**
   - 用途：小型烟花爆炸音效
   - 时长：约1-2秒
   - 格式：MP3

5. **explosion_large.mp3**
   - 用途：大型烟花爆炸音效
   - 时长：约2-3秒
   - 格式：MP3

6. **countdown_heartbeat.mp3**
   - 用途：倒计时心跳音效
   - 时长：约1秒
   - 格式：MP3

7. **finale_boom.mp3**
   - 用途：0点整震撼音效
   - 时长：约3-5秒
   - 格式：MP3

### 音频资源获取建议

**免费资源网站**:
- Freesound.org (需注册)
- Zapsplat.com
- Pixabay Audio
- YouTube Audio Library

**版权说明**:
- 使用CC0（无版权）或CC BY（署名）授权的音频
- 或使用自己制作的音效

## 图片资源 (assets/images/)

### 必需文件列表

1. **bg_solar.jpg**
   - 用途：阳历主题背景图
   - 尺寸：1920x1080或更大
   - 内容：现代城市夜景剪影
   - 风格：科技感、蓝色调
   - 格式：JPG（压缩以控制文件大小）

2. **bg_lunar.jpg**
   - 用途：阴历主题背景图
   - 尺寸：1920x1080或更大
   - 内容：中式窗棂、灯笼纹理或红纸质感
   - 风格：传统、红色/金色调
   - 格式：JPG（压缩以控制文件大小）

3. **favicon.png**
   - 用途：网站图标
   - 尺寸：32x32或64x64
   - 内容：烟花图标
   - 格式：PNG（支持透明背景）

### 图片资源制作建议

**背景图**:
- 可以使用AI图像生成工具（如Midjourney、DALL-E）
- 或从Unsplash、Pexels等免费图库下载
- 确保图片暗色调，不影响烟花显示

**Favicon**:
- 可以使用在线favicon生成器
- 或用Canvas/SVG绘制简单的烟花图案

## 字体资源 (assets/fonts/) - 可选

如需使用自定义字体，可以添加：

1. **custom-font.woff2**
   - 格式：WOFF2（推荐）或WOFF
   - 用途：中文/英文字体
   - 注意：字体文件较大，需谨慎使用

## 文件大小建议

为保证页面加载速度：

- **背景图**: < 500KB（JPG压缩）
- **Favicon**: < 10KB
- **BGM**: < 2MB/首
- **音效**: < 100KB/个

## 临时占位方案

如果暂时没有资源文件，系统会：
- 音频：静默失败（不影响核心功能）
- 图片：使用纯色背景代替

## 如何添加资源

1. 在项目根目录创建资源文件夹：
```bash
mkdir -p assets/audio assets/images assets/fonts
```

2. 将准备好的文件复制到对应目录

3. 验证文件名是否与代码中的引用一致

4. 测试页面是否能正确加载资源

## 资源检查脚本

可以使用以下命令检查资源文件：

```bash
# 检查音频文件
ls -lh assets/audio/*.mp3

# 检查图片文件
ls -lh assets/images/*.{jpg,png}

# 统计文件数量
echo "音频文件: $(ls assets/audio/ | wc -l)"
echo "图片文件: $(ls assets/images/ | wc -l)"
```
