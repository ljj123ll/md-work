import os
import subprocess
import sys

# 设置中文字体支持
sys.stdout.reconfigure(encoding='utf-8')

def batch_process_directory(directory_path, script_path):
    """
    批量处理目录下的所有HTML文件
    """
    # 检查目录是否存在
    if not os.path.exists(directory_path):
        print(f"错误: 目录 {directory_path} 不存在")
        return
    
    # 检查脚本是否存在
    if not os.path.exists(script_path):
        print(f"错误: 脚本 {script_path} 不存在")
        return
    
    # 遍历目录下的所有文件
    processed_count = 0
    for filename in os.listdir(directory_path):
        # 只处理HTML文件
        if filename.lower().endswith('.html'):
            file_path = os.path.join(directory_path, filename)
            # 调用convert_lazy_loading.py脚本处理文件
            try:
                # 使用Python解释器运行脚本
                result = subprocess.run(
                    ['python', script_path, file_path],
                    capture_output=True,
                    text=True,
                    encoding='utf-8'
                )
                # 打印输出结果
                if result.stdout:
                    print(result.stdout)
                if result.stderr:
                    print(f"处理文件 {file_path} 时出错: {result.stderr}")
                processed_count += 1
            except Exception as e:
                print(f"处理文件 {file_path} 时发生异常: {e}")
    
    print(f"批量处理完成，共处理了 {processed_count} 个HTML文件")

def main():
    # 设置目录路径和脚本路径
    directory_path = r"e:/aAStudyCoding/前端/秋招/md文档/md-work/code/爬取八股文系列/计算机基础篇"
    script_path = r"e:/aAStudyCoding/前端/秋招/md文档/md-work/code/爬取八股文系列/convert_lazy_loading.py"
    
    print(f"开始批量处理目录: {directory_path}")
    print(f"使用脚本: {script_path}")
    
    # 执行批量处理
    batch_process_directory(directory_path, script_path)

if __name__ == "__main__":
    main()