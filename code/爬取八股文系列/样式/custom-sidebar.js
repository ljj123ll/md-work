// 侧边栏交互功能
(function() {
  // 全局侧边栏状态管理
  window.sidebarState = {
    allowAutoScroll: true,  // 是否允许侧边栏自动滚动
    isUserClick: false,     // 是否是用户点击操作
    lastClickTime: 0        // 上次点击时间
  };
  
  // 等待DOM加载完成
  document.addEventListener('DOMContentLoaded', function() {
    // 生成侧边栏目录
    generateSidebar();
    
    // 设置侧边栏切换功能（移动端）
    setupSidebarToggle();
    
    // 监听滚动，高亮当前章节
    setupScrollSpy();
    
    // 平滑滚动
    setupSmoothScroll();
  });
  
  // 生成侧边栏目录
  function generateSidebar() {
    // 检查是否已存在侧边栏容器
    let sidebarContainer = document.querySelector('.sidebar-container');
    
    if (!sidebarContainer) {
      // 创建侧边栏容器
      sidebarContainer = document.createElement('div');
      sidebarContainer.className = 'sidebar-container';
      document.body.insertBefore(sidebarContainer, document.body.firstChild);
      
      // 创建侧边栏标题
      const sidebarTitle = document.createElement('div');
      sidebarTitle.className = 'sidebar-title';
      sidebarTitle.textContent = '目录导航';
      sidebarContainer.appendChild(sidebarTitle);
      
      // 创建导航列表
      const navList = document.createElement('ul');
      navList.className = 'sidebar-nav';
      sidebarContainer.appendChild(navList);
      
      // 查找页面中的标题元素（h1, h2, h3等）
      const headings = document.querySelectorAll('h1, h2, h3, h4');
      
      // 遍历标题，构建目录结构
      let currentLevel = 1;
      let currentParent = navList;
      let parentStack = [navList];
      
      headings.forEach(heading => {
        // 获取标题级别
        const level = parseInt(heading.tagName.replace('H', ''));
        
        // 确保标题有id
        if (!heading.id) {
          heading.id = heading.textContent.trim().replace(/\s+/g, '-').toLowerCase();
        }
        
        // 创建目录项
        const navItem = document.createElement('li');
        const navLink = document.createElement('a');
        navLink.href = `#${heading.id}`;
        navLink.textContent = heading.textContent;
        navItem.appendChild(navLink);
        
        // 根据标题级别调整目录结构
        if (level > currentLevel) {
          // 向下一级
          const subMenu = document.createElement('ul');
          subMenu.className = 'sub-menu';
          parentStack[parentStack.length - 1].lastChild.appendChild(subMenu);
          parentStack.push(subMenu);
          subMenu.appendChild(navItem);
        } else if (level < currentLevel) {
          // 向上一级或多级
          parentStack.splice(level);
          parentStack[parentStack.length - 1].appendChild(navItem);
        } else {
          // 同一级别
          parentStack[parentStack.length - 1].appendChild(navItem);
        }
        
        currentLevel = level;
      });
    }
    
    // 为内容区域添加边距，避免被侧边栏遮挡
    const mainContent = document.querySelector('body > div');
    if (mainContent && !mainContent.classList.contains('main-content')) {
      mainContent.classList.add('main-content');
    }
    
    // 创建移动端侧边栏切换按钮
    if (!document.querySelector('.sidebar-toggle')) {
      const toggleButton = document.createElement('button');
      toggleButton.className = 'sidebar-toggle';
      toggleButton.innerHTML = '☰ 目录';
      document.body.appendChild(toggleButton);
    }
  }
  
  // 设置侧边栏切换功能
  function setupSidebarToggle() {
    const toggleButton = document.querySelector('.sidebar-toggle');
    const sidebarContainer = document.querySelector('.sidebar-container');
    const mainContent = document.querySelector('.main-content');
    
    if (toggleButton && sidebarContainer) {
      toggleButton.addEventListener('click', function() {
        sidebarContainer.classList.toggle('open');
      });
    }
    
    // 点击内容区域关闭侧边栏（移动端）
    if (mainContent && sidebarContainer) {
      mainContent.addEventListener('click', function() {
        if (window.innerWidth <= 768 && sidebarContainer.classList.contains('open')) {
          sidebarContainer.classList.remove('open');
        }
      });
    }
  }
  
  // 设置滚动监听，高亮当前章节
  function setupScrollSpy() {
    const sections = document.querySelectorAll('h1, h2, h3, h4');
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sidebarContainer = document.querySelector('.sidebar-container');
    
    // 创建状态管理对象
    const state = {
      isUserScrolling: false,     // 用户是否正在滚动页面
      isSidebarScrolling: false,  // 侧边栏是否正在自动滚动
      lastActiveSection: '',      // 上一个激活的章节
      scrollTimeout: null,        // 滚动超时定时器
      animationFrameId: null,     // 动画帧ID
      lastScrollPosition: 0       // 上一次滚动位置，用于检测滚动方向
    };
    
    // 检测当前可见的章节
    function getCurrentSection() {
      let current = '';
      
      // 优先选择在视口中最顶部的章节，特别优化向下滚动体验
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const viewportMiddle = window.pageYOffset + window.innerHeight / 3; // 使用视口1/3处作为判断点
        
        // 对于向下滚动，优先选择第一个顶部小于视口中间且距离视口最近的章节
        if (sectionTop <= viewportMiddle && 
            (!current || sectionTop > document.getElementById(current).offsetTop)) {
          current = section.getAttribute('id');
        }
      });
      
      // 如果没有找到合适的章节，回退到原来的逻辑
      if (!current) {
        let minDistance = Infinity;
        sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const distance = Math.abs(window.pageYOffset - (sectionTop - 100));
          
          if (distance < minDistance) {
            minDistance = distance;
            current = section.getAttribute('id');
          }
        });
      }
      
      return current;
    }
    
    // 更新高亮状态，但不立即滚动侧边栏
    function updateActiveLink(currentSection) {
      if (currentSection !== state.lastActiveSection) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
          }
        });
        state.lastActiveSection = currentSection;
        return true; // 返回true表示高亮项已更新
      }
      return false; // 返回false表示高亮项未更新
    }
    
    // 确保高亮项在侧边栏可视范围内（无动画版本，用于初始定位）
    function ensureActiveLinkVisibleImmediately() {
      // 检查是否允许自动滚动
      if (state.isSidebarScrolling || !window.sidebarState.allowAutoScroll) return;
      
      const activeLink = document.querySelector('.sidebar-nav a.active');
      if (activeLink && sidebarContainer) {
        const sidebarRect = sidebarContainer.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        
        // 增加缓冲区到80px，只有当高亮项完全不在可视范围内时才滚动
        const buffer = 80;
        if (linkRect.top < sidebarRect.top - buffer || linkRect.bottom > sidebarRect.bottom + buffer) {
          // 直接滚动到目标位置，无动画
          try {
            state.isSidebarScrolling = true;
            const scrollAmount = linkRect.top - sidebarRect.top - sidebarRect.height / 2 + linkRect.height / 2;
            sidebarContainer.scrollTop += scrollAmount;
            
            // 滚动完成后重置状态
            setTimeout(() => {
              state.isSidebarScrolling = false;
            }, 100);
          } catch (error) {
            console.error('Sidebar scroll error:', error);
            state.isSidebarScrolling = false;
          }
        }
      }
    }
    
    // 滚动监听处理函数
    function handleScroll() {
      // 清除之前的定时器
      if (state.scrollTimeout) {
        clearTimeout(state.scrollTimeout);
      }
      
      // 标记为用户正在滚动
      state.isUserScrolling = true;
      
      // 获取当前章节并更新高亮
      const currentSection = getCurrentSection();
      const highlightUpdated = updateActiveLink(currentSection);
      
      // 检测滚动方向
      const isScrollingDown = window.pageYOffset > (state.lastScrollPosition || 0);
      state.lastScrollPosition = window.pageYOffset;
      
      // 无论是向上滚动还是向下滚动，只要高亮项已更新，都立即尝试调整侧边栏
      if (highlightUpdated && window.sidebarState.allowAutoScroll) {
        // 使用requestAnimationFrame尽快调整侧边栏位置
        if (state.animationFrameId) {
          cancelAnimationFrame(state.animationFrameId);
        }
        state.animationFrameId = requestAnimationFrame(() => {
          ensureActiveLinkVisibleImmediately();
        });
      }
      
      // 用户停止滚动后，确保侧边栏位置正确
      state.scrollTimeout = setTimeout(() => {
        state.isUserScrolling = false;
        if (highlightUpdated && window.sidebarState.allowAutoScroll) {
          ensureActiveLinkVisibleImmediately();
        }
      }, 150); // 保持较短的防抖时间，提升响应速度
    }
    
    // 绑定滚动事件
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 导出必要的函数供其他地方使用
    window.ensureActiveLinkVisible = ensureActiveLinkVisibleImmediately;
  }
  
  // 设置平滑滚动
  function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sidebarContainer = document.querySelector('.sidebar-container');
    
    // 存储上一次点击的链接和点击时间
    let lastClickedLink = null;
    let lastClickTime = 0;
    const CLICK_THROTTLE = 500; // 点击节流时间（毫秒）
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const now = Date.now();
        // 节流：防止短时间内重复点击
        if (lastClickedLink === this && (now - lastClickTime < CLICK_THROTTLE)) {
          return;
        }
        
        lastClickedLink = this;
        lastClickTime = now;
        
        // 标记为用户点击操作，并暂时禁用侧边栏自动滚动
        window.sidebarState.isUserClick = true;
        window.sidebarState.allowAutoScroll = false;
        window.sidebarState.lastClickTime = now;
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // 高亮当前点击的链接
          navLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
          
          // 立即调整侧边栏，确保点击的链接可见
          // 这里直接执行，因为allowAutoScroll已经设为false，不会影响其他滚动
          const ensureActiveLinkVisible = window.ensureActiveLinkVisible || function() {
            const activeLink = document.querySelector('.sidebar-nav a.active');
            if (activeLink && sidebarContainer) {
              const sidebarRect = sidebarContainer.getBoundingClientRect();
              const linkRect = activeLink.getBoundingClientRect();
              const buffer = 60;
              if (linkRect.top < sidebarRect.top - buffer || linkRect.bottom > sidebarRect.bottom + buffer) {
                const scrollAmount = linkRect.top - sidebarRect.top - sidebarRect.height / 2 + linkRect.height / 2;
                sidebarContainer.scrollTop += scrollAmount;
              }
            }
          };
          ensureActiveLinkVisible();
          
          // 获取目标位置
          const targetPosition = targetElement.offsetTop - 20;
          
          // 使用requestAnimationFrame实现平滑滚动
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          const duration = 800; // 增加滚动持续时间到800ms，使滚动更平滑
          let startTime = null;
          
          function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
              requestAnimationFrame(animation);
            } else {
              // 滚动完成后重置状态
              setTimeout(() => {
                lastClickedLink = null;
                
                // 滚动完成后手动调整一次侧边栏位置（确保最终高亮项可见）
                ensureActiveLinkVisible();
                
                // 延迟恢复自动滚动功能，确保所有动画完成
                setTimeout(() => {
                  window.sidebarState.isUserClick = false;
                  window.sidebarState.allowAutoScroll = true;
                }, 300);
              }, 300);
            }
          }
          
          // 缓动函数
          function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
          }
          
          // 开始滚动动画
          requestAnimationFrame(animation);
          
          // 移动端点击后关闭侧边栏
          if (window.innerWidth <= 768 && sidebarContainer) {
            sidebarContainer.classList.remove('open');
          }
        } else {
          // 如果目标元素不存在，也要恢复自动滚动功能
          setTimeout(() => {
            window.sidebarState.isUserClick = false;
            window.sidebarState.allowAutoScroll = true;
          }, 500);
        }
      });
    });
  }
})();