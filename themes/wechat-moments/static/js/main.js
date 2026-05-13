/**
 * 微信朋友圈主题 - JavaScript
 * WeChat Moments Theme
 */
(function () {
  'use strict';

  // ============================================
  // 1. 暗色模式管理器
  //    - 读取本地存储的主题设置
  //    - 点击按钮切换亮色/暗色
  //    - 滚动后显示切换按钮
  // ============================================
  const ThemeManager = {
    init() {
      const toggle = document.getElementById('themeToggle');
      if (!toggle) return;

      // 读取本地存储的主题，如果没有则跟随系统
      const saved = localStorage.getItem('theme');
      if (saved) {
        this.setTheme(saved);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setTheme('dark');
      }

      // 点击切换主题
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        this.setTheme(current === 'dark' ? 'light' : 'dark');
      });

      // 滚动超过100px时显示切换按钮
      window.addEventListener('scroll', () => {
        toggle.classList.toggle('visible', window.scrollY > 100);
      }, { passive: true });
    },

    // 设置主题并保存到本地存储
    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  };

  // ============================================
  // 2. 相对时间格式化
  //    - 将日期转换为"刚刚"、"5分钟前"等友好格式
  //    - 每分钟自动更新一次
  // ============================================
  const TimeFormatter = {
    init() {
      this.formatAll();
      // 每60秒更新一次时间显示
      setInterval(() => this.formatAll(), 60000);
    },

    // 格式化所有时间元素
    formatAll() {
      document.querySelectorAll('.moment-time').forEach(el => {
        const datetime = el.getAttribute('datetime');
        if (datetime) el.textContent = this.format(datetime);
      });
    },

    // 格式化单个时间
    format(dateStr) {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (minutes < 1) return '刚刚';
      if (minutes < 60) return minutes + '分钟前';
      if (hours < 24) return hours + '小时前';
      if (days < 2) return '昨天';
      if (days < 7) return days + '天前';
      return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
    }
  };

  // ============================================
  // 3. 图片灯箱
  //    - 点击图片放大查看
  //    - 支持左右切换（按钮和键盘方向键）
  //    - 显示图片计数器
  //    - ESC键或点击遮罩关闭
  // ============================================
  const Lightbox = {
    init() {
      this.overlay = document.getElementById('lightbox');
      this.image = document.getElementById('lightboxImage');
      this.counter = document.getElementById('lightboxCounter');
      if (!this.overlay) return;
      this.images = [];
      this.index = 0;

      // 绑定图片点击事件
      document.querySelectorAll('.image-item a').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.open(link);
        });
      });

      // 关闭、上一张、下一张按钮
      document.getElementById('lightboxClose').addEventListener('click', () => this.close());
      document.getElementById('lightboxPrev').addEventListener('click', () => this.prev());
      document.getElementById('lightboxNext').addEventListener('click', () => this.next());

      // 键盘快捷键
      document.addEventListener('keydown', (e) => {
        if (!this.overlay.classList.contains('active')) return;
        if (e.key === 'Escape') this.close();       // ESC关闭
        if (e.key === 'ArrowLeft') this.prev();       // 左箭头上一张
        if (e.key === 'ArrowRight') this.next();      // 右箭头下一张
      });

      // 点击遮罩层关闭
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay || e.target.classList.contains('lightbox-container')) {
          this.close();
        }
      });
    },

    // 打开灯箱，获取同组图片
    open(link) {
      const group = link.getAttribute('data-lightbox');
      this.images = Array.from(document.querySelectorAll('[data-lightbox="' + group + '"]')).map(a => a.href);
      this.index = this.images.indexOf(link.href);
      this.show();
    },

    // 显示当前图片
    show() {
      this.image.src = this.images[this.index];
      this.counter.textContent = (this.index + 1) + ' / ' + this.images.length;
      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';  // 禁止背景滚动
    },

    // 关闭灯箱
    close() {
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
    },

    // 上一张（循环）
    prev() {
      this.index = (this.index - 1 + this.images.length) % this.images.length;
      this.show();
    },

    // 下一张（循环）
    next() {
      this.index = (this.index + 1) % this.images.length;
      this.show();
    }
  };

  // ============================================
  // 4. 音乐播放器
  //    - 点击播放/暂停音乐
  //    - 同时只播放一首音乐
  //    - 自动从封面提取颜色作为渐变背景
  // ============================================
  const MusicPlayer = {
    init() {
      document.querySelectorAll('.moment-music').forEach(container => {
        const btn = container.querySelector('.music-play-btn');
        const audio = container.querySelector('.music-audio');
        const cover = container.querySelector('.music-cover-left img');
        const gradient = container.querySelector('.music-gradient-right');
        if (!btn || !audio) return;

        // 从封面图片提取颜色
        if (cover && cover.complete) this.extractColor(cover, gradient);
        else if (cover) cover.addEventListener('load', () => this.extractColor(cover, gradient));

        // 点击播放/暂停
        btn.addEventListener('click', () => {
          if (audio.paused) {
            // 暂停其他正在播放的音乐
            document.querySelectorAll('.music-audio').forEach(a => {
              if (a !== audio) {
                a.pause();
                a.closest('.moment-music').querySelector('.music-play-btn').classList.remove('playing');
              }
            });
            audio.play();
            btn.classList.add('playing');
          } else {
            audio.pause();
            btn.classList.remove('playing');
          }
        });

        // 播放结束恢复按钮状态
        audio.addEventListener('ended', () => btn.classList.remove('playing'));
        audio.addEventListener('error', () => console.error('音频加载失败:', audio.src));
      });
    },

    // 从封面图片提取主色，设置为渐变背景
    extractColor(img, el) {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 84;
        canvas.height = 84;
        ctx.drawImage(img, 0, 0, 84, 84);
        const data = ctx.getImageData(0, 0, 84, 84).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 16) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        el.style.background = 'linear-gradient(to right, rgb(' + r + ',' + g + ',' + b + ') 0%, rgba(' + r + ',' + g + ',' + b + ',0) 100%)';
      } catch (e) {}
    }
  };

  // ============================================
  // 5. 操作菜单（赞/评论）
  //    - 点击两个点按钮弹出菜单
  //    - 菜单在按钮左边横向显示
  //    - 点赞：空心爱心变红色实心
  //    - 点击外部关闭菜单
  // ============================================
  const ActionMenu = {
    init() {
      // 点击展开按钮显示/隐藏菜单
      document.querySelectorAll('.action-expand').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const wrapper = btn.closest('.action-menu-wrapper');
          const popup = wrapper.querySelector('.action-menu-popup');

          // 关闭其他已打开的菜单
          document.querySelectorAll('.action-menu-popup.show').forEach(p => {
            if (p !== popup) p.classList.remove('show');
          });

          // 切换当前菜单
          popup.classList.toggle('show');
        });
      });

      // 点赞按钮：点击变红/取消
      document.querySelectorAll('.action-like').forEach(btn => {
        btn.addEventListener('click', () => {
          const svg = btn.querySelector('svg');
          const isLiked = btn.classList.toggle('liked');
          if (isLiked) {
            // 点赞：爱心变红色实心
            svg.setAttribute('fill', '#ff6b6b');
            svg.setAttribute('stroke', '#ff6b6b');
          } else {
            // 取消点赞：恢复空心
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
          }
        });
      });

      // 点击页面其他区域关闭菜单
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.action-menu-wrapper')) {
          document.querySelectorAll('.action-menu-popup.show').forEach(p => {
            p.classList.remove('show');
          });
        }
      });
    }
  };

  // ============================================
  // 6. 加载更多（首页分页）
  //    - 初始只显示前5篇文章
  //    - 滚动到底部显示"正在加载..."
  //    - 800ms后加载下一批5篇
  //    - 全部加载完后隐藏加载提示
  // ============================================
  const LoadingIndicator = {
    init() {
      const list = document.getElementById('momentsList');
      if (!list) return;

      // 只显示前5篇，隐藏其余
      const cards = list.querySelectorAll('.moment-card');
      if (cards.length > 5) {
        cards.forEach((card, i) => {
          if (i >= 5) card.style.display = 'none';
        });
      }

      // 滚动到底部加载更多
      const loadMore = document.getElementById('loadMoreIndicator');
      if (loadMore && cards.length > 5) {
        let shown = 5;
        let loading = false;
        window.addEventListener('scroll', () => {
          if (loading) return;
          // 距离底部100px时触发加载
          if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            loadMore.classList.add('visible');
            loading = true;
            setTimeout(() => {
              let count = 0;
              cards.forEach((card, i) => {
                if (i >= shown && i < shown + 5) {
                  card.style.display = '';
                  count++;
                }
              });
              shown += count;
              loading = false;
              // 全部加载完隐藏加载提示
              if (shown >= cards.length) {
                loadMore.classList.remove('visible');
              }
            }, 800);
          }
        }, { passive: true });
      }
    }
  };

  // ============================================
  // 初始化所有模块
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();      // 暗色模式
    TimeFormatter.init();     // 相对时间
    Lightbox.init();          // 图片灯箱
    MusicPlayer.init();       // 音乐播放器
    ActionMenu.init();        // 赞/评论菜单
    LoadingIndicator.init();  // 加载更多
  });
})();
