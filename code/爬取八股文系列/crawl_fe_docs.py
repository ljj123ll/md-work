from playwright.sync_api import sync_playwright
import os
import urllib.parse
from urllib.parse import urljoin, urlparse
import time

def init_download_folder(folder_name="fe_docs_html"):
    """初始化下载文件夹，不存在则创建"""
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)
    return folder_name

def is_target_html_url(url, base_domain="interview.poetries.top", target_path="fe-base-docs"):
    """
    判断URL是否为目标HTML文件：
    1. 域名是目标域名（interview.poetries.top）
    2. 路径包含目标文档根路径（fe-base-docs）
    3. 是HTML文件（路径以.html结尾，或无后缀但逻辑上是HTML页面）
    """
    parsed_url = urlparse(url)
    # 检查域名
    if parsed_url.netloc != base_domain:
        return False
    # 检查路径包含目标文档根路径
    if target_path not in parsed_url.path:
        return False
    # 检查是否为HTML（允许.html后缀或无后缀的文档页面，如part1、part2）
    path = parsed_url.path
    return path.endswith(".html") or (path.count("/") >= 3 and not path.endswith((".js", ".css", ".png", ".jpg", ".gif")))

def get_local_filename(url, base_folder):
    """根据URL生成本地保存的文件名（避免非法字符）"""
    parsed_url = urlparse(url)
    # 提取路径（如 /fe-base-docs/browser/part1），替换斜杠为下划线，作为文件名
    path = parsed_url.path.strip("/")
    # 处理无后缀的页面（如part1），添加.html后缀
    if not path.endswith(".html"):
        path += ".html"
    # 替换路径中的斜杠为下划线，避免创建多级文件夹（简化保存逻辑）
    filename = path.replace("/", "_")
    # 拼接完整保存路径
    return os.path.join(base_folder, filename)

def crawl_html_by_devtools(start_url, base_domain="interview.poetries.top"):
    """
    通过Playwright（DevTools）爬取目标网站的HTML文件
    :param start_url: 起始爬取页面（如https://interview.poetries.top/fe-base-docs/browser/part1）
    :param base_domain: 目标网站域名（避免爬取外部链接）
    """
    # 初始化下载文件夹
    download_folder = init_download_folder()
    # 已爬取的URL集合（去重）
    crawled_urls = set()
    # 待爬取的URL队列（从起始页面开始）
    to_crawl_urls = [start_url]

    with sync_playwright() as p:
        # 启动Chrome浏览器（headless=True：无界面模式，False：显示浏览器便于调试）
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_page()

        while to_crawl_urls:
            # 取出队列中的第一个URL
            current_url = to_crawl_urls.pop(0)
            # 跳过已爬取的URL
            if current_url in crawled_urls:
                continue

            try:
                print(f"正在爬取：{current_url}")
                # 访问当前页面（等待页面加载完成，超时30秒）
                page.goto(current_url, wait_until="networkidle", timeout=30000)
                # 短暂延迟，确保动态内容渲染完成（根据页面复杂度调整）
                time.sleep(2)

                # 1. 保存当前页面的HTML内容
                html_content = page.content()
                local_file = get_local_filename(current_url, download_folder)
                with open(local_file, "w", encoding="utf-8") as f:
                    f.write(html_content)
                print(f"已保存：{local_file}")

                # 2. 标记当前URL为已爬取
                crawled_urls.add(current_url)

                # 3. 解析页面中的所有链接，筛选目标HTML链接
                # 获取所有<a>标签的href属性
                link_elements = page.locator("a[href]").all()
                for link in link_elements:
                    # 获取href属性（处理相对路径）
                    href = link.get_attribute("href")
                    if not href:
                        continue
                    # 拼接为绝对URL（解决相对路径问题，如./part2 → 完整URL）
                    absolute_url = urljoin(current_url, href)
                    # 解析绝对URL，避免锚点重复（如part1#top 和 part1 是同一页面）
                    parsed_absolute_url = urlparse(absolute_url)
                    # 去除锚点部分（保留URL的path和query，去掉fragment）
                    url_without_fragment = parsed_absolute_url._replace(fragment="").geturl()

                    # 筛选目标HTML链接，且未被爬取、未在待爬队列中
                    if (is_target_html_url(url_without_fragment) 
                        and url_without_fragment not in crawled_urls 
                        and url_without_fragment not in to_crawl_urls):
                        to_crawl_urls.append(url_without_fragment)
                        print(f"发现待爬链接：{url_without_fragment}")

            except Exception as e:
                print(f"爬取{current_url}失败：{str(e)}")
                continue

        # 爬取完成，关闭浏览器
        browser.close()
        print(f"\n爬取完成！共爬取{len(crawled_urls)}个HTML文件，保存路径：{os.path.abspath(download_folder)}")

if __name__ == "__main__":
    # 目标起始页面（可根据需要修改，如part1、part2等）
    START_URL = "https://interview.poetries.top/fe-base-docs/browser/part1"
    # 启动爬取
    crawl_html_by_devtools(START_URL)