---
title: '鼓励自己，不要畏惧Fedora'
layout: post
tags:
- Linux
- Fedora
- Bluetooth
---
一件值得高兴的小事情。  
  
在前面的日记“小事情构筑一天的快乐”里提到的Pybluez在Fedora11下编译失败的问题，在昨天晚上被我解决了。就是我猜的找不到BlueZ库的问题。  
  
> Obtaining BlueZ  

> Instructions for installing the BlueZ development libraries can be found at the BlueZ website: htp://www.bluez.org. Most modern Linux distributions (date of this writing: 08/24/2005) should have this packaged somehow. For example:  

> on Debian-based systems:  

> apt-get install libbluetooth1-dev bluez-utils  

> On Fedora:  
  
> yum install bluez-devel  
  
在我的Fedora11上使用yum安装Fedora11发生超时错误，首先是超时错误，由于糟糕的网络，更换Mirror后显示下载某个包完成，但安装过程出现“无事可做”（Nothing to do ），不了解状况。因为之前就从BlueZ官方下载了安装包并且已经解压好，所以手动编译安装。  

> 到解压后的BlueZ目录下，  
  
> ./configure  
  
> make  
    
此时，如果不在root权限下运行，一定要切换到root下才能进行下一步操作  
  
> make install  
  
> 然后，进入pybluez目录  
  
> ./pyblueZ.py install  
  
> 可以看到GCC正常编译所有文件。  
  
> 如果要验证，编写脚本执行即可。  
  
众所周知，Ubuntu的中英文论坛都是相当优秀的，在学习过程中遇到问题，即使在FAQ找不到答案，也会有热心人给予关注，提示或者解答。而Fedora的中文论坛相比Ubuntu Forum的活跃，便显得寂寂无声，如果你查问题链到了那里，大多数时候你看到的是一个晾在那里的好久的无人问津的问题，即便是很小的问题。Fedora的官方论坛http://fedoraforum.org/不错，顺便说下http://linuxtoy.org/是个好玩的站点，有很多关于Linux领域的新动向和资讯。  
  
由于Ubuntu继承了Debian体系优良的软件管理系统，使用sudo apt-get命令方便地获得各种软件包，加上强大的source mirror支持以及和Gnome的完美结合，所以很多建议是Ubuntu适合初学者，但由于缺少很多库，所以要做纵向的稍微深入的学习和开发，对各种库文件的安装配置都需要花费时间和精力。Fedora由于集成了众多的组件（我的F11安装时显示有1100多个包，我确信我常用的只可能是其中的百分之几），所以很好地解决了这方便的问题。由于Fedora的资源和论坛支持不想U那么好，这样要导致的一个事实是，Fedora的用户更加辛苦和努力地去花时间和精力独立解决问题，这是一件好事，因为这整个过程中，获得的关于Linux的知识甚至是Linux文化，不是简简单单的一部教程就能给你的。  
  
不要惧怕Fedora，尽管苦恼会很多，许多时候都是眼睛干涩、身心疲惫的但问题依然没有结果，一般会是在深夜，闷闷不乐地睡了，下一次还是继续寻找答案，不会放弃，相信选择是对的，收获是艰难的过程，有苦也有乐，其中滋味，只有你知得。  
