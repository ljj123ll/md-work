// 侧边栏交互功能
(function() {
  // 全局侧边栏状态管理
  window.sidebarState = {
    allowAutoScroll: true,  // 是否允许侧边栏自动滚动
    isUserClick: false,     // 是否是用户点击操作
    lastClickTime: 0        // 上次点击时间
  };
  
  // 侧边栏状态管理
  let sidebarOpen = false;
  let activeSection = null;
  
  // DOM元素缓存
  let sidebarContainer = null;
  let sidebarToggle = null;
  let appContainer = null;
  let state = {
    isUserScrolling: false,     // 用户是否正在滚动页面
    isSidebarScrolling: false,  // 侧边栏是否正在自动滚动
    lastActiveSection: '',      // 上一个激活的章节
    scrollTimeout: null,        // 滚动超时定时器
    animationFrameId: null,     // 动画帧ID
    lastScrollPosition: 0       // 上一次滚动位置，用于检测滚动方向
  };
  
  // 页面加载完成后初始化侧边栏
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebar);
  } else {
    // 如果页面已经加载完成，直接初始化
    setTimeout(initSidebar, 100);
  }
  
  /**
   * 初始化侧边栏
   */
  function initSidebar() {
    // 创建侧边栏容器
    createSidebarHTML();
    
    // 缓存DOM元素
    sidebarContainer = document.querySelector('.sidebar-container');
    sidebarToggle = document.querySelector('.sidebar-toggle');
    appContainer = document.getElementById('app');
    
    // 初始化事件监听
    initEventListeners();
    
    // 生成目录结构
    generateTableOfContents();
    
    // 初始化活动状态
    updateActiveSection();
    
    // 为内容区域添加边距，避免被侧边栏遮挡
    const mainContent = getMainContentElement();
    if (mainContent && !mainContent.classList.contains('main-content')) {
      mainContent.classList.add('main-content');
    }
  }
  
  /**
   * 创建侧边栏HTML结构
   */
  function createSidebarHTML() {
    // 创建侧边栏切换按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle';
    toggleBtn.innerHTML = '☰';
    document.body.insertBefore(toggleBtn, document.body.firstChild);
    
    // 创建侧边栏容器
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar-container';
    
    // 创建侧边栏标题
    const sidebarTitle = document.createElement('div');
    sidebarTitle.className = 'sidebar-title';
    sidebarTitle.textContent = '高频篇目录';
    
    // 创建侧边栏导航
    const sidebarNav = document.createElement('ul');
    sidebarNav.className = 'sidebar-nav';
    
    // 组合侧边栏结构
    sidebar.appendChild(sidebarTitle);
    sidebar.appendChild(sidebarNav);
    document.body.insertBefore(sidebar, document.body.firstChild);
  }
  
  /**
   * 初始化事件监听器
   */
  function initEventListeners() {
    // 侧边栏切换按钮点击事件
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // 点击侧边栏外部关闭侧边栏（在移动端）
    document.addEventListener('click', function(event) {
      if (window.innerWidth <= 768 && 
          sidebarOpen && 
          !sidebarContainer.contains(event.target) && 
          !sidebarToggle.contains(event.target)) {
        closeSidebar();
      }
    });
    
    // 窗口大小变化时调整侧边栏状态
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        openSidebar(true); // 在桌面端强制打开，但不添加遮罩
      } else if (sidebarOpen) {
        // 保持移动端的当前状态
      }
    });
    
    // 滚动事件监听
    window.addEventListener('scroll', throttle(updateActiveSection, 50));
    
    // 监听目录点击事件，实现平滑滚动
    document.querySelector('.sidebar-nav').addEventListener('click', function(event) {
      if (event.target.tagName === 'A') {
        event.preventDefault();
        
        // 获取目标元素的ID
        const targetId = event.target.getAttribute('href').substring(1);
        let targetElement = document.getElementById(targetId);
        
        // 如果直接通过ID找不到，尝试通过文本内容匹配
        if (!targetElement) {
          const linkText = event.target.textContent.trim().toLowerCase();
          const allHeadings = getMainContentElement().querySelectorAll('h1, h2, h3, h4');
          
          for (let heading of allHeadings) {
            if (heading.textContent.trim().toLowerCase().includes(linkText) || 
                linkText.includes(heading.textContent.trim().toLowerCase())) {
              targetElement = heading;
              break;
            }
          }
        }
        
        if (targetElement) {
          // 标记为用户点击操作，并暂时禁用侧边栏自动滚动
          window.sidebarState.isUserClick = true;
          window.sidebarState.allowAutoScroll = false;
          window.sidebarState.lastClickTime = Date.now();
          
          // 高亮当前点击的链接
          const allLinks = document.querySelectorAll('.sidebar-nav a');
          allLinks.forEach(link => link.classList.remove('active'));
          event.target.classList.add('active');
          
          // 立即调整侧边栏，确保点击的链接可见
          ensureActiveLinkVisibleImmediately(event.target);
          
          // 平滑滚动到目标位置
          smoothScrollTo(targetElement);
          
          // 在移动端点击后关闭侧边栏
          if (window.innerWidth <= 768) {
            closeSidebar();
          }
          
          // 滚动完成后恢复自动滚动功能
          setTimeout(() => {
            window.sidebarState.isUserClick = false;
            window.sidebarState.allowAutoScroll = true;
          }, 1000);
        }
      }
    });
  }
  
  /**
   * 生成目录结构
   */
  function generateTableOfContents() {
    const nav = document.querySelector('.sidebar-nav');
    nav.innerHTML = ''; // 清空现有内容
    
    // 获取所有标题元素
    const headings = getMainContentElement().querySelectorAll('h1, h2, h3, h4');
    
    if (headings.length === 0) {
      // 如果没有找到标题，显示提示信息
      const emptyItem = document.createElement('li');
      const emptyLink = document.createElement('a');
      emptyLink.textContent = '暂无目录数据';
      emptyLink.style.pointerEvents = 'none';
      emptyItem.appendChild(emptyLink);
      nav.appendChild(emptyItem);
      return;
    }
    
    let currentParent = nav;
    let currentLevel = 0;
    let levelStack = [nav];
    
    // 遍历所有标题，构建目录层次结构
    headings.forEach((heading, index) => {
      // 为没有ID的标题添加ID
      if (!heading.id) {
        heading.id = 'heading-' + index;
      }
      
      // 获取标题级别 (1-4)
      const level = parseInt(heading.tagName.substring(1));
      
      // 创建目录项
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent.trim();
      
      // 如果标题级别比当前级别高，创建子菜单
      if (level > currentLevel && level <= currentLevel + 1) {
        const subMenu = document.createElement('ul');
        subMenu.className = 'sub-menu';
        currentParent.appendChild(subMenu);
        levelStack.push(subMenu);
        currentParent = subMenu;
        currentLevel = level;
      }
      // 如果标题级别比当前级别低，回退到对应级别的父菜单
      else if (level < currentLevel) {
        // 计算需要回退的级别数
        const levelsToPop = currentLevel - level;
        // 回退到对应级别的父菜单
        for (let i = 0; i < levelsToPop; i++) {
          if (levelStack.length > 1) { // 至少保留根菜单
            levelStack.pop();
          }
        }
        currentParent = levelStack[levelStack.length - 1];
        currentLevel = level;
      }
      
      // 添加目录项到当前父菜单
      listItem.appendChild(link);
      currentParent.appendChild(listItem);
    });
  }
  
  /**
   * 获取主要内容元素
   */
  function getMainContentElement() {
    // 首先查找main-content容器
    let mainContent = document.querySelector('.main-content');
    
    // 如果没找到，再查找主题容器内的主要内容
    if (!mainContent) {
      mainContent = document.querySelector('#app .theme-container > div:last-child');
    }
    
    // 如果还是没找到，尝试其他可能的选择器
    if (!mainContent) {
      mainContent = document.querySelector('#app .theme-container');
    }
    
    // 如果还是没找到，返回app容器
    if (!mainContent) {
      mainContent = document.getElementById('app');
    }
    
    // 最后尝试body直接子元素
    if (!mainContent) {
      mainContent = document.querySelector('body > div');
    }
    
    return mainContent;
  }
  
  /**
   * 切换侧边栏显示状态
   */
  function toggleSidebar() {
    if (sidebarOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
  
  /**
   * 打开侧边栏
   * @param {boolean} forceNoOverlay - 是否强制不添加遮罩
   */
  function openSidebar(forceNoOverlay = false) {
    sidebarContainer.classList.add('open');
    sidebarToggle.innerHTML = '✕';
    sidebarOpen = true;
    
    // 在移动端添加遮罩效果
    if (window.innerWidth <= 768 && !forceNoOverlay) {
      sidebarContainer.style.boxShadow = '0 0 0 1000px rgba(0, 0, 0, 0.5)';
    } else {
      sidebarContainer.style.boxShadow = '2px 0 15px rgba(0, 0, 0, 0.2)';
    }
  }
  
  /**
   * 关闭侧边栏
   */
  function closeSidebar() {
    sidebarContainer.classList.remove('open');
    sidebarToggle.innerHTML = '☰';
    sidebarOpen = false;
    sidebarContainer.style.boxShadow = '2px 0 15px rgba(0, 0, 0, 0.2)';
  }
  
  /**
   * 更新活动章节高亮状态
   */
  function updateActiveSection() {
    // 清除之前的定时器
    if (state.scrollTimeout) {
      clearTimeout(state.scrollTimeout);
    }
    
    // 标记为用户正在滚动
    state.isUserScrolling = true;
    
    const sections = getMainContentElement().querySelectorAll('h1, h2, h3, h4');
    
    // 获取当前章节
    const currentSection = getCurrentSection(sections);
    
    // 如果找到了当前章节且与之前不同，更新活动状态
    if (currentSection) {
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
    }
    
    // 用户停止滚动后，确保侧边栏位置正确
    state.scrollTimeout = setTimeout(() => {
      state.isUserScrolling = false;
      if (window.sidebarState.allowAutoScroll) {
        ensureActiveLinkVisibleImmediately();
      }
    }, 150); // 保持较短的防抖时间，提升响应速度
  }
  
  /**
   * 检测当前可见的章节
   * @param {NodeList} sections - 所有章节元素
   * @returns {HTMLElement|null} - 当前可见的章节元素
   */
  function getCurrentSection(sections) {
    if (!sections || sections.length === 0) return null;
    
    let current = null;
    
    // 优先选择在视口中最顶部的章节，特别优化向下滚动体验
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const viewportMiddle = window.pageYOffset + window.innerHeight / 3; // 使用视口1/3处作为判断点
      
      // 对于向下滚动，优先选择第一个顶部小于视口中间且距离视口最近的章节
      if (sectionTop <= viewportMiddle && 
          (!current || sectionTop > current.offsetTop)) {
        current = section;
      }
    });
    
    // 如果没有找到合适的章节，回退到原来的逻辑
    if (!current) {
      let minDistance = Infinity;
      
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        
        // 当前章节距离顶部小于等于100px时，认为当前可见
        if (sectionTop <= 100) {
          const distance = Math.abs(sectionTop);
          if (distance < minDistance) {
            minDistance = distance;
            current = section;
          }
        }
      });
    }
    
    return current;
  }
  
  /**
   * 更新高亮状态
   * @param {HTMLElement} currentSection - 当前章节元素
   * @returns {boolean} - 高亮项是否已更新
   */
  function updateActiveLink(currentSection) {
    if (!currentSection) return false;
    
    const currentSectionId = currentSection.id || 
      `section-${currentSection.textContent.trim().substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`;
    
    if (currentSectionId !== state.lastActiveSection) {
      // 移除之前章节的活动状态
      if (state.lastActiveSection) {
        const prevLinks = document.querySelectorAll('.sidebar-nav a.active');
        prevLinks.forEach(link => link.classList.remove('active'));
      }
      
      // 添加当前章节的活动状态
      // 由于我们不能保证链接的href与section的id完全匹配，我们使用更灵活的匹配方式
      const currentLinks = findMatchingLinks(currentSection);
      currentLinks.forEach(link => link.classList.add('active'));
      
      state.lastActiveSection = currentSectionId;
      return true; // 返回true表示高亮项已更新
    }
    return false; // 返回false表示高亮项未更新
  }
  
  /**
   * 确保高亮项在侧边栏可视范围内（无动画版本，用于初始定位）
   * @param {HTMLElement|null} activeLink - 可选的特定高亮元素
   */
  function ensureActiveLinkVisibleImmediately(activeLink = null) {
    // 检查是否允许自动滚动
    if (state.isSidebarScrolling || !window.sidebarState.allowAutoScroll) return;
    
    if (!activeLink) {
      activeLink = document.querySelector('.sidebar-nav a.active');
    }
    
    const container = sidebarContainer.querySelector('.sidebar-nav');
    
    if (activeLink && container) {
      const containerRect = container.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      
      // 增加缓冲区到80px，只有当高亮项完全不在可视范围内时才滚动
      const buffer = 80;
      if (linkRect.top < containerRect.top - buffer || linkRect.bottom > containerRect.bottom + buffer) {
        // 直接滚动到目标位置，无动画
        try {
          state.isSidebarScrolling = true;
          const scrollAmount = linkRect.top - containerRect.top - containerRect.height / 2 + linkRect.height / 2;
          container.scrollTop += scrollAmount;
          
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
  
  /**
   * 查找与当前章节匹配的链接
   * @param {HTMLElement} section - 当前章节元素
   * @returns {Array} - 匹配的链接元素数组
   */
  function findMatchingLinks(section) {
    const links = document.querySelectorAll('.sidebar-nav a');
    const sectionText = section.textContent.trim().toLowerCase();
    const matchingLinks = [];
    
    links.forEach(link => {
      const linkText = link.textContent.trim().toLowerCase();
      // 如果链接文本与章节文本有较高的相似度，则认为是匹配的
      if (sectionText.includes(linkText) || linkText.includes(sectionText)) {
        matchingLinks.push(link);
      }
    });
    
    return matchingLinks;
  }
  
  /**
   * 平滑滚动到指定元素
   * @param {HTMLElement} targetElement - 目标元素
   */
  function smoothScrollTo(targetElement) {
    // 计算目标元素相对于视口的位置
    const targetPosition = targetElement.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - 80; // 减去80px的偏移量，避免内容被顶部遮挡
    const duration = 800; // 增加滚动持续时间到800ms，使滚动更平滑
    let startTime = null;
    
    // 使用requestAnimationFrame实现平滑滚动
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        // 滚动完成后，确保高亮项可见
        setTimeout(() => {
          ensureActiveLinkVisibleImmediately();
        }, 100);
      }
    }
    
    // 缓动函数，使滚动更自然
    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    // 开始滚动动画
    requestAnimationFrame(animation);
  }
  
  /**
   * 防抖函数
   * @param {Function} func - 要执行的函数
   * @param {number} wait - 等待时间（毫秒）
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * 节流函数
   * @param {Function} func - 要执行的函数
   * @param {number} limit - 时间限制（毫秒）
   */
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // 导出必要的函数供其他地方使用
  window.ensureActiveLinkVisible = ensureActiveLinkVisibleImmediately;
})();