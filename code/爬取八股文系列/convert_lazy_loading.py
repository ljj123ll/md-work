from bs4 import BeautifulSoup
import argparse
import os

def convert_lazy_loading(html_content):
    """
    将HTML内容中的图片懒加载转换为正常加载
    """
    # 解析HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 查找所有图片标签
    img_tags = soup.find_all('img')
    
    for img in img_tags:
        # 移除loading="lazy"属性
        if img.has_attr('loading') and img['loading'] == 'lazy':
            del img['loading']
        
        # 处理data-src属性
        if img.has_attr('data-src'):
            # 将data-src的值赋给src
            img['src'] = img['data-src']
            # 移除data-src属性
            del img['data-src']
        
        # 处理data-srcset属性
        if img.has_attr('data-srcset'):
            # 将data-srcset的值赋给srcset
            img['srcset'] = img['data-srcset']
            # 移除data-srcset属性
            del img['data-srcset']
    
    # 返回处理后的HTML
    return str(soup)

def process_file(input_path, output_path=None):
    """
    处理单个HTML文件
    """
    # 读取输入文件
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    except Exception as e:
        print(f"读取文件 {input_path} 失败: {e}")
        return
    
    # 转换懒加载
    converted_html = convert_lazy_loading(html_content)
    
    # 确定输出路径，如果未指定则覆盖原文件
    if not output_path:
        output_path = input_path
    
    # 写入输出文件
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(converted_html)
        print(f"成功处理文件: {output_path}")
    except Exception as e:
        print(f"写入文件 {output_path} 失败: {e}")

def main():
    # 解析命令行参数
    parser = argparse.ArgumentParser(description='将HTML中的图片懒加载转换为正常加载')
    parser.add_argument('input', help='输入HTML文件路径')
    parser.add_argument('-o', '--output', help='输出HTML文件路径，不指定则覆盖原文件')
    
    args = parser.parse_args()
    
    # 检查输入文件是否存在
    if not os.path.exists(args.input):
        print(f"错误: 文件 {args.input} 不存在")
        return
    
    # 处理文件
    process_file(args.input, args.output)

if __name__ == "__main__":
    main()
