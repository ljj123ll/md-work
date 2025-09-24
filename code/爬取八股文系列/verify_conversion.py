import os
import re

# 设置中文字体支持
import sys
sys.stdout.reconfigure(encoding='utf-8')

def verify_directory(directory_path):
    """
    验证目录下的所有HTML文件是否已移除懒加载属性
    """
    # 检查目录是否存在
    if not os.path.exists(directory_path):
        print(f"错误: 目录 {directory_path} 不存在")
        return
    
    # 定义懒加载相关的正则表达式
    lazy_patterns = [
        r'loading="lazy"',
        r'data-src="',
        r'data-srcset="'
    ]
    
    # 遍历目录下的所有文件
    total_files = 0
    clean_files = 0
    
    for filename in os.listdir(directory_path):
        # 只处理HTML文件
        if filename.lower().endswith('.html'):
            total_files += 1
            file_path = os.path.join(directory_path, filename)
            has_lazy_attributes = False
            
            try:
                # 读取文件内容
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # 检查是否存在懒加载属性
                for pattern in lazy_patterns:
                    if re.search(pattern, content):
                        has_lazy_attributes = True
                        print(f"文件 {filename} 中仍存在懒加载属性: {pattern}")
                        break
                
                if not has_lazy_attributes:
                    clean_files += 1
                    print(f"文件 {filename} 处理成功，无懒加载属性")
                    
            except Exception as e:
                print(f"读取文件 {filename} 时出错: {e}")
    
    print(f"\n验证完成！")
    print(f"总共检查了 {total_files} 个HTML文件")
    print(f"其中 {clean_files} 个文件已成功移除所有懒加载属性")
    if total_files > clean_files:
        print(f"有 {total_files - clean_files} 个文件仍存在懒加载属性，需要进一步处理")

def main():
    # 设置目录路径
    directory_path = r"e:/aAStudyCoding/前端/秋招/md文档/md-work/code/爬取八股文系列/计算机基础篇"
    
    print(f"开始验证目录中的HTML文件: {directory_path}")
    print(f"检查是否存在以下懒加载属性: loading=\"lazy\", data-src=\", data-srcset=\"")
    print("=" * 70)
    
    # 执行验证
    verify_directory(directory_path)

if __name__ == "__main__":
    main()