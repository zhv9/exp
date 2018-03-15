#!/bin/bash

FILENAME="./Micromach.LaserDrill.Workbench/Properties/AssemblyInfo.cs"
let p_Second_version=0
let Third_Version=0

# 获取日期中的年作为主版本号
let Main_Version=`date +%y`
let Second_Version=`date +%m`

let p_Second_version=`grep -w "^\[assembly: AssemblyVersion" ${FILENAME} | cut -d "\"" -f2 | cut -d "." -f2`
# 文件中以"[assembly: AssemblyVersion"开头的行，取其中双引号的部分中第三个点和第二个点之间的字
let Third_Version=`grep -w "^\[assembly: AssemblyVersion" ${FILENAME} | cut -d "\"" -f2 | cut -d "." -f3`

# 如果月份切换了，那么第三位版本号从0开始算
if [ $p_Second_version = $Second_Version ]
    then
        Third_Version=`expr ${Third_Version} + 1`
    else
        Third_Version=0
        echo '从0开始'
fi

Version="${Main_Version}.${Second_Version}.${Third_Version}"
echo "目前版本为:"$Version

# 获取目前分支最新的短hash值
HASH=`git rev-parse --short HEAD`

# 修改版本文件中的版本号和文件版本号
sed -i -e "/^\[assembly: AssemblyVersion(/ c \[assembly: AssemblyVersion(\"${Version}\")\]" -e "/^\[assembly: AssemblyFileVersion(/ c \[assembly: AssemblyFileVersion(\"${Version}.${HASH}\")\]" $FILENAME

read -n1 -p "按任意键继续"